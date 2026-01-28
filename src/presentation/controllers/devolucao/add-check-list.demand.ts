import { Body, Param, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AddCheckListDemand } from '../../../application/devolucao/usecases/add-check-list.js';
import { AddCheckListDto } from '../../../domain/devolucao/model/add-check-list.schema.js';
import { AddCheckListResponseDto } from '../../../domain/devolucao/model/result-add-check-list.js';
import { ApiController } from '../../../main/decorators/api-controller.decorator.js';

@ApiController({ tag: 'Devolucao', path: 'devolucao' })
export class AddCheckListDemandController {
  constructor(private readonly addCheckListDemandUseCase: AddCheckListDemand) {}
  @Post('add-check-list/:demandaId')
  @ApiOperation({
    summary: 'Adicionar check list',
    operationId: 'addCheckListDevolucaoMobile',
  })
  @ApiBody({ type: AddCheckListDto })
  @ApiResponse({
    status: 200,
    description: 'Check list adicionado com sucesso',
    type: AddCheckListResponseDto,
  })
  async addCheckList(
    @Param('demandaId') demandaId: string,
    @Body() addCheckListDto: AddCheckListDto,
  ): Promise<AddCheckListResponseDto> {
    return this.addCheckListDemandUseCase.execute(addCheckListDto, demandaId);
  }
}
