// API do ChatGPT para Geração de Meditações Lectio Divina
// Implementação limpa e direta seguindo as especificações do usuário

class ChatGPTAPI {
    constructor() {
        // Configuração híbrida: primeiro tenta localStorage, depois chave hardcoded
        this.config = {
            BASE_URL: 'https://api.openai.com/v1',
            MODEL: 'gpt-4o-mini',
            MAX_TOKENS: 4000,
            TEMPERATURE: 0.7
        };
        
        // Inicializar a chave da API
        this.initializeApiKey();
        
        console.log('🔧 ChatGPTAPI inicializada com sucesso');
    }

    // Inicializar a chave da API
    initializeApiKey() {
        const apiKey = this.getApiKey();
        this.config.API_KEY = apiKey;
        console.log('🔑 API Key inicializada:', apiKey ? apiKey.substring(0, 10) + '...' + apiKey.substring(apiKey.length - 4) : 'NÃO ENCONTRADA');
    }

    // Função para obter a chave da API de forma segura
    getApiKey() {
        console.log('🔍 Iniciando busca pela chave da API...');
        
        // 1. Primeiro, tentar obter do localStorage
        const storedKey = localStorage.getItem('openai_api_key');
        console.log('🔍 localStorage:', storedKey ? 'ENCONTRADO' : 'NÃO ENCONTRADO');
        if (storedKey && storedKey.startsWith('sk-')) {
            console.log('✅ Usando chave do localStorage');
            return storedKey;
        }
        
        // 2. Depois, usar a chave hardcoded (sua chave real)
        const hardcodedKey = "sk-proj-..."; // ⚠️ Chave removida por segurança
        console.log('🔍 Chave hardcoded:', hardcodedKey ? 'CONFIGURADA' : 'NÃO CONFIGURADA');
        if (hardcodedKey && hardcodedKey.startsWith('sk-')) {
            console.log('✅ Usando chave hardcoded');
            return hardcodedKey;
        }
        
        // 3. Por último, tentar window.getApiKey se disponível
        if (window.getApiKey && typeof window.getApiKey === 'function') {
            const windowKey = window.getApiKey();
            console.log('🔍 window.getApiKey:', windowKey ? 'DISPONÍVEL' : 'NÃO DISPONÍVEL');
            if (windowKey && windowKey.startsWith('sk-')) {
                console.log('✅ Usando chave do window.getApiKey');
                return windowKey;
            }
        }
        
        // 4. Fallback para chave padrão
        console.log('⚠️ Usando chave padrão (pode não funcionar)');
        return "YOUR_OPENAI_API_KEY_HERE";
    }

    // Verificar status da API
    async checkAPIStatus() {
        try {
            console.log('🔍 Verificando status da API do ChatGPT...');
            
            // Obter chave da API usando o método interno
            const apiKey = this.getApiKey();
            console.log('🔑 Chave obtida:', apiKey ? apiKey.substring(0, 10) + '...' + apiKey.substring(apiKey.length - 4) : 'NÃO ENCONTRADA');
            
            if (!apiKey || !apiKey.startsWith('sk-')) {
                console.error('❌ Chave da API não configurada ou inválida');
                return { status: 'error', message: 'Chave da API não configurada' };
            }
            
            console.log('🔑 Usando chave:', apiKey.substring(0, 10) + '...' + apiKey.substring(apiKey.length - 4));
            
            const response = await fetch(`${this.config.BASE_URL}/models`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                }
            });

            console.log('📡 Resposta da API:', response.status, response.statusText);

            if (response.ok) {
                const data = await response.json();
                console.log('✅ API do ChatGPT está funcionando. Modelos disponíveis:', data.data.length);
                return { status: 'success', message: 'API funcionando' };
            } else {
                const errorText = await response.text();
                console.error('❌ API do ChatGPT retornou erro:', response.status, errorText);
                return { status: 'error', message: `Erro ${response.status}: ${errorText}` };
            }
        } catch (error) {
            console.error('❌ Erro ao verificar API:', error);
            return { status: 'error', message: `Erro ao verificar API: ${error.message}` };
        }
    }

    // Gerar meditações baseadas em um tópico
    async generateMeditations(topic) {
        try {
            console.log('🚀 Iniciando geração de meditações para:', topic);
            
            // Verificar se a API está funcionando
            const apiStatus = await this.checkAPIStatus();
            if (apiStatus.status !== 'success') {
                throw new Error(`API não está disponível: ${apiStatus.message}`);
            }
            
            // Carregar documentos de referência
            const documents = await this.loadDocuments();
            
            // Criar prompt para o ChatGPT
            const prompt = this.createMeditationPrompt(topic, documents);
            
            // Chamar ChatGPT
            const response = await this.callChatGPT(prompt);
            
            // Processar resposta
            const meditations = this.processMeditations(response, topic);
            
            console.log('✅ Meditações geradas com sucesso:', meditations.length);
            return { meditations };
            
        } catch (error) {
            console.error('❌ Erro ao gerar meditações:', error);
            throw error;
        }
    }

    // Carregar documentos de referência
    async loadDocuments() {
        try {
            console.log('📚 Carregando documentos de referência...');
            
            // Documentos base para meditações católicas
            const documents = {
                'amor': 'O amor de Deus é um mistério profundo, que transcende toda compreensão humana. "Deus é amor" (1 João 4, 8).',
                'fe': 'A fé é a certeza das coisas que se esperam, a convicção dos fatos que não se veem (Hebreus 11, 1).',
                'esperanca': 'A esperança não decepciona, porque o amor de Deus foi derramado em nossos corações pelo Espírito Santo (Romanos 5, 5).',
                'perdao': 'Perdoai-nos as nossas ofensas, assim como nós perdoamos a quem nos tem ofendido (Mateus 6, 12).',
                'paz': 'Deixo-vos a paz, a minha paz vos dou; não vo-la dou como o mundo a dá (João 14, 27).',
                'gratidao': 'Em tudo dai graças, porque esta é a vontade de Deus em Cristo Jesus para convosco (1 Tessalonicenses 5, 18).',
                'humildade': 'Aprendei de mim, que sou manso e humilde de coração (Mateus 11, 29).',
                'caridade': 'Agora, pois, permanecem a fé, a esperança e a caridade, estas três; mas a maior destas é a caridade (1 Coríntios 13, 13).'
            };
            
            console.log('✅ Documentos carregados:', Object.keys(documents).length);
            return documents;
            
        } catch (error) {
            console.error('❌ Erro ao carregar documentos:', error);
            return {};
        }
    }

    // Criar prompt para o ChatGPT
    createMeditationPrompt(topic, documents) {
        console.log('📝 Criando prompt para tópico:', topic);
        
        // Encontrar documento relevante
        const relevantDoc = documents[topic.toLowerCase()] || documents['amor'];
        
        const prompt = `Crie uma meditação católica sobre "${topic}" seguindo o método Lectio Divina.

Contexto bíblico: ${relevantDoc}

Estrutura da meditação:
1. **Lectio (Leitura)**: Uma passagem bíblica relacionada ao tema
2. **Meditatio (Meditação)**: Reflexão sobre o que Deus está dizendo
3. **Oratio (Oração)**: Oração pessoal baseada na meditação
4. **Contemplatio (Contemplação)**: Momento de silêncio e contemplação

Formato da resposta:
**Lectio:**
[passagem bíblica]

**Meditatio:**
[reflexão]

**Oratio:**
[oração]

**Contemplatio:**
[contemplação]

Duração: 15 minutos
Tópico: ${topic}`;

        console.log('📝 Prompt criado com sucesso');
        return prompt;
    }

    // Chamar API do ChatGPT
    async callChatGPT(prompt) {
        try {
            console.log('🤖 Chamando API do ChatGPT...');
            
            const response = await fetch(`${this.config.BASE_URL}/chat/completions`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.config.API_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: this.config.MODEL,
                    messages: [
                        {
                            role: 'system',
                            content: 'Você é um assistente especializado em criar meditações católicas profundas e inspiradoras, seguindo o método Lectio Divina.'
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

            console.log('📡 Resposta do ChatGPT:', response.status);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ Erro na API do ChatGPT:', response.status, errorText);
                throw new Error(`Erro na API: ${response.status} - ${errorText}`);
            }

            const data = await response.json();
            const content = data.choices[0].message.content;
            
            console.log('✅ Resposta do ChatGPT obtida');
            return content;
            
        } catch (error) {
            console.error('❌ Erro ao chamar ChatGPT:', error);
            throw error;
        }
    }

    // Processar meditação simples
    processSimpleMeditation(content, topic) {
        try {
            console.log('🔧 Processando meditação simples...');
            
            const meditation = {
                id: `meditation-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                title: `Meditação sobre ${topic}`,
                topic: topic,
                content: this.cleanText(content),
                duration: '15 min',
                status: 'completed',
                source: 'chatgpt',
                type: 'simple',
                createdAt: new Date().toISOString(),
                lastUpdated: new Date().toISOString()
            };
            
            console.log('✅ Meditação simples processada');
            return meditation;
            
        } catch (error) {
            console.error('❌ Erro ao processar meditação simples:', error);
            throw error;
        }
    }

    // Processar meditações complexas (Lectio Divina)
    processMeditations(content, topic) {
        try {
            console.log('🔧 Processando meditações Lectio Divina...');
            
            // Extrair seções da meditação
            const lectio = this.extractSection(content, 'Lectio');
            const meditatio = this.extractSection(content, 'Meditatio');
            const oratio = this.extractSection(content, 'Oratio');
            const contemplatio = this.extractSection(content, 'Contemplatio');
            
            // Criar meditação estruturada
            const meditation = {
                id: `meditation-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                title: `Meditação sobre ${topic}`,
                topic: topic,
                content: this.cleanText(content),
                duration: '15 min',
                status: 'completed',
                source: 'chatgpt',
                type: 'lectio-divina',
                sections: {
                    lectio: lectio,
                    meditatio: meditatio,
                    oratio: oratio,
                    contemplatio: contemplatio
                },
                createdAt: new Date().toISOString(),
                lastUpdated: new Date().toISOString()
            };
            
            console.log('✅ Meditação Lectio Divina processada');
            return [meditation];
            
        } catch (error) {
            console.error('❌ Erro ao processar meditações:', error);
            // Fallback para meditação simples
            console.log('🔄 Fallback para meditação simples...');
            return [this.processSimpleMeditation(content, topic)];
        }
    }

    // Extrair meditações do conteúdo
    extractMeditations(content) {
        try {
            console.log('🔍 Extraindo meditações do conteúdo...');
            
            const meditations = [];
            const sections = content.split(/\*\*[^*]+\*\*:/);
            
            if (sections.length > 1) {
                // Conteúdo estruturado
                console.log('📋 Conteúdo estruturado encontrado');
                return this.processMeditations(content, 'Tópico');
            } else {
                // Conteúdo simples
                console.log('📋 Conteúdo simples encontrado');
                return [this.processSimpleMeditation(content, 'Tópico')];
            }
            
        } catch (error) {
            console.error('❌ Erro ao extrair meditações:', error);
            return [];
        }
    }

    // Extrair seção específica do conteúdo
    extractSection(content, sectionName) {
        try {
            const regex = new RegExp(`\\*\\*${sectionName}:\\*\\*\\s*([\\s\\S]*?)(?=\\*\\*[^*]+:\\*\\*|$)`, 'i');
            const match = content.match(regex);
            
            if (match && match[1]) {
                let sectionContent = match[1].trim();
                
                // Formatar seção específica
                if (sectionName.toLowerCase() === 'lectio') {
                    // Formatar leitura com itálico para citações
                    sectionContent = sectionContent.replace(/\*(.*?)\*/g, '<em>$1</em>');
                } else if (sectionName.toLowerCase() === 'meditatio') {
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
            
            return '';
        } catch (error) {
            console.error(`❌ Erro ao extrair seção ${sectionName}:`, error);
            return '';
        }
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

// Definir a classe globalmente
window.ChatGPTAPI = ChatGPTAPI;

// Aguardar o DOM estar pronto antes de criar a instância global
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Inicializando ChatGPTAPI global...');
    
    // Criar instância global
    window.chatGPTAPI = new ChatGPTAPI();
    
    // Criar funções globais para compatibilidade
    window.generateMeditations = async function(topic) {
        try {
            console.log('🚀 Função global generateMeditations chamada para:', topic);
            const result = await window.chatGPTAPI.generateMeditations(topic);
            console.log('✅ Resultado da função global:', result);
            return result;
        } catch (error) {
            console.error('❌ Erro na função global generateMeditations:', error);
            throw error;
        }
    };
    
    window.checkAPIStatus = async function() {
        try {
            console.log('🔍 Função global checkAPIStatus chamada');
            const result = await window.chatGPTAPI.checkAPIStatus();
            console.log('✅ Status da API:', result);
            return result;
        } catch (error) {
            console.error('❌ Erro na função global checkAPIStatus:', error);
            throw error;
        }
    };
    
    console.log('✅ ChatGPTAPI global inicializada com sucesso');
});

// Fallback para caso o DOMContentLoaded já tenha sido disparado
if (document.readyState === 'loading') {
    // DOM ainda não carregado, aguardar
    console.log('⏳ Aguardando DOM carregar...');
} else {
    // DOM já carregado, criar imediatamente
    console.log('🚀 DOM já carregado, criando ChatGPTAPI imediatamente...');
    
    window.chatGPTAPI = new ChatGPTAPI();
    
    window.generateMeditations = async function(topic) {
        try {
            console.log('🚀 Função global generateMeditations chamada para:', topic);
            const result = await window.chatGPTAPI.generateMeditations(topic);
            console.log('✅ Resultado da função global:', result);
            return result;
        } catch (error) {
            console.error('❌ Erro na função global generateMeditations:', error);
            throw error;
        }
    };
    
    window.checkAPIStatus = async function() {
        try {
            console.log('🔍 Função global checkAPIStatus chamada');
            const result = await window.chatGPTAPI.checkAPIStatus();
            console.log('✅ Status da API:', result);
            return result;
        } catch (error) {
            console.error('❌ Erro na função global checkAPIStatus:', error);
            throw error;
        }
    };
    
    console.log('✅ ChatGPTAPI global inicializada com sucesso (fallback)');
} 