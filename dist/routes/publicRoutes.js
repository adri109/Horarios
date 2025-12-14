"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// routes/publicRoutes.ts
const express_1 = require("express");
const publicController_1 = require("../controllers/publicController");
const router = (0, express_1.Router)();
// URL pública: http://localhost:3000/public/:slug
router.get('/:slug', publicController_1.getSalonPublic);
// Slots por fecha
router.get('/:slug/slots', publicController_1.getSalonSlots);
// Crear cita desde página pública
router.post('/:slug/appointments', publicController_1.createPublicAppointment);
exports.default = router;
