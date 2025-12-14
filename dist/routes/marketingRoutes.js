"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const permissions_1 = require("../middleware/permissions");
const marketingController_1 = require("../controllers/marketingController");
const router = (0, express_1.Router)();
// Enviar campaña de marketing (solo con permiso de marketing o ADMIN)
router.post('/send-campaign', auth_1.authenticateToken, (0, permissions_1.checkPermission)('canViewMarketing'), marketingController_1.sendCampaign);
exports.default = router;
