# Pipeline CI/CD com GitHub Actions - Cálculos Trabalhistas

## 📋 Sobre o Projeto

Este projeto implementa uma **Pipeline de Integração Contínua (CI)** completa utilizando **GitHub Actions** para um módulo de cálculos trabalhistas desenvolvido em JavaScript com testes automatizados usando Mocha e Node Assert.

Repositório: [PriscilaFarias/pgats-trabalho-final](https://github.com/PriscilaFarias/pgats-trabalho-final)

O projeto foi originado da disciplina de Integração Contínua para Automação de Testes da pós-graduação e agora conta com uma solução robusta de CI/CD que garante a qualidade e confiabilidade do código através de execução automática de testes.

---

## 🎯 Objetivo

Desenvolver uma pipeline de integração contínua que contempla:

- ✅ **Execução Manual**: Disparar testes manualmente via GitHub Actions
- ✅ **Execução Agendada**: Rodar testes em horários predefinidos (diariamente e semanal)
- ✅ **Execução por Push**: Automática quando há alterações no repositório
- ✅ **Pipeline Integrada**: Múltiplas etapas com verificação, testes e relatórios
- ✅ **Geração de Relatórios**: Armazenamento de resultados de testes em formato JSON
- ✅ **Documentação**: README explicando a solução e conceitos

---

## 🏗️ Arquitetura da Solução

### Fluxo da Pipeline

```
┌─────────────────────────────────────────────────────────────┐
│          GATILHOS (TRIGGERS)                                 │
├─────────────────────────────────────────────────────────────┤
│  • workflow_dispatch (Manual)                                │
│  • schedule (Agendado)                                       │
│  • push (Por alteração de código)                            │
│  • pull_request (Pull Request)                               │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│          JOBS (TAREFAS)                                      │
├─────────────────────────────────────────────────────────────┤
│  1. Verificação (Lint/Check)                                 │
│  2. Testes Unitários                                         │
│  3. Geração de Relatórios                                    │
│  4. Armazenamento de Artefatos                               │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│          SAÍDA                                               │
├─────────────────────────────────────────────────────────────┤
│  • Testes Passando/Falhando                                  │
│  • Relatórios JSON disponíveis                               │
│  • Resumo da execução                                        │
│  • Notificações em PRs (quando aplicável)                    │
└─────────────────────────────────────────────────────────────┘
```

---

## 📦 Workflows Implementados

### 1️⃣ **N1 - Execução Manual** (`01-manual-exec.yaml`)

**Objetivo**: Permitir que qualquer desenvolvedor execute testes manualmente pelo interface do GitHub.

**Gatilho**: `workflow_dispatch` (clique manual)

**Etapas**:
1. Checkout do código
2. Instalação do Node.js (v20)
3. Instalação de dependências
4. Execução de testes com output verbose
5. Upload do relatório JSON

**Quando usar**: Quando você quer testar manualmente sem fazer push

---

### 2️⃣ **N2 - Execução Agendada** (`02-scheduled-exec.yaml`)

**Objetivo**: Executar testes automaticamente em horários predefinidos.

**Gatilhos**: 
- Todos os dias às 00:00 (UTC)
- Toda segunda-feira às 09:00 (UTC)
- Manual com `workflow_dispatch`

**Etapas**: (Similares ao N1 com artefatos nomeados)

**Quando usar**: Para garantir que o código continua funcionando mesmo sem alterações

**Expressão Cron**:
```
minute hour day-of-month month day-of-week
  |     |        |          |        |
  |     |        |          |        └─ 0=domingo, 1=segunda, 5=sexta, etc
  |     |        |          └────────── 1-12
  |     |        └───────────────────── 1-31
  |     └───────────────────────────── 0-23
  └─────────────────────────────────── 0-59
```

---

### 3️⃣ **N3 - Execução por Push** (`03-push-exec.yaml`)

**Objetivo**: Executar testes automaticamente quando há alterações no código.

**Gatilhos**:
- Push nas branches: `main`, `master`, `develop`
- Pull Requests nas mesmas branches

**Etapas**:
1. Todas as etapas do N1
2. Comentário automático no PR com resultado

**Quando usar**: Fluxo padrão de CI em qualquer commit/PR

---

### 4️⃣ **N4 - Pipeline Integrada** (`04-integrated-exec.yaml`)

**Objetivo**: Execução completa com múltiplas etapas interdependentes.

**Gatilhos**: 
- Manual (`workflow_dispatch`)
- Push nas branches principais

**Etapas** (com dependências):

```
┌──────────────┐
│ Verificação  │  (Etapa 1)
│ (Check Code) │
└──────┬───────┘
       │
       ↓
┌──────────────────────┐
│ Testes Unitários     │  (Etapa 2 - Depende de Verificação)
│ + Relatórios         │
└──────┬───────────────┘
       │
       ↓
┌──────────────────────┐
│ Relatório Final      │  (Etapa 3 - Depende de Testes)
│ (Sempre executa)     │
└──────────────────────┘
```

**Características**:
- Execução sequencial com dependências
- Sempre gera relatório final mesmo se houver falhas
- Resume informações da execução

---

## 🛠️ Conceitos Técnicos Utilizados

### 1. **Workflows (Fluxos de Trabalho)**
   - Automação de processos via GitHub Actions
   - Definição YAML dos passos a executar
   - Múltiplas estratégias de disparo

### 2. **Gatilhos (Triggers)**
   - `workflow_dispatch`: Execução manual
   - `schedule`: Execução por cron job
   - `push`: Execução ao enviar código
   - `pull_request`: Execução em PRs

### 3. **Jobs (Tarefas)**
   - Unidade de execução isolada
   - Rodando em máquinas separadas
   - Podem ter dependências (`needs`)

### 4. **Steps (Passos)**
   - Comandos shell individuais
   - Actions reutilizáveis do marketplace
   - Condicionalidades (`if`)

### 5. **Artefatos (Artifacts)**
   - Armazenamento de resultados
   - Retenção configurável
   - Download para análise posterior

### 6. **Expressões Condicionais**
   - `if: ${{ always() }}`: Sempre executa
   - `if: github.event_name == 'pull_request'`: Se for PR
   - Status checks como `success()`, `failure()`

### 7. **Variáveis de Contexto**
   - `github.sha`: Hash do commit
   - `github.ref_name`: Nome da branch
   - `github.actor`: Usuário que disparou
   - `github.run_number`: Número da execução

---

## 📊 Estrutura de Testes

### Arquivo de Testes: `test/calculostrabalhistas.test.js`

O projeto utiliza **Mocha** como framework de testes e **Node Assert** para validações.

**Testes implementados**:

```javascript
✓ Cálculo de Salário com Bônus
  ├─ Junior (salário + R$50)
  ├─ Pleno (salário + R$100)
  └─ Senior (salário + R$1000)

✓ Cálculo de Venda de Férias
  ├─ Venda de 1 dia
  └─ Venda de 30 dias
```

### Relatórios Gerados

**Formato JSON** (`test-results.json`):
```json
{
  "stats": {
    "tests": 5,
    "passes": 5,
    "failures": 0,
    "duration": 15,
    "start": "2024-06-14T10:30:00.000Z",
    "end": "2024-06-14T10:30:00.015Z"
  },
  "tests": [...]
}
```

---

## 🚀 Como Usar

### Pré-requisitos
- Conta GitHub
- Repositório com este código
- Node.js 20+ (na máquina local)

### Executar Testes Localmente

```bash
# Instalar dependências
npm install

# Rodar testes com verbose
npm run test:verbose

# Rodar testes com relatório JSON
npm test
```

### Disparar Pipeline Manual

1. Vá para `Actions` no repositório GitHub
2. Selecione o workflow desejado:
   - `N1 - Execução Manual`
   - `N2 - Execução Agendada`
   - `N3 - Execução por Push`
   - `N4 - Execução Integrada`
3. Clique em `Run workflow`
4. Aguarde a execução

### Visualizar Resultados

1. **Logs**: Em `Actions` > Workflow > Job
2. **Artefatos**: 
   - Abra o workflow executado
   - Seção `Artifacts`
   - Baixe `test-results-*.json`
3. **Histórico**: Tab `Workflow runs` mostra todas as execuções

---

## 📋 Configurações Importantes

### Node.js Version
Definido em todos os workflows como **v20.x** (LTS)
```yaml
- uses: actions/setup-node@v4
  with:
    node-version: 20.x
```

### Branches Monitoradas
- **Push**: `main`, `master`, `develop`
- **Pull Requests**: `main`, `master`, `develop`
- **Scheduled**: Todas as branches

### Retenção de Artefatos
- Padrão: **30 dias**
- Configurável em cada workflow

### Comandos de Teste
```bash
npm run test           # Roda testes com relatório JSON
npm run test:verbose  # Roda testes com output verboso
```

---

## 📈 Exemplo de Execução Bem-Sucedida

### Workflow N1 - Manual
```
✓ Checkout v4
✓ Setup Node.js 20.x
✓ Installing dependencies (1.2s)
✓ Running unit tests (0.3s)
  ✓ Teste da adição do bonus (3)
  ✓ Testes de calculo de venda de férias (2)
✓ Uploading artifacts
  → test-results-manual (185 bytes)

Total: 5/5 tests passed ✅
Duration: 15s
```

### Workflow N4 - Integrada
```
Job 1: Verificação ✓
Job 2: Testes Unitários ✓
  → test-results-integrated-123.json
Job 3: Relatório Final ✓
  → pipeline-summary-123

Status: SUCCESS ✅
```

---

## 🔍 Troubleshooting

### Testes Falhando na Pipeline

**Problema**: Testes passam localmente mas falham na pipeline

**Solução**:
```bash
# Verificar versão do Node
node --version

# Limpar node_modules
rm -rf node_modules package-lock.json
npm install

# Rodar testes novamente
npm run test:verbose
```

### Artefatos não aparecem

**Problema**: "Artifact not found"

**Solução**:
- Verificar se o workflow completou (não foi cancelado)
- Revisar logs do job para erros
- Confirmar que `path:` existe no workflow

### Cron não está executando

**Problema**: Scheduled workflow não dispara

**Solução**:
- Verificar sintaxe da expressão cron
- Usar https://crontab.guru para validar
- Lembrar que GitHub usa UTC
- Ter pelo menos um push na branch em 60 dias

---

## 📚 Recursos Adicionais

### Documentação Oficial
- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Workflow Syntax](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions)
- [Cron Syntax](https://crontab.guru)

### Actions Utilizadas
- `actions/checkout@v4`: Clone do repositório
- `actions/setup-node@v4`: Instalação do Node.js
- `actions/upload-artifact@v4`: Armazenamento de artefatos
- `actions/download-artifact@v4`: Download de artefatos
- `actions/github-script@v7`: Scripts GitHub

### Referência de Variáveis
- [GitHub Context Variables](https://docs.github.com/en/actions/learn-github-actions/contexts)
- [Default Environment Variables](https://docs.github.com/en/actions/learn-github-actions/environment-variables)

---

## ✅ Checklist de Requisitos

- [x] **Trabalho individual** - Repositório pessoal
- [x] **Utilizar GitHub Actions** - 4 workflows implementados
- [x] **Pipeline executando com sucesso** - Testado manualmente
- [x] **Testes automatizados com sucesso** - Mocha + Assert
- [x] **Relatório armazenado** - JSON em artefatos
- [x] **Conceitos aplicados corretamente** - Triggers, jobs, dependencies
- [x] **Ferramentas utilizadas adequadamente** - Actions, Node.js, npm
- [x] **Documentação completa** - Este README

---

## 📝 Autor
Projeto desenvolvido como trabalho final de Pipeline CI/CD com GitHub Actions

---

## 📄 Licença
ISC

---

## 🎓 Conceitos Demonstrados

Este projeto demonstra:

1. **Integração Contínua**: Testes automáticos a cada push
2. **Entrega Contínua**: Pipeline pronta para deploy
3. **Infrastructure as Code**: Workflows definidos em YAML
4. **Automação**: Eliminação de tarefas manuais
5. **Rastreabilidade**: Logs e relatórios de todas as execuções
6. **Qualidade**: Validação contínua do código
7. **Colaboração**: PRs com testes automáticos

---

**Última atualização**: Junho 2026
**Versão da Pipeline**: 1.0.0
