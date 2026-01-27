export interface IDevolucaoRepository {
  findById(id: number): Promise<any>;
  findNotasByDemandaId(id: number): Promise<any[]>;
  findItensByDemandaId(id: number): Promise<any[]>;
}
