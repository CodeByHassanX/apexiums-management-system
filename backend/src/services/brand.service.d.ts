export declare class BrandService {
    static getAll(): Promise<{
        id: string;
        name: string;
    }[]>;
    static getById(id: string): Promise<{
        id: string;
        name: string;
    }>;
    static create(data: {
        name: string;
    }): Promise<{
        id: string;
        name: string;
    }>;
    static update(id: string, data: {
        name?: string;
    }): Promise<{
        id: string;
        name: string;
    }>;
    static delete(id: string): Promise<{
        id: string;
        name: string;
    }>;
}
//# sourceMappingURL=brand.service.d.ts.map