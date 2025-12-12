import express from 'express';
import { 
  getClients, 
  getClientById, 
  updateClient, 
  deleteClient 
} from '../controllers/clientController';
import { authenticateToken } from '../middleware/auth';
import { checkPermission } from '../middleware/permissions';

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(authenticateToken);

// GET /clients - Obtener todos los clientes del salón (requiere ver clientes)
router.get('/', checkPermission('canViewClients'), getClients);

// GET /clients/:id - Obtener un cliente específico (requiere ver clientes)
router.get('/:id', checkPermission('canViewClients'), getClientById);

// PUT /clients/:id - Actualizar un cliente (requiere editar clientes)
router.put('/:id', checkPermission('canEditClients'), updateClient);

// DELETE /clients/:id - Eliminar un cliente (requiere eliminar clientes)
router.delete('/:id', checkPermission('canDeleteClients'), deleteClient);

export default router;
