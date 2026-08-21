import { z } from 'zod';
export declare const createCategorySchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    parentId: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodEnum<{
        ACTIVE: "ACTIVE";
        INACTIVE: "INACTIVE";
    }>>;
}, z.core.$strip>;
export declare const updateCategorySchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    parentId: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    status: z.ZodOptional<z.ZodOptional<z.ZodEnum<{
        ACTIVE: "ACTIVE";
        INACTIVE: "INACTIVE";
    }>>>;
}, z.core.$strip>;
export declare const createBrandSchema: z.ZodObject<{
    name: z.ZodString;
}, z.core.$strip>;
export declare const updateBrandSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const createProductSchema: z.ZodObject<{
    sku: z.ZodString;
    barcode: z.ZodOptional<z.ZodString>;
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    categoryId: z.ZodString;
    brandId: z.ZodOptional<z.ZodString>;
    unit: z.ZodDefault<z.ZodString>;
    costPrice: z.ZodNumber;
    sellingPrice: z.ZodNumber;
    discount: z.ZodDefault<z.ZodNumber>;
    tax: z.ZodDefault<z.ZodNumber>;
    minimumStock: z.ZodDefault<z.ZodNumber>;
    maximumStock: z.ZodOptional<z.ZodNumber>;
    image: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    status: z.ZodDefault<z.ZodEnum<{
        ACTIVE: "ACTIVE";
        INACTIVE: "INACTIVE";
    }>>;
}, z.core.$strip>;
export declare const updateProductSchema: z.ZodObject<{
    sku: z.ZodOptional<z.ZodString>;
    barcode: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    name: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    categoryId: z.ZodOptional<z.ZodString>;
    brandId: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    unit: z.ZodOptional<z.ZodDefault<z.ZodString>>;
    costPrice: z.ZodOptional<z.ZodNumber>;
    sellingPrice: z.ZodOptional<z.ZodNumber>;
    discount: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
    tax: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
    minimumStock: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
    maximumStock: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
    image: z.ZodOptional<z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>>;
    status: z.ZodOptional<z.ZodDefault<z.ZodEnum<{
        ACTIVE: "ACTIVE";
        INACTIVE: "INACTIVE";
    }>>>;
}, z.core.$strip>;
//# sourceMappingURL=catalog.validator.d.ts.map