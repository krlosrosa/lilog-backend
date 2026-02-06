import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { GetResultadoDemanda } from '../../application/devolucao/usecases/get-result-demand.js';
import { GetInfoByViagemId } from '../../application/devolucao/usecases/get-info-by-viagemId.js';
import { GetInfoByViagemIdController } from '../../presentation/controllers/devolucao/get-info-by-viagem-id.js';
import { GetResultDemandByIdController } from '../../presentation/controllers/devolucao/get-result-demand-by-id.js';
import { DevolucaoDrizzleRepository } from '../db/devolucao.db.js';
import { ProdutoDrizzleRepository } from '../db/produto.db.js';
import { RavexRepository } from '../../application/services/ravex/ravex.db.js';
import { RavexAuthService } from '../../application/services/ravex/RavexAuthService.js';
import { drizzleProvider } from '../db/drizzle/config/drizzle.provider.js';
import { AddNewDemandController } from '../../presentation/controllers/devolucao/add-new-demand.js';
import { AddNewDemand } from '../../application/devolucao/usecases/add-new-demand.js';
import { ListDemandasByCenter } from '../../application/devolucao/usecases/list-demandas-by-center.js';
import { ListDemandasByCenterAndDataController } from '../../presentation/controllers/devolucao/list-demanda-by-center-and-data.js';
import { GetDemandaByIdController } from '../../presentation/controllers/devolucao/get-demanda-by-id.js';
import { GetDemandaById } from '../../application/devolucao/usecases/get-demanda-by-id.js';
import { AddNfInDemandaController } from '../../presentation/controllers/devolucao/add-nf-in-demanda.js';
import AddNfInDemand from '../../application/devolucao/usecases/add-nf-in-demand.js';
import { LiberateDemandDevolucaoController } from '../../presentation/controllers/devolucao/liberate-demand-devolucao.js';
import { LiberateDemandDevolucao } from '../../application/devolucao/usecases/liberate.demand-devolucao.js';
import { ListDemandOpenController } from '../../presentation/controllers/devolucao/list-demand-open.js';
import { ListDemandOpen } from '../../application/devolucao/usecases/list-demand-open.js';
import { StartDemandaDevolucaoController } from '../../presentation/controllers/devolucao/start-demanda-devolucao.js';
import { StartDemandaDevolucao } from '../../application/devolucao/usecases/start-demanda-devolucao.js';
import { GetItensContabilController } from '../../presentation/controllers/devolucao/get-itens-contabil.js';
import { GetItensContabil } from '../../application/devolucao/usecases/get-itens-contabil.js';
import { AddCheckListDemand } from '../../application/devolucao/usecases/add-check-list.js';
import { AddCheckListDemandController } from '../../presentation/controllers/devolucao/add-check-list.demand.js';
import { AddContagemCegaController } from '../../presentation/controllers/devolucao/add-contagem-cega.js';
import { AddContagemCegaUseCase } from '../../application/devolucao/usecases/add-contagem-cega.js';
import { FinishDemandaController } from '../../presentation/controllers/devolucao/finish-demanda.js';
import { FinishDemanda } from '../../application/devolucao/usecases/finish-demanda.js';
import { AddAnomaliaDevolucaoController } from '../../presentation/controllers/devolucao/add-anomalia-devolucao.js';
import { AddAnomaliaDevolucao } from '../../application/devolucao/usecases/add-anomalia-devolucao.js';
import { PresignedUrlDevolucaoController } from '../../presentation/controllers/devolucao/presigned-url-devolucao.js';
import { PresignedUrlMinio } from '../../application/devolucao/usecases/presigned-url-minio.js';
import { AddImagemFimDevolucaoController } from '../../presentation/controllers/devolucao/add-imagem-fim-devolucao.js';
import { AddImagemFimDevolucao } from '../../application/devolucao/usecases/add-imagem-fim-devolucao.js';

@Module({
  imports: [
    HttpModule, // Necessário para injetar HttpService no RavexRepository
    // ConfigModule não precisa mais ser importado aqui pois está global no AppModule
  ],
  controllers: [
    GetResultDemandByIdController, // Vem da pasta Presentation
    GetInfoByViagemIdController, // Vem da pasta Presentation
    AddNewDemandController, // Vem da pasta Presentation
    ListDemandasByCenterAndDataController, // Vem da pasta Presentation
    GetDemandaByIdController,
    AddNfInDemandaController,
    LiberateDemandDevolucaoController,
    ListDemandOpenController,
    StartDemandaDevolucaoController,
    GetItensContabilController,
    AddCheckListDemandController,
    AddContagemCegaController,
    FinishDemandaController,
    AddAnomaliaDevolucaoController,
    PresignedUrlDevolucaoController,
    AddImagemFimDevolucaoController,
  ],
  providers: [
    drizzleProvider, // Provider do Drizzle ORM
    GetResultadoDemanda, // Vem da pasta Application
    GetInfoByViagemId, // Vem da pasta Application
    AddNewDemand,
    RavexAuthService, // Serviço de autenticação Ravex
    ListDemandasByCenter,
    GetDemandaById,
    AddNfInDemand,
    LiberateDemandDevolucao,
    ListDemandOpen,
    StartDemandaDevolucao,
    GetItensContabil,
    AddCheckListDemand,
    AddContagemCegaUseCase,
    FinishDemanda,
    AddAnomaliaDevolucao,
    PresignedUrlMinio,
    AddImagemFimDevolucao,
    {
      provide: 'IDevolucaoRepository', // Interface no Domain
      useClass: DevolucaoDrizzleRepository, // Implementação na Infra
    },
    {
      provide: 'IProdutoRepository',
      useClass: ProdutoDrizzleRepository,
    },
    {
      provide: 'IRavexRepository',
      useClass: RavexRepository,
    },
  ],
})
export class DevolucaoModule {}
