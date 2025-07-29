// Configuração do Supabase para Ora et Medita
const SUPABASE_CONFIG = {
  url: 'https://pmqxibhulaybvpjvdvyp.supabase.co',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBtcXhpYmh1bGF5YnZwanZkdnlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM2NTg0MjUsImV4cCI6MjA2OTIzNDQyNX0.biPp1NLnfvjspZgDv7RLt9_Ymtayy68cHgnPKy_FAWc',
  serviceRoleKey: null // Será configurado posteriormente se necessário
};

// Classe para gerenciar operações do Supabase
class SupabaseManager {
  constructor() {
    this.config = SUPABASE_CONFIG;
    this.baseUrl = this.config.url;
    this.anonKey = this.config.anonKey;
    this.headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.anonKey}`,
      'apikey': this.anonKey
    };
  }

  // Método para fazer requisições para o Supabase
  async request(endpoint, options = {}) {
    try {
      const url = `${this.baseUrl}/rest/v1/${endpoint}`;
      const config = {
        headers: this.headers,
        ...options
      };

      console.log('🌐 Requisição Supabase:', { url, method: config.method || 'GET' });
      
      const response = await fetch(url, config);
      
      console.log('📊 Status da resposta:', response.status, response.statusText);
      
      if (!response.ok) {
        // Tentar ler o corpo da resposta para mais detalhes
        let errorDetails = '';
        try {
          const errorText = await response.text();
          errorDetails = errorText ? ` - ${errorText}` : '';
        } catch (e) {
          errorDetails = ' - Não foi possível ler detalhes do erro';
        }
        
        throw new Error(`Erro HTTP: ${response.status} - ${response.statusText}${errorDetails}`);
      }

      // Verificar se a resposta tem conteúdo
      const responseText = await response.text();
      console.log('📋 Resposta bruta:', responseText);
      
      if (!responseText.trim()) {
        console.log('⚠️ Resposta vazia do Supabase');
        return [];
      }

      const data = JSON.parse(responseText);
      console.log('✅ Resposta Supabase:', data);
      
      return data;
    } catch (error) {
      console.error('❌ Erro na requisição Supabase:', error);
      throw error;
    }
  }

  // Métodos para usuários
  async createUser(userData) {
    return this.request('users', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  }

  async getUserById(userId) {
    return this.request(`users?id=eq.${userId}&select=*`);
  }

  async updateUser(userId, userData) {
    return this.request(`users?id=eq.${userId}`, {
      method: 'PATCH',
      body: JSON.stringify(userData)
    });
  }

  async getUserByEmail(email) {
    return this.request(`users?email=eq.${email}&select=*`);
  }

  // Métodos para categorias
  async getCategories() {
    return this.request('categories?select=*&order=sort_order.asc');
  }

  async createCategory(categoryData) {
    return this.request('categories', {
      method: 'POST',
      body: JSON.stringify(categoryData)
    });
  }

  async deleteCategory(categoryId) {
    return this.request(`categories?id=eq.${categoryId}`, {
      method: 'DELETE'
    });
  }

  async updateCategory(categoryId, categoryData) {
    return this.request(`categories?id=eq.${categoryId}`, {
      method: 'PATCH',
      body: JSON.stringify(categoryData)
    });
  }

  // Métodos para meditações
  async getMeditations(categoryId = null) {
    let endpoint = 'meditations?select=*';
    if (categoryId) {
      endpoint += `&category_id=eq.${categoryId}`;
    }
    return this.request(endpoint);
  }

  async createMeditation(meditationData) {
    return this.request('meditations', {
      method: 'POST',
      body: JSON.stringify(meditationData)
    });
  }

  async deleteMeditation(meditationId) {
    return this.request(`meditations?id=eq.${meditationId}`, {
      method: 'DELETE'
    });
  }

  async updateMeditation(meditationId, meditationData) {
    return this.request(`meditations?id=eq.${meditationId}`, {
      method: 'PATCH',
      body: JSON.stringify(meditationData)
    });
  }

  // Métodos para meditações personalizadas
  async getPersonalizedMeditations(userId = null) {
    const endpoint = userId ? `personalized_meditations?user_id=eq.${userId}` : 'personalized_meditations';
    return this.request(endpoint);
  }

  async createPersonalizedMeditation(meditationData) {
    return this.request('personalized_meditations', {
      method: 'POST',
      body: JSON.stringify(meditationData)
    });
  }

  async updatePersonalizedMeditation(meditationId, meditationData) {
    return this.request(`personalized_meditations?id=eq.${meditationId}`, {
      method: 'PATCH',
      body: JSON.stringify(meditationData)
    });
  }

  async deletePersonalizedMeditation(meditationId) {
    return this.request(`personalized_meditations?id=eq.${meditationId}`, {
      method: 'DELETE'
    });
  }

  async getPersonalizedMeditationsByTopic(topic, userId = null) {
    let endpoint = `personalized_meditations?topic=eq.${topic}`;
    if (userId) {
      endpoint += `&user_id=eq.${userId}`;
    }
    return this.request(endpoint);
  }

  // Métodos para meditações personalizadas
  async getPersonalizedMeditations(userId) {
    return this.request(`personalized_meditations?user_id=eq.${userId}&select=*&order=created_at.desc`);
  }

  async createPersonalizedMeditation(meditationData) {
    return this.request('personalized_meditations', {
      method: 'POST',
      body: JSON.stringify(meditationData)
    });
  }

  async updatePersonalizedMeditation(meditationId, meditationData) {
    return this.request(`personalized_meditations?id=eq.${meditationId}`, {
      method: 'PATCH',
      body: JSON.stringify(meditationData)
    });
  }

  async deletePersonalizedMeditation(meditationId) {
    return this.request(`personalized_meditations?id=eq.${meditationId}`, {
      method: 'DELETE'
    });
  }

  // Métodos para progresso do usuário
  async getUserProgress(userId) {
    return this.request(`user_meditation_progress?user_id=eq.${userId}&select=*`);
  }

  async createUserProgress(progressData) {
    return this.request('user_meditation_progress', {
      method: 'POST',
      body: JSON.stringify(progressData)
    });
  }

  async updateUserProgress(progressId, progressData) {
    return this.request(`user_meditation_progress?id=eq.${progressId}`, {
      method: 'PATCH',
      body: JSON.stringify(progressData)
    });
  }

  // Métodos para estatísticas do usuário
  async getUserStats(userId) {
    return this.request(`user_stats?user_id=eq.${userId}&select=*`);
  }

  async createUserStats(statsData) {
    return this.request('user_stats', {
      method: 'POST',
      body: JSON.stringify(statsData)
    });
  }

  async updateUserStats(userId, statsData) {
    return this.request(`user_stats?user_id=eq.${userId}`, {
      method: 'PATCH',
      body: JSON.stringify(statsData)
    });
  }

  // Métodos para agendamentos (ATUALIZADOS com novos nomes de campos)
  async getSchedules(userId = null) {
    const endpoint = userId ? `schedules?user_id=eq.${userId}` : 'schedules';
    return this.request(endpoint);
  }

  async getUserSchedules(userId) {
    return this.request(`schedules?user_id=eq.${userId}&select=*&order=schedule_date.asc,schedule_time.asc`);
  }

  async createSchedule(scheduleData) {
    return this.request('schedules', {
      method: 'POST',
      body: JSON.stringify(scheduleData)
    });
  }

  async updateSchedule(scheduleId, scheduleData) {
    return this.request(`schedules?id=eq.${scheduleId}`, {
      method: 'PATCH',
      body: JSON.stringify(scheduleData)
    });
  }

  async deleteSchedule(scheduleId) {
    return this.request(`schedules?id=eq.${scheduleId}`, {
      method: 'DELETE'
    });
  }

  async getScheduleById(scheduleId) {
    return this.request(`schedules?id=eq.${scheduleId}`);
  }

  async getSchedulesByDate(userId, date) {
    return this.request(`schedules?user_id=eq.${userId}&schedule_date=eq.${date}`);
  }

  async getActiveSchedules(userId) {
    return this.request(`schedules?user_id=eq.${userId}&status=eq.agendado`);
  }

  async getSchedulesByCategory(userId, category) {
    return this.request(`schedules?user_id=eq.${userId}&category=eq.${category}`);
  }

  async getScheduleStats() {
    return this.request('schedules?select=count(*) as total_schedules,count(*) filter (where status = \'agendado\') as active_schedules,count(*) filter (where notifications = true) as scheduled_with_notifications');
  }

  // Métodos para notificações
  async getUserNotifications(userId) {
    return this.request(`notifications?user_id=eq.${userId}&select=*&order=created_at.desc`);
  }

  async createNotification(notificationData) {
    return this.request('notifications', {
      method: 'POST',
      body: JSON.stringify(notificationData)
    });
  }

  async markNotificationAsRead(notificationId) {
    return this.request(`notifications?id=eq.${notificationId}`, {
      method: 'PATCH',
      body: JSON.stringify({ is_read: true })
    });
  }

  // Método para testar conexão
  async testConnection() {
    try {
      // Testar apenas se conseguimos acessar a API do Supabase
      const response = await fetch(`${this.baseUrl}/rest/v1/`, {
        headers: this.headers
      });
      
      if (response.ok) {
        console.log('✅ Conexão com Supabase estabelecida com sucesso');
        return true;
      } else {
        console.error('❌ Erro na resposta do Supabase:', response.status, response.statusText);
        return false;
      }
    } catch (error) {
      console.error('❌ Erro ao conectar com Supabase:', error);
      return false;
    }
  }
}

// Criar instância global
window.supabaseManager = new SupabaseManager();

// Função para inicializar o Supabase
async function initSupabase() {
  try {
    console.log('🚀 Inicializando Supabase...');
    const isConnected = await window.supabaseManager.testConnection();
    
    if (isConnected) {
      console.log('✅ Supabase inicializado com sucesso');
      return true;
    } else {
      console.error('❌ Falha ao inicializar Supabase');
      return false;
    }
  } catch (error) {
    console.error('❌ Erro ao inicializar Supabase:', error);
    return false;
  }
}

// Exportar para uso global
window.initSupabase = initSupabase;

console.log('📦 Supabase Manager carregado'); 