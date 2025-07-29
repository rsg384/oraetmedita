-- SQL para criar a tabela categories no Supabase
-- Execute este código no SQL Editor do Supabase

-- Criar tabela categories
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  icon VARCHAR(50),
  color VARCHAR(7) DEFAULT '#7ee787',
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

-- Inserir categorias padrão
INSERT INTO categories (name, description, icon, color, sort_order) VALUES
('Amor de Deus', 'Meditações sobre o amor divino', '❤️', '#ff6b6b', 1),
('Fé', 'Reflexões sobre a fé católica', '✝️', '#4ecdc4', 2),
('Paz', 'Meditações para encontrar paz interior', '🕊️', '#45b7d1', 3),
('Coragem', 'Reflexões sobre coragem e força', '⚔️', '#96ceb4', 4),
('Misericórdia', 'Meditações sobre a misericórdia divina', '🙏', '#feca57', 5);

-- Verificar se funcionou
SELECT 'Tabela categories criada com sucesso!' as status; 