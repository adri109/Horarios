"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const appointmentController_1 = require("../controllers/appointmentController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Todas las rutas de citas requieren autenticación
router.get('/', auth_1.authenticateToken, appointmentController_1.getAllAppointments);
router.get('/:id', auth_1.authenticateToken, appointmentController_1.getAppointmentById);
router.post('/', auth_1.authenticateToken, appointmentController_1.createAppointment);
router.put('/:id/status', auth_1.authenticateToken, appointmentController_1.updateAppointmentStatus);
exports.default = router;
