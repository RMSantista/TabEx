# ⚙️ Guia de Configuração - TabEx

Este guia apresenta todas as opções de configuração e personalização do TabEx.

## 📋 Índice

- [Configurações Básicas](#configurações-básicas)
- [Alterar IDs das Pastas e Planilha](#alterar-ids-das-pastas-e-planilha)
- [Adicionar Novos Exames](#adicionar-novos-exames)
- [Ajustar RegEx para Outros Formatos](#ajustar-regex-para-outros-formatos)
- [Modificar Intervalo de Processamento](#modificar-intervalo-de-processamento)
- [Personalizar Estrutura da Planilha](#personalizar-estrutura-da-planilha)
- [Troubleshooting](#troubleshooting)

---

## 🎯 Configurações Básicas

Todas as configurações principais estão no objeto `CONFIG` no arquivo `src/Code.gs`:

```javascript
const CONFIG = {
  PASTA_EXAMES_ID: '1YQd7_Bl7PxJ9foUXmORL3zMDFFF3LK0Z',
  PASTA_ANTERIORES_ID: '1Eix7akgMqKpXmBgXY_qn3CZ7eFBn6uup',
  PLANILHA_ID: '1ize4bVksT-DpX4DGCAeO2IjrPYqCc_01HxiXRpQQDfU',
  NOME_ABA: 'Exames',
  COLUNAS: {
    'Sódio': 1,
    'Potássio': 2,
    'Cálcio': 3,
    'Magnésio': 4,
    'Fósforo': 5,
    'Ureia': 6,
    'Creatinina': 7,
    'TFG': 8
  }
};
```

### Parâmetros

| Parâmetro | Descrição | Exemplo |
|-----------|-----------|---------|
| `PASTA_EXAMES_ID` | ID da pasta onde os PDFs são colocados para processamento | `'1YQd7_Bl...'` |
| `PASTA_ANTERIORES_ID` | ID da pasta onde os PDFs processados são arquivados | `'1Eix7ak...'` |
| `PLANILHA_ID` | ID da planilha Google Sheets para tabulação | `'1ize4bV...'` |
| `NOME_ABA` | Nome da aba dentro da planilha | `'Exames'` |
| `COLUNAS` | Mapeamento de exames para colunas (1-indexed) | Ver tabela abaixo |

---

## 🔧 Alterar IDs das Pastas e Planilha

### Quando alterar?

- Você quer usar pastas/planilhas diferentes
- Está configurando o TabEx em uma nova conta
- Quer criar múltiplas instâncias do TabEx

### Como obter os IDs?

#### Pasta do Google Drive:
1. Abra a pasta no navegador
2. Copie o ID da URL:
   ```
   https://drive.google.com/drive/folders/[ESTE_É_O_ID]
   ```

#### Planilha do Google Sheets:
1. Abra a planilha no navegador
2. Copie o ID da URL:
   ```
   https://docs.google.com/spreadsheets/d/[ESTE_É_O_ID]/edit
   ```

### Como alterar?

1. Abra `src/Code.gs` no Google Apps Script
2. Localize o objeto `CONFIG`
3. Substitua os valores:

```javascript
const CONFIG = {
  PASTA_EXAMES_ID: 'SEU_NOVO_ID_AQUI',
  PASTA_ANTERIORES_ID: 'SEU_NOVO_ID_AQUI',
  PLANILHA_ID: 'SEU_NOVO_ID_AQUI',
  // ...
};
```

4. Salve o arquivo (Ctrl+S)
5. Teste executando `processarNovosExames()` manualmente

---

## ➕ Adicionar Novos Exames

### Passo 1: Definir o Exame no Objeto EXAMES

Localize o objeto `EXAMES` em `src/Code.gs` (linhas 34-95) e adicione uma nova entrada:

```javascript
const EXAMES = {
  // ... exames existentes

  'NomeDoExame': {
    detectar: ['variação1', 'variação2', 'variação sem acentos'],
    regex: [
      /PADRAO_DO_EXAME[:\s]+(\d+[.,]\d+)/i,
      /Resultado[\.:\s]+(\d+[.,]\d+)/i
    ]
  }
};
```

### Exemplo: Adicionar Hemoglobina

```javascript
'Hemoglobina': {
  detectar: ['hemoglobina', 'hb', 'dosagem de hemoglobina'],
  regex: [
    /HEMOGLOBINA[:\s]+(\d+[.,]\d+)/i,
    /HB[:\s]+(\d+[.,]\d+)/i,
    /Resultado[\.:\s]+(\d+[.,]\d+)/i
  ]
}
```

### Passo 2: Adicionar Coluna no Mapeamento

Atualize o objeto `CONFIG.COLUNAS`:

```javascript
COLUNAS: {
  'Sódio': 1,
  'Potássio': 2,
  'Cálcio': 3,
  'Magnésio': 4,
  'Fósforo': 5,
  'Ureia': 6,
  'Creatinina': 7,
  'TFG': 8,
  'Hemoglobina': 9  // ← Nova coluna
}
```

**IMPORTANTE:** O número da coluna é relativo à coluna B (primeira coluna de dados). A coluna A sempre contém a data.

### Passo 3: Atualizar a Planilha

1. Abra sua planilha Google Sheets
2. Adicione o cabeçalho "Hemoglobina" na coluna J (próxima disponível)
3. Salve a planilha

### Passo 4: Testar

1. Faça upload de um PDF que contenha o novo exame
2. Execute `processarNovosExames()` manualmente
3. Verifique o log de execução:
   - Deve mostrar "✓ Hemoglobina: [valor]"
4. Verifique a planilha:
   - O valor deve aparecer na coluna correta

---

## 🔍 Ajustar RegEx para Outros Formatos

O TabEx usa expressões regulares (RegEx) para extrair valores dos PDFs. Se os PDFs do seu município têm formato diferente, você precisará ajustar os padrões.

### Como funciona?

Cada exame tem duas partes:

1. **`detectar`**: Lista de palavras-chave que identificam se o exame está no PDF
2. **`regex`**: Lista de padrões RegEx que extraem o valor numérico

### Exemplo: Formato Atual (SUS Ribeirão Preto)

```javascript
'Sódio': {
  detectar: ['sodio', 'sódio', 'dosagem de sodio'],
  regex: [
    /SODIO[:\s]+(\d+[.,]\d+)/i,
    /Resultado[\.:\s]+(\d+[.,]\d+)/i
  ]
}
```

**Como funciona:**
- `detectar`: O sistema verifica se o texto contém "sodio", "sódio" ou "dosagem de sodio"
- `regex`: Se encontrado, tenta extrair o valor usando os padrões:
  1. Procura "SODIO" seguido de `:` ou espaços e um número (ex: `SODIO: 140.5`)
  2. Procura "Resultado" seguido de `.`, `:` ou espaços e um número (ex: `Resultado: 140.5`)

### Como ajustar para seu formato?

#### Passo 1: Obter o Texto OCR

1. Coloque um PDF na pasta "Exames"
2. Execute `debugVerTexto()` no Google Apps Script
3. Copie o texto extraído do log de execução

#### Passo 2: Identificar o Padrão

Procure no texto como o exame aparece. Exemplos:

```
Formato 1 (Ribeirão Preto novo):
SODIO
Resultado: 140.5
Referência: 135-145

Formato 2 (Ribeirão Preto antigo):
SODIO: 140.5 mEq/L

Formato 3 (Hipotético):
Sódio (Na+) ............. 140.5 mEq/L
```

#### Passo 3: Criar o RegEx

Para o **Formato 3** acima, o RegEx seria:

```javascript
'Sódio': {
  detectar: ['sodio', 'sódio', 'na+'],
  regex: [
    /S[OÓ]DIO\s*\(Na\+\)\s*\.+\s*(\d+[.,]\d+)/i,
    /Resultado[\.:\s]+(\d+[.,]\d+)/i  // Fallback genérico
  ]
}
```

**Explicação do RegEx:**
- `S[OÓ]DIO`: Aceita "SODIO" ou "SÓDIO"
- `\s*`: Zero ou mais espaços
- `\(Na\+\)`: Literal "(Na+)"
- `\s*\.+\s*`: Espaços, pontos, espaços
- `(\d+[.,]\d+)`: **Captura** o número (grupo 1)
- `/i`: Case-insensitive (maiúsculas/minúsculas)

### Testador de RegEx

Use sites como [regex101.com](https://regex101.com/) para testar seus padrões:

1. Cole o texto OCR na área "Test String"
2. Insira seu RegEx na área "Regular Expression"
3. Selecione "JavaScript" como flavor
4. Verifique se o valor é capturado corretamente

### Dicas de RegEx

| Padrão | Descrição | Exemplo |
|--------|-----------|---------|
| `\d+` | Um ou mais dígitos | `140`, `45` |
| `\d+[.,]\d+` | Número decimal | `140.5`, `1,2` |
| `[:\s]+` | Dois pontos ou espaços | `: `, `:`, `  ` |
| `[AÁ]` | A ou Á | `CALCIO`, `CÁLCIO` |
| `.*` | Qualquer caractere (0 ou mais) | `CREATININA - Método X` |
| `\s*` | Zero ou mais espaços | ` `, `  `, `` |
| `(?:...)` | Grupo não-capturado | Para organizar sem capturar |
| `(...)` | Grupo capturado | O valor que queremos |

---

## ⏱️ Modificar Intervalo de Processamento

Por padrão, o TabEx processa novos PDFs **a cada 5 minutos**.

### Alterar o Intervalo

Edite a função `configurarGatilho()` em `src/Code.gs`:

```javascript
function configurarGatilho() {
  const gatilhos = ScriptApp.getProjectTriggers();
  for (const g of gatilhos) {
    if (g.getHandlerFunction() === 'processarNovosExames') {
      ScriptApp.deleteTrigger(g);
    }
  }
  ScriptApp.newTrigger('processarNovosExames')
    .timeBased()
    .everyMinutes(5)  // ← ALTERE AQUI
    .create();
  Logger.log('✅ Gatilho configurado para cada 5 minutos');
}
```

### Opções Disponíveis

| Método | Descrição | Exemplo |
|--------|-----------|---------|
| `.everyMinutes(n)` | A cada N minutos (1, 5, 10, 15, 30) | `.everyMinutes(10)` |
| `.everyHours(n)` | A cada N horas (1, 2, 4, 6, 8, 12) | `.everyHours(1)` |
| `.everyDays(n)` | A cada N dias | `.everyDays(1)` |
| `.atHour(h)` | Diariamente em hora específica | `.everyDays(1).atHour(9)` |

### Exemplos

**A cada 1 minuto (máxima frequência):**
```javascript
.everyMinutes(1)
```

**A cada 1 hora:**
```javascript
.everyHours(1)
```

**Diariamente às 9h:**
```javascript
.everyDays(1).atHour(9)
```

### Aplicar Alterações

Após modificar o código:

1. Salve o arquivo (Ctrl+S)
2. Execute `removerGatilho()` para remover o gatilho antigo
3. Execute `configurarGatilho()` para criar o novo gatilho
4. Verifique o log: deve mostrar a confirmação

---

## 📊 Personalizar Estrutura da Planilha

### Alterar Nome da Aba

Se sua planilha usa um nome diferente de "Exames":

```javascript
const CONFIG = {
  // ...
  NOME_ABA: 'MeusExames',  // ← Altere aqui
  // ...
};
```

### Reorganizar Colunas

Você pode alterar a ordem das colunas na planilha:

**Exemplo:** Colocar TFG antes de Creatinina

1. **Atualize o mapeamento:**
```javascript
COLUNAS: {
  'Sódio': 1,
  'Potássio': 2,
  'Cálcio': 3,
  'Magnésio': 4,
  'Fósforo': 5,
  'Ureia': 6,
  'TFG': 7,         // ← Trocado
  'Creatinina': 8   // ← Trocado
}
```

2. **Reorganize a planilha:**
   - Abra a planilha Google Sheets
   - Arraste as colunas para a ordem desejada
   - Atualize os cabeçalhos

3. **Teste:** Execute `processarNovosExames()` e verifique se os valores aparecem nas colunas corretas

---

## 🐛 Troubleshooting

### Problema: Valores não são extraídos

**Causa:** O RegEx não está correspondendo ao formato do PDF

**Solução:**
1. Execute `debugVerTexto()` para ver o texto OCR
2. Identifique o padrão exato no texto
3. Ajuste o RegEx conforme explicado acima
4. Teste novamente

### Problema: Exame não é detectado

**Causa:** A lista `detectar` não contém as variações usadas no PDF

**Solução:**
1. Execute `debugVerTexto()` para ver o texto OCR
2. Procure como o exame é chamado no texto (ex: "SODIO" vs "Sódio" vs "Na+")
3. Adicione todas as variações à lista `detectar`:
```javascript
detectar: ['sodio', 'sódio', 'na+', 'dosagem de sodio']
```

### Problema: Valores aparecem na coluna errada

**Causa:** O mapeamento `CONFIG.COLUNAS` está incorreto

**Solução:**
1. Abra a planilha e conte as colunas (A=0, B=1, C=2, etc.)
2. Lembre-se: coluna A é sempre a data (não mapeada)
3. Atualize o número da coluna no mapeamento:
```javascript
COLUNAS: {
  'Sódio': 1,  // Coluna B
  'Potássio': 2,  // Coluna C
  // ...
}
```

### Problema: Data não é extraída

**Causa:** O formato de data no PDF é diferente do esperado

**Solução:**
1. Execute `debugVerTexto()` e procure a data no texto OCR
2. Edite a função `extrairData()` em `src/Code.gs`
3. Adicione um novo padrão RegEx:

```javascript
function extrairData(texto) {
  // ... padrões existentes

  // Novo padrão: Data: 08/12/2025
  m = texto.match(/Data[:\s]+(\d{1,2})\/(\d{1,2})\/(\d{4})/i);
  if (m) {
    return pad(m[1]) + '/' + pad(m[2]) + '/' + m[3];
  }

  // ...
}
```

### Problema: Gatilho não executa automaticamente

**Causa:** Gatilho não está configurado ou foi removido

**Solução:**
1. Acesse Google Apps Script
2. Menu: **Gatilhos** (ícone de relógio na barra lateral)
3. Verifique se há um gatilho para `processarNovosExames`
4. Se não houver, execute `configurarGatilho()`

---

## 📞 Suporte

Se você precisar de ajuda adicional:

1. Verifique o [README.md](../README.md) principal
2. Consulte [INSTALACAO.md](INSTALACAO.md) para problemas de configuração inicial
3. Veja [ESTRUTURA_PLANILHA.md](ESTRUTURA_PLANILHA.md) para dúvidas sobre a planilha
4. Abra uma Issue no GitHub com detalhes do problema

---

**Boas configurações!** 🚀
