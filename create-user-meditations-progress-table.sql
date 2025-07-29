-- =====================================================
-- Tabela: user_meditations_progress
-- Descrição: Acompanha o progresso individual dos usuários nas meditações
-- Autor: Rodrigo Silva Goes
-- Data: 2025-07-29
-- =====================================================

-- Criar tabela user_meditations_progress
CREATE TABLE IF NOT EXISTS user_meditations_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    meditation_id UUID REFERENCES meditations(id) ON DELETE CASCADE,
    personalized_meditation_id UUID REFERENCES personalized_meditations(id) ON DELETE CASCADE,
    category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
    
    -- Informações do progresso
    status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'paused', 'abandoned')),
    progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    time_spent_seconds INTEGER DEFAULT 0,
    completion_date TIMESTAMP WITH TIME ZONE,
    start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_accessed TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Metadados
    notes TEXT,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    difficulty_level VARCHAR(20) CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
    session_count INTEGER DEFAULT 0,
    
    -- Configurações
    auto_play BOOLEAN DEFAULT false,
    background_music BOOLEAN DEFAULT false,
    notifications_enabled BOOLEAN DEFAULT true,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT valid_meditation_reference CHECK (
        (meditation_id IS NOT NULL AND personalized_meditation_id IS NULL) OR
        (meditation_id IS NULL AND personalized_meditation_id IS NOT NULL)
    )
);

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_user_meditations_progress_user_id ON user_meditations_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_meditations_progress_meditation_id ON user_meditations_progress(meditation_id);
CREATE INDEX IF NOT EXISTS idx_user_meditations_progress_personalized_id ON user_meditations_progress(personalized_meditation_id);
CREATE INDEX IF NOT EXISTS idx_user_meditations_progress_category_id ON user_meditations_progress(category_id);
CREATE INDEX IF NOT EXISTS idx_user_meditations_progress_status ON user_meditations_progress(status);
CREATE INDEX IF NOT EXISTS idx_user_meditations_progress_completion_date ON user_meditations_progress(completion_date);
CREATE INDEX IF NOT EXISTS idx_user_meditations_progress_user_status ON user_meditations_progress(user_id, status);

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_user_meditations_progress_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_user_meditations_progress_updated_at
    BEFORE UPDATE ON user_meditations_progress
    FOR EACH ROW
    EXECUTE FUNCTION update_user_meditations_progress_updated_at();

-- Função para calcular estatísticas do usuário
CREATE OR REPLACE FUNCTION get_user_meditation_stats(user_uuid UUID)
RETURNS TABLE(
    total_meditations INTEGER,
    completed_meditations INTEGER,
    total_time_minutes INTEGER,
    average_rating DECIMAL(3,2),
    favorite_category_id UUID,
    current_streak INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*)::INTEGER as total_meditations,
        COUNT(CASE WHEN status = 'completed' THEN 1 END)::INTEGER as completed_meditations,
        COALESCE(SUM(time_spent_seconds) / 60, 0)::INTEGER as total_time_minutes,
        COALESCE(AVG(rating), 0)::DECIMAL(3,2) as average_rating,
        (SELECT category_id FROM user_meditations_progress 
         WHERE user_id = user_uuid 
         GROUP BY category_id 
         ORDER BY COUNT(*) DESC 
         LIMIT 1) as favorite_category_id,
        (SELECT COUNT(*)::INTEGER FROM (
            SELECT DISTINCT DATE(completion_date) as completion_day
            FROM user_meditations_progress 
            WHERE user_id = user_uuid 
            AND status = 'completed'
            AND completion_date >= CURRENT_DATE - INTERVAL '30 days'
            ORDER BY completion_day DESC
        ) s) as current_streak;
END;
$$ LANGUAGE plpgsql;

-- Inserir dados de exemplo
INSERT INTO user_meditations_progress (
    user_id,
    meditation_id,
    category_id,
    status,
    progress_percentage,
    time_spent_seconds,
    completion_date,
    rating,
    difficulty_level,
    session_count,
    notes
) VALUES 
-- Usuário 1 - Meditações completadas
(
    (SELECT id FROM users WHERE email = 'wanessa.rwg@gmail.com' LIMIT 1),
    (SELECT id FROM meditations WHERE title LIKE '%Amor de Deus%' LIMIT 1),
    (SELECT id FROM categories WHERE name = 'Amor de Deus' LIMIT 1),
    'completed',
    100,
    900, -- 15 minutos
    NOW() - INTERVAL '2 days',
    5,
    'beginner',
    1,
    'Meditação muito inspiradora sobre o amor divino'
),
(
    (SELECT id FROM users WHERE email = 'wanessa.rwg@gmail.com' LIMIT 1),
    (SELECT id FROM meditations WHERE title LIKE '%Perdão%' LIMIT 1),
    (SELECT id FROM categories WHERE name = 'Perdão' LIMIT 1),
    'completed',
    100,
    1200, -- 20 minutos
    NOW() - INTERVAL '1 day',
    4,
    'intermediate',
    2,
    'Reflexão profunda sobre o perdão'
),
-- Usuário 1 - Meditações em andamento
(
    (SELECT id FROM users WHERE email = 'wanessa.rwg@gmail.com' LIMIT 1),
    (SELECT id FROM meditations WHERE title LIKE '%Fé%' LIMIT 1),
    (SELECT id FROM categories WHERE name = 'Fé' LIMIT 1),
    'in_progress',
    65,
    600, -- 10 minutos
    NULL,
    NULL,
    'intermediate',
    1,
    'Meditação sobre fortalecer a fé'
),
-- Usuário 2 - Exemplo de progresso
(
    (SELECT id FROM users WHERE email = 'admin@oraetmedita.com' LIMIT 1),
    (SELECT id FROM meditations WHERE title LIKE '%Oração%' LIMIT 1),
    (SELECT id FROM categories WHERE name = 'Oração' LIMIT 1),
    'completed',
    100,
    1800, -- 30 minutos
    NOW() - INTERVAL '3 days',
    5,
    'advanced',
    3,
    'Meditação profunda sobre a oração'
);

-- Comentários da tabela
COMMENT ON TABLE user_meditations_progress IS 'Acompanha o progresso individual dos usuários nas meditações';
COMMENT ON COLUMN user_meditations_progress.id IS 'Identificador único do progresso';
COMMENT ON COLUMN user_meditations_progress.user_id IS 'ID do usuário';
COMMENT ON COLUMN user_meditations_progress.meditation_id IS 'ID da meditação (pode ser NULL se for meditação personalizada)';
COMMENT ON COLUMN user_meditations_progress.personalized_meditation_id IS 'ID da meditação personalizada (pode ser NULL se for meditação padrão)';
COMMENT ON COLUMN user_meditations_progress.category_id IS 'ID da categoria da meditação';
COMMENT ON COLUMN user_meditations_progress.status IS 'Status do progresso: pending, in_progress, completed, paused, abandoned';
COMMENT ON COLUMN user_meditations_progress.progress_percentage IS 'Percentual de conclusão (0-100)';
COMMENT ON COLUMN user_meditations_progress.time_spent_seconds IS 'Tempo gasto em segundos';
COMMENT ON COLUMN user_meditations_progress.completion_date IS 'Data de conclusão';
COMMENT ON COLUMN user_meditations_progress.rating IS 'Avaliação do usuário (1-5)';
COMMENT ON COLUMN user_meditations_progress.difficulty_level IS 'Nível de dificuldade percebido';
COMMENT ON COLUMN user_meditations_progress.session_count IS 'Número de sessões realizadas';
COMMENT ON COLUMN user_meditations_progress.notes IS 'Notas pessoais do usuário';

-- Verificar se a tabela foi criada
SELECT 
    'Tabela user_meditations_progress criada com sucesso!' as status,
    COUNT(*) as total_records
FROM user_meditations_progress; 