import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import authRoutes from './routes/auth.routes';
import catalogRoutes from './routes/catalog.routes';
import inventoryRoutes from './routes/inventory.routes';
import uploadRoutes from './routes/upload.routes';
import posRoutes from './routes/pos.routes';
import dashboardRoutes from './routes/dashboard.routes';
import customerRoutes from './routes/customer.routes';
import saleRoutes from './routes/sale.routes';
import supplierRoutes from './routes/supplier.routes';
import purchaseRoutes from './routes/purchase.routes';
import financeRoutes from './routes/finance.routes';
import staffRoutes from './routes/staff.routes';
import tenantRoutes from './routes/tenant.routes';
import { errorHandler } from './middleware/error.middleware';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Serve static files (uploaded images)
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

app.get('/api/v1/health', (req, res) => {
  res.json({ status: 'ok', message: 'Retail Management API is running' });
});

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/catalog', catalogRoutes);
app.use('/api/v1/inventory', inventoryRoutes);
app.use('/api/v1/upload', uploadRoutes);
app.use('/api/v1/pos', posRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);
app.use('/api/v1/customers', customerRoutes);
app.use('/api/v1/sales', saleRoutes);
app.use('/api/v1/suppliers', supplierRoutes);
app.use('/api/v1/purchases', purchaseRoutes);
app.use('/api/v1/finance', financeRoutes);
app.use('/api/v1/staff', staffRoutes);
app.use('/api/v1/stores', tenantRoutes);

// Global Error Handler
app.use(errorHandler);

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

export default app;
