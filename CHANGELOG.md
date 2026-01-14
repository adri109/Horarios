# Changelog

Todos los cambios notables en este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/),
y este proyecto adhiere a [Semantic Versioning](https://semver.org/lang/es/).

## [Sin publicar]

### En Desarrollo - 2026-01-14

#### Añadido
- **Sistema de Solapamiento de Horarios Inteligente**
  - Implementada detección reactiva de días solapados en configuración rápida de horarios
  - Banner de advertencia visual que aparece en tiempo real al configurar rangos solapados
  - Validación que previene aplicar horarios cuando hay días solapados
  - Toast de error específico indicando qué días están solapados al intentar guardar
  - Sistema permite combinar turnos de mañana y tarde en los mismos días (uso intencional)

- **Sistema de Notificaciones Toast**
  - Implementado sistema completo de notificaciones toast (sin alerts)
  - 4 tipos de notificaciones: success (verde), error (rojo), warning (amarillo), info (azul)
  - Animación de entrada suave (slide-in)
  - Auto-cierre en 5 segundos
  - Cierre manual con botón X o click en notificación
  - Posicionamiento fijo en esquina superior derecha
  - Responsive para móviles

- **Modal de Confirmación Personalizado**
  - Reemplazado `window.confirm()` con modal elegante
  - Soporte para mensajes con formato (saltos de línea)
  - Botones estilizados "Cancelar" y "Confirmar"
  - Cierre con click fuera del modal
  - Mantiene flujo async/await con Promises

#### Cambiado
- **Eliminación Total de Alerts del Sistema**
  - ❌ Removidos todos los `alert()` de navegador
  - ✅ Reemplazados por toasts informativos en:
    - Validación de turnos (máximo 3, mínimo 1)
    - Validación de rangos de días
    - Creación/eliminación de bloques
    - Errores al aplicar horarios
    - Confirmaciones de operaciones exitosas
  - ✅ Reemplazados `confirm()` por modal personalizado en:
    - Aplicar horarios rápidos
    - Eliminar bloqueos de horarios

- **Mejora de UX en Banner de Solapamiento**
  - Simplificado de diseño extravagante a versión minimalista
  - Solo muestra icono de advertencia + texto "Horarios solapados"
  - Diseño compacto en una línea
  - Color amarillo/naranja mantiene visibilidad sin ser intrusivo

#### Técnico
- Añadido `watch()` de Vue para detección reactiva de solapamientos
- Variable `overlappingDays` ahora es reactiva y se actualiza automáticamente
- Función `detectOverlappingDays()` optimizada para uso con watch
- Componentes toast con animaciones CSS (@keyframes slideIn)
- Sistema de IDs únicos para gestión de múltiples toasts simultáneos

### En Desarrollo - 2026-01-13

#### Añadido
- **Documentación del Proyecto**
  - Creado CHANGELOG.md para registro de versiones
  - Creado ROADMAP.md con planificación completa del MVP y versiones futuras
  - Definida estrategia de monetización (Free, Pro, Business, Enterprise)
  - Documentados sprints de desarrollo

- **Validación de Horarios**
  - Sistema de validación para evitar solapamiento de horarios en configuración
  - Validación en frontend: nuevo horario comienza automáticamente donde termina el anterior
  - Validación en backend al crear horarios: rechaza horarios solapados con mensaje específico
  - Validación en backend al actualizar horarios: previene solapamientos al editar

- **Mejoras de UX**
  - Aplicado `user-select: none` globalmente para prevenir selección accidental de texto en UI
  - Solo campos de entrada (inputs, textareas) permiten selección de texto

#### Cambiado
- **Panel de Configuración Simplificado (MVP Focus)**
  - ❌ Eliminado checkbox "Requerir confirmación de citas" (funcionalidad no implementada)
  - ❌ Eliminado checkbox "Trabajadores pueden crear servicios" (no hay workers en MVP)
  - ❌ Eliminado checkbox "Clientes pueden modificar citas" (funcionalidad no implementada)
  - ✅ Mantenido checkbox "Aceptar citas online" (funcional)
  - Descripción mejorada: explica que controla si la página pública permite reservas o solo muestra información

#### Técnico
- Limpiado controlador de configuración eliminando campos obsoletos
- Simplificado modelo de configuración en frontend
- Mejorada validación de horarios con mensajes de error claros

### Pendiente (Roadmap MVP v1.0.0)
- Hacer funcional el switch "Aceptar citas online" (slug con/sin formulario)
- Implementar notificaciones para cancelación y confirmación de citas
- Simplificar dashboard (remover: Personal, Inventario, Marketing, Informes)
- Mejorar componente de Citas con calendario visual
- Diseñar y desarrollar página pública atractiva
- Configurar deploy en producción

---

## [0.4.0] - 2025-12-08

### Añadido
- **Sistema de Notificaciones Mejorado**
  - Campo `read` (leído/no leído) para notificaciones
  - Capacidad de marcar notificaciones como leídas
  - Configuración de notificaciones por email (Gmail, Outlook, Yahoo)
  - Integración con WhatsApp Business API
  - Documentación completa en `CONFIGURACION_NOTIFICACIONES.md`

- **Sistema de Permisos Granulares**
  - 16 permisos específicos por usuario/trabajador
  - Control detallado de acceso: `canViewClients`, `canEditServices`, etc.
  - Middleware de permisos para rutas protegidas
  - Permisos independientes para ADMIN y WORKER

- **Gestión de Clientes Mejorada**
  - Campo `email` añadido al modelo Cliente
  - Capacidad de enviar notificaciones por email a clientes

- **Recuperación de Contraseña**
  - Sistema completo de tokens para resetear contraseñas
  - Flujo de recuperación de contraseña olvidada
  - Tokens con expiración temporal

### Cambiado
- Modelo de permisos de usuario actualizado
- Estructura de base de datos optimizada para notificaciones

---

## [0.3.0] - 2025-12-05

### Añadido
- **Sistema de Horarios Múltiples**
  - Soporte para múltiples horarios por día
  - Flexibilidad en la configuración de horarios del salón
  - Modelos de Schedule mejorados

- **Gestión de Agenda**
  - Sistema completo de programación para el salón
  - Horarios personalizables por día de la semana

---

## [0.2.0] - 2025-08-28

### Añadido
- **Sistema de URL Personalizada**
  - Campo `slug` para salones
  - Páginas públicas de reserva con URL amigables
  - Ejemplo: `tudominio.com/salon/mi-salon-belleza`

- **Sincronización de Usuarios**
  - Modelo de usuario sincronizado con la base de datos
  - Mejoras en la gestión de trabajadores

### Cambiado
- Modelo de Salon actualizado con slug único

---

## [0.1.0] - 2025-08-22

### Añadido
- **Roles de Usuario**
  - Rol por defecto para nuevos usuarios
  - Sistema de roles ADMIN y WORKER
  - Control de acceso basado en roles (RBAC)

---

## [0.0.1] - 2025-06-17

### Añadido
- **Configuración Inicial del Proyecto**
  - Estructura base del backend (Node.js + Express + TypeScript)
  - Estructura base del frontend (Vue.js 3)
  - Base de datos PostgreSQL con Prisma ORM
  - Sistema de autenticación JWT
  - Modelos principales: User, Salon, Client, Appointment, Service
  - CRUD básico para gestión de salones
  - Panel de administración inicial
  - Sistema de rutas públicas y privadas
  - Configuración de CORS
  - Middleware de autenticación

### Estructura Inicial
- `/src` - Backend con TypeScript
- `/frontend` - SPA con Vue.js
- `/prisma` - Esquemas y migraciones
- Configuración de deployment para Railway
- Documentación inicial del proyecto

---

## Formato de Versiones

- **MAJOR (X.0.0)**: Cambios incompatibles con versiones anteriores
- **MINOR (0.X.0)**: Nueva funcionalidad compatible con versiones anteriores
- **PATCH (0.0.X)**: Correcciones de bugs compatibles con versiones anteriores

## Categorías de Cambios

- **Añadido**: Nuevas funcionalidades
- **Cambiado**: Cambios en funcionalidades existentes
- **Obsoleto**: Funcionalidades que serán eliminadas
- **Eliminado**: Funcionalidades eliminadas
- **Corregido**: Corrección de bugs
- **Seguridad**: Cambios relacionados con vulnerabilidades
