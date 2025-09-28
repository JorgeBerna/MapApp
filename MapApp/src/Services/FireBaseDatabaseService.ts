import { getDatabase, ref, get, set } from 'firebase/database';
import { app } from '../DataBase/dbconfig';
import { Role } from './IAuthService';
import type { IUserDatabaseService } from './IUserDatabaseService';

export class FirebaseDatabaseService implements IUserDatabaseService {
    async getUserRoles(uid: string): Promise<Role[]> {
        const db = getDatabase(app);
        const rolesRef = ref(db, `users/${uid}/roles`);
        const snapshot = await get(rolesRef);
        if (snapshot.exists()) {
            const rolesData = snapshot.val();
            const roles: Role[] = [];
            if (rolesData.admin === true) {
                roles.push(Role.ADMIN);
            }

            if (roles.length === 0) {
                // Si no se ha asignado ningún rol, se asume el rol de usuario.
                roles.push(Role.USER);
            }
            return roles;
        }
        return [Role.USER];
    }

    async setUserRoles(uid: string, userData: { email: string | null; roles: { admin: boolean } }): Promise<void> {
        const db = getDatabase(app);
        const userRef = ref(db, `users/${uid}`);
        await set(userRef, userData);
    }
}