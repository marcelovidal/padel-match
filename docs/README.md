# Documentación de PadelMatch

## Descripción General
PadelMatch es una aplicación web diseñada para facilitar la organización de partidos de pádel, permitiendo a los jugadores encontrar compañeros y gestionar sus partidos de manera eficiente. La aplicación está construida con Next.js 14, TypeScript, Tailwind CSS y Supabase.

## Características Principales

### 1. Sistema de Autenticación
- Registro de usuarios con roles específicos (Jugador/Club)
- Inicio de sesión seguro
- Perfiles personalizados según el rol

### 2. Perfil de Jugador
- Información básica (nombre, email)
- Posición preferida (Drive/Revés/Ambos)
- Categoría (1ª a 8ª)
- Estadísticas de juego
- Historial de partidos

### 3. Perfil de Club
- Información del club
- Gestión de pistas
- Gestión de reservas
- Estadísticas de uso

### 4. Gestión de Partidos
- Creación de partidos
- Invitación de jugadores
- Sistema de confirmación
- Historial de partidos
- Estadísticas de rendimiento

### 5. Sistema de Puntuación
- Registro de resultados
- Estadísticas detalladas
- Historial de puntuaciones
- Comparativas de rendimiento

## Estructura del Proyecto

```
padel-match/
├── app/                    # Rutas y páginas de la aplicación
│   ├── (dashboard)/       # Rutas protegidas del dashboard
│   │   ├── player/        # Dashboard del jugador
│   │   └── club/          # Dashboard del club
│   ├── login/             # Página de inicio de sesión
│   ├── register/          # Página de registro
│   └── matches/           # Gestión de partidos
├── src/
│   ├── components/        # Componentes reutilizables
│   │   ├── ui/           # Componentes de interfaz base
│   │   └── ...           # Componentes específicos
│   ├── lib/              # Utilidades y configuraciones
│   └── types/            # Definiciones de tipos TypeScript
└── supabase/             # Configuración y migraciones de Supabase
```

## Tecnologías Utilizadas

### Frontend
- Next.js 14
- TypeScript
- Tailwind CSS
- Radix UI (componentes)
- React Hook Form
- Zod (validación)

### Backend
- Supabase
  - Autenticación
  - Base de datos PostgreSQL
  - Almacenamiento
  - Row Level Security

## Configuración del Entorno

### Prerrequisitos
- Node.js 18+
- Cuenta de Supabase
- Git

### Variables de Entorno
```env
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Instalación
1. Clonar el repositorio
```bash
git clone https://github.com/marcelovidal/padel-match.git
cd padel-match
```

2. Instalar dependencias
```bash
npm install
```

3. Configurar variables de entorno
```bash
cp .env.example .env.local
```

4. Iniciar el servidor de desarrollo
```bash
npm run dev
```

## Base de Datos

### Tablas Principales
- `users`: Usuarios del sistema
- `players`: Perfiles de jugadores
- `clubs`: Información de clubs
- `matches`: Partidos
- `scores`: Puntuaciones
- `invites`: Invitaciones a partidos

### Políticas de Seguridad
- Row Level Security (RLS) implementado en todas las tablas
- Políticas específicas por rol (jugador/club)
- Validación de permisos en cada operación

## Flujos de Usuario

### Registro de Jugador
1. Usuario selecciona rol "Jugador"
2. Completa información básica
3. Especifica posición y categoría
4. Crea cuenta
5. Accede al dashboard personalizado

### Registro de Club
1. Usuario selecciona rol "Club"
2. Completa información del club
3. Crea cuenta
4. Accede al dashboard de gestión

### Creación de Partido
1. Usuario accede a "Nuevo Partido"
2. Selecciona fecha y hora
3. Invita jugadores
4. Espera confirmaciones
5. Gestiona el partido

## Contribución
1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia
Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## Contacto
Marcelo Vidal - [@marcelovidal](https://github.com/marcelovidal)

Link del Proyecto: [https://github.com/marcelovidal/padel-match](https://github.com/marcelovidal/padel-match) 