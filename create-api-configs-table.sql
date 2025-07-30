-- SQL para criar tabela api_configs no Supabase
-- Execute este SQL no painel do Supabase (SQL Editor)

-- 1. Verificar se a tabela existe
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'api_configs'
ORDER BY ordinal_position;

-- 2. Criar tabela api_configs
CREATE TABLE IF NOT EXISTS api_configs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    value TEXT NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_api_configs_name ON api_configs(name);
CREATE INDEX IF NOT EXISTS idx_api_configs_is_active ON api_configs(is_active);

-- 4. Criar trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_api_configs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_api_configs_updated_at ON api_configs;
CREATE TRIGGER trigger_update_api_configs_updated_at
    BEFORE UPDATE ON api_configs
    FOR EACH ROW
    EXECUTE FUNCTION update_api_configs_updated_at();

-- 5. Inserir configurações padrão
INSERT INTO api_configs (name, value, description) VALUES 
('chatgpt_api_key', 'sua_chave_aqui', 'Chave da API do ChatGPT'),
('openai_organization', '', 'Organização OpenAI (opcional)'),
('max_tokens', '1000', 'Número máximo de tokens para geração'),
('temperature', '0.7', 'Temperatura para geração (0.0 a 1.0)'),
('model', 'gpt-3.5-turbo', 'Modelo do ChatGPT a ser usado')
ON CONFLICT (name) DO NOTHING;

-- 6. Verificar estrutura final da tabela
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default,
    ordinal_position
FROM information_schema.columns 
WHERE table_name = 'api_configs'
ORDER BY ordinal_position;

-- 7. Verificar dados inseridos
SELECT 
    id,
    name,
    CASE 
        WHEN name = 'chatgpt_api_key' THEN '***CHAVE_OCULTA***'
        ELSE value 
    END as value,
    description,
    is_active,
    created_at
FROM api_configs 
ORDER BY created_at;

-- Comentários sobre a estrutura:
/*
ESTRUTURA DA TABELA API_CONFIGS:

Campos Principais:
- id: UUID único da configuração
- name: Nome da configuração (único)
- value: Valor da configuração
- description: Descrição da configuração

Campos de Controle:
- is_active: Se a configuração está ativa
- created_at: Data de criação
- updated_at: Data de atualização (atualizada automaticamente)

Configurações Padrão:
- chatgpt_api_key: Chave da API do ChatGPT
- openai_organization: Organização OpenAI (opcional)
- max_tokens: Número máximo de tokens
- temperature: Temperatura para geração
- model: Modelo do ChatGPT

Índices Criados:
- name: Para consultas por nome
- is_active: Para filtrar configurações ativas

Triggers:
- updated_at: Atualiza automaticamente a data de modificação
*/ 