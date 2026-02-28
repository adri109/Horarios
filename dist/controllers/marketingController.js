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
exports.sendCampaign = void 0;
const notificationService_1 = require("../services/notificationService");
const prisma_1 = __importDefault(require("../utils/prisma"));
const sendCampaign = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    const { channel, subject, message, sendToAll, selectedClients } = req.body;
    console.log('📧 Iniciando campaña de marketing');
    console.log('Canal:', channel);
    console.log('Enviar a todos:', sendToAll);
    try {
        // 1. Obtener el salón del usuario
        const user = yield prisma_1.default.user.findUnique({
            where: { id: userId },
            include: { salon: true, worksAt: true }
        });
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        const salon = user.role === 'ADMIN' ? user.salon : user.worksAt;
        if (!salon) {
            return res.status(404).json({ error: 'Salón no encontrado' });
        }
        // 2. Obtener clientes destinatarios
        let clients;
        if (sendToAll) {
            clients = yield prisma_1.default.client.findMany({
                where: { salonId: salon.id }
            });
        }
        else {
            if (!selectedClients || selectedClients.length === 0) {
                return res.status(400).json({ error: 'No se seleccionaron clientes' });
            }
            clients = yield prisma_1.default.client.findMany({
                where: {
                    id: { in: selectedClients },
                    salonId: salon.id
                }
            });
        }
        if (clients.length === 0) {
            return res.status(400).json({ error: 'No hay clientes para enviar la campaña' });
        }
        console.log(`📨 Enviando campaña a ${clients.length} cliente(s)`);
        // 3. Personalizar y enviar mensajes
        const results = {
            success: 0,
            failed: 0,
            errors: []
        };
        for (const client of clients) {
            // Personalizar mensaje
            let personalizedMessage = message;
            personalizedMessage = personalizedMessage.replace(/{nombre}/g, client.name);
            personalizedMessage = personalizedMessage.replace(/{salon_name}/g, salon.name);
            personalizedMessage = personalizedMessage.replace(/{salon_url}/g, `http://localhost:8080/salon/${salon.slug}`);
            let personalizedSubject = subject || '';
            personalizedSubject = personalizedSubject.replace(/{nombre}/g, client.name);
            personalizedSubject = personalizedSubject.replace(/{salon_name}/g, salon.name);
            try {
                let sent = false;
                // Enviar por Email
                if ((channel === 'email' || channel === 'both') && client.email) {
                    yield (0, notificationService_1.sendEmail)(client.email, personalizedSubject, personalizedMessage);
                    console.log(`✅ Email enviado a ${client.name} (${client.email})`);
                    sent = true;
                }
                else if (channel === 'email' || channel === 'both') {
                    console.log(`⚠️ ${client.name} no tiene email registrado`);
                }
                // Enviar por WhatsApp
                if ((channel === 'whatsapp' || channel === 'both') && client.phone) {
                    yield (0, notificationService_1.sendWhatsApp)(client.phone, personalizedMessage);
                    console.log(`✅ WhatsApp enviado a ${client.name} (${client.phone})`);
                    sent = true;
                }
                else if (channel === 'whatsapp' || channel === 'both') {
                    console.log(`⚠️ ${client.name} no tiene teléfono registrado`);
                }
                if (sent) {
                    results.success++;
                }
                else {
                    results.failed++;
                    results.errors.push(`${client.name} no tiene contacto válido para ${channel}`);
                }
            }
            catch (error) {
                console.error(`❌ Error enviando a ${client.name}:`, error);
                results.failed++;
                results.errors.push(`Error con ${client.name}: ${error}`);
            }
        }
        console.log(`✅ Campaña completada: ${results.success} exitosos, ${results.failed} fallidos`);
        res.json({
            message: 'Campaña enviada',
            results: {
                total: clients.length,
                success: results.success,
                failed: results.failed,
                errors: results.errors
            }
        });
    }
    catch (error) {
        console.error('❌ Error en campaña de marketing:', error);
        res.status(500).json({ error: 'Error al enviar la campaña' });
    }
});
exports.sendCampaign = sendCampaign;
