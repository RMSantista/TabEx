# 📦 Guia de Instalação - TabEx

Este guia apresenta o passo a passo completo para instalar e configurar o TabEx.

## 📋 Pré-requisitos

Antes de começar, você precisará de:

- ✅ Conta Google ativa (Gmail)
- ✅ Acesso ao Google Drive
- ✅ Acesso ao Google Sheets
- ✅ Conhecimento básico de navegação no Google Apps Script (opcional)

## 🎯 Passo 1: Criar as Pastas no Google Drive

1. Acesse [Google Drive](https://drive.google.com)
2. Crie uma pasta chamada **"Exames"**
   - Esta pasta receberá os PDFs para processamento
3. Dentro da pasta "Exames", crie uma subpasta chamada **"Anteriores"**
   - Esta pasta armazenará os PDFs processados organizados por data

**Estrutura esperada:**
```
Meu Drive/
└── Exames/
    └── Anteriores/
```

## 🎯 Passo 2: Criar a Planilha Google Sheets

1. Acesse [Google Sheets](https://sheets.google.com)
2. Crie uma nova planilha em branco
3. Renomeie a planilha para "Exames Tabulados" (ou nome de sua preferência)
4. Crie a estrutura de colunas conforme abaixo:

| Coluna A | Coluna B | Coluna C | Coluna D | Coluna E | Coluna F | Coluna G | Coluna H | Coluna I |
|----------|----------|----------|----------|----------|----------|----------|----------|----------|
| **Data** | **Sódio** | **Potássio** | **Cálcio** | **Magnésio** | **Fósforo** | **Ureia** | **Creatinina** | **TFG** |

**Importante:**
- A primeira linha deve conter exatamente esses cabeçalhos
- A coluna A é reservada para datas
- As colunas B-I são para os valores dos exames
- Veja [ESTRUTURA_PLANILHA.md](ESTRUTURA_PLANILHA.md) para detalhes completos

5. Salve a planilha

## 🎯 Passo 3: Obter os IDs Necessários

### ID da Pasta "Exames"

1. Abra a pasta "Exames" no Google Drive
2. Copie o ID da URL do navegador:
   ```
   https://drive.google.com/drive/folders/[COPIE_ESTE_ID]
   ```
3. Anote este ID (exemplo: `1YQd7_Bl7PxJ9foUXmORL3zMDFFF3LK0Z`)

### ID da Pasta "Anteriores"

1. Abra a pasta "Anteriores" no Google Drive
2. Copie o ID da URL do navegador:
   ```
   https://drive.google.com/drive/folders/[COPIE_ESTE_ID]
   ```
3. Anote este ID (exemplo: `1Eix7akgMqKpXmBgXY_qn3CZ7eFBn6uup`)

### ID da Planilha

1. Abra a planilha "Exames Tabulados" no Google Sheets
2. Copie o ID da URL do navegador:
   ```
   https://docs.google.com/spreadsheets/d/[COPIE_ESTE_ID]/edit
   ```
3. Anote este ID (exemplo: `1ize4bVksT-DpX4DGCAeO2IjrPYqCc_01HxiXRpQQDfU`)

## 🎯 Passo 4: Criar o Projeto no Google Apps Script

1. Acesse [Google Apps Script](https://script.google.com)
2. Clique em **"Novo projeto"**
3. Renomeie o projeto para **"TabEx"** (clique em "Projeto sem título" no topo)
4. Delete todo o código de exemplo que aparece no editor
5. Abra o arquivo `src/Code.gs` deste repositório
6. Copie **TODO** o conteúdo do arquivo
7. Cole no editor do Google Apps Script
8. Clique em **Salvar** (ícone de disquete ou Ctrl+S)

## 🎯 Passo 5: Configurar os IDs no Código

1. No editor do Google Apps Script, localize o objeto `CONFIG` (linhas 18-29)
2. Substitua os IDs pelos seus próprios IDs anotados anteriormente:

```javascript
const CONFIG = {
  PASTA_EXAMES_ID: 'SEU_ID_DA_PASTA_EXAMES',           // ← Cole aqui
  PASTA_ANTERIORES_ID: 'SEU_ID_DA_PASTA_ANTERIORES',   // ← Cole aqui
  PLANILHA_ID: 'SEU_ID_DA_PLANILHA',                   // ← Cole aqui
  NOME_ABA: 'Exames',  // Ou o nome da sua aba
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

3. Salve novamente o projeto (Ctrl+S)

## 🎯 Passo 6: Autorizar Permissões

1. No menu superior, selecione a função **`configurarGatilho`** no dropdown
2. Clique em **"Executar"** (ícone ▶️)
3. Uma janela solicitará autorização:
   - Clique em **"Revisar permissões"**
   - Escolha sua conta Google
   - Clique em **"Avançado"**
   - Clique em **"Ir para TabEx (não seguro)"**
   - Clique em **"Permitir"**

**Permissões necessárias:**
- Ver e gerenciar arquivos do Google Drive
- Ver e gerenciar planilhas do Google Sheets
- Ver e gerenciar documentos do Google Docs (para OCR temporário)
- Executar como gatilho temporal

4. Aguarde a execução terminar (veja o log de execução)
5. Você verá a mensagem: `✅ Gatilho configurado para cada 5 minutos`

## 🎯 Passo 7: Testar o Sistema

### Teste Manual

1. Faça upload de um PDF de exame na pasta "Exames"
2. No Google Apps Script, selecione a função **`processarNovosExames`**
3. Clique em **"Executar"**
4. Verifique o log de execução (View > Logs ou Ctrl+Enter):
   - Deve mostrar o processamento do PDF
   - Deve exibir a data extraída
   - Deve listar os exames encontrados
5. Verifique sua planilha:
   - Deve haver uma nova linha com a data
   - Os valores dos exames devem estar preenchidos
6. Verifique a pasta "Anteriores":
   - O PDF deve ter sido movido para uma subpasta com a data

### Teste com Gatilho Automático

1. Faça upload de outro PDF de exame na pasta "Exames"
2. Aguarde até 5 minutos
3. Verifique se o PDF foi processado automaticamente
4. Confirme que a planilha foi atualizada
5. Confirme que o PDF foi movido para "Anteriores"

## 🎯 Passo 8: Monitoramento

### Ver Status do Sistema

1. No Google Apps Script, selecione a função **`verStatus`**
2. Clique em **"Executar"**
3. Veja o log de execução para estatísticas:
   - Quantos PDFs estão aguardando processamento
   - Quantos PDFs já foram processados
   - Quantas pastas de data foram criadas

### Debug de OCR

Se o OCR não estiver funcionando corretamente:

1. Coloque um PDF na pasta "Exames"
2. Execute a função **`debugVerTexto`**
3. Veja o log de execução para verificar o texto extraído
4. Confirme se o texto contém os dados esperados

## ⚙️ Configurações Avançadas

### Desativar o Gatilho Automático

Se quiser processar manualmente em vez de automaticamente:

1. Execute a função **`removerGatilho`**
2. Agora você precisa executar `processarNovosExames()` manualmente

### Reprocessar Todos os Exames

Se você atualizou o código e quer reprocessar todos os PDFs:

1. Execute a função **`reprocessarTodos`**
2. Todos os PDFs de "Anteriores" voltarão para "Exames"
3. O gatilho automático (se ativo) processará novamente
4. Ou execute `processarNovosExames()` manualmente

## 🚨 Solução de Problemas

### Erro: "Permissão negada"

- Execute `configurarGatilho()` novamente e autorize todas as permissões

### Erro: "Pasta não encontrada" ou "Planilha não encontrada"

- Verifique se os IDs estão corretos no objeto `CONFIG`
- Confirme que você tem acesso às pastas/planilhas com a conta que autorizou o script

### PDFs não são processados

- Verifique se os PDFs estão na pasta correta ("Exames")
- Confirme que os arquivos são PDFs válidos (tipo MIME `application/pdf`)
- Execute `verStatus()` para ver quantos arquivos estão aguardando

### OCR não funciona

- Verifique a qualidade do PDF (deve ser legível)
- Confirme que o PDF não está protegido por senha
- Execute `debugVerTexto()` para ver o que o OCR está extraindo

### Valores não aparecem na planilha

- Verifique se a estrutura da planilha está correta (veja [ESTRUTURA_PLANILHA.md](ESTRUTURA_PLANILHA.md))
- Confirme que o nome da aba no `CONFIG.NOME_ABA` corresponde ao nome real da aba
- Execute `debugVerTexto()` para verificar se os valores estão sendo detectados no texto

## 📞 Suporte

Se você encontrou um problema não listado aqui:

1. Verifique a seção de Issues no GitHub
2. Abra uma nova Issue com:
   - Descrição do problema
   - Logs de execução (remova informações sensíveis)
   - Versão do TabEx
   - Passos para reproduzir o erro

## ✅ Próximos Passos

Após a instalação bem-sucedida:

- Leia [CONFIGURACAO.md](CONFIGURACAO.md) para personalizar o sistema
- Veja [ESTRUTURA_PLANILHA.md](ESTRUTURA_PLANILHA.md) para detalhes sobre a planilha
- Comece a fazer upload dos seus PDFs de exames!

---

**Parabéns! O TabEx está instalado e funcionando.** 🎉
