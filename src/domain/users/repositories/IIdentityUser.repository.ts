import { RoleDto } from '../model/roles.schema';
import { UserDto } from '../model/user.schema';

export interface IIdentityUserRepository {
  addUser(command: UserDto): Promise<string | null>;
  resetPassword(userId: string, newPassword: string): Promise<void>;
  logout(id: string): Promise<void>;
  getAllRoles(): Promise<RoleDto[]>;
  criarRole(id: string): Promise<void>;
  deleteUser(id: string): Promise<void>;
  isServiceHealthy(): Promise<boolean>;
}
