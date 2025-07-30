// Script para o novo painel administrativo
console.log('🚀 Novo painel administrativo carregado');

// Configuração do Supabase
const SUPABASE_URL = 'https://pmqxibhulaybvpjvdvyp.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBtcXhpYmh1bGF5YnZwanZkdnlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM2NTg0MjUsImV4cCI6MjA2OTIzNDQyNX0.biPp1NLnfvjspZgDv7RLt9_Ymtayy68cHgnPKy_FAWc';

// Variáveis globais para edição
let editingUser = null;
let editingCategory = null;
let editingMeditation = null;
let editingPersonalized = null;

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
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`HTTP ${response.status}: ${errorData.message || response.statusText}`);
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
async function updateUserSelects() {
    try {
        const users = await supabaseRequest('users?select=id,name&is_active=eq.true&order=name.asc');
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
    } catch (error) {
        console.error('❌ Erro ao carregar usuários para select:', error);
    }
}

// Função para abrir modal
function openModal(type) {
    const modal = document.getElementById(`${type}-modal`);
    if (modal) {
        modal.style.display = 'block';
        
        // Atualizar título do modal baseado no modo (edição ou criação)
        const header = modal.querySelector('.modal-header h3');
        if (header) {
            const isEditing = editingUser || editingCategory || editingMeditation || editingPersonalized;
            if (isEditing) {
                header.textContent = `Editar ${getEntityName(type)}`;
            } else {
                header.textContent = `Adicionar ${getEntityName(type)}`;
            }
        }
    }
}

// Função para obter nome da entidade
function getEntityName(type) {
    const names = {
        'user': 'Usuário',
        'category': 'Categoria',
        'meditation': 'Meditação',
        'personalized': 'Meditação Personalizada'
    };
    return names[type] || 'Item';
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
        // Limpar variáveis de edição
        editingUser = null;
        editingCategory = null;
        editingMeditation = null;
        editingPersonalized = null;
    }
}

// Função para salvar usuário
async function saveUser(formData) {
    try {
        const userData = {
            name: formData.get('name'),
            email: formData.get('email'),
            is_active: formData.get('status') === 'active',
            updated_at: new Date().toISOString()
        };

        if (editingUser) {
            // Atualizar usuário existente
            await supabaseRequest(`users?id=eq.${editingUser.id}`, {
                method: 'PATCH',
                body: JSON.stringify(userData)
            });
            console.log('✅ Usuário atualizado com sucesso');
        } else {
            // Criar novo usuário
            userData.created_at = new Date().toISOString();
            await supabaseRequest('users', {
                method: 'POST',
                body: JSON.stringify(userData)
            });
            console.log('✅ Usuário criado com sucesso');
        }

        closeModal('user');
        loadUsers();
        loadDashboardData();
        updateUserSelects();
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
            updated_at: new Date().toISOString()
        };

        if (editingCategory) {
            // Atualizar categoria existente
            await supabaseRequest(`categories?id=eq.${editingCategory.id}`, {
                method: 'PATCH',
                body: JSON.stringify(categoryData)
            });
            console.log('✅ Categoria atualizada com sucesso');
        } else {
            // Criar nova categoria
            categoryData.sort_order = 0;
            categoryData.created_at = new Date().toISOString();
            await supabaseRequest('categories', {
                method: 'POST',
                body: JSON.stringify(categoryData)
            });
            console.log('✅ Categoria criada com sucesso');
        }

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
            updated_at: new Date().toISOString()
        };

        if (editingMeditation) {
            // Atualizar meditação existente
            await supabaseRequest(`meditations?id=eq.${editingMeditation.id}`, {
                method: 'PATCH',
                body: JSON.stringify(meditationData)
            });
            console.log('✅ Meditação atualizada com sucesso');
        } else {
            // Criar nova meditação
            meditationData.is_active = true;
            meditationData.type = 'free';
            meditationData.difficulty = 'intermediate';
            meditationData.created_at = new Date().toISOString();
            await supabaseRequest('meditations', {
                method: 'POST',
                body: JSON.stringify(meditationData)
            });
            console.log('✅ Meditação criada com sucesso');
        }

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

        if (editingPersonalized) {
            // Atualizar meditação personalizada existente
            meditationData.updated_at = new Date().toISOString();
            await supabaseRequest(`personalized_meditations?id=eq.${editingPersonalized.id}`, {
                method: 'PATCH',
                body: JSON.stringify(meditationData)
            });
            console.log('✅ Meditação personalizada atualizada com sucesso');
        } else {
            // Criar nova meditação personalizada
            await supabaseRequest('personalized_meditations', {
                method: 'POST',
                body: JSON.stringify(meditationData)
            });
            console.log('✅ Meditação personalizada criada com sucesso');
        }

        closeModal('personalized');
        loadPersonalizedMeditations();
        loadDashboardData();
    } catch (error) {
        console.error('❌ Erro ao gerar meditação personalizada:', error);
        alert('Erro ao gerar meditação: ' + error.message);
    }
}

// Função para editar usuário
async function editUser(id) {
    try {
        const users = await supabaseRequest(`users?id=eq.${id}`);
        if (users.length > 0) {
            editingUser = users[0];
            
            // Preencher formulário
            document.getElementById('user-name').value = editingUser.name || '';
            document.getElementById('user-email').value = editingUser.email || '';
            document.getElementById('user-status').value = editingUser.is_active ? 'active' : 'inactive';
            
            openModal('user');
        }
    } catch (error) {
        console.error('❌ Erro ao carregar usuário para edição:', error);
        alert('Erro ao carregar usuário: ' + error.message);
    }
}

// Função para editar categoria
async function editCategory(id) {
    try {
        const categories = await supabaseRequest(`categories?id=eq.${id}`);
        if (categories.length > 0) {
            editingCategory = categories[0];
            
            // Preencher formulário
            document.getElementById('category-name').value = editingCategory.name || '';
            document.getElementById('category-description').value = editingCategory.description || '';
            document.getElementById('category-icon').value = editingCategory.icon || '📖';
            document.getElementById('category-color').value = editingCategory.color || '#7ee787';
            document.getElementById('category-status').value = editingCategory.is_active ? 'active' : 'inactive';
            
            openModal('category');
        }
    } catch (error) {
        console.error('❌ Erro ao carregar categoria para edição:', error);
        alert('Erro ao carregar categoria: ' + error.message);
    }
}

// Função para editar meditação
async function editMeditation(id) {
    try {
        const meditations = await supabaseRequest(`meditations?id=eq.${id}`);
        if (meditations.length > 0) {
            editingMeditation = meditations[0];
            
            // Preencher formulário
            document.getElementById('meditation-title').value = editingMeditation.title || '';
            document.getElementById('meditation-content').value = editingMeditation.content || '';
            document.getElementById('meditation-category').value = editingMeditation.category_id || '';
            document.getElementById('meditation-duration').value = editingMeditation.duration || 10;
            document.getElementById('meditation-bible-verse').value = editingMeditation.bible_verse || '';
            document.getElementById('meditation-prayer').value = editingMeditation.prayer || '';
            document.getElementById('meditation-application').value = editingMeditation.practical_application || '';
            
            openModal('meditation');
        }
    } catch (error) {
        console.error('❌ Erro ao carregar meditação para edição:', error);
        alert('Erro ao carregar meditação: ' + error.message);
    }
}

// Função para editar meditação personalizada
async function editPersonalized(id) {
    try {
        const personalized = await supabaseRequest(`personalized_meditations?id=eq.${id}`);
        if (personalized.length > 0) {
            editingPersonalized = personalized[0];
            
            // Preencher formulário
            document.getElementById('personalized-topic').value = editingPersonalized.topic || '';
            document.getElementById('personalized-user').value = editingPersonalized.user_id || '';
            document.getElementById('personalized-duration').value = editingPersonalized.duration || 15;
            
            openModal('personalized');
        }
    } catch (error) {
        console.error('❌ Erro ao carregar meditação personalizada para edição:', error);
        alert('Erro ao carregar meditação personalizada: ' + error.message);
    }
}

// Função para excluir usuário
async function deleteUser(id) {
    if (confirm('Tem certeza que deseja excluir este usuário?')) {
        try {
            await supabaseRequest(`users?id=eq.${id}`, {
                method: 'DELETE'
            });
            console.log('✅ Usuário excluído com sucesso');
            loadUsers();
            loadDashboardData();
            updateUserSelects();
        } catch (error) {
            console.error('❌ Erro ao excluir usuário:', error);
            alert('Erro ao excluir usuário: ' + error.message);
        }
    }
}

// Função para excluir categoria
async function deleteCategory(id) {
    if (confirm('Tem certeza que deseja excluir esta categoria?')) {
        try {
            await supabaseRequest(`categories?id=eq.${id}`, {
                method: 'DELETE'
            });
            console.log('✅ Categoria excluída com sucesso');
            loadCategories();
            loadDashboardData();
        } catch (error) {
            console.error('❌ Erro ao excluir categoria:', error);
            alert('Erro ao excluir categoria: ' + error.message);
        }
    }
}

// Função para excluir meditação
async function deleteMeditation(id) {
    if (confirm('Tem certeza que deseja excluir esta meditação?')) {
        try {
            await supabaseRequest(`meditations?id=eq.${id}`, {
                method: 'DELETE'
            });
            console.log('✅ Meditação excluída com sucesso');
            loadMeditations();
            loadDashboardData();
        } catch (error) {
            console.error('❌ Erro ao excluir meditação:', error);
            alert('Erro ao excluir meditação: ' + error.message);
        }
    }
}

// Função para excluir meditação personalizada
async function deletePersonalized(id) {
    if (confirm('Tem certeza que deseja excluir esta meditação personalizada?')) {
        try {
            await supabaseRequest(`personalized_meditations?id=eq.${id}`, {
                method: 'DELETE'
            });
            console.log('✅ Meditação personalizada excluída com sucesso');
            loadPersonalizedMeditations();
            loadDashboardData();
        } catch (error) {
            console.error('❌ Erro ao excluir meditação personalizada:', error);
            alert('Erro ao excluir meditação personalizada: ' + error.message);
        }
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
    updateUserSelects();
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

// Função para mostrar notificação
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 5px;
        color: white;
        font-weight: bold;
        z-index: 1000;
        ${type === 'success' ? 'background-color: #4CAF50;' : ''}
        ${type === 'error' ? 'background-color: #f44336;' : ''}
        ${type === 'info' ? 'background-color: #2196F3;' : ''}
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 3000);
}

console.log('✅ Script do novo painel administrativo carregado'); 