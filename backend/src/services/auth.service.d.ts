export declare class AuthService {
    static login(email: string, password: string): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            name: string;
            email: string;
            role: string;
        };
    }>;
    static refresh(token: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    static logout(userId: string): Promise<void>;
    static getProfile(userId: string): Promise<{
        id: string;
        name: string;
        email: string;
        phone: string | null;
        avatar: string | null;
        status: string;
        lastLogin: Date | null;
        createdAt: Date;
        updatedAt: Date;
        storeId: string | null;
        roleId: string;
        permissions: string[];
        role: {
            permissions: ({
                permission: {
                    id: string;
                    action: string;
                };
            } & {
                roleId: string;
                permissionId: string;
            })[];
        } & {
            id: string;
            name: string;
            description: string | null;
        };
    }>;
}
//# sourceMappingURL=auth.service.d.ts.map