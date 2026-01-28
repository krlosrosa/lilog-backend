import { Inject } from '@nestjs/common';
import { AddAnomaliaDto } from '../../../domain/devolucao/model/add-anomalia.schema.js';
import { type IDevolucaoRepository } from '../../../domain/devolucao/repositories/devoluca.repository.js';

export class AddAnomaliaDevolucao {
  constructor(
    @Inject('IDevolucaoRepository')
    private readonly devolucaoRepository: IDevolucaoRepository,
  ) {}
  async execute(anomalia: AddAnomaliaDto): Promise<void> {
    await this.devolucaoRepository.addAnomalia(anomalia);
  }
}
