import { IRavexRepository } from 'src/domain/ravex/ravex.repository.js';

export class RavexAuthService {
  constructor(private readonly ravexRepository: IRavexRepository) {}

  async getToken(): Promise<string> {
    const auth = await this.ravexRepository.authRavex();
    return auth?.access_token ?? '';
  }
}
