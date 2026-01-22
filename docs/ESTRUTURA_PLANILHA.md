# 📊 Estrutura da Planilha - TabEx

Este guia detalha a estrutura da planilha Google Sheets utilizada pelo TabEx para tabulação de resultados de exames.

## 📋 Estrutura Básica

A planilha deve seguir exatamente a estrutura abaixo para que o TabEx funcione corretamente.

### Layout de Colunas

| Coluna | Cabeçalho | Tipo de Dado | Descrição |
|--------|-----------|--------------|-----------|
| **A** | Data | Data (DD/MM/AAAA) | Data de coleta do exame |
| **B** | Sódio | Número | Nível de sódio (mEq/L) |
| **C** | Potássio | Número | Nível de potássio (mEq/L) |
| **D** | Cálcio | Número | Nível de cálcio (mg/dL) |
| **E** | Magnésio | Número | Nível de magnésio (mg/dL) |
| **F** | Fósforo | Número | Nível de fósforo (mg/dL) |
| **G** | Ureia | Número | Nível de ureia (mg/dL) |
| **H** | Creatinina | Número | Nível de creatinina (mg/dL) |
| **I** | TFG | Número | Taxa de Filtração Glomerular (mL/min) |

### Exemplo Visual

```
┌────────────┬───────┬──────────┬────────┬──────────┬─────────┬───────┬────────────┬──────┐
│    Data    │ Sódio │ Potássio │ Cálcio │ Magnésio │ Fósforo │ Ureia │ Creatinina │ TFG  │
├────────────┼───────┼──────────┼────────┼──────────┼─────────┼───────┼────────────┼──────┤
│ 08/12/2025 │  140  │   4.5    │  9.2   │   2.1    │   3.5   │  45   │    1.2     │  85  │
│ 15/12/2025 │  138  │   4.2    │  9.0   │   2.0    │   3.8   │  42   │    1.1     │  90  │
│ 22/12/2025 │  142  │   4.7    │  9.1   │   2.2    │   3.6   │  48   │    1.3     │  82  │
└────────────┴───────┴──────────┴────────┴──────────┴─────────┴───────┴────────────┴──────┘
```

---

## 🎨 Criando a Planilha do Zero

### Passo 1: Criar Nova Planilha

1. Acesse [Google Sheets](https://sheets.google.com)
2. Clique em **"Em branco"** para criar nova planilha
3. Renomeie a planilha:
   - Clique em "Planilha sem título" no topo
   - Digite "Exames Tabulados" (ou nome de sua preferência)

### Passo 2: Configurar Cabeçalhos

Na **linha 1**, adicione os cabeçalhos exatamente como mostrado:

| A | B | C | D | E | F | G | H | I |
|---|---|---|---|---|---|---|---|---|
| Data | Sódio | Potássio | Cálcio | Magnésio | Fósforo | Ureia | Creatinina | TFG |

**IMPORTANTE:**
- Os nomes devem estar exatamente como acima (com acentos)
- Use letra maiúscula apenas na primeira letra
- A coluna A é sempre "Data"

### Passo 3: Formatar Coluna de Data

1. Selecione a coluna **A** (clique na letra "A" no topo)
2. Menu: **Formatar** > **Número** > **Data**
3. Ou use o formato personalizado: `dd/mm/yyyy`

### Passo 4: Formatar Colunas Numéricas

1. Selecione as colunas **B até I** (arraste de B até I)
2. Menu: **Formatar** > **Número** > **Número**
3. Defina 1 casa decimal para maior precisão

### Passo 5: Estilizar (Opcional)

**Linha de Cabeçalho:**
- Selecione a linha 1
- Menu: **Formatar** > **Negrito** (ou Ctrl+B)
- Menu: **Formatar** > **Cor de preenchimento** (escolha uma cor de destaque)
- Menu: **Formatar** > **Alinhamento horizontal** > **Centralizar**

**Congelar Linha de Cabeçalho:**
1. Clique na linha 2 (primeira linha de dados)
2. Menu: **Visualizar** > **Congelar** > **1 linha**
3. Agora o cabeçalho fica fixo ao rolar a planilha

**Bordas:**
1. Selecione todas as células com dados (A1:I100, por exemplo)
2. Ícone de **Bordas** na barra de ferramentas
3. Selecione "Todas as bordas"

---

## 📐 Regras de Formato

### Coluna A - Data

**Formato aceito:** `DD/MM/AAAA`

**Exemplos válidos:**
- `08/12/2025`
- `01/01/2026`
- `31/12/2024`

**Formato do Google Sheets:**
- Tipo: Data
- Formato personalizado: `dd/mm/yyyy`

**Como o TabEx identifica:**
- O sistema procura pela data exata no formato `DD/MM/AAAA`
- Se a data já existe, atualiza a linha existente
- Se a data não existe, cria uma nova linha

### Colunas B-I - Valores Numéricos

**Formato aceito:** Números decimais com ponto ou vírgula

**Exemplos válidos:**
- `140` (inteiro)
- `140.5` (decimal com ponto)
- `140,5` (decimal com vírgula - convertido automaticamente)

**Formato do Google Sheets:**
- Tipo: Número
- Casas decimais: 1 ou 2 (recomendado)

**Como o TabEx insere:**
- O sistema sempre converte vírgula para ponto antes de inserir
- Valores são inseridos como `parseFloat()` do JavaScript
- Células vazias permanecem vazias (não são preenchidas com 0)

---

## 🔧 Configurações Avançadas

### Adicionar Novas Colunas

Se você adicionou novos exames (veja [CONFIGURACAO.md](CONFIGURACAO.md)), precisa adicionar as colunas correspondentes:

**Exemplo:** Adicionar coluna "Hemoglobina"

1. **Insira a coluna na planilha:**
   - Clique na coluna J (próxima disponível)
   - Digite o cabeçalho: `Hemoglobina`
   - Formate como número

2. **Atualize o código:**
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
  'Hemoglobina': 9  // ← Nova coluna (J = 9)
}
```

**IMPORTANTE:** O número da coluna no código é **relativo à coluna B**:
- Coluna B = 1
- Coluna C = 2
- Coluna D = 3
- ...
- Coluna J = 9

### Reorganizar Colunas

Se você quiser alterar a ordem das colunas:

1. **Reorganize na planilha:**
   - Clique na letra da coluna (ex: "C")
   - Arraste para a nova posição

2. **Atualize o mapeamento no código:**
```javascript
COLUNAS: {
  'Sódio': 1,     // Coluna B
  'Creatinina': 2, // Coluna C (movida)
  'TFG': 3,       // Coluna D (movida)
  // ... etc
}
```

### Usar Múltiplas Abas

Você pode ter várias abas na mesma planilha:

**Exemplo:** Separar por ano

1. **Crie as abas:**
   - Aba "Exames 2024"
   - Aba "Exames 2025"
   - Aba "Exames 2026"

2. **Altere a configuração conforme necessário:**
```javascript
NOME_ABA: 'Exames 2025'  // ← Aba ativa
```

3. **Para alternar de aba:**
   - Edite `NOME_ABA` no código
   - Salve e execute novamente

---

## 📈 Análise de Dados

### Adicionar Fórmulas

Você pode adicionar colunas extras com fórmulas para análise:

**Coluna J - Variação de Creatinina:**
```
=H2-H1
```
(Diferença em relação ao exame anterior)

**Coluna K - Média Móvel (últimos 3 exames):**
```
=AVERAGE(H2:H4)
```

**Coluna L - Status:**
```
=IF(H2<0.7, "Baixo", IF(H2>1.3, "Alto", "Normal"))
```
(Classificação baseada em valores de referência)

### Criar Gráficos

**Gráfico de Linha - Evolução Temporal:**

1. Selecione as colunas A e H (Data e Creatinina)
2. Menu: **Inserir** > **Gráfico**
3. Tipo: **Gráfico de linhas**
4. Personalize título, eixos e cores

**Gráfico de Colunas - Comparação de Exames:**

1. Selecione a última linha de dados (todos os exames de uma data)
2. Menu: **Inserir** > **Gráfico**
3. Tipo: **Gráfico de colunas**
4. Útil para visualizar todos os valores de uma vez

### Formatação Condicional

**Destacar valores fora da faixa:**

**Exemplo: Creatinina (normal: 0.7-1.3 mg/dL)**

1. Selecione a coluna H (Creatinina)
2. Menu: **Formatar** > **Formatação condicional**
3. Adicione regra:
   - **Condição:** Maior que `1.3`
   - **Formato:** Vermelho claro
4. Adicione outra regra:
   - **Condição:** Menor que `0.7`
   - **Formato:** Amarelo claro

---

## 🐛 Troubleshooting

### Problema: Valores aparecem na coluna errada

**Causa:** Mapeamento `CONFIG.COLUNAS` não corresponde à planilha

**Solução:**
1. Verifique a ordem das colunas na planilha
2. Conte: B=1, C=2, D=3, etc.
3. Atualize o mapeamento no código

### Problema: Datas duplicadas

**Causa:** O sistema criou uma nova linha em vez de atualizar a existente

**Solução:**
1. Verifique o formato da coluna A (deve ser Data, não Texto)
2. Verifique se as datas estão no formato `DD/MM/AAAA`
3. Remova linhas duplicadas manualmente
4. Execute novamente o processamento

### Problema: Valores não aparecem

**Causa 1:** Nome do exame no código não corresponde ao cabeçalho da planilha

**Solução:**
- Verifique se os nomes são exatamente iguais (incluindo acentos)
- Exemplo: "Sódio" no código deve ser "Sódio" na planilha (não "Sodio")

**Causa 2:** Nome da aba está incorreto

**Solução:**
- Verifique `CONFIG.NOME_ABA` no código
- Deve corresponder exatamente ao nome da aba na planilha

### Problema: Formato de data incorreto

**Causa:** Google Sheets está usando formato de data diferente (ex: MM/DD/YYYY)

**Solução:**
1. Selecione a coluna A
2. Menu: **Formatar** > **Número** > **Mais formatos** > **Mais formatos de data e hora**
3. Escolha: `dd/mm/yyyy`
4. Ou use formato personalizado: `dd/mm/yyyy`

---

## 📸 Template de Planilha

Você pode fazer uma cópia de uma planilha modelo (se disponível) ou criar do zero seguindo este guia.

### Download do Template

*[Futuro: Link para planilha modelo compartilhada]*

### Criar a Sua Própria

Siga os passos 1-5 em "Criando a Planilha do Zero" acima.

---

## 📞 Suporte

Para dúvidas sobre a estrutura da planilha:

1. Verifique [CONFIGURACAO.md](CONFIGURACAO.md) para personalização
2. Veja [INSTALACAO.md](INSTALACAO.md) para problemas iniciais
3. Consulte o [README.md](../README.md) principal
4. Abra uma Issue no GitHub

---

**A estrutura correta da planilha é essencial para o funcionamento do TabEx!** ✅
