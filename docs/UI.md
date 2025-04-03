# Documentación de la Interfaz de Usuario

## Componentes Base

### Avatar
```typescript
interface AvatarProps {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: 'sm' | 'md' | 'lg';
}
```
Componente para mostrar imágenes de perfil con fallback a iniciales.

### Badge
```typescript
interface BadgeProps {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}
```
Componente para mostrar etiquetas o estados.

### Button
```typescript
interface ButtonProps {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  disabled?: boolean;
  loading?: boolean;
}
```
Botón con múltiples variantes y estados.

### Card
```typescript
interface CardProps {
  children: React.ReactNode;
  className?: string;
}
```
Contenedor con estilo de tarjeta.

### Dialog
```typescript
interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}
```
Modal para mostrar contenido importante.

### Form
```typescript
interface FormProps {
  onSubmit: (data: any) => void;
  children: React.ReactNode;
  className?: string;
}
```
Formulario con validación integrada.

### Input
```typescript
interface InputProps {
  type?: string;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
}
```
Campo de entrada de texto.

### Label
```typescript
interface LabelProps {
  htmlFor: string;
  children: React.ReactNode;
}
```
Etiqueta para campos de formulario.

### Select
```typescript
interface SelectProps {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
}
```
Selector desplegable.

### Table
```typescript
interface TableProps {
  children: React.ReactNode;
  className?: string;
}
```
Tabla con estilo consistente.

## Componentes Específicos

### AuthForm
```typescript
interface AuthFormProps {
  type: 'login' | 'register';
  onSubmit: (data: AuthFormData) => void;
  error?: string;
}
```
Formulario de autenticación reutilizable.

### DashboardStats
```typescript
interface DashboardStatsProps {
  stats: {
    totalMatches: number;
    upcomingMatches: number;
    winRate: number;
    averageScore: number;
  };
}
```
Panel de estadísticas del dashboard.

### MatchForm
```typescript
interface MatchFormProps {
  onSubmit: (data: MatchFormData) => void;
  initialData?: Partial<MatchFormData>;
}
```
Formulario para crear/editar partidos.

### PlayerSuggestions
```typescript
interface PlayerSuggestionsProps {
  onSelect: (player: Player) => void;
  excludeIds?: string[];
}
```
Lista de sugerencias de jugadores.

### ScoreForm
```typescript
interface ScoreFormProps {
  matchId: string;
  onSubmit: (data: ScoreFormData) => void;
}
```
Formulario para registrar puntuaciones.

## Layouts

### DashboardLayout
```typescript
interface DashboardLayoutProps {
  children: React.ReactNode;
  user: User;
}
```
Layout base para el dashboard.

### PlayerLayout
```typescript
interface PlayerLayoutProps {
  children: React.ReactNode;
  player: Player;
}
```
Layout específico para jugadores.

### ClubLayout
```typescript
interface ClubLayoutProps {
  children: React.ReactNode;
  club: Club;
}
```
Layout específico para clubs.

## Páginas

### Login
- Ruta: `/login`
- Componentes principales:
  - AuthForm
  - Card
  - Button

### Register
- Ruta: `/register`
- Componentes principales:
  - AuthForm
  - Card
  - Select (para rol)

### Player Dashboard
- Ruta: `/player`
- Componentes principales:
  - DashboardStats
  - UpcomingMatches
  - RecentActivity
  - RecentScores

### Club Dashboard
- Ruta: `/club`
- Componentes principales:
  - DashboardStats
  - CourtManagement
  - ReservationCalendar
  - PlayerManagement

### Matches
- Ruta: `/matches`
- Componentes principales:
  - MatchForm
  - MatchesList
  - MatchesFilter
  - PlayerSuggestions

### Scores
- Ruta: `/scores`
- Componentes principales:
  - ScoreForm
  - ScoresTable
  - ScoreStats
  - ScoreOverview

## Estilos

### Tema
```typescript
interface Theme {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    foreground: string;
    muted: string;
    border: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
    full: string;
  };
}
```

### Clases de Utilidad
```css
/* Espaciado */
.p-{size} /* padding */
.m-{size} /* margin */
.gap-{size} /* gap */

/* Flexbox */
.flex /* display: flex */
.items-center /* align-items: center */
.justify-between /* justify-content: space-between */

/* Grid */
.grid /* display: grid */
.grid-cols-{n} /* grid-template-columns: repeat(n, 1fr) */

/* Responsive */
.sm: /* @media (min-width: 640px) */
.md: /* @media (min-width: 768px) */
.lg: /* @media (min-width: 1024px) */
.xl: /* @media (min-width: 1280px) */
```

## Accesibilidad

### Roles ARIA
```typescript
// Roles comunes
role="button"
role="dialog"
role="form"
role="list"
role="listitem"
role="navigation"
role="tab"
role="tabpanel"
```

### Estados ARIA
```typescript
// Estados comunes
aria-expanded
aria-disabled
aria-selected
aria-hidden
aria-label
aria-describedby
```

### Navegación por Teclado
- Tab: Navegación entre elementos interactivos
- Enter/Space: Activar elementos
- Escape: Cerrar modales/dropdowns
- Arrow keys: Navegación en listas/menús

## Responsive Design

### Breakpoints
```css
/* Mobile First */
sm: 640px   /* Small devices */
md: 768px   /* Medium devices */
lg: 1024px  /* Large devices */
xl: 1280px  /* Extra large devices */
```

### Layouts Responsivos
```typescript
// Grid responsivo
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {items.map(item => (
    <Card key={item.id}>{item.content}</Card>
  ))}
</div>

// Flex responsivo
<div className="flex flex-col md:flex-row gap-4">
  <div className="w-full md:w-1/2">{content}</div>
  <div className="w-full md:w-1/2">{content}</div>
</div>
``` 