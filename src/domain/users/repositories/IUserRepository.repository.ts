import { InfoMeDto } from '../model/info-me.schema.js';

export interface IUserRepository {
  getInfoMe(userId: string): Promise<InfoMeDto>;
}
