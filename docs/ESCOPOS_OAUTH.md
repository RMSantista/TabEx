# Escopos OAuth (Permissões)

O TabEx solicita os seguintes escopos OAuth ao ser executado pela primeira vez. Cada escopo é necessário para uma funcionalidade específica do sistema.

## Escopos Utilizados

| Escopo | Motivo |
|--------|--------|
| `auth/drive` | Leitura de PDFs na pasta de exames, upload para OCR (cria documento temporário), movimentação de arquivos entre pastas e criação de subpastas por data |
| `auth/spreadsheets` | Leitura e escrita na planilha de tabulação (inserir datas e resultados dos exames) |
| `auth/documents` | Leitura do texto extraído via OCR (o Drive converte o PDF em Google Docs temporário) |
| `auth/script.scriptapp` | Criação e remoção de gatilhos automáticos (trigger de 5 em 5 minutos) |

## Por que `auth/drive` e não `auth/drive.file`?

O escopo `auth/drive.file` é mais restritivo (só acessa arquivos criados pelo script), mas o TabEx precisa acessar PDFs que o **usuário** coloca na pasta — arquivos que não foram criados pelo script. Por isso, o escopo completo `auth/drive` é necessário.

## Documento temporário de OCR

Durante o processamento, o TabEx cria um Google Docs temporário para cada PDF (é assim que a API do Drive faz OCR). Esse documento é automaticamente enviado para a lixeira logo após a extração do texto.
