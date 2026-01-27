import { DemandDto } from '../model/demanda-retorno.schema.js';

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
}
