"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const catalog_routes_1 = __importDefault(require("./routes/catalog.routes"));
const inventory_routes_1 = __importDefault(require("./routes/inventory.routes"));
const upload_routes_1 = __importDefault(require("./routes/upload.routes"));
const pos_routes_1 = __importDefault(require("./routes/pos.routes"));
const dashboard_routes_1 = __importDefault(require("./routes/dashboard.routes"));
const customer_routes_1 = __importDefault(require("./routes/customer.routes"));
const sale_routes_1 = __importDefault(require("./routes/sale.routes"));
const supplier_routes_1 = __importDefault(require("./routes/supplier.routes"));
const purchase_routes_1 = __importDefault(require("./routes/purchase.routes"));
const finance_routes_1 = __importDefault(require("./routes/finance.routes"));
const staff_routes_1 = __importDefault(require("./routes/staff.routes"));
const tenant_routes_1 = __importDefault(require("./routes/tenant.routes"));
const error_middleware_1 = require("./middleware/error.middleware");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Serve static files (uploaded images)
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../public/uploads')));
app.get('/api/v1/health', (req, res) => {
    res.json({ status: 'ok', message: 'Retail Management API is running' });
});
// Routes
app.use('/api/v1/auth', auth_routes_1.default);
app.use('/api/v1/catalog', catalog_routes_1.default);
app.use('/api/v1/inventory', inventory_routes_1.default);
app.use('/api/v1/upload', upload_routes_1.default);
app.use('/api/v1/pos', pos_routes_1.default);
app.use('/api/v1/dashboard', dashboard_routes_1.default);
app.use('/api/v1/customers', customer_routes_1.default);
app.use('/api/v1/sales', sale_routes_1.default);
app.use('/api/v1/suppliers', supplier_routes_1.default);
app.use('/api/v1/purchases', purchase_routes_1.default);
app.use('/api/v1/finance', finance_routes_1.default);
app.use('/api/v1/staff', staff_routes_1.default);
app.use('/api/v1/stores', tenant_routes_1.default);
// Global Error Handler
app.use(error_middleware_1.errorHandler);
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
//# sourceMappingURL=server.js.map