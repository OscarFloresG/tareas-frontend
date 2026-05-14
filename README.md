# Frontend de Gestión de Tareas

Una aplicación web moderna para la gestión de tareas y usuarios, construida con Vue 3, Vite y Vuetify. Incluye autenticación, roles de usuario (admin/normal), CRUD de tareas y etiquetas, y funcionalidades de búsqueda avanzada.

## 🚀 Características

- **Autenticación**: Login/logout con soporte para Google OAuth y simulación (bypass)
- **Roles de Usuario**: Admin y usuario normal con permisos diferenciados
- **Gestión de Tareas**: Crear, editar, eliminar y marcar como completadas
- **Etiquetas**: Sistema de etiquetas para organizar tareas
- **Búsquedas**: Filtrado por etiquetas (usuario normal) y búsquedas globales (admin)
- **Interfaz Moderna**: UI responsiva con Vuetify 3
- **Pruebas E2E**: Suite completa con Playwright

## 📋 Requisitos Previos

- Node.js 18+
- npm o yarn
- Backend corriendo en `https://localhost:3000` (ver documentación del backend)

## 🛠️ Instalación

1. Clona el repositorio:
```bash
git clone <url-del-repositorio>
cd frontend-tareas
```

2. Instala las dependencias:
```bash
npm install
```

3. Configura las variables de entorno (opcional):
Crea un archivo `.env` en la raíz del proyecto:
```env
VITE_GOOGLE_CLIENT_ID=tu-client-id-de-google
```

## ⚙️ Configuración

### Backend
El frontend se conecta a un backend API REST. Asegúrate de que el backend esté corriendo en `https://localhost:3000/api`.

### Google OAuth (Opcional)
Para habilitar el login con Google:
1. Crea un proyecto en Google Cloud Console
2. Habilita Google+ API
3. Crea credenciales OAuth 2.0
4. Configura el client ID en `src/App.vue` (línea 17) o en `.env`

### Credenciales Admin por Defecto
- **Método de Login**: Simulación (Bypass)
- **Usuario**: alumno.seguridad@uabc.edu.mx
- **Rol**: USER (usuario normal)
- **Nota**: El bypass no genera automáticamente un usuario admin. Para probar funcionalidades admin, necesitas un usuario con rol 'admin' en el backend.

## 🚀 Ejecución

### Desarrollo
```bash
npm run dev
```
La aplicación estará disponible en `http://localhost:5173`

### Producción
```bash
npm run build
npm run preview
```

### Pruebas E2E
```bash
# Ejecutar todas las pruebas
npm run test:e2e

# Ejecutar en un navegador específico
npx playwright test --project=chromium

# Ejecutar con UI de Playwright
npx playwright test --ui
```

## 📖 Uso

### Autenticación
1. Accede a la aplicación
2. Usa "Simulación (Bypass)" para login rápido
3. O ingresa credenciales manualmente
4. O usa Google OAuth (si está configurado)

### Funcionalidades por Rol

#### Usuario Normal
- Crear tareas con etiquetas
- Marcar tareas como completadas
- Eliminar tareas propias
- Filtrar tareas por etiquetas

#### Administrador
- Todas las funcionalidades de usuario normal
- Gestionar usuarios (cambiar roles, activar/desactivar)
- Búsquedas globales (usuarios por tag, tareas por tag, tags por usuario)

## 🔗 API Endpoints

El frontend consume los siguientes endpoints del backend:

### Autenticación
- `GET /auth/login-test` - Login de simulación (bypass)
- `POST /auth/login` - Login con credenciales
- `POST /auth/logout` - Logout
- `POST /auth/google/callback` - Callback de Google OAuth

### Tareas
- `GET /tareas` - Obtener todas las tareas del usuario
- `POST /tareas` - Crear nueva tarea
- `PATCH /tareas/:id` - Actualizar tarea (marcar completada)
- `DELETE /tareas/:id` - Eliminar tarea

### Etiquetas (Tags)
- `GET /tags` - Obtener todas las etiquetas
- `PATCH /tags/:id` - Actualizar etiqueta
- `DELETE /tags/:id` - Eliminar etiqueta

### Administración (Solo Admin)
- `GET /admin/usuarios` - Obtener lista de usuarios
- `PATCH /admin/usuarios/:id` - Cambiar rol de usuario
- `PATCH /admin/usuarios/:id/estado` - Activar/desactivar usuario
- `GET /admin/busqueda-avanzada` - Búsqueda global con filtros

### Búsquedas
- `GET /tareas/buscar-tags` - Filtrar tareas por etiquetas

## 🌐 URL Funcional

- **Desarrollo**: `http://localhost:5173`
- **Producción**: `https://localhost:3001` (según configuración de Playwright)

## 🧪 Pruebas

### Cobertura de Pruebas
- ✅ Autenticación (login/logout)
- ✅ Gestión de usuarios (admin)
- ✅ CRUD tareas y etiquetas
- ✅ Búsquedas usuario normal
- ✅ Búsquedas admin

### Ejecutar Pruebas
```bash
# Todas las pruebas
npx playwright test

# Con reporte HTML
npx playwright show-report

# Depurar pruebas
npx playwright test --debug
```

## 📁 Estructura del Proyecto

```
frontend-tareas/
├── public/                 # Archivos estáticos
├── src/
│   ├── assets/            # Recursos (CSS, imágenes)
│   ├── components/        # Componentes Vue
│   │   ├── AccionesTarea.vue
│   │   ├── BusquedaAvanzadaDialog.vue
│   │   ├── GestionTagsDialog.vue
│   │   ├── GestionUsuariosDialog.vue
│   │   ├── ListaTareas.vue
│   │   ├── NuevaTarea.vue
│   │   └── README.md
│   ├── plugins/           # Plugins (Vuetify)
│   ├── services/          # Servicios API
│   │   └── api.js
│   ├── styles/            # Estilos globales
│   ├── App.vue            # Componente raíz
│   └── main.ts            # Punto de entrada
├── tests/                 # Pruebas E2E
│   ├── tareas.spec.js     # Suite principal
│   └── example.spec.ts
├── e2e/                   # Pruebas adicionales
├── playwright.config.ts   # Configuración Playwright
├── package.json
├── vite.config.mts        # Configuración Vite
└── README.md
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -am 'Agrega nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🆘 Soporte

Para soporte técnico o reportar bugs, por favor crea un issue en el repositorio.
npm run dev
```

## 🏗️ Build

```bash
npm run build
```

## 🧪 Available Scripts

- `npm run dev`
- `npm run build`
- `npm run preview`
- `npm run build-only`
- `npm run type-check`

## 💪 Support Vuetify Development

This project uses Vuetify - an MIT licensed Open Source project. We are glad to welcome contributors and any support for ongoing development:

- Contribute to Vuetify and ecosystem projects: https://github.com/vuetifyjs
- Request enterprise support: https://support.vuetifyjs.com/
- Sponsor on GitHub: https://github.com/sponsors/vuetifyjs
- Support on Open Collective: https://opencollective.com/vuetify
