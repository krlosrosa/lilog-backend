import { Injectable, Inject } from '@nestjs/common';
import { IDevolucaoRepository } from '../../domain/devolucao/repositories/devoluca.repository.js';
import { type DrizzleClient } from './drizzle/config/drizzle.provider.js';
import {
  devolucaoDemanda,
  devolucaoItens,
  devolucaoNotas,
} from './drizzle/config/migrations/schema.js';
import { and, eq, sql } from 'drizzle-orm';
import { DRIZZLE_PROVIDER } from './drizzle/config/drizzle.constat.js';
import { DemandDto } from '../../domain/devolucao/model/demanda-retorno.schema.js';

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
}
