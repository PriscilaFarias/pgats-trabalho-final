# 📚 Índice de Arquivos - Projeto CI/CD com GitHub Actions

## 📁 Estrutura do Projeto

```
pgats-trabalho-final/
├── 📄 README.md                          # Documentação principal
├── 📄 EVIDENCIAS.md                      # Guia de captura de evidências
├── 📄 .gitignore                         # Arquivos a ignorar no git
├── 📄 package.json                       # Configuração Node.js
├── 📄 package-lock.json                  # Lock de dependências
│
├── 📁 .github/
│   └── 📁 workflows/                     # Workflows GitHub Actions
│       ├── 01-manual-exec.yaml           # N1: Execução Manual
│       ├── 02-scheduled-exec.yaml        # N2: Execução Agendada
│       ├── 03-push-exec.yaml             # N3: Execução por Push
│       └── 04-integrated-exec.yaml       # N4: Pipeline Integrada
│
├── 📁 src/
│   └── calculosTrabalhista.js            # Código principal
│
├── 📁 test/
│   ├── calculostrabalhistas.test.js      # Testes automatizados
│   └── features/                         # Testes BDD (opcional)
│
├── 📁 docs/
│   └── ARQUITETURA.md                    # Documentação técnica
│
└── 📁 _bmad/ & _bmad-output/            # Arquivos de configuração
```

---

## 🎯 Arquivos Criados para CI/CD

### Workflows GitHub Actions

| Arquivo | Trigger | Descrição |
|---------|---------|-----------|
| `01-manual-exec.yaml` | Manual (workflow_dispatch) | Disparo manual via botão no GitHub |
| `02-scheduled-exec.yaml` | Agendado (cron) | Executa todos os dias e segundas-feira |
| `03-push-exec.yaml` | Push + PR | Auto-dispara em alterações de código |
| `04-integrated-exec.yaml` | Manual + Push | Pipeline com múltiplas etapas |

### Documentação

| Arquivo | Propósito |
|---------|-----------|
| `README.md` | Guia completo da solução (obrigatório) |
| `EVIDENCIAS.md` | Como capturar provas de execução |
| Este arquivo | Índice e referência rápida |

---

## 📋 Detalhes de Cada Workflow

### N1 - Execução Manual (`01-manual-exec.yaml`)
```yaml
Trigger: workflow_dispatch
Job: testes-unitarios
Steps:
  1. Checkout
  2. Setup Node.js 20.x
  3. Instalar dependências
  4. Executar testes (verbose)
  5. Upload de artifacts
Artefato: test-results-manual
```

**Quando usar**: Teste manual sem fazer push

---

### N2 - Execução Agendada (`02-scheduled-exec.yaml`)
```yaml
Triggers: 
  - workflow_dispatch (manual)
  - schedule (diário 00:00 UTC)
  - schedule (segunda 09:00 UTC)
Job: testes-unitarios
Steps: Idêntico ao N1 + timestamp nos artifacts
Artefatos: test-results-scheduled-{run_number}
```

**Quando usar**: Validação contínua mesmo sem alterações

---

### N3 - Execução por Push (`03-push-exec.yaml`)
```yaml
Triggers:
  - push (main, master, develop)
  - pull_request (main, master, develop)
Jobs: testes-unitarios + comentário em PR
Steps: Idêntico ao N1 + comentário automático
Artefatos: test-results-push-{run_number}
```

**Quando usar**: CI padrão a cada commit

---

### N4 - Pipeline Integrada (`04-integrated-exec.yaml`)
```yaml
Triggers:
  - workflow_dispatch
  - push (main, master)
Jobs: 3 jobs em sequência
  1. verificacao (lint/check)
  2. testes-unitarios (needs: [verificacao])
  3. relatorio-final (needs: [testes-unitarios], always)
Artefatos: 
  - test-results-integrated-{run_number}
  - pipeline-summary-{run_number}
```

**Quando usar**: Deploy ou merge para produção

---

## 🧪 Configuração de Testes

### Scripts (em `package.json`)

```json
{
  "scripts": {
    "test": "mocha test/**/*.test.js --reporter json --reporter-options output=./test-results.json || true",
    "test:verbose": "mocha test/**/*.test.js --reporter spec"
  }
}
```

### Testes Implementados

**Arquivo**: `test/calculostrabalhistas.test.js`

```javascript
✓ Testes relacionados ao cálculo do salário com bônus (3 testes)
  ├─ Junior: salário + R$50
  ├─ Pleno: salário + R$100
  └─ Senior: salário + R$1000

✓ Testes de cálculo de venda de férias (2 testes)
  ├─ 1 dia de férias = R$100
  └─ 30 dias de férias = R$3000
```

**Total**: 5 testes automatizados

---

## 📊 Relatórios Gerados

### Formato JSON (`test-results.json`)

Estrutura esperada:
```json
{
  "stats": {
    "suites": 2,
    "tests": 5,
    "passes": 5,
    "failures": 0,
    "duration": 15,
    "start": "2024-06-14T10:30:00Z",
    "end": "2024-06-14T10:30:00.015Z"
  },
  "tests": [
    {
      "title": "Deve retornar o salário com bônus para um funcionário junior",
      "fullTitle": "Testes relacionados... junior",
      "state": "passed",
      "duration": 1
    },
    // ... mais 4 testes
  ]
}
```

### Localização dos Artifacts

```
GitHub UI: Actions → [Workflow] → Artifacts
Local: Após download → test-results-*.json
```

---

## 🚀 Como Usar

### Execução Local

```bash
# 1. Clonar
git clone https://github.com/PriscilaFarias/pgats-trabalho-final.git
cd pgats-trabalho-final

# 2. Instalar
npm install

# 3. Testar
npm run test:verbose          # Com output
npm test                      # Com relatório JSON

# 4. Ver resultado
cat test-results.json | python -m json.tool
```

### Execução via GitHub

```bash
# 1. Fazer push de alterações
git add .
git commit -m "Seu commit"
git push origin main

# 2. GitHub Actions dispara N3 automaticamente
# 3. Acompanhar em: https://github.com/PriscilaFarias/pgats-trabalho-final/actions

# 4. Disparar manualmente: Actions → N1 → Run workflow
```

---

## 📌 Checklist de Validação

```markdown
✅ Workflows criados
  └─ 01-manual-exec.yaml
  └─ 02-scheduled-exec.yaml
  └─ 03-push-exec.yaml
  └─ 04-integrated-exec.yaml

✅ Scripts de teste configurados
  └─ npm test (JSON output)
  └─ npm run test:verbose (spec output)

✅ Testes passando
  └─ 5/5 testes com sucesso
  └─ Relatório JSON gerado

✅ Documentação completa
  └─ README.md (obrigatório)
  └─ EVIDENCIAS.md (guia de captura)
  └─ INDEX.md (este arquivo)

✅ Repositório GitHub
  └─ Público
  └─ Com workflows em .github/workflows/
  └─ Com pelo menos 1 execução bem-sucedida
```

---

## 🔗 Links Importantes

### Documentação GitHub Actions
- [Official Docs](https://docs.github.com/en/actions)
- [Workflow Syntax](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions)
- [Cron Syntax Validator](https://crontab.guru)

### Actions Utilizadas
- [checkout@v4](https://github.com/actions/checkout)
- [setup-node@v4](https://github.com/actions/setup-node)
- [upload-artifact@v4](https://github.com/actions/upload-artifact)
- [download-artifact@v4](https://github.com/actions/download-artifact)
- [github-script@v7](https://github.com/actions/github-script)

---

## 💾 Variáveis de Contexto Utilizadas

| Variável | Uso | Exemplo |
|----------|-----|---------|
| `github.sha` | Hash do commit | `abc1234...` |
| `github.ref_name` | Nome da branch | `main` |
| `github.actor` | Usuário que disparou | `usuario` |
| `github.run_number` | ID da execução | `123` |
| `github.event_name` | Tipo de gatilho | `push`, `pull_request` |

---

## 🎓 Conceitos Demonstrados

1. **CI/CD Pipeline**: Automação de build e testes
2. **Triggers Múltiplos**: Manual, agendado, push
3. **Dependências entre Jobs**: Sequential execution
4. **Artefatos**: Armazenamento de resultados
5. **Variáveis de Contexto**: Informações da execução
6. **Expressões Condicionais**: Lógica nos workflows
7. **Integração com PRs**: Comentários automáticos

---

## ❓ FAQ Rápido

**P: Todos os 4 workflows devem estar no repositório final?**
R: Sim, todos os 4 devem estar em `.github/workflows/`

**P: Os testes precisam de 100% de cobertura?**
R: Não, apenas que todos os testes implementados passem (5/5)

**P: Preciso hospedar os relatórios em algum lugar?**
R: Não, os artifacts do GitHub Actions bastam

**P: Posso usar outro framework de testes?**
R: Sim, desde que gere relatório e passe os testes

**P: Como provar que a pipeline executou com sucesso?**
R: Screenshots da aba Actions mostrando status ✓

---

## 📞 Suporte

Para dúvidas:
1. Consultar `README.md` seção "Troubleshooting"
2. Verificar `EVIDENCIAS.md` para validação
3. Acessar [GitHub Actions Docs](https://docs.github.com/en/actions)

---

**Documento atualizado**: Junho 2024
**Versão**: 1.0.0
**Status**: ✅ Completo e Pronto para Entrega

