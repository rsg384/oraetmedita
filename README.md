# Ora et Medita

Uma aplicação web para meditações católicas com geração de conteúdo personalizado via IA.

## 🚀 Funcionalidades

- **Meditações Personalizadas**: Geração de meditações via ChatGPT
- **Categorias**: Organização por temas espirituais
- **Progresso**: Acompanhamento do desenvolvimento espiritual
- **Agendamentos**: Programação de horários de meditação
- **Sincronização**: Integração com Supabase para persistência de dados
- **Interface Responsiva**: Design moderno e adaptável

## 🛠️ Tecnologias

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Supabase (PostgreSQL)
- **IA**: OpenAI ChatGPT API
- **Estilização**: CSS Custom Properties, Flexbox, Grid
- **Armazenamento**: LocalStorage + Supabase

## 📁 Estrutura do Projeto

```
Projeto-OraetMedita 5/
├── index.html                 # Página principal
├── dashboard.html             # Dashboard do usuário
├── minhas-meditacoes.html    # Meditações personalizadas
├── meditacao.html            # Visualização de meditação
├── categorias.html           # Categorias de meditação
├── progresso.html            # Progresso espiritual
├── agendamentos.html         # Agendamentos
├── admin-panel.html          # Painel administrativo
├── supabase-config.js        # Configuração Supabase
├── chatgpt-api.js           # Integração ChatGPT
├── api-config.js            # Configuração de APIs
└── documents/               # Documentos católicos
```

## 🚀 Como Executar

1. **Clone o repositório**:
   ```bash
   git clone https://github.com/rsg384/oraetmedita.git
   cd oraetmedita
   ```

2. **Configure as APIs**:
   - Edite `api-config.js` com suas chaves de API
   - Configure o Supabase em `supabase-config.js`

3. **Execute localmente**:
   ```bash
   # Usando Python
   python3 -m http.server 8000
   
   # Ou usando Node.js
   npx http-server
   ```

4. **Acesse**: `http://localhost:8000`

## 📊 Banco de Dados (Supabase)

### Tabelas Principais:

- **users**: Usuários do sistema
- **categories**: Categorias de meditação
- **meditations**: Meditações do admin
- **personalized_meditations**: Meditações geradas pelos usuários

### Sincronização Automática:

- ✅ Criação de meditações personalizadas
- ✅ Atualização de status (concluída/pendente)
- ✅ Exclusão de meditações
- ✅ Sincronização de categorias

## 🎨 Interface

- **Modo Escuro/Claro**: Toggle automático
- **Design Responsivo**: Adaptável a todos os dispositivos
- **Animações Suaves**: Transições CSS
- **Notificações**: Sistema de alertas em tempo real

## 🔧 Configuração

### APIs Necessárias:

1. **OpenAI ChatGPT**:
   - Chave de API no `api-config.js`
   - Configuração no `chatgpt-api.js`

2. **Supabase**:
   - URL e chave anônima no `supabase-config.js`
   - Tabelas criadas via SQL

### Variáveis de Ambiente:

```javascript
// api-config.js
const OPENAI_API_KEY = 'sua_chave_aqui';

// supabase-config.js
const SUPABASE_URL = 'sua_url_supabase';
const SUPABASE_ANON_KEY = 'sua_chave_anonima';
```

## 📝 Funcionalidades Principais

### Geração de Meditações:
- Campo de digitação no dashboard
- Campo de digitação em "Minhas Meditações"
- Geração automática via ChatGPT
- Sincronização com Supabase

### Gestão de Conteúdo:
- Painel administrativo
- CRUD de categorias e meditações
- Sincronização automática com banco

### Progresso Espiritual:
- Contadores de meditações
- Estatísticas de conclusão
- Histórico de atividades

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 👨‍💻 Autor

**Rodrigo Silva Goes**
- GitHub: [@rsg384](https://github.com/rsg384)

## 🙏 Agradecimentos

- Comunidade católica
- OpenAI pela API ChatGPT
- Supabase pela infraestrutura
- Todos os contribuidores

---

**Ora et Medita** - Reze e Medite 🕊️ 