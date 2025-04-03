# Guía de Contribución a PadelMatch

## Introducción
Gracias por tu interés en contribuir a PadelMatch. Este documento te guiará a través del proceso de contribución.

## Requisitos Previos
- Node.js 18 o superior
- npm 9 o superior
- Git
- Cuenta de GitHub
- Cuenta de Supabase (para desarrollo local)

## Configuración del Entorno de Desarrollo

### 1. Fork del Repositorio
1. Ve a [https://github.com/marcelovidal/padel-match](https://github.com/marcelovidal/padel-match)
2. Haz clic en el botón "Fork" en la esquina superior derecha
3. Clona tu fork localmente:
```bash
git clone https://github.com/tu-usuario/padel-match.git
cd padel-match
```

### 2. Configuración del Proyecto
1. Instala las dependencias:
```bash
npm install
```

2. Configura las variables de entorno:
```bash
cp .env.example .env.local
```

3. Actualiza las variables en `.env.local` con tus credenciales de Supabase

4. Inicia el servidor de desarrollo:
```bash
npm run dev
```

## Flujo de Trabajo

### 1. Crear una Rama
```bash
git checkout -b feature/nombre-feature
# o
git checkout -b fix/nombre-fix
```

### 2. Desarrollar
- Sigue las convenciones de código establecidas
- Escribe código limpio y bien documentado
- Asegúrate de que tu código pase los tests
- Verifica que no haya errores de linting

### 3. Commit de Cambios
```bash
git add .
git commit -m "tipo: descripción concisa"
```

Tipos de commits:
- `feat`: Nueva característica
- `fix`: Corrección de bug
- `docs`: Cambios en documentación
- `style`: Cambios de formato
- `refactor`: Refactorización de código
- `test`: Añadir o modificar tests
- `chore`: Tareas de mantenimiento

### 4. Push a tu Fork
```bash
git push origin feature/nombre-feature
```

### 5. Crear Pull Request
1. Ve a tu fork en GitHub
2. Haz clic en "Compare & pull request"
3. Describe tus cambios en detalle
4. Adjunta capturas de pantalla si es necesario
5. Espera la revisión

## Convenciones de Código

### TypeScript
- Usa tipos explícitos
- Evita `any`
- Documenta interfaces y tipos complejos
```typescript
interface User {
  id: string;
  email: string;
  role: UserRole;
}

type UserRole = 'player' | 'club';
```

### React
- Usa componentes funcionales
- Implementa hooks personalizados para lógica reutilizable
- Mantén los componentes pequeños y enfocados
```typescript
const UserProfile: React.FC<UserProfileProps> = ({ user }) => {
  // ...
};
```

### Estilos
- Usa Tailwind CSS para estilos
- Mantén la consistencia con el diseño existente
- Sigue el sistema de diseño establecido
```tsx
<div className="flex items-center justify-between p-4">
  {/* ... */}
</div>
```

### Testing
- Escribe tests para nuevas características
- Mantén la cobertura de tests por encima del 80%
- Usa nombres descriptivos para los tests
```typescript
describe('UserProfile', () => {
  it('should display user information correctly', () => {
    // ...
  });
});
```

## Revisión de Código

### Checklist
- [ ] El código sigue las convenciones establecidas
- [ ] Los tests pasan
- [ ] No hay errores de linting
- [ ] La documentación está actualizada
- [ ] Los cambios son compatibles con versiones anteriores
- [ ] El código es accesible
- [ ] El rendimiento no se ve afectado negativamente

### Proceso de Revisión
1. El código será revisado por al menos un mantenedor
2. Se pueden solicitar cambios
3. Una vez aprobado, se hará merge a main

## Soporte
Si tienes preguntas o necesitas ayuda:
- Abre un issue en GitHub
- Contacta a los mantenedores
- Revisa la documentación existente

## Licencia
Al contribuir, aceptas que tu código será licenciado bajo la misma licencia que el proyecto (MIT).

## Agradecimientos
Gracias por contribuir a hacer PadelMatch mejor para todos. 