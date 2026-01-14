# 🗺️ Roadmap - Sistema de Gestión para Salones de Belleza

Este documento describe la hoja de ruta del proyecto, desde el MVP hasta las versiones futuras.

---

## 🎯 Versión 1.0.0 - MVP DEMO (Producto Mínimo Viable)

**Objetivo:** Versión comercializable básica para captar primeros clientes y validar el modelo de negocio.

**Meta de Lanzamiento:** ⏱️ 2-3 semanas

### Funcionalidades Core

#### ✅ 1. Autenticación y Gestión de Usuario
- [x] Registro de salón (1 administrador)
- [x] Login/Logout con JWT
- [x] Recuperación de contraseña
- [ ] Perfil de usuario (nombre, teléfono, datos del salón)
- [ ] Solo rol ADMIN (sin workers)

#### ✅ 2. Gestión de Citas (CORE del negocio)
- [ ] Crear nueva cita
- [ ] Editar cita existente
- [ ] Cancelar cita
- [ ] Vista de calendario (semanal/mensual)
- [ ] Estados básicos:
  - Pendiente (amarillo)
  - Confirmada (verde)
  - Completada (azul)
  - Cancelada (rojo)
- [ ] Asignar cliente y servicio a cita
- [ ] Evitar solapamiento de horarios

#### ✅ 3. Gestión de Clientes
- [ ] Añadir cliente (nombre, teléfono, email opcional)
- [ ] Editar cliente
- [ ] Eliminar cliente
- [ ] Lista de clientes con búsqueda
- [ ] Ver historial de citas del cliente

#### ✅ 4. Gestión de Servicios
- [ ] Crear servicio (nombre, duración, precio)
- [ ] Editar servicio
- [ ] Eliminar servicio
- [ ] Lista de servicios del salón

#### ✅ 5. Página Pública de Reservas ⭐
- [ ] URL personalizada: `tudominio.com/salon/[slug]`
- [ ] Mostrar información del salón
- [ ] Mostrar servicios disponibles con precios
- [ ] Formulario de solicitud de cita:
  - Nombre del cliente
  - Teléfono
  - Email (opcional)
  - Servicio deseado
  - Fecha y hora preferida
- [ ] Mensaje de confirmación "Solicitud enviada"
- [ ] Cita queda como "Pendiente" en el dashboard

#### ✅ 6. Configuración Básica del Salón
- [x] Datos del salón (nombre, dirección, teléfono)
- [x] URL personalizada (slug)
- [x] Horario de apertura y cierre por día de la semana
- [x] Configuración rápida de horarios (rangos de días + múltiples turnos)
- [x] Detección y validación de días solapados
- [x] Sistema de notificaciones toast (sin alerts del navegador)
- [x] Modal de confirmación personalizado
- [x] Intervalo de citas (ej: cada 30 min)
- [ ] Activar/desactivar sistema de reservas online (funcionalidad)
- [ ] Bloqueos de fechas específicas

#### ✅ 7. Sistema de Notificaciones UX
- [x] Toast notifications con 4 tipos (success, error, warning, info)
- [x] Animaciones suaves (slide-in, auto-close)
- [x] Eliminación completa de alerts/confirms del navegador
- [x] Modal de confirmación estilizado
- [x] Mensajes de error específicos y útiles

### 🚫 Funcionalidades EXCLUIDAS del MVP

- ❌ Sistema de trabajadores/personal
- ❌ Permisos granulares
- ❌ Inventario
- ❌ Marketing/Campañas
- ❌ Informes avanzados
- ❌ Notificaciones automáticas (WhatsApp/Email)
- ❌ Múltiples horarios por día
- ❌ Bloqueos de agenda
- ❌ Recordatorios automáticos

### 📋 Checklist de Tareas MVP

### 🚨 TAREAS CRÍTICAS PRE-LANZAMIENTO (OBLIGATORIAS)

**Configuración - Simplificación:**
- [x] **REVISAR Y LIMPIAR PANEL DE CONFIGURACIÓN** - Eliminar opciones que no tienen sentido para MVP
- [x] Eliminar checkboxes innecesarios: requireConfirmation, workersCanCreateServices, canModifyAppointments
- [x] Sistema de horarios por día de la semana implementado
- [x] Configuración rápida de horarios con rangos y múltiples turnos
- [x] Detección reactiva de solapamiento de días
- [x] Sistema de validación que previene guardar horarios solapados
- [x] Toasts informativos reemplazan todos los alerts
- [x] Modal de confirmación personalizado
- [ ] **HACER FUNCIONAL "Aceptar citas online"**:
  - Si está activado → La página pública del slug permite reservar citas
  - Si está desactivado → La página pública del slug solo muestra información del salón (sin formulario de reserva)
- [x] Mantener solo configuraciones esenciales (horarios, datos del salón, slug)
- [x] Reorganizar panel de configuración de forma más clara
- [x] Mejorar validaciones y mensajes de error/éxito

**Diseño - Ajustes Menores:**
- [ ] Pulir detalles visuales (mantener el sistema de tarjetas actual)
- [ ] Verificar responsive design en móvil y tablet
- [ ] Revisar paleta de colores si es necesario
- [ ] Asegurar consistencia visual en todos los componentes

**Backend:**
- [ ] Limpiar/simplificar controladores (remover lógica de workers)
- [ ] Simplificar rutas de configuración
- [ ] Endpoint para página pública mejorado
- [ ] Validar horarios y evitar solapamientos
- [ ] Testing básico de endpoints críticos

**Frontend:**
- [ ] Simplificar Dashboard (remover secciones: Personal, Inventario, Marketing, Informes)
- [ ] Mejorar componente de Citas con calendario visual
- [ ] Formulario de cliente mejorado
- [ ] Formulario de servicio mejorado
- [ ] Página pública responsive y atractiva
- [ ] Configuración básica del salón

**Base de Datos:**
- [ ] Migración para simplificar permisos (remover campos innecesarios)
- [ ] Optimizar índices para consultas frecuentes

**Deploy:**
- [ ] Configurar Railway/Vercel para producción
- [ ] Variables de entorno de producción
- [ ] Dominio personalizado
- [ ] SSL/HTTPS

**Documentación:**
- [ ] README para clientes (cómo usar la app)
- [ ] Video demo de 2-3 minutos
- [ ] Landing page de marketing

---

## 🚀 Versión 2.0.0 - Gestión de Equipo

**Objetivo:** Permitir salones con múltiples trabajadores.

**Meta de Lanzamiento:** ⏱️ 1-2 meses después del MVP

### Nuevas Funcionalidades

#### ✅ Sistema de Trabajadores
- [ ] Añadir trabajadores al salón
- [ ] Asignar rol WORKER
- [ ] Login de trabajadores
- [ ] Asignar citas a trabajadores específicos
- [ ] Vista de agenda por trabajador

#### ✅ Sistema de Permisos Básico
- [ ] Permisos por trabajador (ver/editar/eliminar):
  - Citas
  - Clientes
  - Servicios
- [ ] Panel de administración de permisos

#### ✅ Horarios por Trabajador
- [ ] Configurar horario individual por trabajador
- [ ] Disponibilidad personalizada
- [ ] Días libres/vacaciones

#### ✅ Mejoras en Página Pública
- [ ] Seleccionar trabajador preferido al reservar
- [ ] Mostrar disponibilidad en tiempo real

---

## 📊 Versión 3.0.0 - Automatización y Comunicación

**Objetivo:** Automatizar comunicaciones y mejorar retención de clientes.

**Meta de Lanzamiento:** ⏱️ 2-3 meses después de v2.0

### Nuevas Funcionalidades

#### ✅ Sistema de Notificaciones
- [ ] Notificaciones por email (confirmación de cita)
- [ ] Notificaciones por WhatsApp (recordatorios)
- [ ] Plantillas personalizables de mensajes
- [ ] Configuración de cuándo enviar recordatorios

#### ✅ Marketing Básico
- [ ] Base de datos de clientes con segmentación
- [ ] Envío de promociones por email
- [ ] Campañas de cumpleaños
- [ ] Descuentos y cupones

#### ✅ Estadísticas e Informes
- [ ] Dashboard con métricas clave:
  - Citas del mes
  - Ingresos estimados
  - Clientes nuevos vs recurrentes
  - Servicios más populares
- [ ] Gráficos visuales
- [ ] Exportar reportes PDF

---

## 💎 Versión 4.0.0 - Gestión Avanzada

**Objetivo:** Funcionalidades premium para salones establecidos.

**Meta de Lanzamiento:** ⏱️ 3-4 meses después de v3.0

### Nuevas Funcionalidades

#### ✅ Gestión de Inventario
- [ ] Control de productos (shampoo, tintes, etc.)
- [ ] Alertas de stock bajo
- [ ] Registro de uso por servicio
- [ ] Cálculo de costos por servicio

#### ✅ Sistema de Pagos
- [ ] Registro de pagos por cita
- [ ] Métodos de pago (efectivo, tarjeta, transferencia)
- [ ] Control de cuentas por cobrar
- [ ] Integración con pasarelas de pago

#### ✅ Programación Avanzada
- [ ] Múltiples horarios por día
- [ ] Bloqueos de agenda (vacaciones, eventos)
- [ ] Citas recurrentes
- [ ] Lista de espera automática

#### ✅ Fidelización de Clientes
- [ ] Sistema de puntos/recompensas
- [ ] Membresías y suscripciones
- [ ] Descuentos por referidos
- [ ] Historial completo del cliente (preferencias, notas)

---

## 🎨 Versión 5.0.0 - Experiencia Premium

**Objetivo:** Funcionalidades avanzadas y diferenciación competitiva.

**Meta de Lanzamiento:** ⏱️ 6+ meses después de v4.0

### Nuevas Funcionalidades

#### ✅ App Móvil Nativa
- [ ] App para iOS
- [ ] App para Android
- [ ] Notificaciones push
- [ ] Reservas desde el móvil

#### ✅ Inteligencia Artificial
- [ ] Sugerencias automáticas de horarios
- [ ] Predicción de cancelaciones
- [ ] Recomendaciones de servicios personalizadas
- [ ] Análisis predictivo de demanda

#### ✅ Multi-Salón
- [ ] Gestión de múltiples sucursales
- [ ] Dashboard consolidado
- [ ] Transferencia de citas entre sucursales
- [ ] Reportes por sucursal

#### ✅ Integraciones
- [ ] Google Calendar
- [ ] Redes sociales (Instagram, Facebook)
- [ ] Plataformas de reseñas (Google Reviews)
- [ ] Contabilidad (QuickBooks, Xero)

---

## 📈 Estrategia de Monetización

### Versión Gratuita (Free)
- ✅ Hasta 50 citas/mes
- ✅ 1 administrador
- ✅ Funcionalidades básicas del MVP
- ✅ Página pública de reservas

### Versión Pro ($19.99/mes)
- ✅ Citas ilimitadas
- ✅ Hasta 5 trabajadores
- ✅ Notificaciones por email
- ✅ Estadísticas básicas
- ✅ Sin marca de agua

### Versión Business ($49.99/mes)
- ✅ Todo de Pro
- ✅ Trabajadores ilimitados
- ✅ WhatsApp automático
- ✅ Inventario
- ✅ Reportes avanzados
- ✅ Soporte prioritario

### Versión Enterprise ($99.99/mes)
- ✅ Todo de Business
- ✅ Multi-sucursal
- ✅ App móvil
- ✅ Integraciones avanzadas
- ✅ Personalización completa
- ✅ Soporte dedicado

---

## 🎯 Prioridades Actuales

### Sprint 0 (Semana 0-1): ⚙️ LIMPIEZA Y AJUSTES CRÍTICOS
**PRIORIDAD MÁXIMA - Sin esto no se lanza**
1. ⭐ Revisar panel de configuración y eliminar opciones innecesarias
2. ⭐ Identificar qué configuraciones no tienen sentido para el MVP
3. ⭐ Simplificar formularios y opciones del panel de configuración
4. ⭐ Pulir detalles visuales del dashboard (mantener sistema de tarjetas)
5. ⭐ Verificar que todo sea responsive y funcional

### Sprint 1 (Semana 2-3): Fundación del MVP
1. Simplificar Dashboard (remover secciones innecesarias)
2. Mejorar gestión de Citas con calendario
3. Optimizar formularios de Clientes y Servicios
4. Aplicar nuevo diseño a todos los componentes

### Sprint 2 (Semana 4-5): Página Pública y Deploy
1. Diseñar y desarrollar página pública atractiva
2. Configurar deploy en producción
3. Testing completo del flujo de reserva
4. Documentación para usuarios
5. ✅ Validación final de diseño y configuraciones

### Post-MVP: Marketing y Validación
1. Buscar primeros 10 clientes beta
2. Recopilar feedback
3. Iterar según necesidades reales
4. Planificar v2.0 según demanda

---

## 📝 Notas

- Este roadmap es flexible y se ajustará según feedback de usuarios
- Las fechas son estimaciones y pueden variar
- Las funcionalidades pueden priorizarse diferente según demanda del mercado
- Cada versión debe ser estable antes de pasar a la siguiente
