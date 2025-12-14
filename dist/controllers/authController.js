"use strict";
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
exports.resetPassword = exports.forgotPassword = exports.login = exports.register = void 0;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const slugify_1 = __importDefault(require("slugify"));
const crypto_1 = __importDefault(require("crypto"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const prisma = new client_1.PrismaClient();
// Configurar transporte de email
const transporter = nodemailer_1.default.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});
// ==========================
// REGISTER
// ==========================
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, fullName, phone, salonName, salonAddress, salonPhone, config, } = req.body;
    try {
        // 1️⃣ Verificar si el usuario ya existe
        const existingUser = yield prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'El email ya está registrado' });
        }
        // 2️⃣ Hashear la contraseña
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        // 3️⃣ Crear el usuario ADMIN
        const user = yield prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name: fullName,
                phone: phone || null,
                role: 'ADMIN',
            },
        });
        const slug = (0, slugify_1.default)(salonName, { lower: true, strict: true });
        // 4️⃣ Crear el salón asociado al usuario
        const salon = yield prisma.salon.create({
            data: {
                name: salonName,
                address: salonAddress || null,
                phone: salonPhone || null,
                adminId: user.id,
                slug,
            },
        });
        // 5️⃣ Crear configuración del salón si se proporciona
        if (config) {
            yield prisma.config.create({
                data: {
                    salonId: salon.id,
                    requireConfirmation: config.requireConfirmation || false,
                    workersCanCreateServices: config.workersCanCreateServices || false,
                    canAcceptAppointments: config.canAcceptAppointments !== undefined
                        ? config.canAcceptAppointments
                        : true,
                    canModifyAppointments: config.canModifyAppointments || false,
                },
            });
        }
        // 6️⃣ Crear token JWT
        const token = jsonwebtoken_1.default.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET || 'your_jwt_secret', { expiresIn: '1h' });
        // 7️⃣ Devolver respuesta con usuario + salón
        res.status(201).json({
            token,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                name: user.name,
                phone: user.phone,
                salon: {
                    id: salon.id,
                    name: salon.name,
                    slug: salon.slug,
                    address: salon.address,
                    phone: salon.phone,
                },
            },
        });
    }
    catch (error) {
        console.error('💥 Error al registrar usuario:', error);
        res
            .status(500)
            .json({ error: 'Error en el servidor', details: error.message });
    }
});
exports.register = register;
// ==========================
// LOGIN
// ==========================
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        // 1️⃣ Buscar usuario por email e incluir el salón si existe
        const user = yield prisma.user.findUnique({
            where: { email },
            include: { salon: true, worksAt: true },
        });
        if (!user) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }
        // 2️⃣ Validar contraseña
        const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }
        // 3️⃣ Generar token JWT
        console.log('🔑 Creando token para userId:', user.id, 'role:', user.role);
        const token = jsonwebtoken_1.default.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET || 'your_jwt_secret', { expiresIn: '1h' });
        console.log('✅ Token creado exitosamente');
        // 4️⃣ Devolver datos de usuario + token + permisos
        res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                name: user.name,
                salon: user.salon || user.worksAt || null,
                permissions: {
                    canViewClients: user.canViewClients,
                    canEditClients: user.canEditClients,
                    canDeleteClients: user.canDeleteClients,
                    canViewPersonal: user.canViewPersonal,
                    canEditPersonal: user.canEditPersonal,
                    canDeletePersonal: user.canDeletePersonal,
                    canViewServices: user.canViewServices,
                    canEditServices: user.canEditServices,
                    canDeleteServices: user.canDeleteServices,
                    canViewInventory: user.canViewInventory,
                    canEditInventory: user.canEditInventory,
                    canDeleteInventory: user.canDeleteInventory,
                    canViewReports: user.canViewReports,
                    canViewMarketing: user.canViewMarketing,
                    canConfirmAppointments: user.canConfirmAppointments,
                    canCancelAppointments: user.canCancelAppointments,
                },
            },
        });
    }
    catch (error) {
        console.error('💥 Error al iniciar sesión:', error);
        res
            .status(500)
            .json({ error: 'Error en el servidor', details: error.message });
    }
});
exports.login = login;
// ==========================
// FORGOT PASSWORD
// ==========================
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    try {
        // 1️⃣ Buscar usuario por email
        const user = yield prisma.user.findUnique({ where: { email } });
        // No revelar si el email existe o no por seguridad
        if (!user) {
            return res.json({ message: 'Si el email existe, recibirás un correo de restablecimiento' });
        }
        // 2️⃣ Generar token de restablecimiento (válido por 1 hora)
        const resetToken = crypto_1.default.randomBytes(32).toString('hex');
        const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hora
        // 3️⃣ Guardar token en base de datos
        yield prisma.user.update({
            where: { id: user.id },
            data: {
                resetToken,
                resetTokenExpiry,
            },
        });
        // 4️⃣ Enviar email con enlace de restablecimiento
        const resetUrl = `http://localhost:8080/reset-password?token=${resetToken}`;
        yield transporter.sendMail({
            from: `"Horarios" <${process.env.SMTP_USER}>`,
            to: email,
            subject: 'Restablecer tu contraseña',
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #9333ea;">Restablecer tu contraseña</h2>
          <p>Has solicitado restablecer tu contraseña. Haz clic en el botón de abajo para continuar:</p>
          <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background-color: #9333ea; color: white; text-decoration: none; border-radius: 8px; margin: 20px 0;">
            Restablecer contraseña
          </a>
          <p>O copia y pega este enlace en tu navegador:</p>
          <p style="color: #6b7280; word-break: break-all;">${resetUrl}</p>
          <p style="color: #ef4444; margin-top: 20px;"><strong>Este enlace expirará en 1 hora.</strong></p>
          <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">Si no solicitaste este cambio, puedes ignorar este correo.</p>
        </div>
      `,
        });
        res.json({ message: 'Si el email existe, recibirás un correo de restablecimiento' });
    }
    catch (error) {
        console.error('💥 Error al solicitar restablecimiento:', error);
        res.status(500).json({ error: 'Error al procesar la solicitud' });
    }
});
exports.forgotPassword = forgotPassword;
// ==========================
// RESET PASSWORD
// ==========================
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token, newPassword } = req.body;
    try {
        // 1️⃣ Buscar usuario con el token válido
        const user = yield prisma.user.findFirst({
            where: {
                resetToken: token,
                resetTokenExpiry: { gt: new Date() },
            },
        });
        if (!user) {
            return res.status(400).json({ error: 'Token inválido o expirado' });
        }
        // 2️⃣ Hashear nueva contraseña
        const hashedPassword = yield bcrypt_1.default.hash(newPassword, 10);
        // 3️⃣ Actualizar contraseña y limpiar token
        yield prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                resetToken: null,
                resetTokenExpiry: null,
            },
        });
        res.json({ message: 'Contraseña actualizada exitosamente' });
    }
    catch (error) {
        console.error('💥 Error al restablecer contraseña:', error);
        res.status(500).json({ error: 'Error al restablecer la contraseña' });
    }
});
exports.resetPassword = resetPassword;
