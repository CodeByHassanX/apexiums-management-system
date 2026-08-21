export declare class CategoryService {
    static getAll(): Promise<({
        children: {
            id: string;
            name: string;
            description: string | null;
            image: string | null;
            status: string;
            parentId: string | null;
        }[];
        parent: {
            id: string;
            name: string;
            description: string | null;
            image: string | null;
            status: string;
            parentId: string | null;
        } | null;
    } & {
        id: string;
        name: string;
        description: string | null;
        image: string | null;
        status: string;
        parentId: string | null;
    })[]>;
    static getById(id: string): Promise<{
        children: {
            id: string;
            name: string;
            description: string | null;
            image: string | null;
            status: string;
            parentId: string | null;
        }[];
    } & {
        id: string;
        name: string;
        description: string | null;
        image: string | null;
        status: string;
        parentId: string | null;
    }>;
    static create(data: any): Promise<{
        id: string;
        name: string;
        description: string | null;
        image: string | null;
        status: string;
        parentId: string | null;
    }>;
    static update(id: string, data: any): Promise<{
        id: string;
        name: string;
        description: string | null;
        image: string | null;
        status: string;
        parentId: string | null;
    }>;
    static delete(id: string): Promise<{
        id: string;
        name: string;
        description: string | null;
        image: string | null;
        status: string;
        parentId: string | null;
    }>;
}
//# sourceMappingURL=category.service.d.ts.map