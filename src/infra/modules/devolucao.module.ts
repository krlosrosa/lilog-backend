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
