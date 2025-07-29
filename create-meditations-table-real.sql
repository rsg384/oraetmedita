-- SQL para criar a tabela meditations no Supabase com as meditações reais do backup
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
  metadata JSONB DEFAULT '{}',
  reading TEXT,
  prayer TEXT,
  contemplation TEXT
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

-- Inserir meditações reais do backup (baseado em oraetmedita_backup_2025-07-28 (7).json)
INSERT INTO meditations (title, content, category_id, duration_minutes, difficulty_level, sort_order, reading, prayer, contemplation) VALUES
(
  'Salmo 1',
  'A oração do Salmo 1 convida a continuar a leitura do Livro dos Salmos, pois é nele que encontramos os sentimentos de louvor, gratidão e veneração que o povo eleito é chamado a cultivar diante da Lei de Deus, junto com o apelo para conhecê-la, meditá-la e vivê-la concretamente. É um convite a viver segundo a Lei Divina. O homem justo se distingue, sobretudo, por sua conduta, ao contrário dos que desprezam a Lei do Senhor. As palavras "andar", "deter" e "assentar" indicam três estágios sucessivos de afastamento do caminho reto. As possibilidades do caminho do pecado se apresentam em etapas: primeiro, seguir o conselho dos ímpios; depois, imitar seu exemplo; e por fim, participar da zombaria contra o que é sagrado. A imagem da árvore frondosa representa a prosperidade e o verdadeiro bem-estar. O verdadeiro prazer está em cumprir a vontade de Deus; meditar constantemente sobre seus mandamentos é o bem mais desejável da vida. O homem daquele tempo não possuía uma vontade divina clara e fixa como guia, por isso encontrava felicidade na Lei. Também nós devemos nos submeter continuamente à vontade de Deus, deixando que ela nos penetre até se tornar uma segunda natureza, preenchendo toda a nossa existência. É preciso estar abertos à vontade divina, através da oração, pois nela nasce a verdadeira felicidade, e por meio dela a vida encontra o sentido e o valor que Deus deseja para nós. Quem busca a vontade divina e obedece à Lei do Senhor tem a confiança de que tudo o que empreender será bem-sucedido. Não se trata de uma fé calculista em recompensas, nem de uma busca por retornos humanos ou materiais, mas da alegria superior de estar em comunhão com Deus.',
  (SELECT id FROM categories WHERE name = 'Salmos' LIMIT 1),
  12,
  'beginner',
  1,
  '1. Bem-aventurado o homem que não anda segundo o conselho dos ímpios, nem se detém no caminho dos pecadores, nem se assenta na roda da maldade. 2. Mas o seu prazer está na lei do Senhor, e na sua lei medita de dia e de noite. 3. E ele será como uma árvore plantada junto a ribeiros de águas, a qual dará o seu fruto no seu tempo, e a sua folha não murchará; e tudo o que fizer prosperará. 4. Não são assim os ímpios, não são assim, mas são como o pó que o vento levanta da face da terra. 5. Portanto os ímpios não se levantarão no juízo, nem os pecadores no conselho dos justos. 6. Porque o Senhor conhece o caminho dos justos, mas o caminho dos ímpios perecerá.',
  'Senhor, não quero trilhar o caminho do pecado. Ajuda-me a afastar-me do mal e daqueles que possam me levar a pecar. Peço perdão pelos meus pecados e por ter andado tanto tempo longe dos teus caminhos. Desejo descobrir, a cada dia, o prazer e a verdadeira alegria de viver segundo tua vontade, sendo transformado por tua palavra, meu Deus.',
  'Silencie alguns minutos diante de Deus. Escute Deus te falando... Deixe sua Palavra ressoar dentro do seu coração. Lance curtas e afetuosas orações para Ele. Deixe ele te amar. Experimente o seu amor.'
),
(
  'Salmo 2',
  'Os versículos 1-3, apresenta a rebelião das nações contra Deus e seu Ungido, expressando perplexidade diante da insensatez humana: "Por que se amotinam as nações?" (Sl 2,1). Essa revolta, segundo a tradição, aponta para o rei de Israel como representante de Deus (cf. 1Sm 16,13) e, à luz cristã, se refere ao Messias, Jesus Cristo. São Josemaria Escrivá comenta: "Se opunham a Cristo antes de que nascesse… o perseguiram depois e agora" (Es Cristo que passa, n. 185), mostrando a continuidade da rejeição ao Ungido ao longo da história. Teologicamente, trata-se de uma tentativa inútil de romper o domínio de Deus, pois os planos dos homens "não passam de tentativas vãs" (cf. Sl 2,1-3). Meditar esse salmo hoje é reconhecer que as mesmas forças de oposição a Deus continuam atuando em nossa cultura, estruturas sociais e até mesmo em nossos corações. As palavras de Escrivá nos ajudam a não nos escandalizarmos com a perseguição, mas a vê-la como um eco de algo que "nada tem de novo": o ódio ao Cristo. Contudo, a esperança permanece. O salmo é, ao mesmo tempo, denúncia da rebelião e anúncio da vitória do Ungido. Ele nos convida a sair do tumulto das vozes humanas e escutar, no silêncio da fé, a palavra firme de Deus que unge e sustenta Seu Rei — e com Ele, todos os que Nele confiam.',
  (SELECT id FROM categories WHERE name = 'Salmos' LIMIT 1),
  12,
  'beginner',
  2,
  '1. Salmo de Davi. Por que as nações se enfurecem e os povos planejam coisas vãs? 2.Os reis da terra se levantaram, e os governantes se ajuntaram contra o Senhor e contra o seu ungido. 3. Rompamos as suas ataduras e sacudamos de nós o seu jugo. 4. Aquele que habita no céu se rirá deles, e o Senhor zombará deles. 5. Então ele falará com eles em sua ira e os perturbará em sua fúria. 6. Mas eu fui constituído rei por ele em Sião, seu santo monte, para pregar seus mandamentos. 7. O Senhor me disse: "Tu és meu filho; hoje te gerei." 8. Pede-me, e eu te darei as nações por herança e as extremidades da terra por tua possessão. 9. Tu os regerás com vara de ferro e os quebrarás como a um vaso de oleiro.',
  'Senhor, dá-me força para resistir às forças que se levantam contra Ti e contra mim. Concede-me a graça de discernir tudo aquilo que se opõe à minha fé e coragem para rejeitar, com firmeza e paz, o que me afasta de Ti. Tu és meu Deus, a quem hoje, mais uma vez, escolho seguir com fidelidade.',
  'Silencie diante de Deus e busque contemplar o seu poder e sua glória. Perceba o poder de Deus que age em sua alma. Desfrute da glória de Deus que te envolve. Escute Ele te falar. Ame-o e deixe ser amado.'
),
(
  'Para falarmos com Deus Pai',
  'Essa jaculatória quer ser uma ponte que nos conduz a lembrar e a falar com Deus Pai. Depois de rezá-la, recite também o Pai-Nosso e converse espontaneamente com o Pai. No Pai-Nosso, descobrimos quem somos: filhos muito amados, chamados a viver no amor e na confiança. Nesta jaculatória temos a oportunidade de realizar um ato de amor, de louvor e de súplica ao Pai, para crescermos em intimidade e devoção a Ele. Ao rezarmos, no Pai Nosso, "santificado seja o vosso nome", deixemos que Sua santidade habite em nós. E também, que o Seu Reino venha e transforme nossa vida aqui, agora. Pedir o pão de cada dia é confiar tudo ao Pai: as necessidades do corpo e da alma. E ao suplicarmos o perdão, abramos o coração para também perdoar. Que não guardemos mágoas — o perdão abre espaço para a graça permanecer. E quando pedirmos que Ele nos livre do mal, reconheçamos: sem Ele, somos fracos.',
  (SELECT id FROM categories WHERE name = 'Jaculatórias' LIMIT 1),
  12,
  'beginner',
  1,
  '"Pai, eu Te amo. Toda honra e glória sejam dadas a Ti. Livra-nos de todo o mal, hoje e sempre."',
  '"Pai, eu Te amo. Toda honra e glória sejam dadas a Ti. Livra-nos de todo o mal, hoje e sempre."',
  'Contemple ao seu redor a beleza e da perfeição das coisas e das pessoas, reflexo da beleza de Deus. Escute a voz de Deus nas coisas simples que acontece durante o seu dia. Aproveite para dizer algumas vezes esta jaculatória buscando falar com nosso Pai dos céus.'
),
(
  'Para honrar Maria e pedir sua intercessão',
  'Esta jaculatória ajuda-nos a lembrar de nossa Mãe e da oração da Ave Maria. Cada vez que a pronunciamos com amor, oferecemos a Ela uma rosa espiritual de louvor, afeto e súplica, reconhecendo-a como nossa Mãe do Céu. Ao dizermos "Ave Maria, cheia de graça", somos conduzidos ao mistério de Maria, mediadora de toda graça. Ela nos escuta com ternura, como verdadeira Mãe, intercedendo por nós diante de Deus. Seu nome, Maria, significa "Senhora da luz", pois é fonte de sabedoria e brilho para os que a invocam com fé. E ao dizer "bendita sois vós entre as mulheres", recordamos a misericórdia que a escolheu como a mais feliz das criaturas. Ao exaltarmos o "fruto do vosso ventre, Jesus", glorificamos também a Jesus nosso Salvador. Com esta jaculatória, queremos manter viva a lembrança de Maria, invocando sua poderosa intercessão, consagrando-nos a ela e despertando em nós um maior desejo de rezar com fé e devoção a oração da Ave Maria.',
  (SELECT id FROM categories WHERE name = 'Jaculatórias' LIMIT 1),
  12,
  'beginner',
  2,
  '"Maria, minha Mãe, intercede por nós. Eu me consagro a Ti, sou todo Teu. Cuida de mim, Mãe de Deus e minha Mãe."',
  '"Maria, minha Mãe, intercede por nós. Eu me consagro a Ti, sou todo Teu. Cuida de mim, Mãe de Deus e minha Mãe."',
  'Se coloque diante de Deus como Maria, em um produndo silencio adorador. Una-se com nossa Mãe Maria, para aprendermos com ela a contemplarmos a Deus e assim fazermos aquilo que faremos um dia eternamente no céu. Adore ao Senhor. Escute sua voz. Se proponha hoje a fazer aquilo que Ele te pede. Ame-o com todo seu coração.'
),
(
  'Para adorar a Deus com os anjos e santos',
  'Os anjos que cercam o trono do Deus Uno e Trino jamais cessam de cantar: "Santo, Santo, Santo" (cfr. Is 6,3; Ap 4,8). Nós, que aspiramos a viver como os anjos no Céu, somos chamados a aprender, já nesta vida, essa oração de louvor. A repetição da palavra "santo" enfatiza a santidade e a pureza de Deus, que é distinto e separado de todas as coisas criadas. "Deus do universo": reconhece a onisciência e o poder de Deus sobre todasas coisas. "O céu e a terra proclamam a vossa glória": indica que a glória de Deus é reconhecida e proclamada tanto no céu como na terra. "Hosana nas alturas": uma exclamação de louvor e adoração. "Bendito o que vem em nome do Senhor": uma referência a Jesus Cristo. Ao entoarmos essa proclamação, unimo-nos ao louvor eterno, antecipando a adoração que um dia viveremos na glória divina, mantendo nossos corações voltados para o essencial: amar e glorificar a Deus sem cessar.',
  (SELECT id FROM categories WHERE name = 'Jaculatórias' LIMIT 1),
  12,
  'beginner',
  3,
  '"Santo, Santo, Santo é o Senhor, Deus do universo! O céu e a terra proclamam A vossa glória. Hosana nas alturas! Bendito o que vem em Nome do Senhor! Hosana nas alturas!"',
  '"Santo, Santo, Santo é o Senhor, Deus do universo! O céu e a terra proclamam A vossa glória. Hosana nas alturas! Bendito o que vem em Nome do Senhor! Hosana nas alturas!"',
  'Se coloque na presença de Deus, silencie o seu coração e perceba a presença de Deus. No silêncio podemos perceber mais profundamente nossas qualidades e nossos más inclinações para podermos ordenar tudo em Deus. No silêncio ouvimos mais nitidamente a voz de Deus para podermos orientar nossas vidas. Silencie, adore, ame ao nosso Deus.'
);

-- Verificar se funcionou
SELECT 'Tabela meditations criada com sucesso com as meditações reais do backup!' as status; 