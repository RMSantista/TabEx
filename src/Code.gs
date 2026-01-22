/**
 * =============================================================================
 * TabEx - SISTEMA DE TABULAÇÃO AUTOMÁTICA DE EXAMES
 * =============================================================================
 *
 * Automatiza a extração e tabulação de resultados de exames de sangue
 * do SUS (Ribeirão Preto/SP) a partir de arquivos PDF.
 *
 * @author Rodrigo Marques de Souza
 * @version 1.0.0
 * @license MIT
 * @repository https://github.com/[usuario]/TabEx
 */

// ============================================================================
// CONFIGURAÇÕES
// ============================================================================

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

// ============================================================================
// PADRÕES DE EXAMES (RegExp para detecção e extração)
// ============================================================================

const EXAMES = {
  'Sódio': {
    detectar: ['sodio', 'sódio', 'dosagem de sodio'],
    regex: [
      /SODIO[:\s]+(\d+[.,]\d+)/i,
      /Resultado[\.:\s]+(\d+[.,]\d+)/i
    ]
  },
  'Potássio': {
    detectar: ['potassio', 'potássio', 'dosagem de potassio'],
    regex: [
      /POT[AÁ]SSIO[:\s]+(\d+[.,]\d+)/i,
      /Resultado[\.:\s]+(\d+[.,]\d+)/i
    ]
  },
  'Cálcio': {
    detectar: ['calcio', 'cálcio', 'calcio ionizavel', 'cálcio ionizável'],
    regex: [
      /C[AÁ]LCIO[^:]*[:\s]+(\d+[.,]\d+)/i,
      /Resultado[\.:\s]+(\d+[.,]\d+)/i
    ]
  },
  'Magnésio': {
    detectar: ['magnesio', 'magnésio', 'dosagem de magnesio'],
    regex: [
      /MAGN[EÉ]SIO[:\s]+(\d+[.,]\d+)/i,
      /Resultado[\.:\s]+(\d+[.,]\d+)/i
    ]
  },
  'Fósforo': {
    detectar: ['fosforo', 'fósforo', 'dosagem de fosforo'],
    regex: [
      /F[OÓ]SFORO[:\s]+(\d+[.,]\d+)/i,
      /Resultado[\.:\s]+(\d+[.,]\d+)/i
    ]
  },
  'Ureia': {
    detectar: ['ureia', 'uréia', 'dosagem de ureia'],
    regex: [
      /UR[EÉ]IA[:\s]+(\d+[.,]\d+)/i,
      /Resultado[\.:\s]+(\d+[.,]\d+)/i
    ]
  },
  'Creatinina': {
    detectar: ['creatinina'],
    regex: [
      /CREATININA[:\s]+(\d+[.,]\d+)/i,
      /Resultado[\.:\s]+(\d+[.,]\d+)/i
    ]
  },
  'TFG': {
    detectar: ['taxa de filtração', 'taxa de filtracao', 'filtração glomerular', 'filtracao glomerular', 'tfg'],
    regex: [
      /(?:TAXA\s+DE\s+FILTRA[ÇC][ÃA]O\s+GLOMERULAR|FILTRA[ÇC][ÃA]O\s+GLOMERULAR)\s*(?:TFG)?[:\s]+(\d+[.,]\d+)/i,
      /TFG[:\s]+(\d+[.,]\d+)/i
    ]
  }
};

// ============================================================================
// GATILHOS (Triggers)
// ============================================================================

/**
 * Configura gatilho para execução automática a cada 5 minutos
 */
function configurarGatilho() {
  const gatilhos = ScriptApp.getProjectTriggers();
  for (const g of gatilhos) {
    if (g.getHandlerFunction() === 'processarNovosExames') {
      ScriptApp.deleteTrigger(g);
    }
  }
  ScriptApp.newTrigger('processarNovosExames')
    .timeBased()
    .everyMinutes(5)
    .create();
  Logger.log('✅ Gatilho configurado para cada 5 minutos');
}

/**
 * Remove o gatilho de execução automática
 */
function removerGatilho() {
  const gatilhos = ScriptApp.getProjectTriggers();
  for (const g of gatilhos) {
    if (g.getHandlerFunction() === 'processarNovosExames') {
      ScriptApp.deleteTrigger(g);
    }
  }
  Logger.log('🛑 Gatilho removido');
}

// ============================================================================
// FUNÇÃO PRINCIPAL
// ============================================================================

/**
 * Processa todos os PDFs na pasta de exames
 * - Extrai texto via OCR
 * - Identifica data e resultados
 * - Atualiza planilha
 * - Move arquivos para pasta organizada por data
 */
function processarNovosExames() {
  const pasta = DriveApp.getFolderById(CONFIG.PASTA_EXAMES_ID);
  const pastaAnteriores = DriveApp.getFolderById(CONFIG.PASTA_ANTERIORES_ID);
  const arquivos = pasta.getFiles();
  let count = 0;

  while (arquivos.hasNext()) {
    const arquivo = arquivos.next();

    if (arquivo.getMimeType() !== 'application/pdf') {
      Logger.log('⏭️ Ignorando: ' + arquivo.getName());
      continue;
    }

    Logger.log('📄 Processando: ' + arquivo.getName());

    try {
      const texto = extrairTextoPDF(arquivo);
      if (!texto) {
        Logger.log('❌ OCR falhou');
        moverArquivo(arquivo, pasta, pastaAnteriores, null);
        continue;
      }

      const data = extrairData(texto);
      if (!data) {
        Logger.log('❌ Data não encontrada');
        moverArquivo(arquivo, pasta, pastaAnteriores, null);
        continue;
      }

      const resultados = extrairResultados(texto);
      if (resultados.length === 0) {
        Logger.log('❌ Nenhum resultado');
        moverArquivo(arquivo, pasta, pastaAnteriores, data);
        continue;
      }

      // Renomear arquivo com nome do exame + data
      const novoNome = gerarNome(resultados, data);
      arquivo.setName(novoNome);
      Logger.log('✏️ Renomeado: ' + novoNome);

      // Atualizar planilha
      atualizarPlanilha(data, resultados);
      Logger.log('📊 Planilha atualizada');

      // Mover para pasta da data
      moverArquivo(arquivo, pasta, pastaAnteriores, data);
      count++;

    } catch (e) {
      Logger.log('❌ Erro: ' + e.message);
    }
  }

  Logger.log(count > 0 ? '✅ ' + count + ' processado(s)' : 'ℹ️ Nenhum novo');
}

// ============================================================================
// OCR - EXTRAÇÃO DE TEXTO
// ============================================================================

/**
 * Extrai texto de PDF usando OCR via API do Google Drive
 * @param {File} pdf - Arquivo PDF do Google Drive
 * @returns {string|null} Texto extraído ou null em caso de erro
 */
function extrairTextoPDF(pdf) {
  try {
    const blob = pdf.getBlob();
    const boundary = '---boundary' + Date.now();

    const metadata = JSON.stringify({
      name: 'temp_' + Date.now(),
      mimeType: 'application/vnd.google-apps.document'
    });

    const payload =
      '--' + boundary + '\r\n' +
      'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
      metadata + '\r\n' +
      '--' + boundary + '\r\n' +
      'Content-Type: application/pdf\r\n' +
      'Content-Transfer-Encoding: base64\r\n\r\n' +
      Utilities.base64Encode(blob.getBytes()) + '\r\n' +
      '--' + boundary + '--';

    const resp = UrlFetchApp.fetch(
      'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&ocrLanguage=pt',
      {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + ScriptApp.getOAuthToken(),
          'Content-Type': 'multipart/related; boundary=' + boundary
        },
        payload: payload,
        muteHttpExceptions: true
      }
    );

    const result = JSON.parse(resp.getContentText());
    if (result.error) return null;

    const doc = DocumentApp.openById(result.id);
    const texto = doc.getBody().getText();
    DriveApp.getFileById(result.id).setTrashed(true);

    Logger.log('OCR: ' + texto.length + ' chars');
    return texto;

  } catch (e) {
    Logger.log('OCR erro: ' + e.message);
    return null;
  }
}

// ============================================================================
// EXTRAÇÃO DE DADOS
// ============================================================================

/**
 * Extrai a data de coleta do texto do exame
 * Suporta formato novo e antigo do SUS Ribeirão Preto
 * @param {string} texto - Texto extraído via OCR
 * @returns {string|null} Data no formato DD/MM/AAAA ou null
 */
function extrairData(texto) {
  // Formato novo: Coleta (08/12/2025 07:48)
  let m = texto.match(/Coleta\s*\((\d{1,2})\/(\d{1,2})\/(\d{4})/i);
  if (m) {
    return pad(m[1]) + '/' + pad(m[2]) + '/' + m[3];
  }

  // Formato antigo: Data de Coleta: 08/12/2025
  m = texto.match(/Data\s+de\s+Coleta[:\s]+(\d{1,2})\/(\d{1,2})\/(\d{4})/i);
  if (m) {
    return pad(m[1]) + '/' + pad(m[2]) + '/' + m[3];
  }

  // Fallback: qualquer data no formato DD/MM/AAAA (ignorando datas antigas)
  const datas = texto.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/g) || [];
  for (const d of datas) {
    const [dia, mes, ano] = d.split('/').map(Number);
    if (ano >= 2024 && mes >= 1 && mes <= 12 && dia >= 1 && dia <= 31) {
      return pad(dia) + '/' + pad(mes) + '/' + ano;
    }
  }

  return null;
}

/**
 * Adiciona zero à esquerda se necessário
 */
function pad(n) {
  return String(n).padStart(2, '0');
}

/**
 * Extrai os resultados de exames do texto
 * @param {string} texto - Texto extraído via OCR
 * @returns {Array} Array de objetos {nome, valor}
 */
function extrairResultados(texto) {
  const resultados = [];
  const textoUpper = texto.toUpperCase();

  for (const [nome, config] of Object.entries(EXAMES)) {
    // Verifica se o exame está no texto
    const encontrado = config.detectar.some(d => textoUpper.includes(d.toUpperCase()));
    if (!encontrado) continue;

    // Tenta cada regex até encontrar um match
    let match = null;
    for (const regex of config.regex) {
      match = texto.match(regex);
      if (match) break;
    }

    if (match) {
      resultados.push({
        nome: nome,
        valor: match[1].replace(',', '.')
      });
    }
  }

  return resultados;
}

// ============================================================================
// PLANILHA
// ============================================================================

/**
 * Atualiza a planilha com os resultados extraídos
 * @param {string} data - Data do exame (DD/MM/AAAA)
 * @param {Array} resultados - Array de {nome, valor}
 */
function atualizarPlanilha(data, resultados) {
  const ss = SpreadsheetApp.openById(CONFIG.PLANILHA_ID);
  let aba = ss.getSheetByName(CONFIG.NOME_ABA) || ss.getSheets()[0];

  // Buscar linha da data
  const ultimaLinha = Math.max(aba.getLastRow(), 1);
  const datas = aba.getRange(1, 1, ultimaLinha, 1).getValues();

  let linha = -1;
  for (let i = 0; i < datas.length; i++) {
    if (formatarData(datas[i][0]) === data) {
      linha = i + 1;
      break;
    }
  }

  // Nova linha se não existe
  if (linha === -1) {
    linha = ultimaLinha + 1;
    aba.getRange(linha, 1).setValue(data);
    Logger.log('📅 Nova linha: ' + data);
  }

  // Preencher resultados
  for (const r of resultados) {
    const col = CONFIG.COLUNAS[r.nome];
    if (col) {
      aba.getRange(linha, col + 1).setValue(parseFloat(r.valor));
      Logger.log('  ✓ ' + r.nome + ': ' + r.valor);
    }
  }
}

/**
 * Formata data para comparação
 */
function formatarData(d) {
  if (d instanceof Date) {
    return pad(d.getDate()) + '/' + pad(d.getMonth() + 1) + '/' + d.getFullYear();
  }
  return String(d).trim();
}

// ============================================================================
// UTILITÁRIOS
// ============================================================================

/**
 * Gera nome descritivo para o arquivo
 */
function gerarNome(resultados, data) {
  const nomes = [...new Set(resultados.map(r => r.nome))];
  const dataF = data.replace(/\//g, '-');

  if (nomes.length === 1) return nomes[0] + ' - ' + dataF + '.pdf';
  if (nomes.length === 2) return nomes.join(', ') + ' - ' + dataF + '.pdf';
  return 'Exames (' + nomes.length + ') - ' + dataF + '.pdf';
}

/**
 * Move arquivo para pasta Anteriores, organizando em subpasta por data
 */
function moverArquivo(arquivo, origem, destino, data) {
  try {
    let pastaFinal = destino;

    // Se tem data, criar/usar subpasta
    if (data) {
      const nomePasta = data.replace(/\//g, '-');
      const subpastas = destino.getFoldersByName(nomePasta);

      if (subpastas.hasNext()) {
        pastaFinal = subpastas.next();
      } else {
        pastaFinal = destino.createFolder(nomePasta);
        Logger.log('📁 Pasta criada: ' + nomePasta);
      }
    }

    // Mover arquivo
    pastaFinal.addFile(arquivo);
    origem.removeFile(arquivo);
    Logger.log('📁 Movido para Anteriores' + (data ? '/' + data.replace(/\//g, '-') : ''));
  } catch (e) {
    Logger.log('⚠️ Erro ao mover: ' + e.message);
  }
}

/**
 * Move todos os PDFs das subpastas de Anteriores de volta para Exames
 * Útil para reprocessar todos os exames após alterações no código
 */
function reprocessarTodos() {
  const pasta = DriveApp.getFolderById(CONFIG.PASTA_EXAMES_ID);
  const anteriores = DriveApp.getFolderById(CONFIG.PASTA_ANTERIORES_ID);
  let count = 0;

  // Primeiro, mover PDFs que estão diretamente em Anteriores (legado)
  let arquivos = anteriores.getFiles();
  while (arquivos.hasNext()) {
    const arq = arquivos.next();
    if (arq.getMimeType() === 'application/pdf') {
      pasta.addFile(arq);
      anteriores.removeFile(arq);
      count++;
    }
  }

  // Depois, varrer todas as subpastas de data
  const subpastas = anteriores.getFolders();
  while (subpastas.hasNext()) {
    const subpasta = subpastas.next();
    const arquivosSub = subpasta.getFiles();

    while (arquivosSub.hasNext()) {
      const arq = arquivosSub.next();
      if (arq.getMimeType() === 'application/pdf') {
        pasta.addFile(arq);
        subpasta.removeFile(arq);
        count++;
      }
    }

    // Remover subpasta se ficou vazia
    if (!subpasta.getFiles().hasNext()) {
      subpasta.setTrashed(true);
      Logger.log('🗑️ Pasta vazia removida: ' + subpasta.getName());
    }
  }

  Logger.log('🔄 ' + count + ' arquivo(s) movido(s) para reprocessamento');
}

/**
 * Exibe status atual do sistema
 */
function verStatus() {
  const pasta = DriveApp.getFolderById(CONFIG.PASTA_EXAMES_ID);
  const anteriores = DriveApp.getFolderById(CONFIG.PASTA_ANTERIORES_ID);

  let novos = 0, processados = 0, numPastas = 0;

  // Contar novos
  let arqs = pasta.getFiles();
  while (arqs.hasNext()) {
    if (arqs.next().getMimeType() === 'application/pdf') novos++;
  }

  // Contar processados (direto em Anteriores)
  arqs = anteriores.getFiles();
  while (arqs.hasNext()) {
    if (arqs.next().getMimeType() === 'application/pdf') processados++;
  }

  // Contar processados (em subpastas de data)
  const subpastas = anteriores.getFolders();
  while (subpastas.hasNext()) {
    const sub = subpastas.next();
    numPastas++;
    const arqsSub = sub.getFiles();
    while (arqsSub.hasNext()) {
      if (arqsSub.next().getMimeType() === 'application/pdf') processados++;
    }
  }

  Logger.log('=== STATUS ===');
  Logger.log('📄 Aguardando: ' + novos);
  Logger.log('📑 Processados: ' + processados);
  Logger.log('📁 Pastas de data: ' + numPastas);
}

/**
 * Debug: mostra texto OCR do primeiro PDF encontrado
 */
function debugVerTexto() {
  const pasta = DriveApp.getFolderById(CONFIG.PASTA_EXAMES_ID);
  const arquivos = pasta.getFiles();

  while (arquivos.hasNext()) {
    const arq = arquivos.next();
    if (arq.getMimeType() === 'application/pdf') {
      Logger.log('=== ' + arq.getName() + ' ===');
      Logger.log(extrairTextoPDF(arq));
      break;
    }
  }
}
