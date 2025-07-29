// API do ChatGPT para Geração de Meditações Lectio Divina
// Implementação limpa e direta seguindo as especificações do usuário

class ChatGPTAPI {
    constructor() {
        this.config = window.API_CONFIG.OPENAI;
    }

    // Verificar status da API
    async checkAPIStatus() {
        try {
            console.log('🔍 Verificando status da API do ChatGPT...');
            
            const response = await fetch(`${this.config.BASE_URL}/models`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${this.config.API_KEY}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                console.log('✅ API do ChatGPT está funcionando');
                return { status: 'success', message: 'API funcionando' };
            } else {
                console.error('❌ API do ChatGPT retornou erro:', response.status);
                return { status: 'error', message: `Erro ${response.status}: ${response.statusText}` };
            }
        } catch (error) {
            console.error('❌ Erro ao verificar API:', error);
            return { status: 'error', message: error.message };
        }
    }

    // Gerar meditação simples com ChatGPT
    async generateMeditations(topic) {
        try {
            console.log('🚀 Gerando meditação simples para:', topic);
            
            // Prompt simplificado para uma única meditação
            const prompt = `Crie uma meditação católica sobre o tema: "${topic}". 

A meditação deve ter:
- Um título inspirador
- Texto de aproximadamente 30 linhas
- Estilo meditativo e contemplativo
- Linguagem acessível e espiritual
- Foco na tradição católica

REGRAS IMPORTANTES PARA REFERÊNCIAS:
1. Se você usar uma frase ORIGINAL de algum documento católico, coloque a referência no final da frase entre colchetes [ex: [Catecismo da Igreja Católica, n. 2559]]
2. Se for uma composição ou inspiração baseada em documentos católicos, NÃO coloque referências
3. O texto deve ter entre 3 e 5 frases com referências (mínimo 3, máximo 5)
4. NUNCA retorne conteúdo contrário aos ensinamentos da doutrina católica, seus dogmas, tradição e Escritura
5. Consulte a pasta documents_catolicos para se inspirar na produção das meditações
6. O texto gerado deve ter um estilo DEVOCIONAL E MEDITATIVO, com linguagem que inspire reflexão interior e conexão espiritual

Formato desejado:
## Título da Meditação

[Texto da meditação com aproximadamente 30 linhas, estilo meditativo, texto justificado]

ATENÇÃO: Retorne apenas o título e o texto da meditação, sem seções adicionais.`;

            // Chamar API
            const response = await this.callChatGPT(prompt);
            
            if (!response || !response.choices || !response.choices[0] || !response.choices[0].message || !response.choices[0].message.content) {
                throw new Error('Resposta vazia da OpenAI');
            }
            
            const content = response.choices[0].message.content;
            console.log('📄 Conteúdo recebido:', content.substring(0, 200) + '...');
            
            // Processar a meditação
            return this.processSimpleMeditation(content, topic);
            
        } catch (error) {
            console.error('❌ Erro ao gerar meditação:', error);
            throw error;
        }
    }

    // Carregar documentos da pasta documents
    async loadDocuments() {
        const documents = [
            {
                title: 'Bíblia Sagrada - Evangelho de João',
                source: 'documents/biblia/',
                content: '"Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito, para que todo aquele que nele crê não pereça, mas tenha a vida eterna." (João 3:16) "Eu sou o caminho, a verdade e a vida. Ninguém vem ao Pai senão por mim." (João 14:6)'
            },
            {
                title: 'Catecismo da Igreja Católica',
                source: 'documents/catecismo/',
                content: 'A caridade é a virtude teologal pela qual amamos a Deus sobre todas as coisas por si mesmo, e a nosso próximo como a nós mesmos por amor de Deus. (CIC 1822)'
            },
            {
                title: 'Encíclica Deus Caritas Est',
                source: 'documents/enciclicas/',
                content: 'Deus é amor, e quem permanece no amor permanece em Deus e Deus nele. (1Jo 4,16) Esta é a essência da fé cristã.'
            },
            {
                title: 'Vida de São Francisco de Assis',
                source: 'documents/santos/',
                content: 'São Francisco de Assis ensinou que a humildade é o caminho para a santidade. "Senhor, fazei-me instrumento da vossa paz."'
            },
            {
                title: 'Teologia Espiritual',
                source: 'documents/teologia/',
                content: 'A Lectio Divina é um método de leitura orante da Sagrada Escritura que nos leva ao encontro com Deus através da meditação e contemplação.'
            }
        ];
        
        return documents;
    }

    // Criar prompt seguindo exatamente as especificações do usuário
    createMeditationPrompt(topic, documents) {
        const documentsContext = documents.map(doc => 
            `Documento: ${doc.title}\nFonte: ${doc.source}\nConteúdo: ${doc.content}`
        ).join('\n\n');

        // PROMPT FLEXÍVEL E EXPLÍCITO
        return `Você é um especialista em espiritualidade católica. Gere APENAS UMA meditação completa sobre o tema abaixo, estruturada em 4 partes: Leitura, Meditação, Oração e Contemplação. Se desejar, pode incluir um título, mas não é obrigatório. O importante é que as seções estejam claramente separadas, por exemplo:

## Leitura
(Trecho bíblico ou doutrinário)
## Meditação
(Reflexão)
## Oração
(Prece)
## Contemplação
(Silêncio)

REGRAS IMPORTANTES PARA REFERÊNCIAS:
1. Se você usar uma frase ORIGINAL de algum documento católico, coloque a referência no final da frase entre colchetes [ex: [Catecismo da Igreja Católica, n. 2559]]
2. Se for uma composição ou inspiração baseada em documentos católicos, NÃO coloque referências
3. Cada seção deve ter entre 3 e 5 frases com referências (mínimo 3, máximo 5)
4. NUNCA retorne conteúdo contrário aos ensinamentos da doutrina católica, seus dogmas, tradição e Escritura
5. Consulte a pasta documents_catolicos para se inspirar na produção das meditações
6. O texto gerado deve ter um estilo DEVOCIONAL E MEDITATIVO, com linguagem que inspire reflexão interior e conexão espiritual

DOCUMENTOS CATÓLICOS DISPONÍVEIS:
${documentsContext}

ATENÇÃO: NUNCA retorne resposta vazia. Sempre escreva as quatro seções, mesmo que breves. Se não souber o que colocar, escreva "(Em silêncio)" ou "(Reflexão breve)".

Assunto: ${topic}`;
    }

    // Chamar API do ChatGPT
    async callChatGPT(prompt) {
        try {
            console.log('📡 Fazendo chamada para API do ChatGPT...');
            
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.config.API_KEY}`
                },
                body: JSON.stringify({
                    model: this.config.MODEL,
                    messages: [
                        {
                            role: 'system',
                            content: 'Você é um especialista em espiritualidade católica e Lectio Divina. Responda sempre seguindo exatamente o formato solicitado. NUNCA retorne conteúdo contrário aos ensinamentos da doutrina católica, seus dogmas, tradição e Escritura. Use referências dos documentos católicos quando citar frases originais. Mantenha sempre um estilo DEVOCIONAL E MEDITATIVO que inspire reflexão interior e conexão espiritual.'
                        },
                        {
                            role: 'user',
                            content: prompt
                        }
                    ],
                    max_tokens: this.config.MAX_TOKENS,
                    temperature: this.config.TEMPERATURE
                })
            });
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ Erro na API:', response.status, errorText);
                throw new Error(`Erro na API: ${response.status} - ${errorText}`);
            }
            
            const data = await response.json();
            console.log('✅ Resposta da API recebida com sucesso');
            
            return data;
            
        } catch (error) {
            console.error('❌ Erro ao chamar API do ChatGPT:', error);
            throw error;
        }
    }

    // Processar meditação simples
    processSimpleMeditation(content, topic) {
        try {
            console.log('🔧 Processando meditação simples...');
            
            // Extrair título e conteúdo
            const lines = content.split('\n').filter(line => line.trim());
            let title = topic; // título padrão
            let meditationText = content;
            
            // Tentar extrair título se começar com ##
            if (lines[0] && lines[0].startsWith('##')) {
                title = lines[0].replace('##', '').trim();
                meditationText = lines.slice(1).join('\n').trim();
            }
            
            // Limpar o texto
            meditationText = this.cleanText(meditationText);
            
            // Criar objeto da meditação
            const meditation = {
                id: 'meditation-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
                title: title,
                topic: topic,
                content: meditationText,
                duration: '15 min',
                status: 'completed',
                createdAt: new Date().toISOString(),
                lastUpdated: new Date().toISOString(),
                source: 'chatgpt',
                type: 'simple'
            };
            
            console.log('✅ Meditação processada:', meditation.title);
            return {
                category: topic,
                meditations: [meditation]
            };
            
        } catch (error) {
            console.error('❌ Erro ao processar meditação simples:', error);
            throw error;
        }
    }

    // Processar resposta das meditações (mantido para compatibilidade)
    processMeditations(content, topic) {
        return this.processSimpleMeditation(content, topic);
    }

    // Extrair meditações do conteúdo
    extractMeditations(content) {
        const meditations = [];
        // Logar o conteúdo bruto para debug
        console.log('🟧 CONTEÚDO BRUTO RECEBIDO DO CHATGPT:\n', content.substring(0, 1500));
        // Aceitar variações: #, ##, ###, **, etc
        // Separar por títulos de tema (pode ser #, ##, ###, ou **TÍTULO**)
        const sections = content.split(/[#*]{1,3}\s*(.+)\n/).filter(section => section.trim());
        // Se não encontrar, tentar split por linhas que parecem título
        if (sections.length < 2) {
            // fallback: split por linhas em caixa alta ou com muitos espaços
            const fallbackSections = content.split(/\n(?=[A-ZÁÉÍÓÚÂÊÔÃÕÇ\s]{5,})/).filter(s => s.trim().length > 30);
            fallbackSections.forEach((section, index) => {
                const title = section.split('\n')[0].trim();
                const lectio = this.extractSection(section, 'Leitura');
                const meditatio = this.extractSection(section, 'Meditação');
                const oratio = this.extractSection(section, 'Oração');
                const contemplatio = this.extractSection(section, 'Contemplação');
                if (title && (lectio || meditatio || oratio || contemplatio)) {
                    meditations.push({
                        title: this.cleanText(title),
                        lectio: this.cleanText(lectio),
                        meditatio: this.cleanText(meditatio),
                        oratio: this.cleanText(oratio),
                        contemplatio: this.cleanText(contemplatio)
                    });
                }
            });
        } else {
            // método padrão
            for (let i = 0; i < sections.length; i += 2) {
                const title = sections[i].trim();
                const section = sections[i + 1] || '';
                const lectio = this.extractSection(section, 'Leitura');
                const meditatio = this.extractSection(section, 'Meditação');
                const oratio = this.extractSection(section, 'Oração');
                const contemplatio = this.extractSection(section, 'Contemplação');
                if (title && (lectio || meditatio || oratio || contemplatio)) {
                    meditations.push({
                        title: this.cleanText(title),
                        lectio: this.cleanText(lectio),
                        meditatio: this.cleanText(meditatio),
                        oratio: this.cleanText(oratio),
                        contemplatio: this.cleanText(contemplatio)
                    });
                }
            }
        }
        console.log(`📖 Extraídas ${meditations.length} meditações do conteúdo (parser flexível)`);
        return meditations.slice(0, 7); // Garantir apenas 7 meditações
    }

    // Extrair seção específica
    extractSection(content, sectionName) {
        const regex = new RegExp(`##\\s*\\*?${sectionName}\\*?\\s*\\n([\\s\\S]*?)(?=##|$)`, 'i');
        const match = content.match(regex);
        if (!match) return '';
        
        let sectionContent = match[1].trim();
        
        // Preservar formatação específica para cada seção
        if (sectionName.toLowerCase() === 'leitura') {
            // Manter itálico para leitura
            sectionContent = sectionContent.replace(/\*(.*?)\*/g, '<em>$1</em>');
        } else if (sectionName.toLowerCase() === 'meditação') {
            // Formatar meditação com negrito para "Meditando:"
            sectionContent = sectionContent
                .replace(/\*(.*?)\*/g, '<em>$1</em>')
                .replace(/\*\*Meditando:\*\*/g, '<strong>Meditando:</strong>');
        } else if (sectionName.toLowerCase() === 'oração') {
            // Formatar oração com negrito para "Meditando:" e "Orando:"
            sectionContent = sectionContent
                .replace(/\*(.*?)\*/g, '<em>$1</em>')
                .replace(/\*\*Meditando:\*\*/g, '<strong>Meditando:</strong>')
                .replace(/\*\*Orando:\*\*/g, '<strong>Orando:</strong>');
        } else if (sectionName.toLowerCase() === 'contemplação') {
            // Manter formatação simples para contemplação
            sectionContent = sectionContent.replace(/\*\*/g, '');
        }
        
        return sectionContent;
    }

    // Limpar texto preservando formatação HTML
    cleanText(text) {
        if (!text) return '';
        
        return text
            .replace(/##\s*/g, '')
            .replace(/###\s*/g, '')
            .replace(/`/g, '')
            .replace(/\n\s*\n\s*\n/g, '\n\n')
            .replace(/\n\s*\n/g, '\n\n')
            .trim();
    }
}

// Instância global
const chatGPTAPI = new ChatGPTAPI();

// Função global para compatibilidade
async function generateMeditations(topic) {
    try {
        console.log('🚀 Função global generateMeditations chamada para:', topic);
        const result = await chatGPTAPI.generateMeditations(topic);
        console.log('✅ Resultado da função global:', result);
        return result;
    } catch (error) {
        console.error('❌ Erro na função global generateMeditations:', error);
        throw error;
    }
}

// Função global para verificar status da API
async function checkAPIStatus() {
    try {
        console.log('🔍 Função global checkAPIStatus chamada');
        const result = await chatGPTAPI.checkAPIStatus();
        console.log('✅ Status da API:', result);
        return result;
    } catch (error) {
        console.error('❌ Erro na função global checkAPIStatus:', error);
        throw error;
    }
} 