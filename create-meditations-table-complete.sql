-- SQL completo para criar tabela meditations baseado na estrutura dos dados exportados
-- Execute este SQL no painel do Supabase (SQL Editor)

-- 1. Verificar se a tabela existe e sua estrutura atual
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'meditations'
ORDER BY ordinal_position;

-- 2. Dropar tabela existente se necessário (CUIDADO: isso apaga todos os dados)
-- DROP TABLE IF EXISTS meditations CASCADE;

-- 3. Criar tabela meditations com estrutura completa baseada nos dados exportados
CREATE TABLE IF NOT EXISTS meditations (
    -- Campos principais da meditação
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    
    -- Relacionamento com categoria
    category_id UUID REFERENCES categories(id),
    
    -- Campos de configuração
    duration INTEGER DEFAULT 10,
    status TEXT DEFAULT 'available',
    type TEXT DEFAULT 'free',
    difficulty TEXT DEFAULT 'intermediate',
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    
    -- Campos de conteúdo espiritual
    bible_verse TEXT,
    prayer TEXT,
    practical_application TEXT,
    
    -- Campos de metadados
    tags TEXT[] DEFAULT '{}',
    icon TEXT,
    color TEXT,
    
    -- Campos de controle
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID,
    
    -- Campos de controle de versão
    version INTEGER DEFAULT 1,
    is_deleted BOOLEAN DEFAULT false
);

-- 4. Adicionar colunas se a tabela já existir
DO $$
BEGIN
    -- Adicionar coluna duration se não existir
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'meditations' AND column_name = 'duration') THEN
        ALTER TABLE meditations ADD COLUMN duration INTEGER DEFAULT 10;
    END IF;
    
    -- Adicionar coluna status se não existir
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'meditations' AND column_name = 'status') THEN
        ALTER TABLE meditations ADD COLUMN status TEXT DEFAULT 'available';
    END IF;
    
    -- Adicionar coluna type se não existir
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'meditations' AND column_name = 'type') THEN
        ALTER TABLE meditations ADD COLUMN type TEXT DEFAULT 'free';
    END IF;
    
    -- Adicionar coluna difficulty se não existir
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'meditations' AND column_name = 'difficulty') THEN
        ALTER TABLE meditations ADD COLUMN difficulty TEXT DEFAULT 'intermediate';
    END IF;
    
    -- Adicionar coluna bible_verse se não existir
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'meditations' AND column_name = 'bible_verse') THEN
        ALTER TABLE meditations ADD COLUMN bible_verse TEXT;
    END IF;
    
    -- Adicionar coluna prayer se não existir
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'meditations' AND column_name = 'prayer') THEN
        ALTER TABLE meditations ADD COLUMN prayer TEXT;
    END IF;
    
    -- Adicionar coluna practical_application se não existir
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'meditations' AND column_name = 'practical_application') THEN
        ALTER TABLE meditations ADD COLUMN practical_application TEXT;
    END IF;
    
    -- Adicionar coluna tags se não existir
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'meditations' AND column_name = 'tags') THEN
        ALTER TABLE meditations ADD COLUMN tags TEXT[] DEFAULT '{}';
    END IF;
    
    -- Adicionar coluna icon se não existir
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'meditations' AND column_name = 'icon') THEN
        ALTER TABLE meditations ADD COLUMN icon TEXT;
    END IF;
    
    -- Adicionar coluna color se não existir
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'meditations' AND column_name = 'color') THEN
        ALTER TABLE meditations ADD COLUMN color TEXT;
    END IF;
    
    -- Adicionar coluna created_by se não existir
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'meditations' AND column_name = 'created_by') THEN
        ALTER TABLE meditations ADD COLUMN created_by UUID;
    END IF;
    
    -- Adicionar coluna version se não existir
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'meditations' AND column_name = 'version') THEN
        ALTER TABLE meditations ADD COLUMN version INTEGER DEFAULT 1;
    END IF;
    
    -- Adicionar coluna is_deleted se não existir
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'meditations' AND column_name = 'is_deleted') THEN
        ALTER TABLE meditations ADD COLUMN is_deleted BOOLEAN DEFAULT false;
    END IF;
    
END $$;

-- 5. Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_meditations_category_id ON meditations(category_id);
CREATE INDEX IF NOT EXISTS idx_meditations_status ON meditations(status);
CREATE INDEX IF NOT EXISTS idx_meditations_type ON meditations(type);
CREATE INDEX IF NOT EXISTS idx_meditations_is_active ON meditations(is_active);
CREATE INDEX IF NOT EXISTS idx_meditations_created_at ON meditations(created_at);
CREATE INDEX IF NOT EXISTS idx_meditations_sort_order ON meditations(sort_order);

-- 6. Criar trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_meditations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_meditations_updated_at ON meditations;
CREATE TRIGGER trigger_update_meditations_updated_at
    BEFORE UPDATE ON meditations
    FOR EACH ROW
    EXECUTE FUNCTION update_meditations_updated_at();

-- 7. Criar função para inserir meditação com validação
CREATE OR REPLACE FUNCTION insert_meditation(
    p_title TEXT,
    p_content TEXT,
    p_category_id UUID,
    p_duration INTEGER DEFAULT 10,
    p_status TEXT DEFAULT 'available',
    p_type TEXT DEFAULT 'free',
    p_difficulty TEXT DEFAULT 'intermediate',
    p_bible_verse TEXT DEFAULT NULL,
    p_prayer TEXT DEFAULT NULL,
    p_practical_application TEXT DEFAULT NULL,
    p_tags TEXT[] DEFAULT '{}',
    p_icon TEXT DEFAULT NULL,
    p_color TEXT DEFAULT NULL,
    p_created_by UUID DEFAULT NULL
)
RETURNS meditations AS $$
DECLARE
    new_meditation meditations;
BEGIN
    -- Validar se a categoria existe
    IF NOT EXISTS (SELECT 1 FROM categories WHERE id = p_category_id) THEN
        RAISE EXCEPTION 'Categoria com ID % não encontrada', p_category_id;
    END IF;
    
    -- Inserir meditação
    INSERT INTO meditations (
        title,
        content,
        category_id,
        duration,
        status,
        type,
        difficulty,
        bible_verse,
        prayer,
        practical_application,
        tags,
        icon,
        color,
        created_by
    ) VALUES (
        p_title,
        p_content,
        p_category_id,
        p_duration,
        p_status,
        p_type,
        p_difficulty,
        p_bible_verse,
        p_prayer,
        p_practical_application,
        p_tags,
        p_icon,
        p_color,
        p_created_by
    )
    RETURNING * INTO new_meditation;
    
    RETURN new_meditation;
END;
$$ LANGUAGE plpgsql;

-- 8. Verificar estrutura final da tabela
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default,
    ordinal_position
FROM information_schema.columns 
WHERE table_name = 'meditations'
ORDER BY ordinal_position;

-- 9. Inserir dados de exemplo (opcional)
INSERT INTO meditations (
    title,
    content,
    category_id,
    duration,
    status,
    type,
    difficulty,
    bible_verse,
    prayer,
    practical_application,
    tags,
    icon,
    color
) VALUES 
(
    'Meditação de Exemplo',
    'Esta é uma meditação de exemplo para testar a estrutura da tabela.',
    (SELECT id FROM categories LIMIT 1),
    15,
    'available',
    'free',
    'intermediate',
    'Salmo 1:1-2',
    'Senhor, ajuda-me a meditar em tua palavra.',
    'Aplicar os ensinamentos desta meditação no dia a dia.',
    ARRAY['exemplo', 'teste'],
    '📖',
    '#7ee787'
)
ON CONFLICT (id) DO NOTHING;

-- 10. Verificar dados inseridos
SELECT 
    id,
    title,
    category_id,
    duration,
    status,
    created_at
FROM meditations 
ORDER BY created_at DESC 
LIMIT 5;

-- Comentários sobre a estrutura:
/*
ESTRUTURA DA TABELA MEDITATIONS:

Campos Principais:
- id: UUID único da meditação
- title: Título da meditação
- content: Conteúdo/texto da meditação
- category_id: Referência para a tabela categories

Campos de Configuração:
- duration: Duração em minutos (padrão: 10)
- status: Status da meditação (available, locked, etc.)
- type: Tipo da meditação (free, premium, etc.)
- difficulty: Dificuldade (beginner, intermediate, advanced)
- is_active: Se a meditação está ativa
- sort_order: Ordem de exibição

Campos de Conteúdo Espiritual:
- bible_verse: Versículo bíblico relacionado
- prayer: Oração da meditação
- practical_application: Aplicação prática

Campos de Metadados:
- tags: Array de tags
- icon: Ícone da meditação
- color: Cor da meditação

Campos de Controle:
- created_at: Data de criação
- updated_at: Data de atualização (atualizada automaticamente)
- created_by: ID do usuário que criou
- version: Versão da meditação
- is_deleted: Soft delete

Índices Criados:
- category_id: Para consultas por categoria
- status: Para filtrar por status
- type: Para filtrar por tipo
- is_active: Para filtrar ativas/inativas
- created_at: Para ordenação por data
- sort_order: Para ordenação personalizada
*/ 