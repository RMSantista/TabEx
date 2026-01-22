# 🧪 TabEx

> Sistema de Tabulação Automática de Exames Médicos do SUS

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Google Apps Script](https://img.shields.io/badge/Google%20Apps%20Script-V8-green.svg)](https://developers.google.com/apps-script)
[![Status](https://img.shields.io/badge/Status-Funcional-brightgreen.svg)](https://github.com/RMSantista/TabEx)

## 📋 Sobre

TabEx automatiza a tabulação de resultados de exames de sangue do SUS (Ribeirão Preto/SP). O sistema monitora uma pasta do Google Drive, extrai dados de PDFs via OCR e organiza os resultados em uma planilha Google Sheets para acompanhamento ao longo do tempo.

**Caso de uso:** Inicialmente desenvolvido para acompanhamento de eletrólitos e função renal, facilitando o monitoramento de exames periódicos para pacientes em tratamento de saúde renal.

## 🛠️ Tecnologias

- **Google Apps Script (V8)** - Runtime e automação
- **Google Drive API** - OCR nativo para extração de texto de PDFs
- **Google Sheets API** - Armazenamento e tabulação dos resultados
- **Vibe Coding/Engineering** - Desenvolvido com Claude Code (Anthropic)

## ✨ Funcionalidades

- 📁 Monitoramento automático de pasta no Google Drive
- 🔍 OCR nativo via API do Google Drive (português)
- 📊 Tabulação automática em Google Sheets
- 📅 Organização de arquivos por data de coleta
- ✏️ Renomeação automática dos PDFs processados
- ⏰ Execução automática a cada 5 minutos via trigger
- 🔄 Função de reprocessamento em massa
- 🗂️ Suporte para formatos antigos e novos de exames do SUS-RP

## 🧬 Exames Suportados

| Exame | Variações Detectadas |
|-------|---------------------|
| Sódio | sódio, sodio, dosagem de sódio |
| Potássio | potássio, potassio, dosagem de potássio |
| Cálcio | cálcio, calcio, cálcio ionizável |
| Magnésio | magnésio, magnesio, dosagem de magnésio |
| Fósforo | fósforo, fosforo, dosagem de fósforo |
| Ureia | ureia, uréia, dosagem de ureia |
| Creatinina | creatinina |
| TFG | taxa de filtração glomerular, filtração glomerular, tfg |

## 📁 Estrutura de Pastas

```
Google Drive/
└── 📁 Exames/                        ← Coloque os PDFs aqui
    ├── Exame.pdf
    ├── Exame(1).pdf
    ├── Exame(2).pdf
    │
    └── 📁 Anteriores/                ← PDFs processados
        ├── 📁 08-12-2025/
        │   └── Creatinina - 08-12-2025.pdf
        │
        └── 📁 15-12-2025/
            ├── Magnésio - 15-12-2025.pdf
            └── Fósforo - 15-12-2025.pdf
```

## 📊 Estrutura da Planilha

A planilha deve ter a seguinte estrutura (criar manualmente antes de usar):

| Data | Sódio | Potássio | Cálcio | Magnésio | Fósforo | Ureia | Creatinina | TFG |
|------|-------|----------|--------|----------|---------|-------|------------|-----|
| 08/12/2025 | 140 | 4.5 | 9.2 | 2.1 | 3.5 | 45 | 1.2 | 85 |
| 15/12/2025 | 138 | 4.2 | 9.0 | 2.0 | 3.8 | 42 | 1.1 | 90 |

**Importante:**
- A coluna A deve conter as datas no formato DD/MM/AAAA
- As colunas B-I devem conter os cabeçalhos dos exames exatamente como mapeados no código
- A primeira linha deve conter os cabeçalhos
- Veja [docs/ESTRUTURA_PLANILHA.md](docs/ESTRUTURA_PLANILHA.md) para detalhes completos

## 🚀 Instalação

### Opção 1: Via Google Apps Script (Recomendado)

1. Acesse [script.google.com](https://script.google.com)
2. Crie um novo projeto ("Novo projeto")
3. Cole o conteúdo de `src/Code.gs` no editor
4. Atualize os IDs no objeto `CONFIG`:
   - `PASTA_EXAMES_ID`: ID da pasta para upload dos PDFs
   - `PASTA_ANTERIORES_ID`: ID da pasta para arquivos processados
   - `PLANILHA_ID`: ID da planilha de resultados
5. Salve o projeto com um nome descritivo (ex: "TabEx")
6. Execute a função `configurarGatilho()` para ativar o processamento automático

**Veja o guia detalhado:** [docs/INSTALACAO.md](docs/INSTALACAO.md)

### Opção 2: Via Clasp (Desenvolvedores)

```bash
# Instalar clasp
npm install -g @google/clasp

# Login
clasp login

# Clonar este repositório
git clone https://github.com/RMSantista/TabEx.git
cd TabEx

# Criar projeto ou vincular existente
clasp create --type standalone --title "TabEx"
# ou
clasp clone <scriptId>

# Deploy
clasp push
```

## ⚙️ Configuração

### IDs Necessários

Para obter os IDs das pastas e planilha:

- **Pasta do Drive:** Abra a pasta no navegador → copie o ID da URL
  `https://drive.google.com/drive/folders/[ID_AQUI]`

- **Planilha:** Abra a planilha no navegador → copie o ID da URL
  `https://docs.google.com/spreadsheets/d/[ID_AQUI]/edit`

### Adicionar Novos Exames

Para adicionar suporte a novos tipos de exames, edite o objeto `EXAMES` em `src/Code.gs`:

```javascript
'NomeDoExame': {
  detectar: ['variação1', 'variação2', 'variação3'],
  regex: [
    /PADRAO_PRINCIPAL[:\s]+(\d+[.,]\d+)/i,
    /Resultado[\.:\s]+(\d+[.,]\d+)/i
  ]
}
```

E adicione a coluna correspondente no `CONFIG.COLUNAS`:
```javascript
COLUNAS: {
  // ... exames existentes
  'NomeDoExame': 9  // próxima coluna disponível
}
```

**Veja o guia completo:** [docs/CONFIGURACAO.md](docs/CONFIGURACAO.md)

## 📖 Uso

### Funções Disponíveis

Execute estas funções pelo editor do Google Apps Script:

| Função | Descrição |
|--------|-----------|
| `processarNovosExames()` | Processa manualmente todos os PDFs na pasta de exames |
| `configurarGatilho()` | Ativa execução automática a cada 5 minutos |
| `removerGatilho()` | Desativa execução automática |
| `reprocessarTodos()` | Move todos PDFs de Anteriores de volta para reprocessamento |
| `verStatus()` | Mostra estatísticas do sistema (arquivos aguardando/processados) |
| `debugVerTexto()` | Debug: mostra texto OCR extraído do primeiro PDF encontrado |

### Fluxo Normal de Uso

1. **Prepare a planilha**: Crie uma planilha Google Sheets com a estrutura correta (veja [docs/ESTRUTURA_PLANILHA.md](docs/ESTRUTURA_PLANILHA.md))
2. **Configure as pastas**: Crie duas pastas no Google Drive (Exames e Anteriores)
3. **Configure o script**: Atualize os IDs no objeto `CONFIG`
4. **Ative o gatilho**: Execute `configurarGatilho()` para processar automaticamente
5. **Faça upload dos PDFs**: Coloque os PDFs de exames na pasta "Exames"
6. **Aguarde**: O sistema processa automaticamente a cada 5 minutos
7. **Verifique a planilha**: Os resultados aparecem tabulados automaticamente
8. **Arquivos processados**: PDFs processados são movidos para "Anteriores/[data]"

### Workflow do Sistema

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Upload PDF na  │────▶│  Gatilho        │────▶│  OCR via API    │
│  Pasta Exames   │     │  (5 em 5 min)   │     │  Google Drive   │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                                                        │
                                                        ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Move PDF para  │◀────│  Atualiza       │◀────│  Extrai Data +  │
│  Anteriores/    │     │  Planilha       │     │  Resultados     │
│  [data]         │     │                 │     │  (RegExp)       │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

## ⚠️ Limitações

- Desenvolvido e testado especificamente para exames do SUS de Ribeirão Preto/SP
- Requer criação manual da planilha com estrutura correta
- OCR pode falhar em PDFs de baixa qualidade ou com formatação muito diferente
- Não valida automaticamente valores fora da faixa de referência
- Requer permissões completas do Google Drive, Sheets e Docs
- Limitado pela cota de execução do Google Apps Script (6 minutos por execução)

## 🐛 Troubleshooting

### O sistema não está processando PDFs

- Verifique se o gatilho está ativo: Execute `verStatus()` e confira se há PDFs pendentes
- Confirme os IDs das pastas no objeto `CONFIG`
- Verifique as permissões do script (deve ter acesso ao Drive, Sheets e Docs)

### Resultados não aparecem na planilha

- Confirme que a estrutura da planilha está correta (veja [docs/ESTRUTURA_PLANILHA.md](docs/ESTRUTURA_PLANILHA.md))
- Verifique se o `NOME_ABA` no `CONFIG` corresponde ao nome da aba na planilha
- Execute `debugVerTexto()` para verificar o texto extraído do OCR

### OCR não funciona

- Verifique a qualidade do PDF (deve ser legível e não protegido por senha)
- Confirme que o script tem permissão para criar documentos temporários
- Tente processar o PDF manualmente executando `processarNovosExames()`

## 🗺️ Roadmap

- [ ] Suporte a outros municípios/formatos de exames do SUS
- [ ] Geração automática da planilha modelo com estrutura correta
- [ ] Alertas para valores fora da faixa de referência
- [ ] Interface web para configuração e monitoramento
- [ ] Suporte a mais tipos de exames (hemograma completo, lipidograma, etc.)
- [ ] Exportação de dados em formato CSV/JSON
- [ ] Gráficos automáticos de tendência temporal
- [ ] Notificações via email quando novos exames são processados

## 🤝 Contribuição

Contribuições são bem-vindas! Para contribuir:

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/NovoExame`)
3. Commit suas alterações (`git commit -m 'Adiciona suporte a Hemograma'`)
4. Push para a branch (`git push origin feature/NovoExame`)
5. Abra um Pull Request

### Diretrizes de Contribuição

- Mantenha o código documentado (JSDoc)
- Teste com PDFs reais antes de submeter
- Atualize a documentação se adicionar novas funcionalidades
- Siga o padrão de código existente

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para detalhes.

## 👤 Autor

**Rodrigo Marques de Souza**

- **Especialidades**: Automações com e sem Agentes de I.A., Google Workspaces, Desenvolvimento de Aplicações e Aplicativos
- **GitHub**: [@RMSantista](https://github.com/RMSantista)

## 🙏 Agradecimentos

- Google Apps Script pela plataforma robusta de automação
- Claude Code (Anthropic) pelo desenvolvimento assistido por IA
- Comunidade SUS pela inspiração para criar ferramentas que facilitam o acompanhamento de saúde

---

**Feito com ❤️ para facilitar o acompanhamento de saúde**

*Este projeto foi desenvolvido para uso pessoal e educacional. Sempre consulte profissionais de saúde qualificados para interpretação de resultados de exames.*
