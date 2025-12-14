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
exports.sendAppointmentConfirmationEmail = sendAppointmentConfirmationEmail;
exports.sendAppointmentConfirmationWhatsApp = sendAppointmentConfirmationWhatsApp;
exports.sendAppointmentConfirmationSMS = sendAppointmentConfirmationSMS;
exports.sendAppointmentNotifications = sendAppointmentNotifications;
exports.sendEmail = sendEmail;
exports.sendWhatsApp = sendWhatsApp;
const nodemailer_1 = __importDefault(require("nodemailer"));
// Configuración del transportador de email
const transporter = nodemailer_1.default.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: false, // true para 465, false para otros puertos
    auth: {
        user: process.env.SMTP_USER || 'tu-email@gmail.com',
        pass: process.env.SMTP_PASS || 'tu-contraseña',
    },
});
/**
 * Enviar email de confirmación de cita
 */
function sendAppointmentConfirmationEmail(data) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!data.clientEmail) {
            console.log('⚠️ No se proporcionó email, no se enviará notificación por correo');
            return false;
        }
        try {
            const emailContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f5f5f5;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 20px auto;
            background: white;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          }
          .header {
            background: linear-gradient(135deg, #9333ea 0%, #ec4899 100%);
            color: white;
            padding: 30px;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 28px;
          }
          .content {
            padding: 30px;
          }
          .info-box {
            background: linear-gradient(135deg, #faf5ff 0%, #fce7f3 100%);
            border-left: 4px solid #9333ea;
            padding: 20px;
            margin: 20px 0;
            border-radius: 8px;
          }
          .info-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #e5e7eb;
          }
          .info-row:last-child {
            border-bottom: none;
          }
          .label {
            font-weight: 600;
            color: #6b7280;
          }
          .value {
            color: #111827;
            font-weight: 500;
          }
          .footer {
            background: #f9fafb;
            padding: 20px;
            text-align: center;
            color: #6b7280;
            font-size: 14px;
          }
          .checkmark {
            font-size: 48px;
            color: #10b981;
            margin-bottom: 10px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="checkmark">✓</div>
            <h1>¡Cita Confirmada!</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Tu reserva ha sido registrada exitosamente</p>
          </div>
          
          <div class="content">
            <p>Hola <strong>${data.clientName}</strong>,</p>
            <p>Tu cita en <strong>${data.salonName}</strong> ha sido confirmada con los siguientes detalles:</p>
            
            <div class="info-box">
              <div class="info-row">
                <span class="label">📋 Servicio:</span>
                <span class="value">${data.serviceName}</span>
              </div>
              <div class="info-row">
                <span class="label">📅 Fecha:</span>
                <span class="value">${data.date}</span>
              </div>
              <div class="info-row">
                <span class="label">⏰ Hora:</span>
                <span class="value">${data.time}</span>
              </div>
              <div class="info-row">
                <span class="label">⏱️ Duración:</span>
                <span class="value">${data.duration} minutos</span>
              </div>
              <div class="info-row">
                <span class="label">💰 Precio:</span>
                <span class="value">€${data.price}</span>
              </div>
              ${data.salonAddress ? `
              <div class="info-row">
                <span class="label">📍 Dirección:</span>
                <span class="value">${data.salonAddress}</span>
              </div>
              ` : ''}
              ${data.salonPhone ? `
              <div class="info-row">
                <span class="label">📞 Teléfono:</span>
                <span class="value">${data.salonPhone}</span>
              </div>
              ` : ''}
            </div>
            
            <p style="color: #6b7280; font-size: 14px; margin-top: 20px;">
              <strong>Nota:</strong> Por favor, llega 5 minutos antes de tu cita. 
              Si necesitas cancelar o modificar tu reserva, contacta directamente con el salón.
            </p>
          </div>
          
          <div class="footer">
            <p>Este es un correo automático, por favor no respondas a este mensaje.</p>
            <p style="margin: 5px 0;">© 2025 BeautySalon - Sistema de Gestión de Citas</p>
          </div>
        </div>
      </body>
      </html>
    `;
            const info = yield transporter.sendMail({
                from: `"${data.salonName}" <${process.env.SMTP_USER || 'noreply@beautysalon.com'}>`,
                to: data.clientEmail,
                subject: `✅ Cita Confirmada - ${data.salonName}`,
                html: emailContent,
            });
            console.log('✅ Email enviado:', info.messageId);
            return true;
        }
        catch (error) {
            console.error('❌ Error enviando email:', error);
            return false;
        }
    });
}
/**
 * Enviar mensaje de WhatsApp usando WhatsApp Business Cloud API
 */
function sendAppointmentConfirmationWhatsApp(data) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        if (!data.clientPhone) {
            console.log('⚠️ No se proporcionó teléfono, no se enviará notificación por WhatsApp');
            return false;
        }
        const whatsappToken = process.env.WHATSAPP_TOKEN;
        const whatsappPhoneId = process.env.WHATSAPP_PHONE_ID;
        if (!whatsappToken || !whatsappPhoneId) {
            console.log('⚠️ WhatsApp no configurado (falta WHATSAPP_TOKEN o WHATSAPP_PHONE_ID)');
            console.log('📱 Mensaje que se enviaría por WhatsApp:');
            console.log(`   Destinatario: ${data.clientPhone}`);
            console.log(`   ¡Cita Confirmada en ${data.salonName}!`);
            console.log(`   Servicio: ${data.serviceName}`);
            console.log(`   📅 ${data.date} a las ${data.time}`);
            console.log(`   💰 €${data.price}`);
            return false;
        }
        try {
            // Formatear el número de teléfono (debe incluir código de país sin +)
            const phoneNumber = data.clientPhone.replace(/[^\d]/g, '');
            const formattedPhone = phoneNumber.startsWith('34') ? phoneNumber : `34${phoneNumber}`;
            const messageText = `🎉 *¡Cita Confirmada!*

Hola ${data.clientName}, tu reserva en *${data.salonName}* ha sido confirmada.

📋 *Servicio:* ${data.serviceName}
📅 *Fecha:* ${data.date}
⏰ *Hora:* ${data.time}
⏱️ *Duración:* ${data.duration} minutos
💰 *Precio:* €${data.price}

${data.salonAddress ? `📍 *Dirección:* ${data.salonAddress}\n` : ''}${data.salonPhone ? `📞 *Teléfono:* ${data.salonPhone}\n` : ''}
_Por favor, llega 5 minutos antes de tu cita._

¡Gracias por tu reserva! 🙌`;
            const axios = require('axios');
            const response = yield axios.post(`https://graph.facebook.com/v21.0/${whatsappPhoneId}/messages`, {
                messaging_product: 'whatsapp',
                to: formattedPhone,
                type: 'text',
                text: {
                    preview_url: false,
                    body: messageText,
                },
            }, {
                headers: {
                    'Authorization': `Bearer ${whatsappToken}`,
                    'Content-Type': 'application/json',
                },
            });
            console.log('✅ WhatsApp enviado correctamente:', response.data.messages[0].id);
            return true;
        }
        catch (error) {
            console.error('❌ Error enviando WhatsApp:', ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message);
            return false;
        }
    });
}
/**
 * Enviar SMS de confirmación de cita (simulado - alternativa si no hay WhatsApp)
 */
function sendAppointmentConfirmationSMS(data) {
    return __awaiter(this, void 0, void 0, function* () {
        // Ahora intentamos enviar por WhatsApp en lugar de SMS
        return sendAppointmentConfirmationWhatsApp(data);
    });
}
/**
 * Enviar notificaciones de confirmación (email y/o SMS)
 */
function sendAppointmentNotifications(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const [emailSent, smsSent] = yield Promise.all([
            sendAppointmentConfirmationEmail(data),
            sendAppointmentConfirmationSMS(data),
        ]);
        return { emailSent, smsSent };
    });
}
/**
 * Enviar email genérico (para campañas de marketing)
 */
function sendEmail(to, subject, message) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const emailContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f5f5f5;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 20px auto;
            background: white;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          }
          .header {
            background: linear-gradient(135deg, #9333ea 0%, #ec4899 100%);
            color: white;
            padding: 30px;
            text-align: center;
          }
          .content {
            padding: 30px;
            color: #374151;
            line-height: 1.6;
            white-space: pre-wrap;
          }
          .footer {
            background: #f9fafb;
            padding: 20px;
            text-align: center;
            color: #6b7280;
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>💌 Mensaje de tu salón</h1>
          </div>
          <div class="content">
            ${message}
          </div>
          <div class="footer">
            Este mensaje fue enviado automáticamente. Por favor no respondas a este correo.
          </div>
        </div>
      </body>
      </html>
    `;
            yield transporter.sendMail({
                from: `"${process.env.SALON_NAME || 'Tu Salón'}" <${process.env.SMTP_USER}>`,
                to,
                subject,
                html: emailContent,
            });
            console.log(`✅ Email enviado a: ${to}`);
            return true;
        }
        catch (error) {
            console.error('❌ Error enviando email:', error);
            return false;
        }
    });
}
/**
 * Enviar WhatsApp genérico (para campañas de marketing)
 */
function sendWhatsApp(phone, message) {
    return __awaiter(this, void 0, void 0, function* () {
        const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
        const WHATSAPP_PHONE_ID = process.env.WHATSAPP_PHONE_ID;
        if (!WHATSAPP_TOKEN || !WHATSAPP_PHONE_ID) {
            console.log('⚠️ Credenciales de WhatsApp no configuradas');
            return false;
        }
        try {
            // Limpiar el número de teléfono
            const cleanPhone = phone.replace(/\D/g, '');
            const response = yield fetch(`https://graph.facebook.com/v17.0/${WHATSAPP_PHONE_ID}/messages`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    messaging_product: 'whatsapp',
                    to: cleanPhone,
                    type: 'text',
                    text: {
                        body: message,
                    },
                }),
            });
            if (!response.ok) {
                const error = yield response.json();
                console.error('❌ Error en respuesta de WhatsApp:', error);
                return false;
            }
            console.log(`✅ WhatsApp enviado a: ${phone}`);
            return true;
        }
        catch (error) {
            console.error('❌ Error enviando WhatsApp:', error.message);
            return false;
        }
    });
}
