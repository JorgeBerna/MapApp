import { Role } from './IAuthService';

export interface IUserDatabaseService {
    getUserRoles(uid: string): Promise<Role[]>;
    setUserRoles(uid: string, userData: { email: string | null; roles: { admin: boolean } }): Promise<void>;
}