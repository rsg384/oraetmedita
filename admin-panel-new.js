// Script para o novo painel administrativo
console.log('🚀 Novo painel administrativo carregado');

// Configuração do Supabase
const SUPABASE_URL = 'https://pmqxibhulaybvpjvdvyp.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBtcXhpYmh1bGF5YnZwanZkdnlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM2NTg0MjUsImV4cCI6MjA2OTIzNDQyNX0.biPp1NLnfvjspZgDv7RLt9_Ymtayy68cHgnPKy_FAWc';

// Função para fazer requisições ao Supabase
async function supabaseRequest(endpoint, options = {}) {
    const url = `${SUPABASE_URL}/rest/v1/${endpoint}`;
    const headers = {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        ...options.headers
    };

    try {
        const response = await fetch(url, {
            ...options,
            headers
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Erro na requisição Supabase:', error);
        throw error;
    }
}

// Função para carregar dados do dashboard
async function loadDashboardData() {
    console.log('📊 Carregando dados do dashboard...');
    
    try {
        // Carregar estatísticas
        const [users, categories, meditations, personalized] = await Promise.all([
            supabaseRequest('users?select=count'),
            supabaseRequest('categories?select=count'),
            supabaseRequest('meditations?select=count'),
            supabaseRequest('personalized_meditations?select=count')
        ]);

        // Atualizar contadores
        document.getElementById('users-count').textContent = users[0]?.count || 0;
        document.getElementById('categories-count').textContent = categories[0]?.count || 0;
        document.getElementById('meditations-count').textContent = meditations[0]?.count || 0;
        document.getElementById('personalized-count').textContent = personalized[0]?.count || 0;

        // Carregar dados ativos
        const [activeUsers, activeCategories, activeMeditations, activePersonalized] = await Promise.all([
            supabaseRequest('users?select=count&is_active=eq.true'),
            supabaseRequest('categories?select=count&is_active=eq.true'),
            supabaseRequest('meditations?select=count&is_active=eq.true'),
            supabaseRequest('personalized_meditations?select=count&is_active=eq.true')
        ]);

        document.getElementById('users-active').textContent = activeUsers[0]?.count || 0;
        document.getElementById('categories-active').textContent = activeCategories[0]?.count || 0;
        document.getElementById('meditations-active').textContent = activeMeditations[0]?.count || 0;
        document.getElementById('personalized-active').textContent = activePersonalized[0]?.count || 0;

        console.log('✅ Dashboard atualizado');
    } catch (error) {
        console.error('❌ Erro ao carregar dashboard:', error);
    }
}

// Função para carregar usuários
async function loadUsers() {
    console.log('👥 Carregando usuários...');
    
    try {
        const users = await supabaseRequest('users?select=*&order=created_at.desc');
        const tbody = document.getElementById('users-tbody');
        
        tbody.innerHTML = '';
        
        users.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.id}</td>
                <td>${user.name || 'N/A'}</td>
                <td>${user.email || 'N/A'}</td>
                <td><span class="status-${user.is_active ? 'active' : 'inactive'}">${user.is_active ? 'Ativo' : 'Inativo'}</span></td>
                <td>${new Date(user.created_at).toLocaleDateString('pt-BR')}</td>
                <td>
                    <button class="btn-edit" onclick="editUser('${user.id}')">Editar</button>
                    <button class="btn-delete" onclick="deleteUser('${user.id}')">Excluir</button>
                </td>
            `;
            tbody.appendChild(row);
        });

        console.log(`✅ ${users.length} usuários carregados`);
    } catch (error) {
        console.error('❌ Erro ao carregar usuários:', error);
    }
}

// Função para carregar categorias
async function loadCategories() {
    console.log('📂 Carregando categorias...');
    
    try {
        const categories = await supabaseRequest('categories?select=*&order=sort_order.asc');
        const tbody = document.getElementById('categories-tbody');
        
        tbody.innerHTML = '';
        
        categories.forEach(category => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${category.id}</td>
                <td>${category.name}</td>
                <td>${category.description || 'N/A'}</td>
                <td>${category.icon || '📖'}</td>
                <td><span style="color: ${category.color}">${category.color}</span></td>
                <td><span class="status-${category.is_active ? 'active' : 'inactive'}">${category.is_active ? 'Ativo' : 'Inativo'}</span></td>
                <td>
                    <button class="btn-edit" onclick="editCategory('${category.id}')">Editar</button>
                    <button class="btn-delete" onclick="deleteCategory('${category.id}')">Excluir</button>
                </td>
            `;
            tbody.appendChild(row);
        });

        // Atualizar select de categorias nos modais
        updateCategorySelects(categories);

        console.log(`✅ ${categories.length} categorias carregadas`);
    } catch (error) {
        console.error('❌ Erro ao carregar categorias:', error);
    }
}

// Função para carregar meditações
async function loadMeditations() {
    console.log('📖 Carregando meditações...');
    
    try {
        const meditations = await supabaseRequest('meditations?select=*,categories(name)&order=created_at.desc');
        const tbody = document.getElementById('meditations-tbody');
        
        tbody.innerHTML = '';
        
        meditations.forEach(meditation => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${meditation.id}</td>
                <td>${meditation.title}</td>
                <td>${meditation.categories?.name || 'N/A'}</td>
                <td>${meditation.duration || 10} min</td>
                <td><span class="status-${meditation.is_active ? 'active' : 'inactive'}">${meditation.is_active ? 'Ativo' : 'Inativo'}</span></td>
                <td>${new Date(meditation.created_at).toLocaleDateString('pt-BR')}</td>
                <td>
                    <button class="btn-edit" onclick="editMeditation('${meditation.id}')">Editar</button>
                    <button class="btn-delete" onclick="deleteMeditation('${meditation.id}')">Excluir</button>
                </td>
            `;
            tbody.appendChild(row);
        });

        console.log(`✅ ${meditations.length} meditações carregadas`);
    } catch (error) {
        console.error('❌ Erro ao carregar meditações:', error);
    }
}

// Função para carregar meditações personalizadas
async function loadPersonalizedMeditations() {
    console.log('🤖 Carregando meditações personalizadas...');
    
    try {
        const personalized = await supabaseRequest('personalized_meditations?select=*,users(name)&order=created_at.desc');
        const tbody = document.getElementById('personalized-tbody');
        
        tbody.innerHTML = '';
        
        personalized.forEach(meditation => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${meditation.id}</td>
                <td>${meditation.title}</td>
                <td>${meditation.users?.name || 'N/A'}</td>
                <td>${meditation.topic}</td>
                <td><span class="status-${meditation.is_active ? 'active' : 'inactive'}">${meditation.is_active ? 'Ativo' : 'Inativo'}</span></td>
                <td>${new Date(meditation.created_at).toLocaleDateString('pt-BR')}</td>
                <td>
                    <button class="btn-edit" onclick="editPersonalized('${meditation.id}')">Editar</button>
                    <button class="btn-delete" onclick="deletePersonalized('${meditation.id}')">Excluir</button>
                </td>
            `;
            tbody.appendChild(row);
        });

        // Atualizar select de usuários no modal
        updateUserSelects(personalized);

        console.log(`✅ ${personalized.length} meditações personalizadas carregadas`);
    } catch (error) {
        console.error('❌ Erro ao carregar meditações personalizadas:', error);
    }
}

// Função para atualizar selects de categoria
function updateCategorySelects(categories) {
    const selects = ['meditation-category'];
    
    selects.forEach(selectId => {
        const select = document.getElementById(selectId);
        if (select) {
            select.innerHTML = '<option value="">Selecione uma categoria</option>';
            categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category.id;
                option.textContent = category.name;
                select.appendChild(option);
            });
        }
    });
}

// Função para atualizar selects de usuário
function updateUserSelects(users) {
    const selects = ['personalized-user'];
    
    selects.forEach(selectId => {
        const select = document.getElementById(selectId);
        if (select) {
            select.innerHTML = '<option value="">Selecione um usuário</option>';
            users.forEach(user => {
                const option = document.createElement('option');
                option.value = user.id;
                option.textContent = user.name;
                select.appendChild(option);
            });
        }
    });
}

// Função para abrir modal
function openModal(type) {
    const modal = document.getElementById(`${type}-modal`);
    if (modal) {
        modal.style.display = 'block';
    }
}

// Função para fechar modal
function closeModal(type) {
    const modal = document.getElementById(`${type}-modal`);
    if (modal) {
        modal.style.display = 'none';
        // Limpar formulário
        const form = document.getElementById(`${type}-form`);
        if (form) {
            form.reset();
        }
    }
}

// Função para salvar usuário
async function saveUser(formData) {
    try {
        const userData = {
            name: formData.get('name'),
            email: formData.get('email'),
            is_active: formData.get('status') === 'active',
            created_at: new Date().toISOString()
        };

        await supabaseRequest('users', {
            method: 'POST',
            body: JSON.stringify(userData)
        });

        console.log('✅ Usuário salvo com sucesso');
        closeModal('user');
        loadUsers();
        loadDashboardData();
    } catch (error) {
        console.error('❌ Erro ao salvar usuário:', error);
        alert('Erro ao salvar usuário: ' + error.message);
    }
}

// Função para salvar categoria
async function saveCategory(formData) {
    try {
        const categoryData = {
            name: formData.get('name'),
            description: formData.get('description'),
            icon: formData.get('icon') || '📖',
            color: formData.get('color') || '#7ee787',
            is_active: formData.get('status') === 'active',
            sort_order: 0,
            created_at: new Date().toISOString()
        };

        await supabaseRequest('categories', {
            method: 'POST',
            body: JSON.stringify(categoryData)
        });

        console.log('✅ Categoria salva com sucesso');
        closeModal('category');
        loadCategories();
        loadDashboardData();
    } catch (error) {
        console.error('❌ Erro ao salvar categoria:', error);
        alert('Erro ao salvar categoria: ' + error.message);
    }
}

// Função para salvar meditação
async function saveMeditation(formData) {
    try {
        const meditationData = {
            title: formData.get('title'),
            content: formData.get('content'),
            category_id: formData.get('category_id'),
            duration: parseInt(formData.get('duration')) || 10,
            bible_verse: formData.get('bible_verse') || '',
            prayer: formData.get('prayer') || '',
            practical_application: formData.get('practical_application') || '',
            is_active: true,
            type: 'free',
            difficulty: 'intermediate',
            created_at: new Date().toISOString()
        };

        await supabaseRequest('meditations', {
            method: 'POST',
            body: JSON.stringify(meditationData)
        });

        console.log('✅ Meditação salva com sucesso');
        closeModal('meditation');
        loadMeditations();
        loadDashboardData();
    } catch (error) {
        console.error('❌ Erro ao salvar meditação:', error);
        alert('Erro ao salvar meditação: ' + error.message);
    }
}

// Função para gerar meditação personalizada
async function generatePersonalizedMeditation(formData) {
    try {
        const topic = formData.get('topic');
        const userId = formData.get('user_id');
        const duration = parseInt(formData.get('duration')) || 15;

        // Aqui você pode integrar com a API do ChatGPT
        // Por enquanto, vamos criar uma meditação de exemplo
        const meditationData = {
            title: `Meditação sobre ${topic}`,
            content: `Esta é uma meditação personalizada sobre ${topic}. Conteúdo gerado pelo ChatGPT.`,
            topic: topic,
            user_id: userId,
            duration: duration,
            is_active: true,
            created_at: new Date().toISOString()
        };

        await supabaseRequest('personalized_meditations', {
            method: 'POST',
            body: JSON.stringify(meditationData)
        });

        console.log('✅ Meditação personalizada gerada com sucesso');
        closeModal('personalized');
        loadPersonalizedMeditations();
        loadDashboardData();
    } catch (error) {
        console.error('❌ Erro ao gerar meditação personalizada:', error);
        alert('Erro ao gerar meditação: ' + error.message);
    }
}

// Event listeners para formulários
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Inicializando novo painel administrativo...');

    // Event listeners para navegação
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remover classe active de todos os links
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            
            // Adicionar classe active ao link clicado
            this.classList.add('active');
            
            // Mostrar seção correspondente
            const section = this.getAttribute('data-section');
            showSection(section);
        });
    });

    // Event listeners para formulários
    document.getElementById('user-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(this);
        saveUser(formData);
    });

    document.getElementById('category-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(this);
        saveCategory(formData);
    });

    document.getElementById('meditation-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(this);
        saveMeditation(formData);
    });

    document.getElementById('personalized-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(this);
        generatePersonalizedMeditation(formData);
    });

    // Carregar dados iniciais
    loadDashboardData();
    loadUsers();
    loadCategories();
    loadMeditations();
    loadPersonalizedMeditations();
});

// Função para mostrar seção
function showSection(sectionName) {
    // Ocultar todas as seções
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Mostrar seção selecionada
    const targetSection = document.getElementById(`${sectionName}-section`);
    if (targetSection) {
        targetSection.classList.add('active');
    }
}

// Funções de edição e exclusão (placeholder)
function editUser(id) {
    console.log('Editar usuário:', id);
    // Implementar edição
}

function deleteUser(id) {
    if (confirm('Tem certeza que deseja excluir este usuário?')) {
        console.log('Excluir usuário:', id);
        // Implementar exclusão
    }
}

function editCategory(id) {
    console.log('Editar categoria:', id);
    // Implementar edição
}

function deleteCategory(id) {
    if (confirm('Tem certeza que deseja excluir esta categoria?')) {
        console.log('Excluir categoria:', id);
        // Implementar exclusão
    }
}

function editMeditation(id) {
    console.log('Editar meditação:', id);
    // Implementar edição
}

function deleteMeditation(id) {
    if (confirm('Tem certeza que deseja excluir esta meditação?')) {
        console.log('Excluir meditação:', id);
        // Implementar exclusão
    }
}

function editPersonalized(id) {
    console.log('Editar meditação personalizada:', id);
    // Implementar edição
}

function deletePersonalized(id) {
    if (confirm('Tem certeza que deseja excluir esta meditação personalizada?')) {
        console.log('Excluir meditação personalizada:', id);
        // Implementar exclusão
    }
}

console.log('✅ Script do novo painel administrativo carregado'); 