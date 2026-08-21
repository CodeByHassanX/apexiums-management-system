export declare class ProductService {
    static getAll(params?: any): Promise<{
        products: ({
            brand: {
                id: string;
                name: string;
            } | null;
            category: {
                id: string;
                name: string;
                description: string | null;
                image: string | null;
                status: string;
                parentId: string | null;
            };
            inventory: {
                id: string;
                productId: string;
                branchId: string;
                quantity: number;
            }[];
        } & {
            id: string;
            sku: string;
            barcode: string | null;
            name: string;
            description: string | null;
            categoryId: string;
            brandId: string | null;
            unit: string;
            costPrice: import("@prisma/client/runtime/library").Decimal;
            sellingPrice: import("@prisma/client/runtime/library").Decimal;
            discount: import("@prisma/client/runtime/library").Decimal;
            tax: import("@prisma/client/runtime/library").Decimal;
            status: string;
            image: string | null;
            minimumStock: number;
            maximumStock: number | null;
            expiryDate: Date | null;
            supplierId: string | null;
            createdAt: Date;
            updatedAt: Date;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    static getById(id: string): Promise<{
        brand: {
            id: string;
            name: string;
        } | null;
        category: {
            id: string;
            name: string;
            description: string | null;
            image: string | null;
            status: string;
            parentId: string | null;
        };
        inventory: ({
            branch: {
                id: string;
                name: string;
                address: string | null;
                storeId: string;
            };
        } & {
            id: string;
            productId: string;
            branchId: string;
            quantity: number;
        })[];
    } & {
        id: string;
        sku: string;
        barcode: string | null;
        name: string;
        description: string | null;
        categoryId: string;
        brandId: string | null;
        unit: string;
        costPrice: import("@prisma/client/runtime/library").Decimal;
        sellingPrice: import("@prisma/client/runtime/library").Decimal;
        discount: import("@prisma/client/runtime/library").Decimal;
        tax: import("@prisma/client/runtime/library").Decimal;
        status: string;
        image: string | null;
        minimumStock: number;
        maximumStock: number | null;
        expiryDate: Date | null;
        supplierId: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    static create(data: any): Promise<{
        id: string;
        sku: string;
        barcode: string | null;
        name: string;
        description: string | null;
        categoryId: string;
        brandId: string | null;
        unit: string;
        costPrice: import("@prisma/client/runtime/library").Decimal;
        sellingPrice: import("@prisma/client/runtime/library").Decimal;
        discount: import("@prisma/client/runtime/library").Decimal;
        tax: import("@prisma/client/runtime/library").Decimal;
        status: string;
        image: string | null;
        minimumStock: number;
        maximumStock: number | null;
        expiryDate: Date | null;
        supplierId: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    static update(id: string, data: any): Promise<{
        id: string;
        sku: string;
        barcode: string | null;
        name: string;
        description: string | null;
        categoryId: string;
        brandId: string | null;
        unit: string;
        costPrice: import("@prisma/client/runtime/library").Decimal;
        sellingPrice: import("@prisma/client/runtime/library").Decimal;
        discount: import("@prisma/client/runtime/library").Decimal;
        tax: import("@prisma/client/runtime/library").Decimal;
        status: string;
        image: string | null;
        minimumStock: number;
        maximumStock: number | null;
        expiryDate: Date | null;
        supplierId: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    static delete(id: string): Promise<{
        id: string;
        sku: string;
        barcode: string | null;
        name: string;
        description: string | null;
        categoryId: string;
        brandId: string | null;
        unit: string;
        costPrice: import("@prisma/client/runtime/library").Decimal;
        sellingPrice: import("@prisma/client/runtime/library").Decimal;
        discount: import("@prisma/client/runtime/library").Decimal;
        tax: import("@prisma/client/runtime/library").Decimal;
        status: string;
        image: string | null;
        minimumStock: number;
        maximumStock: number | null;
        expiryDate: Date | null;
        supplierId: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
//# sourceMappingURL=product.service.d.ts.map