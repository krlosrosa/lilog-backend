import { Injectable, Inject } from '@nestjs/common';
import { IDevolucaoRepository } from '../../domain/devolucao/repositories/devoluca.repository.js';
import { type DrizzleClient } from './drizzle/config/drizzle.provider.js';
import {
  devolucaoDemanda,
  devolucaoItens,
  devolucaoNotas,
} from './drizzle/config/migrations/schema.js';
import { and, eq, or, sql } from 'drizzle-orm';
import { DRIZZLE_PROVIDER } from './drizzle/config/drizzle.constat.js';
import { DemandDto } from '../../domain/devolucao/model/demanda-retorno.schema.js';
import { AddNotaDto } from '../../domain/devolucao/model/add-nota.schema.js';
import { agruparPorTipoSkuEDevolucao } from '../../domain/devolucao/mappers/contabil-mapper.js';
import {
  EntradaDto,
  ItensContabilDto,
} from '../../domain/devolucao/model/get-itens-contabil.schema.js';

@Injectable()
export class DevolucaoDrizzleRepository implements IDevolucaoRepository {
  constructor(
    @Inject(DRIZZLE_PROVIDER)
    private readonly db: DrizzleClient,
  ) {}

  findById(id: number): Promise<any> {
    return this.db
      .select()
      .from(devolucaoDemanda)
      .where(eq(devolucaoDemanda.id, id));
  }
  async findNotasByDemandaId(id: number): Promise<any[]> {
    return this.db
      .select()
      .from(devolucaoNotas)
      .where(eq(devolucaoNotas.devolucaoDemandaId, id));
  }

  async findItensByDemandaId(id: number): Promise<any[]> {
    return await this.db.query.devolucaoItens.findMany({
      where: eq(devolucaoItens.demandaId, id),
    });
  }

  async create(
    demand: DemandDto,
    centerId: string,
    adicionadoPorId: string,
  ): Promise<string | null> {
    const demandId = await this.db
      .insert(devolucaoDemanda)
      .values({
        ...demand,
        centerId,
        adicionadoPorId,
        atualizadoEm: new Date().toISOString(),
        senha: process.env.SENHA || '',
      })
      .returning({ id: devolucaoDemanda.id });
    return demandId[0].id.toString();
  }

  async findDemandasByCenterId(
    centerId: string,
    data: string,
  ): Promise<DemandDto[] | null> {
    const demandas = await this.db
      .select()
      .from(devolucaoDemanda)
      .where(
        and(
          eq(devolucaoDemanda.centerId, centerId),
          sql`${devolucaoDemanda.criadoEm}::date = ${data}`,
        ),
      )
      .orderBy(devolucaoDemanda.criadoEm);

    return demandas;
  }

  async addNfInDemand(addNotaDto: AddNotaDto): Promise<void> {
    const addDemanda = {
      empresa: addNotaDto.empresa,
      devolucaoDemandaId: addNotaDto.devolucaoDemandaId,
      notaFiscal: addNotaDto.notaFiscal,
      motivoDevolucao: addNotaDto.motivoDevolucao,
      descMotivoDevolucao: addNotaDto.descMotivoDevolucao,
      nfParcial: addNotaDto.nfParcial,
      idViagemRavex: addNotaDto.idViagemRavex,
      tipo: addNotaDto.tipo,
      atualizadoEm: new Date().toISOString(),
      criadoEm: new Date().toISOString(),
    };
    await this.db.transaction(async (tx) => {
      const notaId = await tx
        .insert(devolucaoNotas)
        .values({
          ...addDemanda,
        })
        .returning({ id: devolucaoNotas.id });
      const ItensNota = addNotaDto.itens.map((item) => ({
        ...item,
        devolucaoNotasId: addNotaDto.notaFiscal,
        demandaId: addNotaDto.devolucaoDemandaId,
        atualizadoEm: new Date().toISOString(),
        criadoEm: new Date().toISOString(),
        tipo: 'CONTABIL' as const,
        sku: item.sku,
        descricao: item.descricao,
        lote: item.lote,
        fabricacao: item.fabricacao?.toString(),
        sif: item.sif,
        quantidadeCaixas: item.quantidadeCaixas,
        quantidadeUnidades: item.quantidadeUnidades,
        avariaCaixas: item.avariaCaixas,
        notaId: notaId[0].id,
      }));
      await tx.insert(devolucaoItens).values(ItensNota);
    });
  }

  async liberateDemand(demandaId: string): Promise<void> {
    await this.db
      .update(devolucaoDemanda)
      .set({
        status: 'AGUARDANDO_CONFERENCIA',
        liberadoParaConferenciaEm: new Date().toISOString(),
      })
      .where(eq(devolucaoDemanda.id, Number(demandaId)));
  }

  async findDemandasOpen(
    centerId: string,
    accountId: string,
  ): Promise<DemandDto[]> {
    return this.db
      .select()
      .from(devolucaoDemanda)
      .where(
        and(
          eq(devolucaoDemanda.centerId, centerId),
          or(
            and(
              eq(devolucaoDemanda.status, 'EM_CONFERENCIA'),
              eq(devolucaoDemanda.conferenteId, accountId),
            ),
            eq(devolucaoDemanda.status, 'AGUARDANDO_CONFERENCIA'),
          ),
        ),
      );
  }

  async startDemanda(demandaId: string, accountId: string): Promise<void> {
    await this.db
      .update(devolucaoDemanda)
      .set({
        status: 'EM_CONFERENCIA',
        inicioConferenciaEm: new Date().toISOString(),
        conferenteId: accountId,
      })
      .where(eq(devolucaoDemanda.id, Number(demandaId)));
  }

  async getItensContabil(demandaId: string): Promise<ItensContabilDto[]> {
    const itens = await this.db.query.devolucaoNotas.findMany({
      where: eq(devolucaoNotas.devolucaoDemandaId, Number(demandaId)),
      with: {
        devolucaoItens: true,
      },
    });

    const subItens: EntradaDto[] = itens.flatMap((d) => {
      return d.devolucaoItens.map((i) => {
        return {
          ...i,
          tipoDevolucao: d.tipo === 'REENTREGA' ? 'REENTREGA' : 'RETORNO',
        };
      });
    });
    const itensAgrupados = agruparPorTipoSkuEDevolucao(subItens);

    return itensAgrupados;
  }
}
