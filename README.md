# TimeIt — Sistema de gestión para salones de belleza

Aplicación web para la gestión diaria de salones de belleza, peluquerías y centros estéticos. Sistema multi-tenant con panel administrativo y página pública de reservas.

> **Proyecto académico.** Desarrollado como Proyecto Final del ciclo formativo de Grado Superior en Desarrollo de Aplicaciones Web (CPIFP Bajo Aragón). No existe un despliegue público activo; el proyecto se ejecuta en local siguiendo las instrucciones de este documento.

## Características principales

- **Gestión de citas:** creación, edición, confirmación y cancelación.
- **Control de clientes:** historial completo, estadísticas y búsqueda avanzada.
- **Gestión de personal:** roles, permisos personalizados y asignación de tareas.
- **Servicios:** administración de servicios con precios y duraciones.
- **Informes y estadísticas:** panel con métricas clave y exportación CSV.
- **Notificaciones:** correo electrónico (Gmail) y soporte de WhatsApp según la integración disponible.
- **Marketing:** campañas promocionales por correo y WhatsApp.
- **Reserva pública:** página de reservas personalizada con URL única por salón.
- **Autenticación:** JWT con roles y permisos granulares.
- **Multi-tenant:** cada salón con sus datos completamente aislados.
- **Inventario:** módulo reservado para una versión futura.

## Tecnologías

**Backend**

- Node.js + Express.js + TypeScript
- PostgreSQL con Prisma ORM
- JWT para autenticación
- bcrypt para el cifrado de contraseñas
- Nodemailer para el envío de correos
- WhatsApp Business API para notificaciones

**Frontend**

- Vue.js 3 (Composition API)
- Vue Router
- Tailwind CSS
- Axios

## Requisitos previos

- Node.js 16 o superior
- PostgreSQL 12 o superior
- npm o yarn (incluido con Node.js)
- Git

## Instalación y configuración

### 1. Clonar el repositorio

```bash
git clone https://github.com/adri109/Horarios.git
cd Horarios
```

### 2. Instalar dependencias

Backend:

```bash
npm install
```

Frontend:

```bash
cd frontend
npm install
cd ..
```

### 3. Variables de entorno

Crea un archivo `.env` en la raíz del proyecto (puedes partir de `.env.example`):

```env
# Base de datos PostgreSQL (local)
DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/nombre_db"

# Seguridad JWT
JWT_SECRET="cadena_larga_segura_y_aleatoria"
PORT=3000

# Correo (Gmail)
SMTP_USER="tu_email@gmail.com"
SMTP_PASS="tu_contraseña_de_aplicacion"

# WhatsApp Business API (opcional)
WHATSAPP_TOKEN="tu_token_de_whatsapp_business_api"
WHATSAPP_PHONE_ID="tu_phone_id"
```

Si usas un proveedor con *connection pooler* (por ejemplo Supabase), define además `DIRECT_URL` con la conexión directa para las migraciones y utiliza `sslmode=require` en ambas URL.

**Configurar Gmail para SMTP**

1. Accede a tu cuenta de Google.
2. Activa la verificación en dos pasos.
3. Genera una «contraseña de aplicación» en <https://myaccount.google.com/apppasswords>.
4. Úsala en `SMTP_PASS`.

### 4. Base de datos

Crea la base de datos en PostgreSQL:

```sql
CREATE DATABASE nombre_db;
```

Ejecuta las migraciones y genera el cliente de Prisma:

```bash
npx prisma migrate deploy
npx prisma generate
```

Opcional, para inspeccionar la base de datos:

```bash
npx prisma studio
```

### 5. Arrancar el proyecto

Backend (con recarga automática):

```bash
npm run dev
```

Frontend (en otra terminal):

```bash
cd frontend
npm run serve
```

### 6. Acceso

- Frontend: <http://localhost:8080>
- API: <http://localhost:3000>
- Prisma Studio: <http://localhost:5555> (si está activo)

## Estructura del proyecto

```
Horarios/
├── src/                      # Backend (Node.js + TypeScript)
│   ├── controllers/          # Lógica de negocio
│   ├── routes/               # Definición de rutas de la API
│   ├── middleware/           # Autenticación y permisos
│   ├── services/             # Servicios (correo, notificaciones)
│   └── index.ts              # Punto de entrada del servidor
├── prisma/
│   ├── schema.prisma         # Modelo de datos
│   └── migrations/           # Historial de migraciones
├── frontend/                 # Frontend (Vue.js 3)
│   ├── src/
│   │   ├── views/            # Páginas principales
│   │   ├── components/       # Componentes compartidos
│   │   ├── router/           # Configuración de rutas
│   │   └── assets/           # Estilos y recursos
│   └── public/               # Archivos estáticos
├── tests/                    # Pruebas
├── .env.example              # Plantilla de variables de entorno
├── package.json              # Dependencias del backend
└── README.md
```

> Ajusta este árbol a la estructura real si alguna carpeta difiere (por ejemplo, la ubicación de `components/` dentro de `frontend/src/`).

## Primer uso

1. Abre <http://localhost:8080/register>.
2. Completa el formulario: correo y contraseña del administrador, nombre completo, nombre del salón y, opcionalmente, dirección y teléfono.
3. Se creará el usuario ADMIN, el salón con un *slug* único y la configuración básica.

Página pública de reservas de cada salón (local):

```
http://localhost:8080/salon/<slug-del-salon>
```

El *slug* se genera automáticamente a partir del nombre del salón.

## Roles y permisos

**ADMIN**

- Acceso completo a todas las funcionalidades.
- Gestión de personal y permisos.
- Configuración del salón.
- Acceso a informes financieros.

**WORKER (trabajador)**

- Permisos personalizables por el ADMIN (ver, editar o eliminar clientes y servicios).
- Acceso a las citas asignadas.
- Sin acceso a configuración ni a gestión de personal.

## Funcionalidades destacadas

- **Notificaciones:** avisos en la cabecera, alertas de nuevas citas, recordatorios y actualización cada 30 segundos.
- **Campañas de marketing:** envío masivo por correo o WhatsApp, plantillas predefinidas, variables de personalización (`{nombre}`, `{salon_name}`) y selección de destinatarios.
- **Informes:** filtros por periodo, métricas clave (ingresos, citas completadas, tasa de cancelación), servicios más populares, mejores clientes y exportación a CSV.
- **Horarios:** configuración por día de la semana, varios bloques por día, cálculo dinámico de huecos disponibles y prevención de conflictos entre citas.

## Scripts disponibles

**Backend**

```bash
npm run dev      # Desarrollo con recarga automática
npm run build    # Compilar TypeScript
npm start        # Ejecutar la versión compilada
```

**Frontend**

```bash
npm run serve    # Servidor de desarrollo
npm run build    # Build de producción
npm run lint     # Linter
```

**Prisma**

```bash
npx prisma migrate dev      # Crear y aplicar migración
npx prisma migrate deploy   # Aplicar migraciones existentes
npx prisma generate         # Regenerar el cliente
npx prisma studio           # Interfaz visual de la base de datos
```

## Solución de problemas

**Error de conexión a la base de datos**

- Comprueba que PostgreSQL está en ejecución.
- Revisa `DATABASE_URL` en `.env` (y `DIRECT_URL` si usas pooler).
- Asegúrate de que la base de datos existe.

**Error «JWT_SECRET not defined»**

- Añade `JWT_SECRET` al archivo `.env` y reinicia el backend.

**Puerto 3000 u 8080 ocupado**

- Cambia el puerto en `.env` (backend) o en la configuración del frontend, o detén el proceso que lo usa.

**Errores de TypeScript en el backend**

- Ejecuta `npx prisma generate` y reinicia el editor.

**El frontend no conecta con el backend**

- Comprueba que el backend corre en el puerto 3000 y que `VUE_APP_API_URL=http://localhost:3000` está definido en `frontend/.env.development.local`.

## Despliegue (referencia)

El proyecto no está desplegado públicamente. Los documentos [`docs/CONFIGURACION_PRODUCCION.md`](docs/CONFIGURACION_PRODUCCION.md) y [`docs/CONFIGURACION_CORS_PRODUCCION.md`](docs/CONFIGURACION_CORS_PRODUCCION.md) describen una configuración de despliegue de referencia (variables de entorno, CORS y migraciones con `npx prisma migrate deploy`); los dominios que aparezcan en ellos (por ejemplo `timeit.es`) son ejemplos, no servicios activos.

## Autor

Adrián Pérez Correro — [github.com/adri109](https://github.com/adri109) · [linkedin.com/in/adriperezdev](https://linkedin.com/in/adriperezdev)

## Contexto académico

Proyecto Final del ciclo formativo de Grado Superior en Desarrollo de Aplicaciones Web.
