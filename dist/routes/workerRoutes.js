"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const permissions_1 = require("../middleware/permissions");
const workerController_1 = require("../controllers/workerController");
const router = (0, express_1.Router)();
// Todas las rutas requieren autenticación + permisos
router.get('/', auth_1.authenticateToken, (0, permissions_1.checkPermission)('canViewPersonal'), workerController_1.getAllWorkers);
router.post('/', auth_1.authenticateToken, (0, permissions_1.checkPermission)('canEditPersonal'), workerController_1.createWorker);
router.put('/:id', auth_1.authenticateToken, (0, permissions_1.checkPermission)('canEditPersonal'), workerController_1.updateWorker);
router.delete('/:id', auth_1.authenticateToken, (0, permissions_1.checkPermission)('canDeletePersonal'), workerController_1.deleteWorker);
exports.default = router;
