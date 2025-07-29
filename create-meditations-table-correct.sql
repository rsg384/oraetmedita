-- SQL para criar a tabela meditations no Supabase com as categorias corretas
-- Execute este código no SQL Editor do Supabase

-- Criar tabela meditations
CREATE TABLE meditations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  duration_minutes INTEGER DEFAULT 15,
  difficulty_level VARCHAR(20) DEFAULT 'beginner',
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES users(id),
  tags TEXT[]
);

-- Criar índices
CREATE INDEX idx_meditations_category_id ON meditations(category_id);
CREATE INDEX idx_meditations_status ON meditations(status);
CREATE INDEX idx_meditations_created_by ON meditations(created_by);
CREATE INDEX idx_meditations_title ON meditations(title);

-- Criar função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_meditations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Criar trigger para updated_at
CREATE TRIGGER update_meditations_updated_at 
    BEFORE UPDATE ON meditations 
    FOR EACH ROW 
    EXECUTE FUNCTION update_meditations_updated_at();

-- Inserir meditações de exemplo com as categorias corretas
INSERT INTO meditations (title, content, category_id, duration_minutes, difficulty_level, status, created_by) VALUES
(
  'Princípios da Vida Sobrenatural',
  'Nesta meditação, vamos refletir sobre os princípios fundamentais da vida espiritual. A graça de Deus é o dom gratuito que nos permite participar da vida divina. Como ramos da videira verdadeira, somos chamados a permanecer em Cristo para dar frutos abundantes. A vida sobrenatural não é algo distante ou inacessível, mas uma realidade presente que transforma nossa existência diária.',
  (SELECT id FROM categories WHERE name = 'Vida Sobrenatural' LIMIT 1),
  12,
  'beginner',
  'active',
  (SELECT id FROM users WHERE email = 'test@example.com' LIMIT 1)
),
(
  'A Humildade de Maria',
  'Maria, a Mãe de Deus, nos ensina a humildade através de sua resposta ao anjo Gabriel: "Eis aqui a serva do Senhor. Faça-se em mim segundo a tua palavra." Nesta meditação, vamos contemplar como Maria se colocou totalmente nas mãos de Deus, aceitando com fé e coragem o plano divino para sua vida. Sua humildade nos inspira a confiar mais profundamente na providência de Deus.',
  (SELECT id FROM categories WHERE name = 'Mariologia' LIMIT 1),
  15,
  'intermediate',
  'active',
  (SELECT id FROM users WHERE email = 'test@example.com' LIMIT 1)
),
(
  'A Oração do Pai Nosso',
  'Jesus nos ensina a orar com o Pai Nosso, uma oração que começa reconhecendo a paternidade de Deus e sua santidade. Esta meditação nos guia através de cada petição da oração do Senhor, ajudando-nos a compreender o significado profundo de cada palavra. A oração não é apenas uma prática religiosa, mas um diálogo íntimo com nosso Pai celestial.',
  (SELECT id FROM categories WHERE name = 'Oração' LIMIT 1),
  18,
  'beginner',
  'active',
  (SELECT id FROM users WHERE email = 'test@example.com' LIMIT 1)
);

-- Verificar se funcionou
SELECT 'Tabela meditations criada com sucesso!' as status; 