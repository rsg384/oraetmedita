// Sistema de Backup Simplificado - Ora et Medita
class BackupManager {
    constructor() {
        this.backupFileName = `oraetmedita_backup_${new Date().toISOString().split('T')[0]}`;
        this.init();
    }

    init() {
        console.log('🚀 Inicializando BackupManager...');
        this.createBackupInterface();
        console.log('✅ BackupManager inicializado');
    }

    // Criar interface de backup
    createBackupInterface() {
        // Verificar se já existe a interface
        if (document.getElementById('backup-interface')) {
            return;
        }

        const backupContainer = document.createElement('div');
        backupContainer.id = 'backup-interface';
        backupContainer.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            display: flex;
            gap: 10px;
            flex-direction: column;
        `;

        // Botão Exportar
        const exportBtn = this.createButton('Exportar Dados', '📤', '#3b82f6', () => this.exportData());
        
        // Botão Importar
        const importBtn = this.createButton('Importar Dados', '📥', '#10b981', () => this.importData());

        backupContainer.appendChild(exportBtn);
        backupContainer.appendChild(importBtn);

        // Adicionar ao body
        document.body.appendChild(backupContainer);

        console.log('✅ Interface de backup criada');
    }

    // Criar botão
    createButton(text, icon, color, onClick) {
        const button = document.createElement('button');
        button.innerHTML = `${icon} ${text}`;
        button.style.cssText = `
            background: ${color};
            color: white;
            border: none;
            border-radius: 8px;
            padding: 12px 16px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        `;

        button.addEventListener('mouseenter', () => {
            button.style.transform = 'translateY(-2px)';
            button.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.2)';
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translateY(0)';
            button.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
        });

        button.addEventListener('click', onClick);

        return button;
    }

    // Exportar dados completos
    async exportData() {
        try {
            console.log('📤 Iniciando exportação de dados...');
            
            const backupData = await this.collectAllData();
            
            // Criar arquivo para download
            const blob = new Blob([JSON.stringify(backupData, null, 2)], {
                type: 'application/json'
            });
            
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${this.backupFileName}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            this.showNotification('✅ Backup exportado com sucesso!', 'success');
            console.log('✅ Backup exportado:', backupData.metadata);
            
        } catch (error) {
            console.error('❌ Erro ao exportar dados:', error);
            this.showNotification('❌ Erro ao exportar backup', 'error');
        }
    }

    // Importar dados
    async importData() {
        try {
            console.log('📥 Iniciando importação de dados...');
            
            // Criar input file
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.json';
            input.style.display = 'none';
            
            input.addEventListener('change', async (event) => {
                const file = event.target.files[0];
                if (!file) return;
                
                try {
                    const text = await file.text();
                    const backupData = JSON.parse(text);
                    
                    // Validar estrutura do backup
                    if (!this.validateBackupData(backupData)) {
                        throw new Error('Arquivo de backup inválido');
                    }
                    
                    // Confirmar importação
                    if (confirm('⚠️ Importar este backup irá substituir todos os dados atuais. Continuar?')) {
                        await this.restoreData(backupData);
                        this.showNotification('✅ Backup importado com sucesso!', 'success');
                        console.log('✅ Backup importado:', backupData.metadata);
                        
                        // Recarregar página para aplicar mudanças
                        setTimeout(() => {
                            window.location.reload();
                        }, 2000);
                    }
                    
                } catch (error) {
                    console.error('❌ Erro ao importar backup:', error);
                    this.showNotification('❌ Erro ao importar backup: ' + error.message, 'error');
                }
                
                // Limpar input
                document.body.removeChild(input);
            });
            
            document.body.appendChild(input);
            input.click();
            
        } catch (error) {
            console.error('❌ Erro ao preparar importação:', error);
            this.showNotification('❌ Erro ao preparar importação', 'error');
        }
    }

    // Coletar todos os dados do sistema
    async collectAllData() {
        try {
            console.log('🔍 Coletando todos os dados do sistema...');
            
            // Dados básicos
            const meditations = JSON.parse(localStorage.getItem('meditations') || '[]');
            const categories = JSON.parse(localStorage.getItem('categories') || '[]');
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            
            // Dados de usuários e sessões
            const userData = JSON.parse(localStorage.getItem('userData') || '{}');
            const activeSessions = JSON.parse(localStorage.getItem('activeSessions') || '[]');
            
            // Meditações personalizadas
            const personalizedMeditations = JSON.parse(localStorage.getItem('personalized_meditations') || '[]');
            
            // Agendamentos
            const userSchedules = JSON.parse(localStorage.getItem('user_schedules') || '[]');
            
            // Estatísticas e progresso
            const userMeditationStats = JSON.parse(localStorage.getItem('user_meditation_stats') || '{}');
            
            // Histórico de atividades e metas espirituais
            const activityHistory = this.collectActivityHistory();
            const spiritualGoals = this.collectSpiritualGoals();
            
            // Configurações do sistema
            const systemConfig = {
                theme: localStorage.getItem('theme') || 'dark',
                language: localStorage.getItem('language') || 'pt-BR',
                notifications: localStorage.getItem('notifications') !== 'false'
            };
            
            const backupData = {
                metadata: {
                    version: "2.0",
                    createdAt: new Date().toISOString(),
                    description: "Backup completo do sistema Ora et Medita - Inclui todos os dados: meditações, categorias, usuários, meditações personalizadas, agendamentos, estatísticas, histórico de atividades e metas espirituais",
                    totalUsers: users.length,
                    totalPersonalizedMeditations: personalizedMeditations.length,
                    totalSchedules: userSchedules.length,
                    totalMeditations: meditations.length,
                    totalCategories: categories.length,
                    totalActivities: activityHistory.length,
                    totalGoals: spiritualGoals.length
                },
                
                // Dados principais
                meditations: meditations,
                categories: categories,
                users: users,
                
                // Dados de usuários e sessões
                userData: userData,
                activeSessions: activeSessions,
                
                // Meditações personalizadas
                personalizedMeditations: personalizedMeditations,
                
                // Agendamentos
                userSchedules: userSchedules,
                
                // Estatísticas e progresso
                userMeditationStats: userMeditationStats,
                
                // Histórico de atividades
                activityHistory: activityHistory,
                
                // Metas espirituais
                spiritualGoals: spiritualGoals,
                
                // Configurações do sistema
                systemConfig: systemConfig,
                
                // Dados de sessão (se disponível)
                sessionData: this.collectSessionData()
            };
            
            console.log('✅ Dados coletados:', {
                meditations: meditations.length,
                categories: categories.length,
                users: users.length,
                personalizedMeditations: personalizedMeditations.length,
                schedules: userSchedules.length,
                activities: activityHistory.length,
                goals: spiritualGoals.length
            });
            
            return backupData;
            
        } catch (error) {
            console.error('❌ Erro ao coletar dados:', error);
            throw error;
        }
    }

    // Coletar histórico de atividades de todos os usuários
    collectActivityHistory() {
        try {
            const allActivities = [];
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            
            users.forEach(user => {
                const userActivities = JSON.parse(localStorage.getItem(`activity_history_${user.id}`) || '[]');
                allActivities.push(...userActivities);
            });
            
            return allActivities;
        } catch (error) {
            console.error('❌ Erro ao coletar histórico de atividades:', error);
            return [];
        }
    }

    // Coletar metas espirituais de todos os usuários
    collectSpiritualGoals() {
        try {
            const allGoals = [];
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            
            users.forEach(user => {
                const userGoals = JSON.parse(localStorage.getItem(`spiritual_goals_${user.id}`) || '[]');
                allGoals.push(...userGoals);
            });
            
            return allGoals;
        } catch (error) {
            console.error('❌ Erro ao coletar metas espirituais:', error);
            return [];
        }
    }

    // Coletar dados de sessão
    collectSessionData() {
        try {
            const sessionData = {};
            const sessionKeys = Object.keys(localStorage).filter(key => key.startsWith('session_'));
            
            sessionKeys.forEach(key => {
                try {
                    sessionData[key] = JSON.parse(localStorage.getItem(key));
                } catch (error) {
                    console.warn('⚠️ Erro ao coletar sessão:', key, error);
                }
            });
            
            return sessionData;
        } catch (error) {
            console.error('❌ Erro ao coletar dados de sessão:', error);
            return {};
        }
    }

    // Validar estrutura do backup
    validateBackupData(backupData) {
        try {
            const requiredFields = ['metadata', 'meditations', 'categories', 'users'];
            
            for (const field of requiredFields) {
                if (!backupData[field]) {
                    console.error('❌ Campo obrigatório ausente:', field);
                    return false;
                }
            }
            
            if (!backupData.metadata.version || !backupData.metadata.createdAt) {
                console.error('❌ Metadados inválidos');
                return false;
            }
            
            console.log('✅ Backup validado com sucesso');
            return true;
            
        } catch (error) {
            console.error('❌ Erro ao validar backup:', error);
            return false;
        }
    }

    // Restaurar dados
    async restoreData(backupData) {
        try {
            console.log('🔄 Restaurando dados do backup...');
            
            // Limpar dados existentes
            this.clearExistingData();
            
            // Restaurar dados principais
            localStorage.setItem('meditations', JSON.stringify(backupData.meditations || []));
            localStorage.setItem('categories', JSON.stringify(backupData.categories || []));
            localStorage.setItem('users', JSON.stringify(backupData.users || []));
            
            // Restaurar dados de usuários e sessões
            if (backupData.userData) {
                localStorage.setItem('userData', JSON.stringify(backupData.userData));
            }
            if (backupData.activeSessions) {
                localStorage.setItem('activeSessions', JSON.stringify(backupData.activeSessions));
            }
            
            // Restaurar meditações personalizadas
            if (backupData.personalizedMeditations) {
                localStorage.setItem('personalized_meditations', JSON.stringify(backupData.personalizedMeditations));
            }
            
            // Restaurar agendamentos
            if (backupData.userSchedules) {
                localStorage.setItem('user_schedules', JSON.stringify(backupData.userSchedules));
            }
            
            // Restaurar estatísticas
            if (backupData.userMeditationStats) {
                localStorage.setItem('user_meditation_stats', JSON.stringify(backupData.userMeditationStats));
            }
            
            // Restaurar histórico de atividades
            if (backupData.activityHistory) {
                this.restoreActivityHistory(backupData.activityHistory);
            }
            
            // Restaurar metas espirituais
            if (backupData.spiritualGoals) {
                this.restoreSpiritualGoals(backupData.spiritualGoals);
            }
            
            // Restaurar configurações do sistema
            if (backupData.systemConfig) {
                this.restoreSystemConfig(backupData.systemConfig);
            }
            
            // Restaurar dados de sessão
            if (backupData.sessionData) {
                this.restoreSessionData(backupData.sessionData);
            }
            
            console.log('✅ Dados restaurados com sucesso');
            
        } catch (error) {
            console.error('❌ Erro ao restaurar dados:', error);
            throw error;
        }
    }

    // Limpar dados existentes
    clearExistingData() {
        try {
            const keysToKeep = ['currentSessionId']; // Manter ID da sessão atual
            const allKeys = Object.keys(localStorage);
            
            allKeys.forEach(key => {
                if (!keysToKeep.includes(key)) {
                    localStorage.removeItem(key);
                }
            });
            
            console.log('🧹 Dados existentes limpos');
        } catch (error) {
            console.error('❌ Erro ao limpar dados:', error);
        }
    }

    // Restaurar histórico de atividades
    restoreActivityHistory(activities) {
        try {
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            
            users.forEach(user => {
                const userActivities = activities.filter(activity => 
                    activity.metadata && activity.metadata.userId === user.id
                );
                localStorage.setItem(`activity_history_${user.id}`, JSON.stringify(userActivities));
            });
            
            console.log('✅ Histórico de atividades restaurado');
        } catch (error) {
            console.error('❌ Erro ao restaurar histórico de atividades:', error);
        }
    }

    // Restaurar metas espirituais
    restoreSpiritualGoals(goals) {
        try {
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            
            users.forEach(user => {
                const userGoals = goals.filter(goal => 
                    goal.metadata && goal.metadata.userId === user.id
                );
                localStorage.setItem(`spiritual_goals_${user.id}`, JSON.stringify(userGoals));
            });
            
            console.log('✅ Metas espirituais restauradas');
        } catch (error) {
            console.error('❌ Erro ao restaurar metas espirituais:', error);
        }
    }

    // Restaurar configurações do sistema
    restoreSystemConfig(config) {
        try {
            if (config.theme) localStorage.setItem('theme', config.theme);
            if (config.language) localStorage.setItem('language', config.language);
            if (config.notifications !== undefined) {
                localStorage.setItem('notifications', config.notifications.toString());
            }
            
            console.log('✅ Configurações do sistema restauradas');
        } catch (error) {
            console.error('❌ Erro ao restaurar configurações:', error);
        }
    }

    // Restaurar dados de sessão
    restoreSessionData(sessionData) {
        try {
            Object.entries(sessionData).forEach(([key, value]) => {
                localStorage.setItem(key, JSON.stringify(value));
            });
            
            console.log('✅ Dados de sessão restaurados');
        } catch (error) {
            console.error('❌ Erro ao restaurar dados de sessão:', error);
        }
    }

    // Mostrar notificação
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `backup-notification backup-notification-${type}`;
        notification.textContent = message;
        
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            padding: 12px 16px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 10001;
            animation: slideIn 0.3s ease-out;
            max-width: 300px;
            background: ${type === 'success' ? '#10B981' : type === 'error' ? '#EF4444' : '#3B82F6'};
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Criar instância global do BackupManager
window.backupManager = new BackupManager();

// Adicionar estilos CSS para animações
const backupStyle = document.createElement('style');
backupStyle.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(backupStyle);

console.log('✅ BackupManager carregado globalmente'); 