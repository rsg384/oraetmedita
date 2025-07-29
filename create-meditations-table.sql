-- SQL para criar a tabela meditations no Supabase
-- Execute este código no SQL Editor do Supabase

-- Criar tabela meditations
CREATE TABLE meditations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  duration_minutes INTEGER DEFAULT 12,
  difficulty_level VARCHAR(20) DEFAULT 'beginner',
  status VARCHAR(20) DEFAULT 'active',
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  metadata JSONB DEFAULT '{}'
);

-- Criar índices
CREATE INDEX idx_meditations_category_id ON meditations(category_id);
CREATE INDEX idx_meditations_status ON meditations(status);
CREATE INDEX idx_meditations_difficulty_level ON meditations(difficulty_level);
CREATE INDEX idx_meditations_created_by ON meditations(created_by);
CREATE INDEX idx_meditations_sort_order ON meditations(sort_order);
CREATE INDEX idx_meditations_is_active ON meditations(is_active);

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

-- Inserir algumas meditações de exemplo (baseado nas categorias existentes)
INSERT INTO meditations (title, content, category_id, duration_minutes, difficulty_level, sort_order) VALUES
(
  'Salmo 23 - O Senhor é meu Pastor',
  'O Senhor é meu pastor, nada me faltará. Deitar-me faz em verdes pastos, guia-me mansamente a águas tranquilas. Refrigera a minha alma; guia-me pelas veredas da justiça, por amor do seu nome. Ainda que eu andasse pelo vale da sombra da morte, não temeria mal algum, porque tu estás comigo; a tua vara e o teu cajado me consolam. Preparas uma mesa perante mim na presença dos meus inimigos, unges a minha cabeça com óleo, o meu cálice transborda. Certamente que a bondade e a misericórdia me seguirão todos os dias da minha vida; e habitarei na casa do Senhor por longos dias.',
  (SELECT id FROM categories WHERE name = 'Salmos' LIMIT 1),
  15,
  'beginner',
  1
),
(
  'Jaculatória da Manhã',
  'Ó Jesus, manso e humilde de coração, fazei o meu coração semelhante ao vosso. Que eu possa começar este dia com gratidão e amor, buscando sempre fazer a vossa vontade. Amém.',
  (SELECT id FROM categories WHERE name = 'Jaculatórias' LIMIT 1),
  5,
  'beginner',
  1
),
(
  'Evangelho de João 3:16 - O Amor de Deus',
  'Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito, para que todo aquele que nele crê não pereça, mas tenha a vida eterna. Medite sobre o infinito amor de Deus por cada um de nós.',
  (SELECT id FROM categories WHERE name = 'Evangelho do dia' LIMIT 1),
  12,
  'beginner',
  1
),
(
  'Imitação de Cristo - Capítulo 1',
  'Quem me segue, não anda nas trevas, diz o Senhor. Estas são as palavras de Cristo, pelas quais somos exortados a imitar a sua vida e costumes, se queremos ser verdadeiramente iluminados e livres de toda a cegueira do coração.',
  (SELECT id FROM categories WHERE name = 'Imitação de Cristo' LIMIT 1),
  20,
  'intermediate',
  1
),
(
  'Amigos de Cristo - São Francisco de Assis',
  'Senhor, fazei de mim um instrumento da vossa paz. Onde houver ódio, que eu leve o amor. Onde houver ofensa, que eu leve o perdão. Onde houver discórdia, que eu leve a união. Onde houver dúvida, que eu leve a fé.',
  (SELECT id FROM categories WHERE name = 'Amigos de Cristo' LIMIT 1),
  15,
  'beginner',
  1
),
(
  'A Vida Espiritual - Fundamentos',
  'A vida espiritual começa com a oração. A oração é a elevação da mente e do coração a Deus. Sem oração, não há vida espiritual verdadeira. Medite sobre a importância da oração em sua vida diária.',
  (SELECT id FROM categories WHERE name = 'A vida espiritual' LIMIT 1),
  18,
  'beginner',
  1
),
(
  'A Perfeição Cristã - Primeiros Passos',
  'A perfeição cristã não é um estado que se alcança de uma vez, mas um caminho que se percorre dia após dia. Começa com pequenos atos de amor e vai crescendo gradualmente.',
  (SELECT id FROM categories WHERE name = 'A perfeição cristã' LIMIT 1),
  20,
  'intermediate',
  1
),
(
  'Virtudes Morais - A Prudência',
  'A prudência é a virtude que nos ajuda a discernir o bem do mal e a escolher os meios adequados para alcançar o fim desejado. É a virtude que ilumina a inteligência para que possamos agir corretamente.',
  (SELECT id FROM categories WHERE name = 'Virtudes Morais' LIMIT 1),
  15,
  'intermediate',
  1
),
(
  'Virtudes Teologais - A Fé',
  'A fé é a virtude teologal pela qual cremos em Deus e em tudo o que Ele nos revelou. É um dom de Deus, uma resposta livre do homem ao chamado divino. Medite sobre a importância da fé em sua vida.',
  (SELECT id FROM categories WHERE name = 'Virtudes Teologais' LIMIT 1),
  18,
  'beginner',
  1
),
(
  'Os Dons do Espírito Santo - Sabedoria',
  'O dom da sabedoria nos permite ver as coisas como Deus as vê, com os olhos da fé. É um dom que nos ajuda a julgar retamente sobre as coisas divinas e humanas.',
  (SELECT id FROM categories WHERE name = 'Os dons do Espírito Santo' LIMIT 1),
  20,
  'intermediate',
  1
);

-- Verificar se funcionou
SELECT 'Tabela meditations criada com sucesso!' as status; 