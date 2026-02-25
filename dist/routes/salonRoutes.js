"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const salonController_1 = require("../controllers/salonController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.get('/:slug', salonController_1.getSalonBySlug);
router.put('/info', auth_1.authenticateToken, salonController_1.updateSalonInfo);
exports.default = router;
