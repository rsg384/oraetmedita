// Configuração da API do ChatGPT e Sistema de Cache
const API_CONFIG = {
    // Configuração da API OpenAI
    OPENAI: {
        API_KEY: "YOUR_OPENAI_API_KEY_HERE",
        BASE_URL: 'https://api.openai.com/v1',
        MODEL: 'gpt-4o-mini',
        MAX_TOKENS: 4000,
        TEMPERATURE: 0.7
    },
    
    // Configuração do sistema de cache
    CACHE: {
        ENABLED: true,
        TTL: 24 * 60 * 60 * 1000, // 24 horas em ms
        MAX_SIZE: 100, // Máximo de itens no cache
        STORAGE_KEY: 'meditation_cache'
    },
    
    // Configuração de validação
    VALIDATION: {
        ENABLED: true,
        MIN_CONTENT_LENGTH: 100,
        MAX_CONTENT_LENGTH: 5000,
        REQUIRED_SECTIONS: ['reading', 'meditation', 'prayer', 'contemplation'],
        FORBIDDEN_WORDS: ['erro', 'teste', 'placeholder']
    },
    
    // Configuração de backup
    BACKUP: {
        ENABLED: true,
        AUTO_BACKUP_INTERVAL: 60 * 60 * 1000, // 1 hora
        MAX_BACKUPS: 10,
        STORAGE_KEY: 'meditation_backups'
    }
};

// Sistema de Cache
class MeditationCache {
    constructor() {
        this.cache = new Map();
        this.loadFromStorage();
    }
    
    // Gerar chave única para cache
    generateKey(topic, documents) {
        const documentsHash = documents.map(doc => doc.title).join('|');
        return `${topic}_${this.hashString(documentsHash)}`;
    }
    
    // Hash simples para strings
    hashString(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return Math.abs(hash).toString(36);
    }
    
    // Adicionar ao cache
    set(key, data) {
        if (this.cache.size >= API_CONFIG.CACHE.MAX_SIZE) {
            // Remover item mais antigo
            const firstKey = this.cache.keys().next().value;
            this.cache.delete(firstKey);
        }
        
        this.cache.set(key, {
            data,
            timestamp: Date.now(),
            ttl: API_CONFIG.CACHE.TTL
        });
        
        this.saveToStorage();
    }
    
    // Obter do cache
    get(key) {
        const item = this.cache.get(key);
        if (!item) return null;
        
        // Verificar se expirou
        if (Date.now() - item.timestamp > item.ttl) {
            this.cache.delete(key);
            this.saveToStorage();
            return null;
        }
        
        return item.data;
    }
    
    // Limpar cache
    clear() {
        this.cache.clear();
        this.saveToStorage();
    }
    
    // Salvar no localStorage
    saveToStorage() {
        try {
            const cacheData = Array.from(this.cache.entries());
            localStorage.setItem(API_CONFIG.CACHE.STORAGE_KEY, JSON.stringify(cacheData));
        } catch (error) {
            console.error('Erro ao salvar cache:', error);
        }
    }
    
    // Carregar do localStorage
    loadFromStorage() {
        try {
            const cacheData = localStorage.getItem(API_CONFIG.CACHE.STORAGE_KEY);
            if (cacheData) {
                const entries = JSON.parse(cacheData);
                this.cache = new Map(entries);
            }
        } catch (error) {
            console.error('Erro ao carregar cache:', error);
        }
    }
}

// Sistema de Validação de Conteúdo
class ContentValidator {
    constructor() {
        this.rules = API_CONFIG.VALIDATION;
    }
    
    // Validar meditação completa
    validateMeditation(meditation) {
        const errors = [];
        
        // Verificar seções obrigatórias
        for (const section of this.rules.REQUIRED_SECTIONS) {
            if (!meditation[section] || meditation[section].trim().length === 0) {
                errors.push(`Seção '${section}' é obrigatória`);
            }
        }
        
        // Verificar tamanho do conteúdo
        for (const section of this.rules.REQUIRED_SECTIONS) {
            if (meditation[section]) {
                const length = meditation[section].length;
                if (length < this.rules.MIN_CONTENT_LENGTH) {
                    errors.push(`Seção '${section}' muito curta (${length} caracteres)`);
                }
                if (length > this.rules.MAX_CONTENT_LENGTH) {
                    errors.push(`Seção '${section}' muito longa (${length} caracteres)`);
                }
            }
        }
        
        // Verificar palavras proibidas
        for (const section of this.rules.REQUIRED_SECTIONS) {
            if (meditation[section]) {
                for (const word of this.rules.FORBIDDEN_WORDS) {
                    if (meditation[section].toLowerCase().includes(word)) {
                        errors.push(`Palavra proibida '${word}' encontrada em '${section}'`);
                    }
                }
            }
        }
        
        // Verificar referências
        if (!meditation.references || meditation.references.trim().length === 0) {
            errors.push('Referências são obrigatórias');
        }
        
        return {
            isValid: errors.length === 0,
            errors
        };
    }
    
    // Validar documento católico
    validateDocument(document) {
        const errors = [];
        
        if (!document.title || document.title.trim().length === 0) {
            errors.push('Título do documento é obrigatório');
        }
        
        if (!document.content || document.content.trim().length === 0) {
            errors.push('Conteúdo do documento é obrigatório');
        }
        
        if (!document.source || document.source.trim().length === 0) {
            errors.push('Fonte do documento é obrigatória');
        }
        
        return {
            isValid: errors.length === 0,
            errors
        };
    }
}

// Sistema de Backup Automático
class BackupManager {
    constructor() {
        this.config = API_CONFIG.BACKUP;
        this.startAutoBackup();
    }
    
    // Criar backup
    createBackup() {
        try {
            const backupData = {
                timestamp: Date.now(),
                personalized_meditations: localStorage.getItem('personalized_meditations'),
                personalized_meditations_history: localStorage.getItem('personalized_meditations_history'),
                categories: localStorage.getItem('categories'),
                meditations: localStorage.getItem('meditations'),
                user_data: localStorage.getItem('user_data')
            };
            
            const backups = this.getBackups();
            backups.push(backupData);
            
            // Manter apenas os backups mais recentes
            if (backups.length > this.config.MAX_BACKUPS) {
                backups.splice(0, backups.length - this.config.MAX_BACKUPS);
            }
            
            localStorage.setItem(this.config.STORAGE_KEY, JSON.stringify(backups));
            
            console.log(`Backup criado: ${new Date(backupData.timestamp).toLocaleString()}`);
            return true;
        } catch (error) {
            console.error('Erro ao criar backup:', error);
            return false;
        }
    }
    
    // Restaurar backup
    restoreBackup(timestamp) {
        try {
            const backups = this.getBackups();
            const backup = backups.find(b => b.timestamp === timestamp);
            
            if (!backup) {
                throw new Error('Backup não encontrado');
            }
            
            // Restaurar dados
            if (backup.personalized_meditations) {
                localStorage.setItem('personalized_meditations', backup.personalized_meditations);
            }
            if (backup.personalized_meditations_history) {
                localStorage.setItem('personalized_meditations_history', backup.personalized_meditations_history);
            }
            if (backup.categories) {
                localStorage.setItem('categories', backup.categories);
            }
            if (backup.meditations) {
                localStorage.setItem('meditations', backup.meditations);
            }
            if (backup.user_data) {
                localStorage.setItem('user_data', backup.user_data);
            }
            
            console.log(`Backup restaurado: ${new Date(backup.timestamp).toLocaleString()}`);
            return true;
        } catch (error) {
            console.error('Erro ao restaurar backup:', error);
            return false;
        }
    }
    
    // Obter lista de backups
    getBackups() {
        try {
            const backupsData = localStorage.getItem(this.config.STORAGE_KEY);
            return backupsData ? JSON.parse(backupsData) : [];
        } catch (error) {
            console.error('Erro ao obter backups:', error);
            return [];
        }
    }
    
    // Iniciar backup automático
    startAutoBackup() {
        if (this.config.ENABLED) {
            setInterval(() => {
                this.createBackup();
            }, this.config.AUTO_BACKUP_INTERVAL);
        }
    }
}

// Sistema de Exportação
class ExportManager {
    constructor() {
        this.supportedFormats = ['json', 'txt', 'pdf'];
    }
    
    // Exportar meditações em JSON
    exportToJSON(meditations) {
        const exportData = {
            exportDate: new Date().toISOString(),
            version: '1.0',
            meditations: meditations
        };
        
        const blob = new Blob([JSON.stringify(exportData, null, 2)], {
            type: 'application/json'
        });
        
        this.downloadFile(blob, `meditacoes_${new Date().toISOString().split('T')[0]}.json`);
    }
    
    // Exportar meditações em TXT
    exportToTXT(meditations) {
        let content = '=== MEDITAÇÕES PERSONALIZADAS ===\n\n';
        content += `Data de exportação: ${new Date().toLocaleString('pt-BR')}\n\n`;
        
        meditations.forEach((meditation, index) => {
            content += `--- MEDITAÇÃO ${index + 1} ---\n`;
            content += `Título: ${meditation.title}\n`;
            content += `Duração: ${meditation.duration}\n\n`;
            
            if (meditation.reading) {
                content += `📖 LEITURA:\n${meditation.reading}\n\n`;
            }
            if (meditation.meditation) {
                content += `🧠 MEDITAÇÃO:\n${meditation.meditation}\n\n`;
            }
            if (meditation.prayer) {
                content += `🙏 ORAÇÃO:\n${meditation.prayer}\n\n`;
            }
            if (meditation.contemplation) {
                content += `✨ CONTEMPLAÇÃO:\n${meditation.contemplation}\n\n`;
            }
            if (meditation.references) {
                content += `📚 REFERÊNCIAS:\n${meditation.references}\n\n`;
            }
            
            content += '='.repeat(50) + '\n\n';
        });
        
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        this.downloadFile(blob, `meditacoes_${new Date().toISOString().split('T')[0]}.txt`);
    }
    
    // Exportar meditações em PDF (simulado)
    exportToPDF(meditations) {
        // Simulação de exportação PDF
        // Em produção, usar biblioteca como jsPDF
        alert('Exportação PDF será implementada em breve!');
    }
    
    // Download do arquivo
    downloadFile(blob, filename) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
    
    // Exportar categoria específica
    exportCategory(categoryName) {
        try {
            // Buscar dados no histórico
            const historyData = localStorage.getItem('personalized_meditations_history');
            let categoryData = null;
            
            if (historyData) {
                const history = JSON.parse(historyData);
                categoryData = history.find(item => item.category === categoryName);
            }
            
            if (!categoryData) {
                const currentData = localStorage.getItem('personalized_meditations');
                if (currentData) {
                    const current = JSON.parse(currentData);
                    if (current.category === categoryName) {
                        categoryData = current;
                    }
                }
            }
            
            if (categoryData) {
                this.exportToJSON(categoryData);
                return true;
            } else {
                throw new Error('Categoria não encontrada');
            }
        } catch (error) {
            console.error('Erro ao exportar categoria:', error);
            return false;
        }
    }
}

// Instâncias globais
const meditationCache = new MeditationCache();
const contentValidator = new ContentValidator();
const backupManager = new BackupManager();
const exportManager = new ExportManager();

// Exportar para uso global
window.API_CONFIG = API_CONFIG;
window.meditationCache = meditationCache;
window.contentValidator = contentValidator;
window.backupManager = backupManager;
window.exportManager = exportManager; 