"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const configController_1 = require("../controllers/configController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Todas las rutas requieren autenticación
router.use(auth_1.authenticateToken);
// Configuración general
router.get('/', configController_1.getConfig);
router.put('/', configController_1.updateConfig);
// Horarios semanales
router.post('/schedules', configController_1.createSchedule);
router.put('/schedules/:id', configController_1.updateSchedule);
router.delete('/schedules/:id', configController_1.deleteSchedule);
// Bloqueos de fechas
router.post('/blocks', configController_1.createBlock);
router.delete('/blocks/:id', configController_1.deleteBlock);
exports.default = router;
