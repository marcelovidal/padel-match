# PadelMatch

PadelMatch es una aplicación web para organizar partidos de pádel, encontrar jugadores y gestionar clubes.

## Características

- Registro y autenticación de usuarios (jugadores y dueños de clubes)
- Dashboard personalizado según el tipo de usuario
- Gestión de partidos y reservas
- Búsqueda de jugadores y clubes
- Sistema de notificaciones

## Tecnologías Utilizadas

- Next.js 14
- TypeScript
- Tailwind CSS
- Supabase (Autenticación y Base de datos)
- Radix UI
- Lucide Icons

## Requisitos Previos

- Node.js 18.17 o superior
- npm o yarn
- Cuenta en Supabase

## Configuración del Proyecto

1. Clonar el repositorio:
```bash
git clone https://github.com/tu-usuario/padel-match.git
cd padel-match
```

2. Instalar dependencias:
```bash
npm install
# o
yarn install
```

3. Crear archivo de variables de entorno:
```bash
cp .env.example .env.local
```

4. Configurar las variables de entorno en `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase
```

5. Iniciar el servidor de desarrollo:
```bash
npm run dev
# o
yarn dev
```

6. Abrir [http://localhost:3000](http://localhost:3000) en tu navegador.

## Estructura del Proyecto

```
src/
├── app/                    # Rutas y páginas de la aplicación
│   ├── (auth)/            # Rutas de autenticación
│   ├── (dashboard)/       # Rutas del dashboard
│   └── layout.tsx         # Layout principal
├── components/            # Componentes reutilizables
│   └── ui/               # Componentes de UI
├── lib/                   # Utilidades y configuraciones
└── types/                # Tipos de TypeScript
```

## Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run start` - Inicia el servidor de producción
- `npm run lint` - Ejecuta el linter
- `npm run format` - Formatea el código

## Contribuir

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.
