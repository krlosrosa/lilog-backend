import { Inject } from '@nestjs/common';
import { AddCheckListDto } from '../../../domain/devolucao/model/add-check-list.schema.js';
import { type IDevolucaoRepository } from '../../../domain/devolucao/repositories/devoluca.repository.js';
import { AddCheckListResponseDto } from '../../../domain/devolucao/model/result-add-check-list.js';

export class AddCheckListDemand {
  constructor(
    @Inject('IDevolucaoRepository')
    private readonly devolucaoRepository: IDevolucaoRepository,
  ) {}
  async execute(
    checkList: AddCheckListDto,
    demandaId: string,
  ): Promise<AddCheckListResponseDto> {
    return this.devolucaoRepository.addCheckList(checkList, demandaId);
  }
}
