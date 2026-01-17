# 💡 Ideas y Planificación Futura

## ✅ IMPLEMENTACIÓN EN PROGRESO - 16/01/2026

### 🔧 Estado Actual: Sistemas Paralelos
Se ha creado un nuevo sistema de Page Builder que funciona en paralelo con el sistema público actual:

**Backend:**
- ✅ Nuevo controlador: `pageBuilderController.ts`
- ✅ Nuevas rutas: `pageBuilderRoutes.ts` → `/page/:slug`
- ✅ Sistema original `/public/:slug` funcionando normalmente
- ✅ Logs diferenciados con prefijo `[PageBuilder]`

**Frontend:**
- ✅ Nueva vista: `PageBuilder_Page.vue` (copia de SalonPublicPage.vue)
- ✅ Nueva ruta: `/page/:slug` → Sistema nuevo de Page Builder
- ✅ Ruta original: `/salon/:slug` → Sistema público actual
- ✅ Ambos sistemas activos simultáneamente

**URLs Disponibles:**
- Sistema original (funcional): `http://localhost:8080/salon/mi-peluqueria`
- Page Builder (en desarrollo): `http://localhost:8080/page/mi-peluqueria`

**Próximos Pasos:**
1. Crear modelo de datos en Prisma para bloques del page builder
2. Implementar sistema de grid layout en frontend
3. Crear editor visual de bloques
4. Implementar catálogo de bloques (empezar con Header y Booking)

---

## 🎨 Sistema de Page Builder para Slug Público

### Objetivo
Permitir a los administradores personalizar completamente su página pública mediante un editor visual con sistema de bloques reutilizables tipo grid layout.

---

## 📋 Arquitectura del Sistema

### 1. Sistema de Grid Layout

**Grid Base:**
- 12 columnas (tipo Bootstrap)
- Altura de fila configurable (default: 80px)
- Gap entre bloques configurable (default: 16px)
- Max-width del contenedor (default: 1200px)

**Estructura de Bloque:**
```javascript
{
  id: 'block-1',
  type: 'booking-form',        // Tipo de componente
  variant: 'compact',           // Variante del diseño
  position: {
    x: 0,                       // Columna inicial (0-11)
    y: 0,                       // Fila inicial
    w: 3,                       // Ancho en columnas
    h: 2                        // Alto en filas
  },
  config: {
    title: 'Reserva tu cita',
    backgroundColor: '#ffffff',
    showImage: true,
    // ... configuración específica del bloque
  },
  visible: true,
  order: 1
}
```

---

## 🧩 Catálogo de Bloques Propuestos

### 1. **Booking Block** (Reserva de Citas)
**Variantes:**
- `compact` (3x2): Botón + título simple
- `expanded` (2x4): Formulario completo inline
- `minimal` (2x1): Solo botón CTA
- `featured` (6x3): Hero section con imagen de fondo

**Configuración:**
- Título personalizable
- Color de fondo
- Imagen de fondo
- Texto del botón
- Mostrar/ocultar descripción

---

### 2. **Services Block** (Lista de Servicios)
**Variantes:**
- `grid` (6x3): Cuadrícula de tarjetas
- `carousel` (12x2): Carrusel horizontal
- `list` (4x4): Lista vertical detallada
- `minimal` (4x2): Lista compacta sin imágenes

**Configuración:**
- Número de columnas
- Mostrar precios
- Mostrar duración
- Imágenes de servicios
- Filtros por categoría

---

### 3. **Schedule Block** (Horarios)
**Variantes:**
- `week-grid` (4x2): Tabla semanal
- `compact` (3x2): Lista de días
- `calendar` (6x4): Calendario mensual
- `badge` (2x1): Solo horario de hoy

**Configuración:**
- Formato de hora (12h/24h)
- Mostrar días cerrados
- Colores por día
- Destacar día actual

---

### 4. **Header Block** (Cabecera)
**Variantes:**
- `full` (12x2): Logo + nombre + info + nav
- `simple` (12x1): Solo nombre y teléfono
- `hero` (12x3): Header grande con imagen
- `minimal` (12x1): Solo logo centrado

**Configuración:**
- Logo (upload)
- Nombre del salón
- Slogan
- Teléfono, email, dirección
- Links de navegación
- Redes sociales

---

### 5. **Gallery Block** (Galería de Fotos)
**Variantes:**
- `masonry` (8x4): Grid estilo Pinterest
- `carousel` (8x2): Carrusel de imágenes
- `grid` (6x3): Grid simple
- `featured` (12x3): Una imagen destacada + thumbnails

**Configuración:**
- Imágenes (upload múltiple)
- Lightbox activado/desactivado
- Número de columnas
- Espaciado

---

### 6. **Text Block** (Texto Libre)
**Variantes:**
- `paragraph` (6x2): Texto normal
- `highlight` (4x2): Texto destacado con fondo
- `quote` (4x1): Cita/testimonio
- `cta` (3x1): Llamada a la acción

**Configuración:**
- Editor de texto rico (bold, italic, links)
- Alineación
- Color de texto
- Color de fondo
- Padding

---

### 7. **Testimonials Block** (Testimonios)
**Variantes:**
- `carousel` (8x2): Carrusel de testimonios
- `grid` (6x3): Grid de tarjetas
- `featured` (4x2): Un testimonio destacado

**Configuración:**
- Lista de testimonios
- Mostrar fotos de clientes
- Estrellas de rating
- Auto-play en carousel

---

### 8. **Map Block** (Ubicación)
**Variantes:**
- `embed` (6x3): Google Maps embed
- `simple` (4x2): Mapa + dirección
- `contact` (8x3): Mapa + formulario de contacto

**Configuración:**
- Dirección
- Google Maps API key
- Zoom level
- Marcador personalizado

---

### 9. **Contact Form Block** (Formulario de Contacto)
**Variantes:**
- `full` (6x4): Formulario completo
- `simple` (4x2): Solo nombre y mensaje
- `inline` (12x1): Una fila horizontal

**Configuración:**
- Campos visibles
- Email destino
- Mensaje de confirmación
- Validaciones

---

### 10. **Social Media Block** (Redes Sociales)
**Variantes:**
- `icons` (3x1): Solo iconos con links
- `feed-instagram` (4x4): Feed de Instagram con fotos recientes
- `feed-facebook` (4x4): Posts recientes de Facebook
- `feed-tiktok` (4x4): Videos recientes de TikTok
- `buttons` (3x2): Botones grandes con texto y followers
- `grid-mixed` (6x3): Mix de varias redes en grid
- `carousel` (8x2): Carrusel de posts de Instagram

**Configuración:**
- Links de redes sociales (Instagram, Facebook, TikTok, YouTube, Twitter)
- API tokens para feeds (Instagram Basic Display API, Facebook Graph API)
- Número de posts a mostrar
- Estilo de iconos (color, B&W, brand colors)
- Tamaño de iconos
- Mostrar contador de seguidores
- Auto-refresh del feed
- Filtros de hashtags (mostrar solo posts con ciertos #)

**Integraciones de API:**

1. **Instagram Feed**
   - API: Instagram Basic Display API
   - Autenticación OAuth 2.0
   - Mostrar últimas 12-24 fotos
   - Click para ver en Instagram
   - Lightbox opcional para preview
   - Sincronización automática cada 1 hora

2. **Facebook Page**
   - API: Facebook Graph API
   - Mostrar posts públicos de la página
   - Likes, comentarios, shares
   - Click para ver en Facebook

3. **TikTok**
   - Embed de videos específicos
   - Link directo al perfil
   - Vista previa de último video

4. **YouTube**
   - YouTube Data API
   - Últimos videos del canal
   - Player embebido
   - Vista en grid o carousel

**Ejemplo de configuración:**
```javascript
{
  type: 'social-media',
  variant: 'feed-instagram',
  config: {
    instagramToken: 'encrypted_token',
    instagramUserId: '123456789',
    numberOfPosts: 9,
    layout: 'grid', // grid, masonry, carousel
    showCaptions: false,
    showLikes: true,
    openInLightbox: true,
    refreshInterval: 3600, // segundos
    filterHashtags: ['#haircut', '#hairstyle']
  }
}
```

---

### 11. **Video Block** (Videos)
**Variantes:**
- `youtube` (6x3): Video de YouTube embebido
- `vimeo` (6x3): Video de Vimeo embebido
- `native` (6x3): Video nativo HTML5
- `background` (12x4): Video de fondo con texto encima

**Configuración:**
- URL del video
- Autoplay
- Loop
- Muted
- Controles visibles
- Poster image
- Subtítulos

---

### 12. **Reviews & Comments Block** (Comentarios y Reseñas)
**Variantes:**
- `comment-form` (6x3): Formulario para dejar comentario/reseña
- `reviews-list` (6x4): Lista de reseñas con estrellas
- `reviews-carousel` (8x2): Carrusel de testimonios
- `rating-widget` (4x2): Widget de rating con estadísticas
- `google-reviews` (6x3): Reviews de Google My Business
- `combined` (8x5): Formulario + lista de comentarios

**Configuración del formulario:**
- Campos requeridos (nombre, email, rating, comentario)
- Rating con estrellas (1-5)
- Subir foto opcional
- Moderación (publicar automáticamente o esperar aprobación)
- Email de notificación al admin
- CAPTCHA para evitar spam
- Limitar 1 review por IP/día

**Configuración de visualización:**
- Mostrar avatar del cliente
- Mostrar fecha
- Ordenar por: más recientes, mejor rating, más útiles
- Filtrar por rating (solo 5 estrellas, 4+, etc.)
- Paginación o scroll infinito
- Respuestas del dueño del negocio
- Botón "¿Te fue útil?" en cada review

**Integraciones:**
- Google My Business Reviews API
- Facebook Reviews
- Sistema propio de reviews (almacenado en DB)

**Modelo de datos:**
```javascript
{
  type: 'reviews-comments',
  variant: 'combined',
  config: {
    allowGuestReviews: true,
    requireApproval: true,
    showGoogleReviews: true,
    googlePlaceId: 'ChIJ...',
    maxRating: 5,
    showPhotos: true,
    sortBy: 'recent', // recent, rating, helpful
    itemsPerPage: 10,
    allowOwnerReply: true,
    notificationEmail: 'admin@salon.com'
  }
}
```

**Tabla de base de datos:**
```prisma
model Review {
  id          Int      @id @default(autoincrement())
  salonId     Int
  clientId    Int?     // null si es guest review
  
  name        String
  email       String
  rating      Int      // 1-5
  comment     String
  photos      String[] // URLs de fotos
  
  isApproved  Boolean  @default(false)
  isPinned    Boolean  @default(false)
  
  ownerReply  String?
  ownerReplyAt DateTime?
  
  helpfulCount Int     @default(0)
  
  createdAt   DateTime @default(now())
  
  salon       Salon    @relation(...)
  client      Client?  @relation(...)
}
```

---

## 🗄️ Base de Datos

### Nuevo Modelo: PageLayout

```prisma
model PageLayout {
  id            Int      @id @default(autoincrement())
  salonId       Int      @unique
  
  // Configuración del grid
  gridColumns   Int      @default(12)
  gridRowHeight Int      @default(80)
  gridGap       Int      @default(16)
  gridMaxWidth  Int      @default(1200)
  
  // Bloques como JSON
  blocks        Json     // Array de bloques con posiciones
  
  // Configuración global
  settings      Json?    // Tema, fonts, colores globales
  
  // Control de versiones
  isPublished   Boolean  @default(false)
  draft         Json?    // Versión en borrador
  
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  salon         Salon    @relation(fields: [salonId], references: [id])
}
```

---

## 🛠️ Stack Técnico

### Librerías Necesarias

**Frontend:**
```bash
npm install vue-grid-layout          # Drag & drop grid system
npm install @vueuse/core             # Utilidades Vue
npm install vue-color                # Color pickers
npm install cropperjs                # Crop de imágenes
npm install @tiptap/vue-3            # Editor de texto rico (opcional)
```

**Backend:**
```bash
npm install multer                   # Upload de archivos
npm install sharp                    # Optimización de imágenes
npm install aws-sdk                  # AWS S3 para storage (o Cloudinary)
npm install axios                    # Peticiones HTTP para APIs externas
```

**APIs de Redes Sociales:**
- Instagram Basic Display API (gratis, requiere app en Facebook Developers)
- Facebook Graph API (gratis)
- YouTube Data API v3 (gratis, con límites)
- TikTok Embed (no requiere API)

---

## 📅 Plan de Implementación

### Fase 1: Foundation (Semana 1-2)
- [ ] Crear modelo `PageLayout` en Prisma
- [ ] Migración de base de datos
- [ ] Crear estructura de carpetas para bloques
- [ ] Instalar dependencias necesarias
- [ ] Crear 3 componentes de bloque básicos:
  - [ ] HeaderBlock.vue
  - [ ] ServicesBlock.vue  
  - [ ] BookingBlock.vue
- [ ] Crear PageRenderer.vue (componente que renderiza la página)

### Fase 2: Renderer Público (Semana 2-3)
- [ ] Implementar grid system en SalonPublicPage.vue
- [ ] Sistema de carga de bloques desde la DB
- [ ] Renderizado dinámico de bloques
- [ ] Responsive design (grid diferente para móvil)
- [ ] Testing con diferentes configuraciones

### Fase 3: Editor Básico (Semana 3-4)
- [ ] Crear PageEditor.vue
- [ ] Modo edición vs vista previa
- [ ] Sidebar con catálogo de bloques
- [ ] Botón "Añadir bloque"
- [ ] Botón "Eliminar bloque"
- [ ] Guardar layout (draft)
- [ ] Publicar layout

### Fase 4: Drag & Drop (Semana 4-5)
- [ ] Integrar vue-grid-layout
- [ ] Drag & drop de bloques
- [ ] Resize de bloques
- [ ] Colisión detection
- [ ] Indicadores visuales al arrastrar
- [ ] Snap to grid

### Fase 5: Configuración de Bloques (Semana 5-6)
- [ ] Panel lateral de configuración
- [ ] Inputs para cada propiedad del bloque
- [ ] Color pickers
- [ ] Image upload
- [ ] Vista previa en tiempo real
- [ ] Validaciones

### Fase 6: Features Avanzadas (Semana 6-8)
- [ ] Sistema de variantes por bloque
- [ ] Templates predefinidos
- [ ] Copiar/pegar bloques
- [ ] Duplicar bloques
- [ ] Deshacer/Rehacer
- [ ] Sistema de versiones
- [ ] Import/export de layouts

### Fase 7: Upload de Imágenes (Semana 8-9)
- [ ] Endpoint backend para upload
- [ ] Integración con S3/Cloudinary
- [ ] Crop y resize de imágenes
- [ ] Optimización automática
- [ ] Gestión de galería de medios

### Fase 8: Bloques Adicionales (Semana 9-10)
- [ ] Implementar resto de bloques del catálogo
- [ ] Crear variantes para cada bloque
- [ ] Testing exhaustivo
- [ ] Documentación

### Fase 9: Integración de Redes Sociales (Semana 10-11)
- [ ] Configurar Instagram Basic Display API
- [ ] Endpoint backend para conectar Instagram
- [ ] OAuth flow para Instagram
- [ ] Almacenar tokens de forma segura (encriptados)
- [ ] Componente InstagramFeed.vue
- [ ] Cache de posts de Instagram (actualizar cada hora)
- [ ] Integración con Facebook Graph API
- [ ] Embed de TikTok y YouTube
- [ ] Panel de configuración de redes sociales en el editor
- [ ] Testing de rate limits de APIs

---

## 🎨 Mejoras de Personalización

### Sistema de Temas Globales
```javascript
{
  theme: {
    primaryColor: '#9333ea',
    secondaryColor: '#ec4899',
    fontFamily: 'Inter, sans-serif',
    headingFont: 'Playfair Display, serif',
    borderRadius: '12px',
    spacing: {
      small: '8px',
      medium: '16px',
      large: '24px'
    }
  }
}
```

### Upload de Imagen de Fondo
- Permitir subir imagen como fondo en lugar de gradiente
- Blur y overlay opcionales
- Parallax effect (opcional)

### Font Customization
- Selector de fuentes de Google Fonts
- Tamaños personalizables por bloque
- Line-height y letter-spacing

---

## 🚀 Features Premium (Futuro)

- [ ] **A/B Testing**: Probar dos versiones de la página
- [ ] **Analytics**: Tracking de clicks y conversiones por bloque
- [ ] **Animations**: Animaciones de entrada para bloques
- [ ] **Plantillas Premium**: Layouts profesionales prediseñados
- [ ] **Widget de Calendario**: Calendario completo embebido
- [ ] **Chat en Vivo**: Integración con sistemas de chat
- [ ] **Multi-idioma**: Bloques en diferentes idiomas
- [ ] **SEO Optimizer**: Sugerencias de mejora SEO
- [ ] **Mobile App Preview**: Vista previa en dispositivo real
- [ ] **Instagram Stories Highlight**: Mostrar historias destacadas
- [ ] **Review Aggregator**: Mostrar reseñas de Google/Facebook
- [ ] **Booking Widget Advanced**: Calendario interactivo completo
- [ ] **Live Chat Integration**: WhatsApp Business API
- [ ] **Email Marketing**: Captura de emails con formularios
- [ ] **Promociones Automáticas**: Banners de ofertas temporales

---

## 📊 Métricas de Éxito

### KPIs a Medir:
- Tiempo promedio de personalización
- % de salones que personalizan su página
- Conversión de visitas a reservas
- Bloques más utilizados
- Variantes más populares
- Tasa de abandono en el editor

---

## 🐛 Consideraciones Técnicas

### Performance
- Lazy loading de bloques
- Optimización de imágenes automática
- Cache del layout en cliente
- Virtual scrolling para grids grandes

### UX
- Tooltips explicativos
- Tutorial interactivo al entrar al editor
- Preview en tiempo real
- Shortcuts de teclado (Ctrl+Z, Ctrl+C, etc.)

### Seguridad
- Validación de posiciones de bloques
- Sanitización de HTML en bloques de texto
- Límite de tamaño de imágenes
- Rate limiting en uploads

---

## 📝 Notas Adicionales

### Compatibilidad
- Asegurar que funciona en Chrome, Firefox, Safari, Edge
- Testing en móviles iOS y Android
- Degradación elegante en navegadores antiguos

### Accesibilidad
- Labels apropiados en formularios
- Contraste de colores adecuado
- Navegación por teclado
- Screen reader friendly

---

**Fecha de creación:** 15 de enero de 2026
**Última actualización:** 15 de enero de 2026
