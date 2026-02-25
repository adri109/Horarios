"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // si viene "Bearer TOKEN"
    if (!token) {
        return res.status(401).json({ error: 'No autenticado' });
    }
    jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'your_jwt_secret', (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: 'Token inválido' });
        }
        req.user = decoded;
        req.userId = decoded.userId; // Para compatibilidad con controllers que usan req.userId
        req.userRole = decoded.role; // Agregar rol para verificación de permisos
        next();
    });
};
exports.authenticateToken = authenticateToken;
