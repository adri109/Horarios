"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const notificationController_1 = require("../controllers/notificationController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Todas las rutas requieren autenticación
router.use(auth_1.authenticateToken);
// GET /notifications - Obtener todas las notificaciones
router.get('/', notificationController_1.getNotifications);
// GET /notifications/unread - Obtener notificaciones no leídas
router.get('/unread', notificationController_1.getUnreadNotifications);
// PUT /notifications/:id/read - Marcar notificación como leída
router.put('/:id/read', notificationController_1.markAsRead);
// PUT /notifications/read-all - Marcar todas como leídas
router.put('/read-all', notificationController_1.markAllAsRead);
// POST /notifications/test - Crear notificaciones de prueba (temporal)
router.post('/test', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.userId;
    const { createNotification } = yield Promise.resolve().then(() => __importStar(require('../controllers/notificationController')));
    yield createNotification(userId, 'Tienes una cita mañana a las 10:00 AM con Juan Pérez', 'REMINDER');
    yield createNotification(userId, 'Nueva promoción: 20% de descuento en todos los servicios', 'PROMOTION');
    yield createNotification(userId, 'El cliente María López ha cancelado su cita', 'CANCELLATION');
    res.json({ message: 'Notificaciones de prueba creadas' });
}));
exports.default = router;
