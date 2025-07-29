// Sistema de Gerenciamento de Sessões para Múltiplos Usuários
class SessionManager {
    constructor() {
        this.currentSessionId = null;
        this.currentUser = null;
        this.init();
    }

    // Inicializar sessão
    init() {
        console.log('🚀 Inicializando SessionManager...');
        
        // Gerar ID único para esta sessão
        this.currentSessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        console.log('🆔 ID da sessão atual:', this.currentSessionId);
        
        // Salvar ID da sessão no localStorage
        localStorage.setItem('currentSessionId', this.currentSessionId);
        
        // Verificar se há usuário logado nesta sessão
        this.loadCurrentUser();
        
        // Listener para mudanças no localStorage (outras abas)
        window.addEventListener('storage', this.handleStorageChange.bind(this));
        
        console.log('✅ SessionManager inicializado');
    }

    // Carregar usuário atual da sessão
    loadCurrentUser() {
        try {
            const sessionData = localStorage.getItem(`session_${this.currentSessionId}`);
            if (sessionData) {
                this.currentUser = JSON.parse(sessionData);
                console.log('👤 Usuário carregado da sessão:', this.currentUser.name);
                return this.currentUser;
            }
        } catch (error) {
            console.error('❌ Erro ao carregar usuário da sessão:', error);
        }
        return null;
    }

    // Fazer login de usuário
    async loginUser(userData) {
        try {
            console.log('🔐 Fazendo login do usuário:', userData.email);
            
            // Carregar dados completos do admin
            const completeUserData = await this.loadUserDataFromAdmin(userData.email);
            
            // Adicionar informações da sessão
            const sessionUserData = {
                ...completeUserData,
                sessionId: this.currentSessionId,
                loginTime: new Date().toISOString(),
                lastActivity: new Date().toISOString()
            };
            
            // Salvar na sessão atual
            localStorage.setItem(`session_${this.currentSessionId}`, JSON.stringify(sessionUserData));
            
            // Atualizar usuário atual
            this.currentUser = sessionUserData;
            
            // Adicionar sessão à lista de sessões ativas
            this.addActiveSession(sessionUserData);
            
            console.log('✅ Login realizado com sucesso:', sessionUserData.name);
            return sessionUserData;
            
        } catch (error) {
            console.error('❌ Erro no login:', error);
            throw error;
        }
    }

    // Fazer logout do usuário
    logoutUser() {
        try {
            console.log('🚪 Fazendo logout do usuário');
            
            if (this.currentUser) {
                // Remover sessão atual
                localStorage.removeItem(`session_${this.currentSessionId}`);
                
                // Remover da lista de sessões ativas
                this.removeActiveSession(this.currentSessionId);
                
                // Limpar usuário atual
                this.currentUser = null;
                
                console.log('✅ Logout realizado com sucesso');
            }
        } catch (error) {
            console.error('❌ Erro no logout:', error);
        }
    }

    // Obter usuário atual
    getCurrentUser() {
        return this.currentUser;
    }

    // Verificar se há usuário logado
    isLoggedIn() {
        return this.currentUser !== null;
    }

    // Carregar dados do usuário do admin
    async loadUserDataFromAdmin(email) {
        try {
            console.log('🔍 Carregando dados do usuário do admin para:', email);
            
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            console.log('📊 Usuários encontrados no admin:', users.length);
            
            const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
            
            if (user) {
                console.log('✅ Usuário encontrado no admin:', user.name);
                
                // Carregar dados de progresso espiritual
                const spiritualProgress = this.loadSpiritualProgressData(user.id);
                
                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    userNumber: user.userNumber,
                    createdAt: user.createdAt,
                    lastLogin: new Date().toISOString(),
                    preferences: user.preferences || {},
                    stats: user.stats || {
                        consecutiveDays: 5,
                        completedMeditations: 12,
                        totalTime: '2h 30min',
                        totalMeditations: 15,
                        inProgressMeditations: 3
                    },
                    spiritualProgress: spiritualProgress
                };
            } else {
                console.log('⚠️ Usuário não encontrado no admin, criando novo...');
                
                const newUser = {
                    id: 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
                    name: email.split('@')[0],
                    email: email,
                    userNumber: users.length + 1,
                    createdAt: new Date().toISOString(),
                    lastLogin: new Date().toISOString(),
                    preferences: {},
                    stats: {
                        consecutiveDays: 0,
                        completedMeditations: 0,
                        totalTime: '0h 0min',
                        totalMeditations: 0,
                        inProgressMeditations: 0
                    },
                    spiritualProgress: this.loadSpiritualProgressData('new_user')
                };
                
                users.push(newUser);
                localStorage.setItem('users', JSON.stringify(users));
                
                console.log('✅ Novo usuário criado no admin:', newUser.name);
                return newUser;
            }
        } catch (error) {
            console.error('❌ Erro ao carregar dados do usuário do admin:', error);
            throw error;
        }
    }

    // Carregar dados de progresso espiritual
    loadSpiritualProgressData(userId) {
        try {
            console.log('🙏 Carregando dados de progresso espiritual para usuário:', userId);
            
            // Carregar meditações personalizadas do usuário
            const personalizedMeditations = this.getPersonalizedMeditationsForUser(userId);
            
            // Carregar meditações do admin
            const adminMeditations = JSON.parse(localStorage.getItem('meditations') || '[]');
            
            // Carregar categorias do admin
            const adminCategories = JSON.parse(localStorage.getItem('categories') || '[]');
            
            // Calcular estatísticas gerais
            const personalizedCompleted = personalizedMeditations.filter(m => m.status === 'completed').length;
            const adminCompleted = adminMeditations.filter(m => m.status === 'completed').length;
            const totalCompleted = personalizedCompleted + adminCompleted;
            
            const personalizedInProgress = personalizedMeditations.filter(m => 
                m.status !== 'completed' && m.lastViewed
            ).length;
            const adminInProgress = adminMeditations.filter(m => 
                m.status !== 'completed' && m.lastViewed
            ).length;
            const totalInProgress = personalizedInProgress + adminInProgress;
            
            // Calcular tempo total (estimativa: 15 min por meditação)
            const totalMinutes = totalCompleted * 15;
            const hours = Math.floor(totalMinutes / 60);
            const minutes = totalMinutes % 60;
            const totalTime = hours > 0 ? `${hours}h ${minutes}min` : `${minutes}min`;
            
            // Calcular dias consecutivos (simplificado)
            const consecutiveDays = Math.min(totalCompleted, 30);
            
            // Processar progresso por categoria
            const categoryProgress = this.calculateCategoryProgress(adminCategories, adminMeditations, personalizedMeditations);
            
            const spiritualProgress = {
                // Estatísticas gerais
                stats: {
                    completedMeditations: totalCompleted,
                    inProgressMeditations: totalInProgress,
                    totalTime: totalTime,
                    consecutiveDays: consecutiveDays,
                    totalMeditations: personalizedMeditations.length + adminMeditations.length
                },
                
                // Progresso por categoria
                categoryProgress: categoryProgress,
                
                // Meditações personalizadas
                personalizedMeditations: personalizedMeditations,
                
                // Meditações do admin
                adminMeditations: adminMeditations,
                
                // Categorias disponíveis
                categories: adminCategories,
                
                // Histórico de atividades
                activityHistory: this.getActivityHistory(userId),
                
                // Metas espirituais
                spiritualGoals: this.getSpiritualGoals(userId),
                
                // Última atualização
                lastUpdated: new Date().toISOString()
            };
            
            console.log('✅ Dados de progresso espiritual carregados:', {
                totalCompleted: totalCompleted,
                totalInProgress: totalInProgress,
                totalTime: totalTime,
                categories: categoryProgress.length
            });
            
            return spiritualProgress;
            
        } catch (error) {
            console.error('❌ Erro ao carregar dados de progresso espiritual:', error);
            return {
                stats: {
                    completedMeditations: 0,
                    inProgressMeditations: 0,
                    totalTime: '0min',
                    consecutiveDays: 0,
                    totalMeditations: 0
                },
                categoryProgress: [],
                personalizedMeditations: [],
                adminMeditations: [],
                categories: [],
                activityHistory: [],
                spiritualGoals: [],
                lastUpdated: new Date().toISOString()
            };
        }
    }

    // Obter meditações personalizadas do usuário
    getPersonalizedMeditationsForUser(userId) {
        try {
            const allPersonalizedMeditations = JSON.parse(localStorage.getItem('personalized_meditations') || '[]');
            return allPersonalizedMeditations.filter(meditation => meditation.userId === userId);
        } catch (error) {
            console.error('❌ Erro ao obter meditações personalizadas:', error);
            return [];
        }
    }

    // Calcular progresso por categoria
    calculateCategoryProgress(adminCategories, adminMeditations, personalizedMeditations) {
        try {
            let allCategories = [];
            
            // Processar categorias do admin
            adminCategories.forEach(category => {
                const categoryMeditations = adminMeditations.filter(m => m.categoryId === category.id);
                const completedMeditations = categoryMeditations.filter(m => m.status === 'completed').length;
                const inProgressMeditations = categoryMeditations.filter(m => 
                    m.status === 'in_progress' || m.status === 'pending'
                ).length;
                
                allCategories.push({
                    id: category.id,
                    name: category.name,
                    description: category.description,
                    icon: category.icon || '📖',
                    color: category.color || '#7ee787',
                    total: categoryMeditations.length,
                    completed: completedMeditations,
                    inProgress: inProgressMeditations,
                    percentage: categoryMeditations.length > 0 ? Math.round((completedMeditations / categoryMeditations.length) * 100) : 0,
                    locked: 0
                });
            });
            
            // Processar meditações personalizadas
            const personalizedByTopic = {};
            personalizedMeditations.forEach(meditation => {
                const topic = meditation.topic || 'Meditações Personalizadas';
                if (!personalizedByTopic[topic]) {
                    personalizedByTopic[topic] = [];
                }
                personalizedByTopic[topic].push(meditation);
            });
            
            Object.entries(personalizedByTopic).forEach(([topic, meditations]) => {
                const completedCount = meditations.filter(m => m.status === 'completed').length;
                const inProgressCount = meditations.filter(m => 
                    m.status === 'in_progress' || m.status === 'pending'
                ).length;
                
                allCategories.push({
                    id: `personalized_${topic}`,
                    name: topic,
                    description: 'Meditações personalizadas criadas especialmente para você',
                    icon: '✨',
                    color: '#8b5cf6',
                    total: meditations.length,
                    completed: completedCount,
                    inProgress: inProgressCount,
                    percentage: meditations.length > 0 ? Math.round((completedCount / meditations.length) * 100) : 0,
                    locked: 0
                });
            });
            
            return allCategories;
        } catch (error) {
            console.error('❌ Erro ao calcular progresso por categoria:', error);
            return [];
        }
    }

    // Obter histórico de atividades
    getActivityHistory(userId) {
        try {
            const activityHistory = JSON.parse(localStorage.getItem(`activity_history_${userId}`) || '[]');
            return activityHistory;
        } catch (error) {
            console.error('❌ Erro ao obter histórico de atividades:', error);
            return [];
        }
    }

    // Obter metas espirituais
    getSpiritualGoals(userId) {
        try {
            const spiritualGoals = JSON.parse(localStorage.getItem(`spiritual_goals_${userId}`) || '[]');
            return spiritualGoals;
        } catch (error) {
            console.error('❌ Erro ao obter metas espirituais:', error);
            return [];
        }
    }

    // Atualizar dados de progresso espiritual
    updateSpiritualProgress() {
        if (!this.currentUser) {
            console.log('⚠️ Nenhum usuário logado para atualizar progresso');
            return;
        }

        try {
            console.log('🔄 Atualizando dados de progresso espiritual...');
            
            // Recarregar dados de progresso espiritual
            const updatedProgress = this.loadSpiritualProgressData(this.currentUser.id);
            
            // Atualizar na sessão atual
            this.currentUser.spiritualProgress = updatedProgress;
            
            // Salvar na sessão
            localStorage.setItem(`session_${this.currentSessionId}`, JSON.stringify(this.currentUser));
            
            // Atualizar estatísticas gerais do usuário
            this.currentUser.stats = {
                consecutiveDays: updatedProgress.stats.consecutiveDays,
                completedMeditations: updatedProgress.stats.completedMeditations,
                totalTime: updatedProgress.stats.totalTime,
                totalMeditations: updatedProgress.stats.totalMeditations,
                inProgressMeditations: updatedProgress.stats.inProgressMeditations
            };
            
            console.log('✅ Progresso espiritual atualizado:', {
                completed: updatedProgress.stats.completedMeditations,
                inProgress: updatedProgress.stats.inProgressMeditations,
                totalTime: updatedProgress.stats.totalTime,
                categories: updatedProgress.categoryProgress.length
            });
            
            return updatedProgress;
            
        } catch (error) {
            console.error('❌ Erro ao atualizar progresso espiritual:', error);
            return null;
        }
    }

    // Obter dados de progresso espiritual da sessão atual
    getSpiritualProgress() {
        if (!this.currentUser || !this.currentUser.spiritualProgress) {
            console.log('⚠️ Nenhum progresso espiritual disponível, atualizando...');
            return this.updateSpiritualProgress();
        }
        return this.currentUser.spiritualProgress;
    }

    // Adicionar atividade ao histórico
    addActivity(activity) {
        if (!this.currentUser) return;

        try {
            const activityHistory = this.getActivityHistory(this.currentUser.id);
            
            const newActivity = {
                id: 'activity_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
                type: activity.type, // 'meditation_completed', 'meditation_started', 'goal_achieved', etc.
                title: activity.title,
                description: activity.description,
                timestamp: new Date().toISOString(),
                metadata: activity.metadata || {}
            };
            
            activityHistory.unshift(newActivity); // Adicionar no início
            
            // Manter apenas as últimas 100 atividades
            if (activityHistory.length > 100) {
                activityHistory.splice(100);
            }
            
            localStorage.setItem(`activity_history_${this.currentUser.id}`, JSON.stringify(activityHistory));
            
            // Atualizar progresso espiritual
            this.updateSpiritualProgress();
            
            console.log('✅ Atividade adicionada ao histórico:', newActivity.type);
            
        } catch (error) {
            console.error('❌ Erro ao adicionar atividade:', error);
        }
    }

    // Definir meta espiritual
    setSpiritualGoal(goal) {
        if (!this.currentUser) return;

        try {
            const spiritualGoals = this.getSpiritualGoals(this.currentUser.id);
            
            const newGoal = {
                id: 'goal_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
                title: goal.title,
                description: goal.description,
                type: goal.type, // 'daily_meditation', 'weekly_goal', 'monthly_challenge', etc.
                target: goal.target,
                current: goal.current || 0,
                unit: goal.unit, // 'meditations', 'minutes', 'days', etc.
                createdAt: new Date().toISOString(),
                deadline: goal.deadline,
                completed: false
            };
            
            spiritualGoals.push(newGoal);
            localStorage.setItem(`spiritual_goals_${this.currentUser.id}`, JSON.stringify(spiritualGoals));
            
            console.log('✅ Meta espiritual definida:', newGoal.title);
            
        } catch (error) {
            console.error('❌ Erro ao definir meta espiritual:', error);
        }
    }

    // Atualizar progresso de uma meta
    updateGoalProgress(goalId, progress) {
        if (!this.currentUser) return;

        try {
            const spiritualGoals = this.getSpiritualGoals(this.currentUser.id);
            const goalIndex = spiritualGoals.findIndex(goal => goal.id === goalId);
            
            if (goalIndex !== -1) {
                spiritualGoals[goalIndex].current = progress;
                
                // Verificar se a meta foi alcançada
                if (spiritualGoals[goalIndex].current >= spiritualGoals[goalIndex].target) {
                    spiritualGoals[goalIndex].completed = true;
                    spiritualGoals[goalIndex].completedAt = new Date().toISOString();
                    
                    // Adicionar atividade de meta alcançada
                    this.addActivity({
                        type: 'goal_achieved',
                        title: `Meta alcançada: ${spiritualGoals[goalIndex].title}`,
                        description: `Você alcançou sua meta de ${spiritualGoals[goalIndex].title}`,
                        metadata: { goalId: goalId }
                    });
                }
                
                localStorage.setItem(`spiritual_goals_${this.currentUser.id}`, JSON.stringify(spiritualGoals));
                
                console.log('✅ Progresso da meta atualizado:', spiritualGoals[goalIndex].title);
            }
            
        } catch (error) {
            console.error('❌ Erro ao atualizar progresso da meta:', error);
        }
    }

    // Adicionar sessão ativa
    addActiveSession(userData) {
        try {
            const activeSessions = JSON.parse(localStorage.getItem('activeSessions') || '[]');
            
            // Remover sessões antigas (mais de 24 horas)
            const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
            const filteredSessions = activeSessions.filter(session => 
                new Date(session.loginTime) > oneDayAgo
            );
            
            // Adicionar nova sessão
            const sessionInfo = {
                sessionId: this.currentSessionId,
                userId: userData.id,
                userName: userData.name,
                userEmail: userData.email,
                loginTime: userData.loginTime,
                lastActivity: userData.lastActivity
            };
            
            filteredSessions.push(sessionInfo);
            localStorage.setItem('activeSessions', JSON.stringify(filteredSessions));
            
            console.log('✅ Sessão ativa adicionada:', sessionInfo.userName);
        } catch (error) {
            console.error('❌ Erro ao adicionar sessão ativa:', error);
        }
    }

    // Remover sessão ativa
    removeActiveSession(sessionId) {
        try {
            const activeSessions = JSON.parse(localStorage.getItem('activeSessions') || '[]');
            const filteredSessions = activeSessions.filter(session => session.sessionId !== sessionId);
            localStorage.setItem('activeSessions', JSON.stringify(filteredSessions));
            
            console.log('✅ Sessão ativa removida:', sessionId);
        } catch (error) {
            console.error('❌ Erro ao remover sessão ativa:', error);
        }
    }

    // Obter todas as sessões ativas
    getActiveSessions() {
        try {
            return JSON.parse(localStorage.getItem('activeSessions') || '[]');
        } catch (error) {
            console.error('❌ Erro ao obter sessões ativas:', error);
            return [];
        }
    }

    // Atualizar atividade da sessão
    updateActivity() {
        if (this.currentUser) {
            this.currentUser.lastActivity = new Date().toISOString();
            localStorage.setItem(`session_${this.currentSessionId}`, JSON.stringify(this.currentUser));
            
            // Atualizar na lista de sessões ativas
            const activeSessions = this.getActiveSessions();
            const sessionIndex = activeSessions.findIndex(s => s.sessionId === this.currentSessionId);
            if (sessionIndex !== -1) {
                activeSessions[sessionIndex].lastActivity = this.currentUser.lastActivity;
                localStorage.setItem('activeSessions', JSON.stringify(activeSessions));
            }
        }
    }

    // Handler para mudanças no localStorage
    handleStorageChange(event) {
        if (event.key === 'activeSessions') {
            console.log('🔄 Mudança detectada nas sessões ativas');
            // Aqui você pode implementar lógica para sincronizar com outras abas
        }
    }

    // Limpar sessões antigas
    cleanupOldSessions() {
        try {
            const activeSessions = this.getActiveSessions();
            const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
            const validSessions = activeSessions.filter(session => 
                new Date(session.loginTime) > oneDayAgo
            );
            
            if (validSessions.length !== activeSessions.length) {
                localStorage.setItem('activeSessions', JSON.stringify(validSessions));
                console.log('🧹 Sessões antigas removidas');
            }
        } catch (error) {
            console.error('❌ Erro ao limpar sessões antigas:', error);
        }
    }
}

// Criar instância global do SessionManager
window.sessionManager = new SessionManager();

// Limpar sessões antigas periodicamente
setInterval(() => {
    window.sessionManager.cleanupOldSessions();
}, 60000); // A cada minuto

console.log('✅ SessionManager carregado globalmente'); 