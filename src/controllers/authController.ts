import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import slugify from 'slugify';
import crypto from 'crypto';
import prisma from '../utils/prisma';
import logger from '../utils/logger';
import { createSmtpTransport, smtpFrom } from '../utils/smtpTransport';

const transporter = createSmtpTransport();

// ==========================
// CHECK EMAIL (registro, sin persistir)
// ==========================
export const checkRegistrationEmail = async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(200).json({
        available: false,
        error: 'El email ya está registrado',
      });
    }
    res.status(200).json({ available: true });
  } catch (error: any) {
    console.error('💥 Error al comprobar email:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// ==========================
// REGISTER
// ==========================
export const register = async (req: Request, res: Response) => {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    return res.status(500).json({ error: 'Configuración de autenticación inválida' });
  }

  const {
    email,
    password,
    fullName,
    phone,
    salonName,
    salonAddress,
    salonPhone,
  } = req.body;

  try {
    // 1️⃣ Verificar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }

    // 2️⃣ Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3️⃣ Crear el usuario ADMIN
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: fullName,
        phone: phone || null,
        role: 'ADMIN',
      },
    });

    const slug = slugify(salonName, { lower: true, strict: true });

    // 4️⃣ Crear el salón asociado al usuario
    const salon = await prisma.salon.create({
      data: {
        name: salonName,
        address: salonAddress || null,
        phone: salonPhone || null,
        adminId: user.id,
        slug,
      },
    });

    // 5️⃣ Crear configuración por defecto del salón
    await prisma.config.create({
      data: {
        salonId: salon.id,
      },
    });

    // 6️⃣ Crear token JWT
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      jwtSecret,
      { expiresIn: '1h' }
    );

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
  } catch (error: any) {
    console.error('💥 Error al registrar usuario:', error);
    res
      .status(500)
      .json({ error: 'Error en el servidor', details: error.message });
  }
};

// ==========================
// LOGIN
// ==========================
export const login = async (req: Request, res: Response) => {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    return res.status(500).json({ error: 'Configuración de autenticación inválida' });
  }

  const { email, password } = req.body;

  try {
    // 1️⃣ Buscar usuario por email e incluir el salón si existe
    const user = await prisma.user.findUnique({
      where: { email },
      include: { salon: true, worksAt: true },
    });

    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // 2️⃣ Validar contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // 3️⃣ Generar token JWT
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      jwtSecret,
      { expiresIn: '1h' }
    );

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
  } catch (error: any) {
    console.error('💥 Error al iniciar sesión:', error);
    res
      .status(500)
      .json({ error: 'Error en el servidor', details: error.message });
  }
};

// ==========================
// FORGOT PASSWORD
// ==========================
export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    // 1️⃣ Buscar usuario por email
    const user = await prisma.user.findUnique({ where: { email } });

    // No revelar si el email existe o no por seguridad
    if (!user) {
      return res.json({ message: 'Si el email existe, recibirás un correo de restablecimiento' });
    }

    // 2️⃣ Generar token de restablecimiento (válido por 1 hora)
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hora

    // 3️⃣ Guardar token en base de datos
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    });

    // 4️⃣ Enviar email con enlace de restablecimiento
    const resetUrl = `http://localhost:8080/reset-password?token=${resetToken}`;
    
    const info = await transporter.sendMail({
      from: smtpFrom(),
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

    logger.info(
      { messageId: info.messageId, to: email },
      'Correo de restablecimiento aceptado por SMTP'
    );

    res.json({ message: 'Si el email existe, recibirás un correo de restablecimiento' });
  } catch (error: unknown) {
    const e = error as {
      code?: string;
      responseCode?: number;
      response?: string;
      message?: string;
    };
    logger.error(
      {
        smtpHost: process.env.SMTP_HOST,
        smtpPort: process.env.SMTP_PORT,
        smtpUser: process.env.SMTP_USER?.trim(),
        smtpErrCode: e.code,
        smtpErrResponseCode: e.responseCode,
        smtpErrResponse: e.response ?? e.message,
      },
      'Error SMTP al solicitar restablecimiento (535 EAUTH = credenciales incorrectas o SMTP no permitido en tu plan/cuenta Zoho)'
    );
    res.status(500).json({ error: 'Error al procesar la solicitud' });
  }
};

// ==========================
// RESET PASSWORD
// ==========================
export const resetPassword = async (req: Request, res: Response) => {
  const { token, newPassword } = req.body;

  try {
    // 1️⃣ Buscar usuario con el token válido
    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: { gt: new Date() },
      },
    });

    if (!user) {
      return res.status(400).json({ error: 'Token inválido o expirado' });
    }

    // 2️⃣ Hashear nueva contraseña
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 3️⃣ Actualizar contraseña y limpiar token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    res.json({ message: 'Contraseña actualizada exitosamente' });
  } catch (error: any) {
    console.error('💥 Error al restablecer contraseña:', error);
    res.status(500).json({ error: 'Error al restablecer la contraseña' });
  }
};
