-- SQL para criar a tabela categories no Supabase com as categorias corretas
-- Execute este código no SQL Editor do Supabase

-- Criar tabela categories
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  icon VARCHAR(10),
  color VARCHAR(7),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  sort_order INTEGER DEFAULT 0
);

-- Criar índices
CREATE INDEX idx_categories_name ON categories(name);
CREATE INDEX idx_categories_is_active ON categories(is_active);
CREATE INDEX idx_categories_sort_order ON categories(sort_order);

-- Criar função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_categories_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Criar trigger para updated_at
CREATE TRIGGER update_categories_updated_at 
    BEFORE UPDATE ON categories 
    FOR EACH ROW 
    EXECUTE FUNCTION update_categories_updated_at();

-- Inserir categorias corretas do sistema
INSERT INTO categories (name, description, icon, color, sort_order) VALUES
(
  'Vida Sobrenatural',
  'Meditações sobre a vida espiritual e a graça de Deus',
  '📖',
  '#8B5CF6',
  1
),
(
  'Mariologia',
  'Meditações sobre Nossa Senhora e sua devoção',
  '💝',
  '#EC4899',
  2
),
(
  'Oração',
  'Meditações sobre a vida de oração e intimidade com Deus',
  '🙏',
  '#3B82F6',
  3
);

-- Verificar se funcionou
SELECT 'Tabela categories criada com sucesso!' as status; 