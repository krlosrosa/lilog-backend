import { AddAnomaliaDto } from '../model/add-anomalia.schema.js';
import { AddCheckListDto } from '../model/add-check-list.schema.js';
import { AddConferenciaCegaDto } from '../model/add-contagem.schema.js';
import { AddNotaDto } from '../model/add-nota.schema.js';
import { DemandDto } from '../model/demanda-retorno.schema.js';
import { ItensContabilDto } from '../model/get-itens-contabil.schema.js';

export interface IDevolucaoRepository {
  findById(id: number): Promise<any>;
  findNotasByDemandaId(id: number): Promise<any[]>;
  findItensByDemandaId(id: number): Promise<any[]>;
  findDemandasByCenterId(
    centerId: string,
    data: string,
  ): Promise<DemandDto[] | null>;
  create(
    demand: DemandDto,
    centerId: string,
    adicionadoPorId: string,
  ): Promise<string | null>;
  addNfInDemand(addNotaDto: AddNotaDto): Promise<void>;
  liberateDemand(demandaId: string): Promise<void>;
  findDemandasOpen(centerId: string, accountId: string): Promise<DemandDto[]>;
  startDemanda(
    demandaId: string,
    doca: string,
    accountId: string,
  ): Promise<void>;
  getItensContabil(demandaId: string): Promise<ItensContabilDto[]>;
  addCheckList(checkList: AddCheckListDto, demandaId: string): Promise<void>;
  addContagemCega(
    demandaId: string,
    contagem: AddConferenciaCegaDto[],
  ): Promise<void>;
  finishDemanda(demandaId: string): Promise<void>;
  addAnomalia(anomalia: AddAnomaliaDto): Promise<void>;
  addImagemFim(imagens: string[], demandaId: string): Promise<void>;
}
