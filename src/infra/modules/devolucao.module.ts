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
  ],
  providers: [
    drizzleProvider, // Provider do Drizzle ORM
    GetResultadoDemanda, // Vem da pasta Application
    GetInfoByViagemId, // Vem da pasta Application
    AddNewDemand,
    RavexAuthService, // Serviço de autenticação Ravex
    ListDemandasByCenter,
    GetDemandaById,
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
  exports: [GetResultadoDemanda], // Caso outro módulo precise deste caso de uso
})
export class DevolucaoModule {}
