# 💈 Sistema de Gestión para Salones de Belleza

Aplicación web completa para la gestión integral de salones de belleza, peluquerías y centros estéticos. Sistema multi-tenant con panel administrativo y página pública de reservas.

## 📋 Características Principales

- ✅ **Gestión de Citas**: Creación, edición, confirmación y cancelación de citas
- 👥 **Control de Clientes**: Historial completo, estadísticas y búsqueda avanzada
- 👨‍💼 **Gestión de Personal**: Roles, permisos personalizados y asignación de tareas
- 💇 **Servicios**: Administración de servicios con precios y duraciones
- 📦 **Inventario**: Control de stock con alertas de bajo inventario
- 📊 **Informes y Estadísticas**: Panel con métricas clave y exportación CSV
- 📧 **Notificaciones**: Sistema integrado con Email (Gmail) y WhatsApp
- 🎯 **Marketing**: Campañas promocionales por email y WhatsApp
- 🌐 **Reserva Pública**: Página de reservas personalizada con URL única
- 🔐 **Sistema de Autenticación**: JWT con roles y permisos granulares
- 🏢 **Multi-tenant**: Cada salón con datos completamente aislados

## 🛠️ Tecnologías Utilizadas

### Backend
- **Node.js** + **Express.js** + **TypeScript**
- **PostgreSQL** con **Prisma ORM**
- **JWT** para autenticación
- **bcrypt** para encriptación de contraseñas
- **Nodemailer** para envío de emails
- **WhatsApp Business API** para notificaciones

### Frontend
- **Vue.js 3** (Composition API)
- **Vue Router** para navegación
- **Tailwind CSS** para estilos
- **Axios** para peticiones HTTP

## 📦 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** 16+ ([Descargar](https://nodejs.org/))
- **PostgreSQL** 12+ ([Descargar](https://www.postgresql.org/download/))
- **npm** o **yarn** (incluido con Node.js)
- **Git** ([Descargar](https://git-scm.com/))

## 🚀 Instalación y Configuración

### 1️⃣ Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/nombre-repositorio.git
cd nombre-repositorio
```

### 2️⃣ Instalar dependencias

**Backend:**
```bash
npm install
```

**Frontend:**
```bash
cd frontend
npm install
cd ..
```

### 3️⃣ Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
# Base de datos PostgreSQL (local)
DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/nombre_db"

# Supabase (producción con Prisma)
# Runtime (pooler)
# DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1&sslmode=require"
# Migraciones (directa)
# DIRECT_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres?sslmode=require"

# Seguridad JWT
JWT_SECRET="cadena_muy_larga_y_segura_aleatoria"
PORT=3000

# Configuración de Email (Gmail)
SMTP_USER="tu_email@gmail.com"
SMTP_PASS="tu_contraseña_de_aplicacion"

# WhatsApp Business API (opcional)
WHATSAPP_TOKEN="tu_token_de_whatsapp_business_api"
WHATSAPP_PHONE_ID="tu_phone_id"
```

#### 📧 Configurar Gmail para SMTP

1. Ve a tu cuenta de Google
2. Activa la verificación en 2 pasos
3. Genera una "Contraseña de aplicación" en: https://myaccount.google.com/apppasswords
4. Usa esa contraseña en `SMTP_PASS`

### 4️⃣ Configurar la base de datos

**Crear base de datos en PostgreSQL:**

```sql
CREATE DATABASE nombre_db;
```

**Ejecutar migraciones de Prisma:**

```bash
npx prisma migrate deploy
npx prisma generate
```

#### 🔗 Configuración recomendada para Supabase + Prisma

- Usa `DATABASE_URL` con el **Connection Pooler** de Supabase (puerto 6543) para ejecución normal.
- Usa `DIRECT_URL` con la conexión **directa** de Supabase (puerto 5432) para migraciones.
- En producción (Render), configura ambas variables en el panel de entorno.
- Para aplicar migraciones en producción: `npx prisma migrate deploy`.

**Opcional - Ver la base de datos:**
```bash
npx prisma studio
```
Esto abre una interfaz web en `http://localhost:5555`

### 5️⃣ Arrancar el proyecto

**Opción A - Dos terminales separadas:**

Terminal 1 - Backend:
```bash
npm run dev
```

Terminal 2 - Frontend:
```bash
cd frontend
npm run serve
```

**Opción B - Modo desarrollo:**

Backend (con auto-reload):
```bash
npm run dev
```

Frontend (con hot-reload):
```bash
cd frontend
npm run dev
```

### 6️⃣ Acceder a la aplicación

- **Frontend**: http://localhost:8080
- **Backend API**: http://localhost:3000
- **Prisma Studio**: http://localhost:5555 (si está activo)

## 📂 Estructura del Proyecto

```
proyecto/
├── src/                          # Backend (Node.js + TypeScript)
│   ├── controllers/              # Lógica de negocio
│   ├── routes/                   # Definición de rutas API
│   ├── middleware/               # Autenticación y permisos
│   ├── services/                 # Servicios (emails, notificaciones)
│   └── index.ts                  # Punto de entrada del servidor
│
├── prisma/                       # Prisma ORM
│   ├── schema.prisma             # Definición del modelo de datos
│   └── migrations/               # Historial de migraciones
│
├── frontend/                     # Frontend (Vue.js 3)
│   ├── src/
│   │   ├── views/                # Páginas principales
│   │   │   ├── components/       # Componentes compartidos
│   │   │   └── dashboard/        # Componentes del dashboard
│   │   ├── router/               # Configuración de rutas
│   │   └── assets/               # Estilos y recursos
│   └── public/                   # Archivos estáticos
│
├── .env                          # Variables de entorno (NO subir a Git)
├── package.json                  # Dependencias del backend
└── README.md                     # Este archivo
```

## 🔐 Primer Uso

### Registrar un salón

1. Ve a http://localhost:8080/register
2. Completa el formulario con:
   - Email y contraseña del administrador
   - Nombre completo
   - Nombre del salón
   - Dirección y teléfono (opcional)
3. Esto creará:
   - Tu usuario ADMIN
   - Tu salón con un slug único
   - La configuración básica

### Página pública de reservas

Una vez registrado, tus clientes podrán reservar en:
```
http://localhost:8080/salon/tu-slug-unico
```

El slug se genera automáticamente del nombre de tu salón.

## 👥 Roles y Permisos

### ADMIN
- Acceso completo a todas las funcionalidades
- Gestión de personal y permisos
- Configuración del salón
- Acceso a informes financieros

### WORKER (Trabajador)
- Permisos personalizables por el ADMIN
- Puede incluir: ver/editar/eliminar clientes, servicios, inventario
- Acceso a citas asignadas
- Sin acceso a configuración ni gestión de personal

## 📱 Funcionalidades Destacadas

### 🔔 Sistema de Notificaciones
- Notificaciones en tiempo real en el header
- Alertas de nuevas citas
- Recordatorios automáticos
- Actualización cada 30 segundos

### 📧 Campañas de Marketing
- Envío masivo por email o WhatsApp
- Plantillas predefinidas (promociones, recordatorios)
- Personalización con variables: `{nombre}`, `{salon_name}`
- Selección de destinatarios

### 📊 Informes y Estadísticas
- Filtros por periodo (semana, mes, año, personalizado)
- Métricas clave: ingresos, citas completadas, tasa de cancelación
- Servicios más populares
- Clientes TOP
- Exportación a CSV

### 🗓️ Gestión de Horarios
- Configuración de horarios por día de la semana
- Bloques de horario múltiples por día
- Sistema de slots disponibles dinámico
- Prevención de conflictos de citas

## 🔧 Scripts Disponibles

### Backend
```bash
npm run dev          # Desarrollo con auto-reload
npm run build        # Compilar TypeScript
npm start            # Producción (después de build)
```

### Frontend
```bash
npm run serve        # Servidor de desarrollo
npm run build        # Build de producción
npm run lint         # Linter
```

### Prisma
```bash
npx prisma migrate dev          # Crear y aplicar migración
npx prisma migrate deploy       # Aplicar migraciones (producción)
npx prisma generate            # Regenerar cliente Prisma
npx prisma studio              # Interfaz visual de BD
```

## 🐛 Solución de Problemas

### Error de conexión a la base de datos
- Verifica que PostgreSQL esté corriendo
- Comprueba la `DATABASE_URL` en `.env`
- Si usas Supabase, verifica también `DIRECT_URL` y que ambas tengan `sslmode=require`
- Asegúrate de que la base de datos existe

### Error "JWT_SECRET not defined"
- Añade `JWT_SECRET` a tu archivo `.env`
- Reinicia el servidor backend

### Puerto 3000 o 8080 ya en uso
- Cambia el puerto en `.env` (backend) o `vue.config.js` (frontend)
- O detén el proceso que está usando el puerto

### Errores de TypeScript en el backend
- Ejecuta `npx prisma generate` para regenerar el cliente
- Reinicia VS Code para actualizar TypeScript

### Frontend no conecta con Backend
- Verifica que el backend esté corriendo en puerto 3000
- Comprueba CORS en `src/index.ts`
- Revisa la URL del API en los componentes Vue

## 📄 Licencia

Este proyecto fue desarrollado como Proyecto Final del ciclo formativo de Desarrollo de Aplicaciones Web.

## 👨‍💻 Autor

Desarrollado por [Tu Nombre]

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📞 Soporte

Si encuentras algún problema o tienes preguntas:
- Abre un issue en GitHub
- Contacta al autor

---

**⭐ Si este proyecto te resulta útil, considera darle una estrella en GitHub!**
