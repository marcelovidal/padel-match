# Documentación de la API y Base de Datos

## Estructura de la Base de Datos

### Tabla: users
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('player', 'club')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Tabla: players
```sql
CREATE TABLE players (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  position TEXT NOT NULL CHECK (position IN ('drive', 'reves', 'both')),
  category INTEGER NOT NULL CHECK (category BETWEEN 1 AND 8),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Tabla: clubs
```sql
CREATE TABLE clubs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  address TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Tabla: matches
```sql
CREATE TABLE matches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  creator_id UUID REFERENCES users(id) ON DELETE CASCADE,
  club_id UUID REFERENCES clubs(id),
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Tabla: invites
```sql
CREATE TABLE invites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  match_id UUID REFERENCES matches(id) ON DELETE CASCADE,
  player_id UUID REFERENCES players(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Tabla: scores
```sql
CREATE TABLE scores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  match_id UUID REFERENCES matches(id) ON DELETE CASCADE,
  player_id UUID REFERENCES players(id) ON DELETE CASCADE,
  points INTEGER NOT NULL CHECK (points >= 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Políticas de Seguridad (RLS)

### Políticas para users
```sql
-- Lectura: Usuarios pueden ver su propio perfil
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

-- Actualización: Usuarios pueden actualizar su propio perfil
CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);
```

### Políticas para players
```sql
-- Lectura: Jugadores pueden ver todos los perfiles
CREATE POLICY "Players are viewable by everyone" ON players
  FOR SELECT USING (true);

-- Inserción: Solo el usuario correspondiente puede crear su perfil
CREATE POLICY "Players can create own profile" ON players
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Actualización: Jugadores pueden actualizar su propio perfil
CREATE POLICY "Players can update own profile" ON players
  FOR UPDATE USING (auth.uid() = user_id);
```

### Políticas para matches
```sql
-- Lectura: Usuarios pueden ver partidos que crearon o en los que participan
CREATE POLICY "Matches are viewable by participants" ON matches
  FOR SELECT USING (
    auth.uid() = creator_id OR
    EXISTS (
      SELECT 1 FROM invites
      WHERE match_id = matches.id
      AND player_id IN (
        SELECT id FROM players WHERE user_id = auth.uid()
      )
    )
  );

-- Inserción: Cualquier usuario autenticado puede crear partidos
CREATE POLICY "Authenticated users can create matches" ON matches
  FOR INSERT WITH CHECK (auth.uid() = creator_id);

-- Actualización: Solo el creador puede actualizar el partido
CREATE POLICY "Match creator can update match" ON matches
  FOR UPDATE USING (auth.uid() = creator_id);
```

## Endpoints de la API

### Autenticación
```typescript
// Registro
POST /api/auth/register
Body: {
  email: string;
  password: string;
  role: 'player' | 'club';
  name: string;
  position?: 'drive' | 'reves' | 'both';
  category?: number;
}

// Inicio de sesión
POST /api/auth/login
Body: {
  email: string;
  password: string;
}

// Cierre de sesión
POST /api/auth/logout
```

### Jugadores
```typescript
// Obtener perfil
GET /api/players/:id

// Actualizar perfil
PUT /api/players/:id
Body: {
  name?: string;
  position?: 'drive' | 'reves' | 'both';
  category?: number;
}
```

### Partidos
```typescript
// Crear partido
POST /api/matches
Body: {
  date: string;
  club_id?: string;
}

// Obtener partido
GET /api/matches/:id

// Actualizar partido
PUT /api/matches/:id
Body: {
  date?: string;
  status?: 'pending' | 'confirmed' | 'completed' | 'cancelled';
}

// Invitar jugador
POST /api/matches/:id/invites
Body: {
  player_id: string;
}
```

### Puntuaciones
```typescript
// Registrar puntuación
POST /api/scores
Body: {
  match_id: string;
  player_id: string;
  points: number;
}

// Obtener puntuaciones de un partido
GET /api/matches/:id/scores
```

## Tipos TypeScript

```typescript
// Tipos de usuario
type UserRole = 'player' | 'club';

interface User {
  id: string;
  email: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

// Tipos de jugador
type PlayerPosition = 'drive' | 'reves' | 'both';
type PlayerCategory = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

interface Player {
  id: string;
  user_id: string;
  name: string;
  position: PlayerPosition;
  category: PlayerCategory;
  created_at: string;
  updated_at: string;
}

// Tipos de partido
type MatchStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

interface Match {
  id: string;
  creator_id: string;
  club_id?: string;
  date: string;
  status: MatchStatus;
  created_at: string;
  updated_at: string;
}

// Tipos de invitación
type InviteStatus = 'pending' | 'accepted' | 'rejected';

interface Invite {
  id: string;
  match_id: string;
  player_id: string;
  status: InviteStatus;
  created_at: string;
  updated_at: string;
}

// Tipos de puntuación
interface Score {
  id: string;
  match_id: string;
  player_id: string;
  points: number;
  created_at: string;
  updated_at: string;
}
``` 