-- Esquema para la aplicación de pádel

-- Tabla de usuarios (extendiendo la tabla auth.users de Supabase)
CREATE TYPE user_role AS ENUM ('player', 'club_owner', 'admin');
CREATE TYPE player_position AS ENUM ('drive', 'reves', 'ambas');
CREATE TYPE player_category AS ENUM ('1', '2', '3', '4', '5', '6', '7', '8');

CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    phone TEXT UNIQUE,
    role user_role DEFAULT 'player' NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Tabla de jugadores (extiende profiles para usuarios con rol 'player')
CREATE TABLE IF NOT EXISTS public.players (
    id UUID REFERENCES public.profiles(id) ON DELETE CASCADE PRIMARY KEY,
    position player_position DEFAULT 'ambas' NOT NULL,
    category player_category DEFAULT '5' NOT NULL,
    average_rating DECIMAL(3,2) DEFAULT 0.0,
    total_matches INTEGER DEFAULT 0,
    wins INTEGER DEFAULT 0,
    losses INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Tabla de clubes
CREATE TABLE IF NOT EXISTS public.clubs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    owner_id UUID REFERENCES public.profiles(id) NOT NULL,
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    logo_url TEXT,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Tabla de canchas
CREATE TABLE IF NOT EXISTS public.courts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    club_id UUID REFERENCES public.clubs(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    court_number INTEGER NOT NULL,
    is_indoor BOOLEAN DEFAULT false,
    price_per_hour DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    UNIQUE(club_id, court_number)
);

-- Tabla de disponibilidad de canchas
CREATE TABLE IF NOT EXISTS public.court_availability (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    court_id UUID REFERENCES public.courts(id) ON DELETE CASCADE NOT NULL,
    day_of_week INTEGER NOT NULL, -- 0 = Domingo, 1 = Lunes, etc.
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_available BOOLEAN DEFAULT true,
    special_price DECIMAL(10,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Tipo para nivel de partido
CREATE TYPE match_level AS ENUM ('clasico', 'alto', 'medio', 'bajo');

-- Tabla de partidos
CREATE TABLE IF NOT EXISTS public.matches (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    creator_id UUID REFERENCES public.profiles(id) NOT NULL,
    court_id UUID REFERENCES public.courts(id),
    match_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    level match_level NOT NULL,
    price_per_player DECIMAL(10,2),
    max_players INTEGER DEFAULT 4,
    notes TEXT,
    is_completed BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Tabla de jugadores en partidos
CREATE TYPE player_status AS ENUM ('invited', 'confirmed', 'rejected', 'waitlist');
CREATE TYPE player_team AS ENUM ('team_a', 'team_b');
CREATE TYPE player_position_in_match AS ENUM ('drive', 'reves');

CREATE TABLE IF NOT EXISTS public.match_players (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    match_id UUID REFERENCES public.matches(id) ON DELETE CASCADE NOT NULL,
    player_id UUID REFERENCES public.players(id) NOT NULL,
    status player_status DEFAULT 'invited' NOT NULL,
    team player_team,
    position player_position_in_match,
    invitation_sent_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    response_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    UNIQUE(match_id, player_id)
);

-- Tabla de resultados de partidos
CREATE TABLE IF NOT EXISTS public.match_results (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    match_id UUID REFERENCES public.matches(id) ON DELETE CASCADE UNIQUE NOT NULL,
    team_a_score INTEGER NOT NULL,
    team_b_score INTEGER NOT NULL,
    recorded_by UUID REFERENCES public.profiles(id) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Tabla de calificaciones entre jugadores
CREATE TABLE IF NOT EXISTS public.player_ratings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    match_id UUID REFERENCES public.matches(id) ON DELETE CASCADE NOT NULL,
    rater_id UUID REFERENCES public.players(id) NOT NULL,
    rated_id UUID REFERENCES public.players(id) NOT NULL,
    rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    UNIQUE(match_id, rater_id, rated_id)
);

-- Tabla de reservas
CREATE TYPE reservation_status AS ENUM ('pending', 'confirmed', 'cancelled', 'completed');

CREATE TABLE IF NOT EXISTS public.reservations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    court_id UUID REFERENCES public.courts(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.profiles(id) NOT NULL,
    match_id UUID REFERENCES public.matches(id),
    reservation_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    status reservation_status DEFAULT 'pending' NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    is_special_offer BOOLEAN DEFAULT false,
    payment_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Tabla de notificaciones
CREATE TYPE notification_type AS ENUM (
    'match_invitation', 
    'match_confirmation', 
    'match_cancellation', 
    'reservation_confirmation', 
    'reservation_cancellation',
    'player_rating',
    'system_message'
);

CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    type notification_type NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    related_id UUID,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Funciones y triggers

-- Función para actualizar el campo updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Función para actualizar estadísticas del jugador después de un partido
CREATE OR REPLACE FUNCTION update_player_match_stats()
RETURNS TRIGGER AS $$
DECLARE
    team_a_players UUID[];
    team_b_players UUID[];
BEGIN
    -- Obtener jugadores del equipo A
    SELECT array_agg(player_id) INTO team_a_players
    FROM public.match_players
    WHERE match_id = NEW.match_id AND team = 'team_a';
    
    -- Obtener jugadores del equipo B
    SELECT array_agg(player_id) INTO team_b_players
    FROM public.match_players
    WHERE match_id = NEW.match_id AND team = 'team_b';
    
    -- Actualizar total de partidos para todos los jugadores
    UPDATE public.players
    SET total_matches = total_matches + 1
    WHERE id IN (
        SELECT player_id FROM public.match_players WHERE match_id = NEW.match_id
    );
    
    -- Actualizar victorias para el equipo ganador
    IF NEW.team_a_score > NEW.team_b_score THEN
        UPDATE public.players
        SET wins = wins + 1
        WHERE id = ANY(team_a_players);
        
        UPDATE public.players
        SET losses = losses + 1
        WHERE id = ANY(team_b_players);
    ELSIF NEW.team_b_score > NEW.team_a_score THEN
        UPDATE public.players
        SET wins = wins + 1
        WHERE id = ANY(team_b_players);
        
        UPDATE public.players
        SET losses = losses + 1
        WHERE id = ANY(team_a_players);
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Función para actualizar la calificación promedio del jugador
CREATE OR REPLACE FUNCTION update_player_average_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.players
    SET average_rating = (
        SELECT COALESCE(AVG(rating), 0)
        FROM public.player_ratings
        WHERE rated_id = NEW.rated_id
    )
    WHERE id = NEW.rated_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar el trigger a todas las tablas con updated_at
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_players_updated_at
BEFORE UPDATE ON public.players
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_clubs_updated_at
BEFORE UPDATE ON public.clubs
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_courts_updated_at
BEFORE UPDATE ON public.courts
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_court_availability_updated_at
BEFORE UPDATE ON public.court_availability
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_matches_updated_at
BEFORE UPDATE ON public.matches
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_match_players_updated_at
BEFORE UPDATE ON public.match_players
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_match_results_updated_at
BEFORE UPDATE ON public.match_results
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger para actualizar estadísticas después de registrar resultado
CREATE TRIGGER update_player_stats_after_match_result
AFTER INSERT ON public.match_results
FOR EACH ROW EXECUTE FUNCTION update_player_match_stats();

CREATE TRIGGER update_reservations_updated_at
BEFORE UPDATE ON public.reservations
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger para actualizar la calificación promedio
CREATE TRIGGER update_player_rating_after_insert
AFTER INSERT OR UPDATE ON public.player_ratings
FOR EACH ROW EXECUTE FUNCTION update_player_average_rating();

-- Políticas de seguridad RLS (Row Level Security)

-- Habilitar RLS en todas las tablas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.court_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.match_players ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.match_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.player_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Políticas para perfiles
CREATE POLICY "Perfiles visibles para todos los usuarios autenticados"
ON public.profiles FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Los usuarios pueden actualizar sus propios perfiles"
ON public.profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Políticas para jugadores
CREATE POLICY "Información de jugadores visible para todos los usuarios autenticados"
ON public.players FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Los jugadores pueden actualizar su propia información"
ON public.players FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Políticas para clubes
CREATE POLICY "Clubes visibles para todos los usuarios autenticados"
ON public.clubs FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Los dueños de clubes pueden crear clubes"
ON public.clubs FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'club_owner'
    )
);

CREATE POLICY "Los dueños pueden actualizar sus propios clubes"
ON public.clubs FOR UPDATE
TO authenticated
USING (owner_id = auth.uid())
WITH CHECK (owner_id = auth.uid());

-- Políticas para canchas
CREATE POLICY "Canchas visibles para todos los usuarios autenticados"
ON public.courts FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Los dueños de clubes pueden gestionar sus canchas"
ON public.courts FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.clubs
        WHERE id = club_id AND owner_id = auth.uid()
    )
);

CREATE POLICY "Los dueños pueden actualizar sus propias canchas"
ON public.courts FOR UPDATE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.clubs
        WHERE id = club_id AND owner_id = auth.uid()
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.clubs
        WHERE id = club_id AND owner_id = auth.uid()
    )
);

-- Políticas para partidos
CREATE POLICY "Partidos visibles para todos los usuarios autenticados"
ON public.matches FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Cualquier jugador puede crear partidos"
ON public.matches FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND (role = 'player' OR role = 'club_owner' OR role = 'admin')
    )
);

CREATE POLICY "Creadores pueden actualizar sus propios partidos"
ON public.matches FOR UPDATE
TO authenticated
USING (creator_id = auth.uid())
WITH CHECK (creator_id = auth.uid());

-- Políticas para jugadores en partidos
CREATE POLICY "Información de jugadores en partidos visible para todos"
ON public.match_players FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Creadores de partidos pueden añadir jugadores"
ON public.match_players FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.matches
        WHERE id = match_id AND creator_id = auth.uid()
    )
);

-- Políticas para notificaciones
CREATE POLICY "Los usuarios solo ven sus propias notificaciones"
ON public.notifications FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Función para crear un nuevo usuario con perfil
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, role)
    VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email), 'player');
    
    -- Si el rol es jugador, crear entrada en la tabla players
    INSERT INTO public.players (id)
    VALUES (NEW.id);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para crear perfil automáticamente al registrarse
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

