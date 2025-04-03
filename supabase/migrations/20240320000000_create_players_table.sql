-- Crear la tabla players
CREATE TABLE IF NOT EXISTS public.players (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    position TEXT NOT NULL CHECK (position IN ('drive', 'reves', 'ambas')),
    category TEXT NOT NULL CHECK (category IN ('1', '2', '3', '4', '5', '6', '7', '8')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Habilitar RLS
ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;

-- Crear políticas de seguridad
-- Permitir que los usuarios vean su propio perfil de jugador
CREATE POLICY "Users can view their own player profile"
    ON public.players
    FOR SELECT
    USING (auth.uid() = id);

-- Permitir que los usuarios inserten su propio perfil de jugador
CREATE POLICY "Users can insert their own player profile"
    ON public.players
    FOR INSERT
    WITH CHECK (auth.uid() = id);

-- Permitir que los usuarios actualicen su propio perfil de jugador
CREATE POLICY "Users can update their own player profile"
    ON public.players
    FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Crear función para actualizar updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Crear trigger para actualizar updated_at
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.players
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at(); 