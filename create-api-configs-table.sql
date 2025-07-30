-- Script para criar tabela api_configs no Supabase
-- Execute este SQL no painel do Supabase (SQL Editor)

-- Criar tabela api_configs
CREATE TABLE IF NOT EXISTS api_configs (
    id SERIAL PRIMARY KEY,
    openai_api_key TEXT,
    api_key TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inserir configuração de exemplo (substitua pela sua chave real)
INSERT INTO api_configs (openai_api_key, api_key) 
VALUES ('sua-chave-api-aqui', 'sua-chave-api-aqui')
ON CONFLICT (id) DO NOTHING;

-- Criar política de segurança (opcional)
-- ALTER TABLE api_configs ENABLE ROW LEVEL SECURITY;

-- Comentários sobre a tabela
COMMENT ON TABLE api_configs IS 'Configurações de API para integração com ChatGPT';
COMMENT ON COLUMN api_configs.openai_api_key IS 'Chave da API do OpenAI/ChatGPT';
COMMENT ON COLUMN api_configs.api_key IS 'Chave da API alternativa';
COMMENT ON COLUMN api_configs.created_at IS 'Data de criação do registro';
COMMENT ON COLUMN api_configs.updated_at IS 'Data da última atualização';

-- Verificar se a tabela foi criada
SELECT * FROM api_configs; 