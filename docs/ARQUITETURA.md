# 🏗️ Arquitetura Técnica - Pipeline CI/CD

## Visão Geral da Arquitetura

```
┌────────────────────────────────────────────────────────────────────────┐
│                      CAMADA DE GATILHOS (TRIGGERS)                      │
├────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────┐  ┌────────────────┐   │
│  │   Manual    │  │   Agendado   │  │  Push   │  │   Integrada    │   │
│  │  dispatch   │  │   (cron)     │  │  (push) │  │  (manual+push) │   │
│  └──────┬──────┘  └────────┬─────┘  └────┬────┘  └────────┬───────┘   │
│         │                  │             │               │             │
│         └──────────────────┼─────────────┼───────────────┘             │
│                            │             │                             │
│                            ▼             ▼                             │
└────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────┐
│                    CAMADA DE EXECUÇÃO (JOBS)                            │
├────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  N1, N2, N3 ─────┐     N4 (Integrada)                                  │
│                  │                                                      │
│                  └──→ ┌──────────────┐                                  │
│                      │ Verificação  │                                  │
│                      │ (lint/check) │                                  │
│                      └───────┬──────┘                                  │
│                              │ [needs]                                 │
│                              ▼                                          │
│                      ┌──────────────────┐                              │
│                      │ Testes Unitários │                              │
│                      │ + Relatórios     │                              │
│                      └───────┬──────────┘                              │
│                              │ [needs]                                 │
│                              ▼                                          │
│                      ┌──────────────────┐                              │
│                      │ Relatório Final  │                              │
│                      │ (always run)     │                              │
│                      └──────────────────┘                              │
│                                                                          │
└────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────┐
│                    CAMADA DE PROCESSAMENTO (STEPS)                      │
├────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────┐       │
│  │ 1. Checkout                                                 │       │
│  │    └─ actions/checkout@v4                                   │       │
│  └─────────────────────────────────────────────────────────────┘       │
│                            ▼                                            │
│  ┌─────────────────────────────────────────────────────────────┐       │
│  │ 2. Setup Node.js 20.x                                       │       │
│  │    └─ actions/setup-node@v4                                 │       │
│  └─────────────────────────────────────────────────────────────┘       │
│                            ▼                                            │
│  ┌─────────────────────────────────────────────────────────────┐       │
│  │ 3. Instalar Dependências                                    │       │
│  │    └─ npm ci                                                │       │
│  └─────────────────────────────────────────────────────────────┘       │
│                            ▼                                            │
│  ┌─────────────────────────────────────────────────────────────┐       │
│  │ 4. Executar Testes                                          │       │
│  │    ├─ Mocha: mocha test/**/*.test.js                       │       │
│  │    ├─ Output: Spec (terminal) + JSON (relatório)           │       │
│  │    └─ Assert: Node.js built-in (sem dependência extra)     │       │
│  └─────────────────────────────────────────────────────────────┘       │
│                            ▼                                            │
│  ┌─────────────────────────────────────────────────────────────┐       │
│  │ 5. Upload Artifacts                                         │       │
│  │    ├─ Arquivo: test-results.json                            │       │
│  │    ├─ Retenção: 30 dias                                    │       │
│  │    └─ Path: ./test-results.json                            │       │
│  └─────────────────────────────────────────────────────────────┘       │
│                                                                          │
└────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────┐
│                    CAMADA DE SAÍDA (ARTIFACTS)                          │
├────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌─────────────────────┐  ┌──────────────────┐  ┌──────────────────┐  │
│  │ test-results-       │  │ test-results-    │  │ test-results-    │  │
│  │ manual              │  │ scheduled-XXX    │  │ push-XXX         │  │
│  │                     │  │                  │  │                  │  │
│  │ (N1)                │  │ (N2)             │  │ (N3)             │  │
│  └─────────────────────┘  └──────────────────┘  └──────────────────┘  │
│                                                                          │
│  ┌──────────────────────────┐    ┌──────────────────────────────┐     │
│  │ test-results-integrated  │    │ pipeline-summary-XXX         │     │
│  │ -XXX                     │    │                              │     │
│  │                          │    │ (N4 Integrada)               │     │
│  │ (N4)                     │    │                              │     │
│  └──────────────────────────┘    └──────────────────────────────┘     │
│                                                                          │
│  📊 Formato JSON:                                                       │
│  {                                                                      │
│    "stats": {                                                          │
│      "tests": 5,                                                       │
│      "passes": 5,                                                      │
│      "failures": 0,                                                    │
│      "duration": 15                                                    │
│    },                                                                  │
│    "tests": [ ... ]                                                    │
│  }                                                                      │
│                                                                          │
└────────────────────────────────────────────────────────────────────────┘
```

---

## Fluxo de Dados Detalhado

### N1 - Execução Manual

```
Usuário clica "Run workflow"
        │
        ▼
   Workflow Dispara (workflow_dispatch)
        │
        ├─→ Checkout do código
        │    └─ git clone https://github.com/PriscilaFarias/pgats-trabalho-final.git
        │
        ├─→ Setup Node.js 20.x
        │    └─ node --version → v20.x.x
        │
        ├─→ npm ci (Install Clean)
        │    └─ ~/.npm/node_modules atualizado
        │
        ├─→ npm run test:verbose
        │    └─ mocha test/**/*.test.js --reporter spec
        │       └─ Output no terminal:
        │          ✓ Teste 1
        │          ✓ Teste 2
        │          ...
        │          5 passing (15ms)
        │
        └─→ Upload Artifacts
             └─ test-results-manual (185 bytes)
                 Disponível para download por 30 dias

Status: ✅ SUCCESS
Duração: ~15s
```

### N3 - Execução por Push

```
Desenvolvedor: git push origin main
        │
        ▼
GitHub detecta push
        │
        ├─→ Verifica .github/workflows/03-push-exec.yaml
        │
        ├─→ Cria novo run (com ID único)
        │
        ├─→ Executa job: testes-unitarios
        │    ├─ Checkout
        │    ├─ Setup Node
        │    ├─ npm ci
        │    ├─ npm run test:verbose
        │    │   └─ 5/5 tests passed ✓
        │    └─ Upload artifacts
        │
        ├─→ Adiciona status check no commit
        │    └─ ✓ testes-unitarios
        │
        └─→ Comenta no PR (se aplicável)
             └─ "✅ Testes executados com sucesso!"

Status: ✅ SUCCESS (visível no GitHub UI)
Branch: protegida se all checks passed
```

### N4 - Pipeline Integrada

```
Gatilho: manual (workflow_dispatch) OU push para main
        │
        ▼
   Job 1: verificacao
   ├─ Checkout
   ├─ Setup Node
   ├─ npm ci
   ├─ Verificações básicas
   └─ Status: ✅ SUCCESS
        │ [needs]
        ▼
   Job 2: testes-unitarios (inicia só após Job 1)
   ├─ Checkout
   ├─ Setup Node
   ├─ npm ci
   ├─ npm run test (com JSON output)
   ├─ npm run test:verbose (com spec output)
   ├─ Upload: test-results-integrated-XXX
   └─ Status: ✅ SUCCESS
        │ [needs]
        ▼
   Job 3: relatorio-final (sempre executa)
   ├─ Download: test-results-integrated-XXX
   ├─ Gerar resumo:
   │  ├─ Data: 2024-06-14
   │  ├─ Commit: abc1234...
   │  ├─ Branch: main
   │  └─ Executor: usuario
   ├─ Upload: pipeline-summary-XXX
   └─ Status: ✅ SUCCESS

Resultado Final:
├─ Todos os 3 jobs completados
├─ 2 artifacts disponíveis
├─ Tempo total: ~30-60s
└─ Pronto para deploy/merge
```

---

## Estrutura de Dependências

### Sem Dependências (N1, N2, N3)

```
┌──────────────────┐
│ testes-unitarios │
└──────────────────┘
  └─ Rodam independentemente
  └─ Em máquinas separadas (se múltiplos jobs)
  └─ Tempo total: 1 job × 15s = 15s
```

### Com Dependências (N4)

```
┌──────────────────┐
│  verificacao     │  (Executa sempre primeiro)
└────────┬─────────┘
         │ needs: [verificacao]
         ▼
┌──────────────────────┐
│ testes-unitarios     │  (Só depois verificacao OK)
└────────┬─────────────┘
         │ needs: [testes-unitarios]
         ▼
┌──────────────────────┐
│ relatorio-final      │  (Sempre executa, mesmo se erro anterior)
└──────────────────────┘

Tempo total: 15s + 15s + 5s = 35s (sequencial)
vs. 15s se rodassem paralelo (não é o caso aqui)
```

---

## Variáveis e Contexto

```
Job Context:
├─ github.sha              → "abc1234def5678"
├─ github.ref_name         → "main"
├─ github.actor            → "usuario"
├─ github.run_number       → "123"
├─ github.event_name       → "push" | "workflow_dispatch" | "schedule"
└─ github.server_url       → "https://github.com"

Artifact Naming:
├─ test-results-manual                    (N1: estático)
├─ test-results-scheduled-${{ run_number }} (N2: com ID)
├─ test-results-push-${{ run_number }}    (N3: com ID)
└─ test-results-integrated-${{ run_number }} (N4: com ID)

Conditional Execution:
├─ if: ${{ always() }}                    → Sempre roda
├─ if: ${{ success() }}                   → Só se sucesso
├─ if: ${{ failure() }}                   → Só se fracasso
└─ if: github.event_name == 'pull_request' → Só em PRs
```

---

## Fluxo de Testes

```
test/calculostrabalhistas.test.js
│
├─ Describe: "Testes relacionados ao cálculo do salário com bônus"
│  │
│  ├─ Describe: "Teste da adição do bonus"
│  │  ├─ it: "Deve retornar o salário com bônus para um funcionário junior"
│  │  │  └─ assert.equal(calcularSalarioComBonus(2000, 'junior'), 2050)
│  │  │     └─ PASS ✓
│  │  │
│  │  ├─ it: "Deve retornar o salário com bônus para um funcionário pleno"
│  │  │  └─ assert.equal(calcularSalarioComBonus(3000, 'pleno'), 3100)
│  │  │     └─ PASS ✓
│  │  │
│  │  └─ it: "Deve retornar o salário com bônus para um funcionário senior"
│  │     └─ assert.equal(calcularSalarioComBonus(5000, 'senior'), 6000)
│  │        └─ PASS ✓
│  │
│  └─ Describe: "Testes de calculo de venda de férias"
│     ├─ it: "Validar que quando vendo 1 dia..."
│     │  └─ assert.equal(calcularVendaFerias(3000, 1), 100)
│     │     └─ PASS ✓
│     │
│     └─ it: "Validar que quando vendo 30 dias..."
│        └─ assert.equal(calcularVendaFerias(3000, 30), 3000)
│           └─ PASS ✓
│
Result: 5 passing, 0 failing (15ms)
```

---

## Integração com GitHub

```
Repository Hooks:
├─ push → Dispara workflow_run "push"
│         └─ N3, N4 (se main/master)
│
├─ pull_request → Dispara workflow_run "pull_request"
│                 └─ N3 (se PR para main/master/develop)
│
└─ schedule → Dispara workflow_run "schedule"
              └─ N2 (cron: '0 0 * * *' = daily)
                   (cron: '0 9 * * 1' = monday 09:00)

GitHub Checks:
├─ Status Check: testes-unitarios
│                └─ ✓ Passed
│                └─ ✗ Failed
│                └─ ⏳ In Progress
│
└─ Artifact Storage:
   ├─ test-results-*.json
   ├─ pipeline-summary-*
   └─ Retention: 30 days (configurável)
```

---

## Tecnologias Utilizadas

| Componente | Tecnologia | Versão | Propósito |
|-----------|-----------|--------|----------|
| CI/CD | GitHub Actions | - | Orquestração |
| Runtime | Node.js | 20.x | Execução |
| Testes | Mocha | 11.7.5 | Framework |
| Assert | Node.js built-in | native | Validação |
| Package Manager | npm | latest | Dependências |
| VCS | Git/GitHub | - | Versionamento |

---

## Performance

```
Tempo de Execução Esperado:

N1 (Manual):
├─ Checkout: ~2s
├─ Setup Node: ~3s
├─ npm ci: ~5s
├─ Tests: ~3s
├─ Upload: ~2s
└─ Total: ~15s

N4 (Integrada):
├─ Job 1 (verificacao): ~10s
├─ Job 2 (testes): ~15s
├─ Job 3 (relatorio): ~5s
└─ Total sequencial: ~30s

Paralelização:
└─ N4 não paralela (sequential com needs)
└─ Mas se 3 workflows rodassem em paralelo:
   └─ Máximo: max(15s, 15s, 15s) = 15s de tempo real
```

---

## Escalabilidade

```
Possíveis Extensões:

1. Adicionar mais steps:
   └─ Linting: eslint test/**/*.js
   └─ Code coverage: Istanbul/nyc
   └─ Security: npm audit
   └─ Build: webpack/rollup

2. Adicionar mais jobs:
   └─ Browser tests: Playwright
   └─ E2E tests: Cypress
   └─ Performance: Benchmarks
   └─ Documentation: API docs generation

3. Notificações:
   └─ Email on failure
   └─ Slack webhooks
   └─ Discord notifications
   └─ Custom webhooks

4. Deployment:
   └─ Deploy to AWS/Azure
   └─ Release to npm
   └─ Generate changelog
   └─ Tag releases
```

---

## Segurança

```
Boas Práticas Implementadas:

✓ Usar ações official (actions/checkout@v4)
✓ Pinned versions (não latest)
✓ Sem secrets expostos (não necessário aqui)
✓ Artifact retention limitado (30 dias)
✓ Repositório público (transparência)
✓ Sem privilégios escalados
✓ npm ci ao invés de npm install (lock file respected)

Possíveis Melhorias:

☐ Adicionar branch protection rules
☐ Require status checks before merge
☐ Dismiss stale PR approvals
☐ CODEOWNERS arquivo
☐ Dependabot para updates
☐ SAST (CodeQL) scanning
```

---

**Documentação Técnica Versão 1.0**
**Atualizado**: Junho 2024
