"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const clientController_1 = require("../controllers/clientController");
const auth_1 = require("../middleware/auth");
const permissions_1 = require("../middleware/permissions");
const router = express_1.default.Router();
// Todas las rutas requieren autenticación
router.use(auth_1.authenticateToken);
// GET /clients - Obtener todos los clientes del salón (requiere ver clientes)
router.get('/', (0, permissions_1.checkPermission)('canViewClients'), clientController_1.getClients);
// GET /clients/:id - Obtener un cliente específico (requiere ver clientes)
router.get('/:id', (0, permissions_1.checkPermission)('canViewClients'), clientController_1.getClientById);
// PUT /clients/:id - Actualizar un cliente (requiere editar clientes)
router.put('/:id', (0, permissions_1.checkPermission)('canEditClients'), clientController_1.updateClient);
// DELETE /clients/:id - Eliminar un cliente (requiere eliminar clientes)
router.delete('/:id', (0, permissions_1.checkPermission)('canDeleteClients'), clientController_1.deleteClient);
exports.default = router;
