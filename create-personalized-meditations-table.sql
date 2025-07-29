-- SQL para criar a tabela personalized_meditations no Supabase
-- Execute este código no SQL Editor do Supabase

-- Criar tabela personalized_meditations
CREATE TABLE personalized_meditations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meditation_id VARCHAR(255) NOT NULL, -- ID único da meditação (ex: meditation-1753739328247-zj3fw1ix6)
  title VARCHAR(500) NOT NULL,
  topic VARCHAR(255),
  content TEXT NOT NULL,
  duration VARCHAR(20) DEFAULT '15 min',
  status VARCHAR(50) DEFAULT 'pending', -- pending, completed, in_progress
  source VARCHAR(50) DEFAULT 'chatgpt', -- chatgpt, manual, etc.
  type VARCHAR(50) DEFAULT 'simple', -- simple, advanced, etc.
  user_id VARCHAR(255) NOT NULL, -- ID do usuário que criou a meditação
  user_name VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_viewed TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}', -- Para dados adicionais
  is_active BOOLEAN DEFAULT true
);

-- Criar índices
CREATE INDEX idx_personalized_meditations_meditation_id ON personalized_meditations(meditation_id);
CREATE INDEX idx_personalized_meditations_user_id ON personalized_meditations(user_id);
CREATE INDEX idx_personalized_meditations_topic ON personalized_meditations(topic);
CREATE INDEX idx_personalized_meditations_status ON personalized_meditations(status);
CREATE INDEX idx_personalized_meditations_source ON personalized_meditations(source);
CREATE INDEX idx_personalized_meditations_created_at ON personalized_meditations(created_at);
CREATE INDEX idx_personalized_meditations_is_active ON personalized_meditations(is_active);

-- Criar função para atualizar last_updated
CREATE OR REPLACE FUNCTION update_personalized_meditations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.last_updated = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Criar trigger para last_updated
CREATE TRIGGER update_personalized_meditations_updated_at 
    BEFORE UPDATE ON personalized_meditations 
    FOR EACH ROW 
    EXECUTE FUNCTION update_personalized_meditations_updated_at();

-- Inserir dados de exemplo baseados no arquivo JSON
INSERT INTO personalized_meditations (
  meditation_id, title, topic, content, duration, status, source, type, 
  user_id, user_name, created_at, last_updated, last_viewed, completed_at
) VALUES
(
  'meditation-1753739328247-zj3fw1ix6',
  'A Paz que Transcende Todo Entendimento',
  'paz',
  'Em meio ao tumulto da vida cotidiana, encontramos um convite divino à paz, uma paz que não é apenas a ausência de conflitos, mas uma presença viva que nos envolve e nos transforma. Jesus, o Príncipe da Paz, nos oferece a sua serenidade, como está escrito: "Deixo-vos a paz, a minha paz vos dou; não a dou como o mundo a dá" (Jo 14,27). Que belo é saber que a verdadeira paz brota do coração de Deus e se irradia em nossas almas!

Ao contemplar esta paz, somos chamados a entrar em um estado de quietude interior. Feche os olhos e respire profundamente. Sinta o ar entrar e sair, como um fluxo de graça que purifica suas preocupações e medos. Medite sobre as palavras do Salmo: "Em Deus está a minha salvação e a minha glória; a rocha da minha força, em Deus está a minha confiança" (Sl 62,7). Através dessa confiança, encontramos um abrigo seguro, um lugar onde a agitação do mundo não pode nos alcançar.

A paz também nos convida à reconciliação. À medida que nos aproximamos do Senhor em oração, somos chamados a perdoar e a deixar ir as mágoas que nos aprisionam. "Bem-aventurados os pacificadores, porque serão chamados filhos de Deus" (Mt 5,9). Que possamos ser instrumentos de paz em nossas famílias, comunidades e entre os que nos cercam. Cada ato de amor e perdão é um passo na construção do Reino de Deus.

Que, ao longo do dia, possamos recordar que esta paz é um dom que deve ser cultivado. A oração é a chave que abre o nosso coração para recebê-la. "A paz de Deus, que excede todo entendimento, guardará os vossos corações e as vossas mentes em Cristo Jesus" (Fl 4,7). Assim, ao nos entregarmos à oração, deixamo-nos envolver por essa paz divina, que nos fortalece e nos guia.

Permita que a luz da paz de Cristo ilumine suas decisões e seus caminhos. Que a cada amanhecer, ao sairmos para o mundo, possamos ser reflexos da paz que recebemos do Senhor, contagando os outros com a doçura de sua presença. Que nossa vida seja um hino à paz, ecoando a harmonia do céu na terra. Amém.',
  '15 min',
  'completed',
  'chatgpt',
  'simple',
  'user_1753739115816',
  'rodrigo silva goes',
  '2025-07-28T21:48:48.248Z'::timestamp with time zone,
  '2025-07-28T21:48:48.248Z'::timestamp with time zone,
  '2025-07-29T01:57:51.721Z'::timestamp with time zone,
  '2025-07-29T01:54:09.412Z'::timestamp with time zone
),
(
  'meditation-1753739445247-t85ox6gcx',
  'A Luz da Esperança',
  'esperança',
  'Na caminhada da vida, a esperança é como uma luz que brilha nas trevas, guiando-nos por caminhos incertos. É o dom que Deus nos oferece, sustentando nossas almas em meio às tempestades e desafios. Quando olhamos para a cruz, vemos a plenitude da esperança que brota do amor incondicional de Cristo por nós. Ele nos ensina que, mesmo nas horas mais sombrias, podemos confiar na promessa de Sua ressurreição e na vida eterna. "A esperança não decepciona" (Romanos 5,5), pois é um presente do Espírito Santo que habita em nossos corações, fortalecendo-nos e nos encorajando a prosseguir.

Meditemos sobre as palavras do Senhor que nos dizem: "Não temas, porque eu estou contigo" (Isaías 41,10). Que essas palavras penetrem profundamente em nosso ser, lembrando-nos de que nunca estamos sozinhos. Ele nos convida a lançar sobre Ele todas as nossas ansiedades e preocupações, pois a esperança é a âncora de nossa alma, firme e segura (Hebreus 6,19). 

Em momentos de desilusão, quando o futuro parece incerto, voltemo-nos para a oração e a Palavra de Deus, que nos reanimam e renovam. A esperança é alimentada pela fé e pela confiança em Deus, que nunca falha em Suas promessas. Como está escrito: "Porque eu sei os planos que tenho para vocês, diz o Senhor" (Jeremias 29,11). Ele nos chama a confiar em Seu plano, mesmo quando não conseguimos ver o caminho à frente.

Que a nossa esperança seja um testemunho vivo do amor de Cristo, refletindo Sua luz para aqueles que nos rodeiam. Ao enfrentarmos as adversidades, lembremo-nos de que a esperança é um ato de fé que nos leva a acreditar que, após a noite, sempre vem a luz do dia. Que a nossa vida seja um eco da esperança que encontramos em Jesus, e que, através de nós, muitos possam conhecer a alegria de viver na confiança em um Deus que é fiel. Assim, firmemos nossos corações na esperança, pois ela é a certeza de que o melhor ainda está por vir. Que a paz de Cristo nos envolva e nos guie sempre.',
  '15 min',
  'pending',
  'chatgpt',
  'simple',
  'user_1753739115816',
  'rodrigo silva goes',
  '2025-07-28T21:50:45.247Z'::timestamp with time zone,
  '2025-07-28T21:50:45.247Z'::timestamp with time zone,
  '2025-07-28T22:02:11.031Z'::timestamp with time zone,
  NULL
),
(
  'meditation-1753739847958-xtuqvkko6',
  'O Abraço do Perdão',
  'perdao',
  'O perdão é um dom que nos é oferecido por Deus, um convite a libertar o coração das correntes do rancor e da amargura. Ao refletirmos sobre a profundidade desse ato, somos chamados a entrar no mistério do amor divino, que nos ensina que perdoar não é apenas uma ação, mas uma transformação interior. Jesus nos mostrou, em Seu exemplo, que o perdão é um ato de coragem, onde renunciamos ao desejo de vingança e acolhemos a graça que cura. Ele nos disse: "Perdoai, e sereis perdoados" (Lc 6,37). Esta é uma promessa que nos convida a viver em plenitude.

Ao olharmos para nossas próprias feridas, percebemos que o perdão é um bálsamo necessário. É na oração e na contemplação que encontramos a força para liberar aqueles que nos ofenderam, assim como Deus nos perdoa continuamente. Ao dizer "Pai, perdoa-lhes, porque não sabem o que fazem" (Lc 23,34), Jesus nos ensina que o perdão deve ir além das nossas limitações humanas. Através da Lectio Divina, somos chamados a meditar sobre as Escrituras e a abrir nossos corações para a ação do Espírito Santo, que nos capacita a perdoar verdadeiramente.

Neste caminho, é fundamental lembrar que o perdão é um processo. Não é uma questão de esquecer, mas de escolher não ser mais prisioneiro da dor. Como nos ensina o Catecismo, "o perdão é a resposta que devemos dar ao amor de Deus que se manifestou na cruz" [Catecismo da Igreja Católica, n. 2842]. Assim, ao perdoarmos, participamos da obra redentora de Cristo em nossas vidas e na vida dos outros.

Que possamos nos permitir viver o perdão, não apenas como um ato isolado, mas como um estilo de vida, refletindo a misericórdia de Deus em nossas ações diárias. Que, ao nos voltarmos para Deus em oração, possamos sentir a leveza que o perdão traz, e que nossos corações se abram para a paz que excede todo entendimento. O perdão nos liberta, nos transforma e nos aproxima de Deus, que é amor. Que este amor nos inspire a sermos instrumentos de paz, levando a mensagem do perdão ao mundo que tanto precisa.',
  '15 min',
  'completed',
  'chatgpt',
  'simple',
  'user_1753739115816',
  'rodrigo silva goes',
  '2025-07-28T21:57:27.958Z'::timestamp with time zone,
  '2025-07-28T21:57:27.958Z'::timestamp with time zone,
  NULL,
  NULL
),
(
  'meditation-1753741460797-ssn9stzdi',
  'A Fortaleza do Coração: Encontrando Força em Deus',
  'Força em Deus',
  'Em meio às tempestades da vida, quando as dificuldades parecem insuperáveis e o desânimo se instala, somos convidados a buscar a força que vem do Senhor. É na fragilidade que encontramos a verdadeira fortaleza, pois "quando sou fraco, então sou forte" (2 Coríntios 12, 10). Deus não nos chama a uma vida sem desafios, mas promete estar ao nosso lado em cada passo, sustentando-nos com Seu amor infinito.

Pensemos na figura de São Paulo, que, em suas tribulações, encontrou consolo e força na presença de Cristo. Ele nos ensina que, mesmo nas adversidades, podemos nos firmar na graça de Deus, que é suficiente para nós [Catecismo da Igreja Católica, n. 2012]. A força divina não é como a do mundo; ela nos reveste de coragem e esperança, permitindo que enfrentemos cada provação com fé.

Ao meditarmos sobre as Escrituras, encontramos promessas que nos encorajam: "Não temas, porque eu sou contigo; não te assombres, porque eu sou o teu Deus. Eu te fortaleço, e te ajudo, e te sustento com a destra da minha justiça" (Isaías 41, 10). Neste versículo, Deus nos assegura que Sua presença é a nossa fortaleza. Nos momentos de desânimo, voltemo-nos a Ele, abrindo nossos corações para receber a Sua luz e paz.

A Lectio Divina nos convida a contemplar a Palavra de Deus, permitindo que ela penetre em nosso ser. Ao refletirmos sobre essas promessas, podemos perceber que a força em Deus é um bálsamo que cura nossas feridas e nos revigora. "A alegria do Senhor é a nossa força" (Neemias 8, 10). Que possamos encontrar nesta verdade um motivo para nos alegrar, mesmo quando a vida nos desafia.

Assim, ao nos entregarmos ao Senhor e confiarmos em Sua providência, seremos fortalecidos em nossa fé. Que a cada dia possamos buscar a intimidade com Deus, que nos reveste de coragem e nos faz superar as dificuldades. Que a força em Deus seja o nosso alicerce, guiando-nos em cada passo e iluminando nosso caminho, até o dia em que veremos a plenitude de Sua glória.',
  '15 min',
  'pending',
  'chatgpt',
  'simple',
  'user_1753739115816',
  'rodrigo silva goes',
  '2025-07-28T22:24:20.799Z'::timestamp with time zone,
  '2025-07-28T22:24:20.799Z'::timestamp with time zone,
  NULL,
  NULL
);

-- Verificar se funcionou
SELECT 'Tabela personalized_meditations criada com sucesso!' as status; 