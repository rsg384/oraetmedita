-- Script para corrigir a estrutura da tabela meditations no Supabase
-- Execute este SQL no painel do Supabase (SQL Editor)

-- Primeiro, vamos verificar se a tabela existe e sua estrutura atual
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'meditations';

-- Se a tabela não existir, criar com a estrutura correta
CREATE TABLE IF NOT EXISTS meditations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category_id UUID REFERENCES categories(id),
    duration INTEGER DEFAULT 10, -- Duração em minutos
    difficulty TEXT DEFAULT 'intermediate',
    tags TEXT[] DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID,
    bible_verse TEXT,
    prayer TEXT,
    practical_application TEXT,
    sort_order INTEGER DEFAULT 0
);

-- Se a tabela já existir mas não tiver a coluna duration, adicionar
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'meditations' AND column_name = 'duration'
    ) THEN
        ALTER TABLE meditations ADD COLUMN duration INTEGER DEFAULT 10;
    END IF;
END $$;

-- Se a tabela já existir mas não tiver a coluna difficulty, adicionar
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'meditations' AND column_name = 'difficulty'
    ) THEN
        ALTER TABLE meditations ADD COLUMN difficulty TEXT DEFAULT 'intermediate';
    END IF;
END $$;

-- Se a tabela já existir mas não tiver a coluna tags, adicionar
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'meditations' AND column_name = 'tags'
    ) THEN
        ALTER TABLE meditations ADD COLUMN tags TEXT[] DEFAULT '{}';
    END IF;
END $$;

-- Se a tabela já existir mas não tiver a coluna bible_verse, adicionar
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'meditations' AND column_name = 'bible_verse'
    ) THEN
        ALTER TABLE meditations ADD COLUMN bible_verse TEXT;
    END IF;
END $$;

-- Se a tabela já existir mas não tiver a coluna prayer, adicionar
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'meditations' AND column_name = 'prayer'
    ) THEN
        ALTER TABLE meditations ADD COLUMN prayer TEXT;
    END IF;
END $$;

-- Se a tabela já existir mas não tiver a coluna practical_application, adicionar
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'meditations' AND column_name = 'practical_application'
    ) THEN
        ALTER TABLE meditations ADD COLUMN practical_application TEXT;
    END IF;
END $$;

-- Se a tabela já existir mas não tiver a coluna sort_order, adicionar
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'meditations' AND column_name = 'sort_order'
    ) THEN
        ALTER TABLE meditations ADD COLUMN sort_order INTEGER DEFAULT 0;
    END IF;
END $$;

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_meditations_category_id ON meditations(category_id);
CREATE INDEX IF NOT EXISTS idx_meditations_is_active ON meditations(is_active);
CREATE INDEX IF NOT EXISTS idx_meditations_sort_order ON meditations(sort_order);

-- Habilitar RLS (Row Level Security) se necessário
-- ALTER TABLE meditations ENABLE ROW LEVEL SECURITY;

-- Comentários sobre a tabela
COMMENT ON TABLE meditations IS 'Tabela de meditações católicas';
COMMENT ON COLUMN meditations.id IS 'ID único da meditação';
COMMENT ON COLUMN meditations.title IS 'Título da meditação';
COMMENT ON COLUMN meditations.content IS 'Conteúdo completo da meditação';
COMMENT ON COLUMN meditations.category_id IS 'ID da categoria relacionada';
COMMENT ON COLUMN meditations.duration IS 'Duração estimada em minutos';
COMMENT ON COLUMN meditations.difficulty IS 'Nível de dificuldade (beginner, intermediate, advanced)';
COMMENT ON COLUMN meditations.tags IS 'Tags para categorização';
COMMENT ON COLUMN meditations.is_active IS 'Se a meditação está ativa';
COMMENT ON COLUMN meditations.bible_verse IS 'Versículo bíblico relacionado';
COMMENT ON COLUMN meditations.prayer IS 'Oração final da meditação';
COMMENT ON COLUMN meditations.practical_application IS 'Aplicação prática da meditação';

-- Verificar a estrutura final
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'meditations'
ORDER BY ordinal_position; 