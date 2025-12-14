"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dashboardController_1 = require("../controllers/dashboardController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Todas las rutas requieren autenticación
router.use(auth_1.authenticateToken);
// GET /dashboard/stats - Obtener estadísticas del dashboard
router.get('/stats', dashboardController_1.getDashboardStats);
// PUT /dashboard/appointments/:id/status - Actualizar estado de una cita
router.put('/appointments/:id/status', dashboardController_1.updateAppointmentStatus);
exports.default = router;
