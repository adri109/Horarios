"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const servicesController_1 = require("../controllers/servicesController");
const auth_1 = require("../middleware/auth");
const permissions_1 = require("../middleware/permissions");
const router = (0, express_1.Router)();
// Todas las rutas requieren autenticación + permisos
router.get('/', auth_1.authenticateToken, (0, permissions_1.checkPermission)('canViewServices'), servicesController_1.getAllServices);
router.get('/:id', auth_1.authenticateToken, (0, permissions_1.checkPermission)('canViewServices'), servicesController_1.getServiceById);
router.post('/', auth_1.authenticateToken, (0, permissions_1.checkPermission)('canEditServices'), servicesController_1.createService);
router.put('/:id', auth_1.authenticateToken, (0, permissions_1.checkPermission)('canEditServices'), servicesController_1.updateService);
router.delete('/:id', auth_1.authenticateToken, (0, permissions_1.checkPermission)('canDeleteServices'), servicesController_1.deleteService);
exports.default = router;
