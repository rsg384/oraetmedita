// Script para exportar dados da última meditação criada
console.log('📤 Script de exportação da última meditação carregado');

// Função para obter a última meditação criada
function getLastCreatedMeditation() {
    console.log('🔍 Buscando última meditação criada...');
    
    try {
        // Buscar meditações do localStorage
        const meditations = JSON.parse(localStorage.getItem('meditations') || '[]');
        
        if (meditations.length === 0) {
            console.log('❌ Nenhuma meditação encontrada no localStorage');
            return null;
        }
        
        // Ordenar por data de criação (mais recente primeiro)
        const sortedMeditations = meditations.sort((a, b) => {
            const dateA = new Date(a.createdAt || a.created_at || 0);
            const dateB = new Date(b.createdAt || b.created_at || 0);
            return dateB - dateA;
        });
        
        const lastMeditation = sortedMeditations[0];
        console.log('✅ Última meditação encontrada:', lastMeditation);
        
        return lastMeditation;
        
    } catch (error) {
        console.error('❌ Erro ao buscar última meditação:', error);
        return null;
    }
}

// Função para obter dados completos da meditação
function getCompleteMeditationData(meditation) {
    console.log('📋 Obtendo dados completos da meditação...');
    
    try {
        // Buscar categoria relacionada
        const categories = JSON.parse(localStorage.getItem('categories') || '[]');
        const category = categories.find(cat => cat.id === meditation.categoryId || cat.id === meditation.category_id);
        
        // Buscar dados do usuário atual
        const currentUser = JSON.parse(localStorage.getItem('current_user') || 'null');
        
        // Estrutura completa dos dados
        const completeData = {
            metadata: {
                exportDate: new Date().toISOString(),
                version: "1.0",
                description: "Dados da última meditação criada no painel administrativo",
                source: "admin-panel"
            },
            meditation: {
                id: meditation.id,
                title: meditation.title,
                content: meditation.content,
                categoryId: meditation.categoryId || meditation.category_id,
                duration: meditation.duration,
                status: meditation.status,
                type: meditation.type,
                difficulty: meditation.difficulty,
                tags: meditation.tags || [],
                is_active: meditation.is_active,
                bible_verse: meditation.bible_verse,
                prayer: meditation.prayer,
                practical_application: meditation.practical_application,
                sort_order: meditation.sort_order,
                createdAt: meditation.createdAt || meditation.created_at,
                updatedAt: meditation.updatedAt || meditation.updated_at,
                createdBy: meditation.createdBy || meditation.created_by
            },
            category: category ? {
                id: category.id,
                name: category.name,
                description: category.description,
                icon: category.icon,
                color: category.color,
                is_active: category.is_active,
                sort_order: category.sort_order
            } : null,
            user: currentUser ? {
                id: currentUser.id,
                name: currentUser.name,
                email: currentUser.email,
                plan: currentUser.plan
            } : null,
            systemInfo: {
                localStorage: {
                    totalMeditations: JSON.parse(localStorage.getItem('meditations') || '[]').length,
                    totalCategories: JSON.parse(localStorage.getItem('categories') || '[]').length,
                    hasCurrentUser: !!currentUser
                },
                timestamp: new Date().toISOString(),
                userAgent: navigator.userAgent,
                url: window.location.href
            }
        };
        
        console.log('✅ Dados completos obtidos:', completeData);
        return completeData;
        
    } catch (error) {
        console.error('❌ Erro ao obter dados completos:', error);
        return null;
    }
}

// Função para exportar dados como arquivo JSON
function exportMeditationData(data, filename = null) {
    console.log('📤 Exportando dados da meditação...');
    
    try {
        // Gerar nome do arquivo se não fornecido
        if (!filename) {
            const timestamp = new Date().toISOString().split('T')[0].replace(/-/g, '-');
            const meditationTitle = data.meditation.title.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 20);
            filename = `meditation_${meditationTitle}_${timestamp}.json`;
        }
        
        // Converter para JSON
        const jsonString = JSON.stringify(data, null, 2);
        
        // Criar blob e download
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        console.log('✅ Arquivo exportado:', filename);
        return filename;
        
    } catch (error) {
        console.error('❌ Erro ao exportar dados:', error);
        return null;
    }
}

// Função para exportar dados como arquivo CSV
function exportMeditationDataCSV(data, filename = null) {
    console.log('📤 Exportando dados da meditação como CSV...');
    
    try {
        // Gerar nome do arquivo se não fornecido
        if (!filename) {
            const timestamp = new Date().toISOString().split('T')[0].replace(/-/g, '-');
            const meditationTitle = data.meditation.title.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 20);
            filename = `meditation_${meditationTitle}_${timestamp}.csv`;
        }
        
        // Criar linhas CSV
        const csvLines = [
            // Cabeçalho
            'Campo,Valor',
            // Dados da meditação
            `ID,${data.meditation.id || 'N/A'}`,
            `Título,${data.meditation.title || 'N/A'}`,
            `Conteúdo,${data.meditation.content || 'N/A'}`,
            `Categoria ID,${data.meditation.categoryId || 'N/A'}`,
            `Duração,${data.meditation.duration || 'N/A'}`,
            `Status,${data.meditation.status || 'N/A'}`,
            `Tipo,${data.meditation.type || 'N/A'}`,
            `Dificuldade,${data.meditation.difficulty || 'N/A'}`,
            `Tags,${data.meditation.tags ? data.meditation.tags.join(';') : 'N/A'}`,
            `Ativo,${data.meditation.is_active || 'N/A'}`,
            `Versículo Bíblico,${data.meditation.bible_verse || 'N/A'}`,
            `Oração,${data.meditation.prayer || 'N/A'}`,
            `Aplicação Prática,${data.meditation.practical_application || 'N/A'}`,
            `Ordem,${data.meditation.sort_order || 'N/A'}`,
            `Criado em,${data.meditation.createdAt || 'N/A'}`,
            `Atualizado em,${data.meditation.updatedAt || 'N/A'}`,
            // Dados da categoria
            `Categoria Nome,${data.category ? data.category.name : 'N/A'}`,
            `Categoria Descrição,${data.category ? data.category.description : 'N/A'}`,
            // Dados do usuário
            `Usuário Nome,${data.user ? data.user.name : 'N/A'}`,
            `Usuário Email,${data.user ? data.user.email : 'N/A'}`,
            // Metadados
            `Data de Exportação,${data.metadata.exportDate}`,
            `Versão,${data.metadata.version}`,
            `Fonte,${data.metadata.source}`
        ];
        
        const csvContent = csvLines.join('\n');
        
        // Criar blob e download
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        console.log('✅ Arquivo CSV exportado:', filename);
        return filename;
        
    } catch (error) {
        console.error('❌ Erro ao exportar CSV:', error);
        return null;
    }
}

// Função principal para exportar última meditação
function exportLastMeditation(format = 'json') {
    console.log('🚀 Iniciando exportação da última meditação...');
    
    try {
        // 1. Obter última meditação
        const lastMeditation = getLastCreatedMeditation();
        
        if (!lastMeditation) {
            console.error('❌ Nenhuma meditação encontrada para exportar');
            return false;
        }
        
        // 2. Obter dados completos
        const completeData = getCompleteMeditationData(lastMeditation);
        
        if (!completeData) {
            console.error('❌ Erro ao obter dados completos');
            return false;
        }
        
        // 3. Exportar no formato solicitado
        let filename = null;
        
        if (format === 'csv') {
            filename = exportMeditationDataCSV(completeData);
        } else {
            filename = exportMeditationData(completeData);
        }
        
        if (filename) {
            console.log('✅ Exportação concluída:', filename);
            return true;
        } else {
            console.error('❌ Erro na exportação');
            return false;
        }
        
    } catch (error) {
        console.error('❌ Erro na exportação:', error);
        return false;
    }
}

// Função para mostrar dados no console
function showLastMeditationData() {
    console.log('📋 Mostrando dados da última meditação...');
    
    const lastMeditation = getLastCreatedMeditation();
    
    if (lastMeditation) {
        const completeData = getCompleteMeditationData(lastMeditation);
        console.log('📊 Dados da última meditação:', completeData);
        return completeData;
    } else {
        console.log('❌ Nenhuma meditação encontrada');
        return null;
    }
}

// Função para listar todas as meditações
function listAllMeditations() {
    console.log('📋 Listando todas as meditações...');
    
    try {
        const meditations = JSON.parse(localStorage.getItem('meditations') || '[]');
        
        if (meditations.length === 0) {
            console.log('❌ Nenhuma meditação encontrada');
            return [];
        }
        
        // Ordenar por data de criação
        const sortedMeditations = meditations.sort((a, b) => {
            const dateA = new Date(a.createdAt || a.created_at || 0);
            const dateB = new Date(b.createdAt || b.created_at || 0);
            return dateB - dateA;
        });
        
        console.log('📊 Meditações encontradas:', sortedMeditations.length);
        sortedMeditations.forEach((meditation, index) => {
            console.log(`${index + 1}. ${meditation.title} (${meditation.createdAt || meditation.created_at})`);
        });
        
        return sortedMeditations;
        
    } catch (error) {
        console.error('❌ Erro ao listar meditações:', error);
        return [];
    }
}

// Exportar funções
window.exportLastMeditation = exportLastMeditation;
window.showLastMeditationData = showLastMeditationData;
window.listAllMeditations = listAllMeditations;
window.getLastCreatedMeditation = getLastCreatedMeditation;

// Auto-inicialização
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Script de exportação carregado');
    
    // Mostrar dados da última meditação automaticamente
    setTimeout(() => {
        console.log('📋 Verificando última meditação criada...');
        showLastMeditationData();
    }, 1000);
});

console.log('✅ Script de exportação da última meditação carregado'); 