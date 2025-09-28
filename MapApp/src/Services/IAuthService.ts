const Role = {
    ADMIN: "ADMIN",
    USER: "USER"
} as const;

export type Role = typeof Role[keyof typeof Role];
export { Role };
export interface IAuthService {
    signIn(email: string, password: string): Promise<any>;
    signUp(email: string, password: string): Promise<any>;
    signOut(): Promise<void>;
    onAuthStateChanged(callback: (user: any) => void): () => void;
    getCurrentUser(): any | null;
    getUserRoles(user: any): Promise<Role[]>;
}