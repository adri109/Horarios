# Configuración del Sistema de Notificaciones

## 📧 Configuración de Email (Gmail)

Para enviar emails de confirmación de citas, necesitas configurar una cuenta de Gmail:

### Paso 1: Obtener una contraseña de aplicación de Gmail

1. Ve a tu cuenta de Google: https://myaccount.google.com/
2. Selecciona "Seguridad" en el menú lateral
3. Activa la "Verificación en 2 pasos" (si no la tienes activada)
4. Busca "Contraseñas de aplicaciones"
5. Selecciona "Correo" y "Windows" (o tu dispositivo)
6. Google generará una contraseña de 16 caracteres
7. Copia esta contraseña

### Paso 2: Configurar el archivo .env

Edita el archivo `.env` en la raíz del proyecto:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu-correo@gmail.com
SMTP_PASS=xxxx xxxx xxxx xxxx  # Contraseña de aplicación generada
```

### Paso 3: Para otros proveedores de email

**Outlook/Hotmail:**
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_USER=tu-correo@outlook.com
SMTP_PASS=tu-contraseña
```

**Yahoo:**
```env
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
SMTP_USER=tu-correo@yahoo.com
SMTP_PASS=tu-contraseña-de-aplicacion
```

**Servidor SMTP personalizado:**
```env
SMTP_HOST=mail.tudominio.com
SMTP_PORT=587
SMTP_USER=noreply@tudominio.com
SMTP_PASS=tu-contraseña
```

## 📱 Configuración de WhatsApp Business API (GRATIS - 1,000 mensajes/mes)

WhatsApp Business Cloud API es **GRATUITA** hasta 1,000 conversaciones al mes.

### Pasos para configurar WhatsApp:

**1. Crear una App en Meta for Developers:**
   - Ve a https://developers.facebook.com/
   - Haz clic en "Mis Apps" → "Crear App"
   - Selecciona "Empresa" como tipo
   - Dale un nombre a tu app (ej: "MiSalon Notificaciones")

**2. Añadir WhatsApp a tu App:**
   - En el panel de tu app, busca "WhatsApp" y haz clic en "Configurar"
   - Verás una sección "Empezar" con un número de prueba

**3. Obtener tus credenciales:**
   - **Token de Acceso Temporal** (dura 24h - para pruebas):
     - En la sección WhatsApp → "Empezar", copia el "Token de acceso temporal"
   
   - **Token de Acceso Permanente** (recomendado):
     - Ve a "Configuración de WhatsApp" → "Tokens de acceso"
     - Crea un token del sistema con permisos `whatsapp_business_messaging`
   
   - **Phone Number ID**:
     - En "Empezar", verás tu "ID del número de teléfono"
     - Cópialo (algo como: `123456789012345`)

**4. Configurar en tu `.env`:**
```env
WHATSAPP_TOKEN=EAAxxxxxxxxxxxxxxxxxxxxxxxxxxxx
WHATSAPP_PHONE_ID=123456789012345
```

**5. Añadir números de prueba:**
   - En "Configuración de WhatsApp" → "Números de teléfono"
   - Añade tu número de WhatsApp personal para pruebas
   - WhatsApp te enviará un código de verificación

**6. Para producción (enviar a cualquier número):**
   - Verifica tu cuenta de Meta Business (requiere documentos)
   - Obtén un número de WhatsApp propio ($5-15/mes según país)
   - O usa el número de prueba (gratis, pero solo envía a números verificados)

### Modo de Prueba (GRATIS - funciona sin verificar negocio)

Por defecto, WhatsApp te da:
- ✅ Número de teléfono de prueba GRATIS
- ✅ 1,000 mensajes gratis al mes
- ⚠️ Solo puedes enviar a números que hayas agregado manualmente en Meta

Para desarrollo, esto es **perfecto**: añades tu número y el de tus clientes de prueba.

---

## 📱 Alternativa: SMS con Twilio (si prefieres SMS en lugar de WhatsApp)

### Opción: Twilio

1. Crea una cuenta en https://www.twilio.com/
2. Obtén tu Account SID y Auth Token
3. Compra un número de teléfono
4. Configura en `.env`:

```env
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=tu-auth-token
TWILIO_PHONE_NUMBER=+1234567890
```

5. Descomenta el código en `src/services/notificationService.ts`:

```typescript
// Instala el SDK de Twilio
npm install twilio

// En notificationService.ts
import twilio from 'twilio';

export async function sendAppointmentConfirmationSMS(data: AppointmentEmailData): Promise<boolean> {
  if (!data.clientPhone) return false;

  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const client = twilio(accountSid, authToken);

  try {
    const message = await client.messages.create({
      body: `¡Cita Confirmada! ${data.salonName}\n\nServicio: ${data.serviceName}\nFecha: ${data.date}\nHora: ${data.time}\nPrecio: €${data.price}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: data.clientPhone
    });

    console.log('✅ SMS enviado:', message.sid);
    return true;
  } catch (error) {
    console.error('❌ Error enviando SMS:', error);
    return false;
  }
}
```

## 🧪 Modo de Prueba

Por defecto, el sistema de SMS está en modo simulación. Los mensajes se mostrarán en la consola del servidor pero no se enviarán realmente.

Para activar el envío real de SMS, implementa la integración con Twilio siguiendo los pasos anteriores.

## ✅ Verificación

1. Reinicia el servidor backend
2. Crea una reserva desde la página pública del salón
3. Revisa la consola del servidor para ver los logs de envío
4. Revisa la bandeja de entrada del email proporcionado

## 📊 Logs

Los logs del sistema mostrarán:
- `✅ Email enviado: [message-id]` - Email enviado correctamente
- `📱 SMS simulado enviado correctamente` - SMS simulado (modo prueba)
- `✅ SMS enviado: [sid]` - SMS enviado correctamente (con Twilio)
- `⚠️ No se proporcionó email/teléfono` - No se envió porque no hay contacto
- `❌ Error enviando email/SMS` - Error en el envío

## 🎨 Personalización

Puedes personalizar las plantillas de email y SMS en:
- Email: `src/services/notificationService.ts` función `sendAppointmentConfirmationEmail()`
- SMS: `src/services/notificationService.ts` función `sendAppointmentConfirmationSMS()`
