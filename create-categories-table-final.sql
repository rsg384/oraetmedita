-- SQL para criar a tabela categories no Supabase com as categorias corretas do backup
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

-- Inserir categorias corretas do sistema (baseado no backup oraetmedita_backup_2025-07-28 (7).json)
INSERT INTO categories (name, description, icon, color, sort_order) VALUES
(
  'Salmos',
  'Orações inspiradas que elevam a alma e ensinam a confiar e louvar ao Senhor.',
  '',
  '#7ee787',
  1
),
(
  'Jaculatórias',
  'Meditações breves e cheias de fé para elevar o coração a Deus ao longo do dia.',
  '',
  '#7ee787',
  2
),
(
  'Evangelho do dia',
  'Medite o Evangelho e conheça a vida, mistérios e milagres da vida de Jesus.',
  '',
  '#7ee787',
  3
),
(
  'Imitação de Cristo',
  'A obra de Tomás Kempis e desperte em você o desejo de imitar a Cristo.',
  '',
  '#7ee787',
  4
),
(
  'Amigos de Cristo',
  'Medite todos os dias grandes ensinamentos católicos.',
  '',
  '#7ee787',
  5
),
(
  'A vida espiritual',
  'Conheça e medite os alicerces da nossa vida espritual.',
  '',
  '#7ee787',
  6
),
(
  'A perfeição cristã',
  'Aprofundar e meditar o caminho da perfeição cristã.',
  '',
  '#7ee787',
  7
),
(
  'Virtudes Morais',
  'Meditar as virtudes que retira os obstáculos para amar a Deus.',
  '',
  '#7ee787',
  8
),
(
  'Virtudes Teologais',
  'A fé, a esperança e o amor como as principais virtudes para a santidade.',
  '',
  '#7ee787',
  9
),
(
  'Os dons do Espírito Santo',
  'Os dons do Espírito Santo para receber as inspirações do Espírito.',
  '',
  '#7ee787',
  10
);

-- Verificar se funcionou
SELECT 'Tabela categories criada com sucesso!' as status; 