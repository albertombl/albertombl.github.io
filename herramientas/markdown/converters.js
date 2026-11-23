import './vendor/jszip.min.js';

export const formats = new Set(['pdf', 'docx', 'pptx', 'xlsx', 'txt', 'md']);

const children = (node, name) => Array.from(node?.children ?? []).filter((child) => child.localName === name);
const first = (node, name) => children(node, name)[0];
const descendants = (node, name) => Array.from(node?.getElementsByTagNameNS('*', name) ?? []);
const attr = (node, name) => Array.from(node?.attributes ?? []).find((item) => item.localName === name)?.value;
const escapeMarkdown = (text) => text.replace(/[\\`*_{}\[\]<>#|~]/g, '\\$&');
const heading = (label, level = 2) => '#'.repeat(level) + ' ' + escapeMarkdown(label);

function markdownTable(rows) {
  const width = rows.reduce((max, row) => Math.max(max, row.length), 0);
  if (!width) return '';
  const line = (row) => '| ' + Array.from({ length: width }, (_, index) =>
    String(row[index] ?? '').trim().replace(/(?<!\\)\|/g, '\\|').replace(/\r?\n/g, '<br>')
  ).join(' | ') + ' |';
  return [line(rows[0]), line(Array(width).fill('---')), ...rows.slice(1).map(line)].join('\n');
}

async function readXml(zip, path, required = true) {
  const entry = zip.file(path);
  if (!entry) {
    if (!required) return null;
    throw new Error('El archivo no contiene la estructura esperada.');
  }
  const text = await entry.async('string');
  const xml = new DOMParser().parseFromString(text, 'application/xml');
  if (xml.documentElement.localName === 'parsererror') throw new Error('El archivo contiene XML que no se puede leer.');
  return xml.documentElement;
}

async function relationships(zip, source) {
  const slash = source.lastIndexOf('/') + 1;
  const directory = source.slice(0, slash);
  const xml = await readXml(zip, directory + '_rels/' + source.slice(slash) + '.rels', false);
  return new Map(children(xml, 'Relationship')
    .filter((entry) => attr(entry, 'TargetMode') !== 'External')
    .map((entry) => {
      const url = new URL(attr(entry, 'Target'), 'https://document.invalid/' + source);
      const path = url.hostname === 'document.invalid' ? decodeURIComponent(url.pathname.slice(1)) : null;
      return [attr(entry, 'Id'), path];
    }));
}

function wordRun(run) {
  const content = Array.from(run.children).map((element) => {
    if (element.localName === 't') return escapeMarkdown(element.textContent);
    if (element.localName === 'tab') return '\t';
    if (['br', 'cr'].includes(element.localName)) return '  \n';
    return '';
  }).join('');
  const properties = first(run, 'rPr');
  const marked = (type) => {
    const element = first(properties, type);
    return element && !['false', '0', 'off'].includes(attr(element, 'val'));
  };
  const marker = (marked('b') ? '**' : '') + (marked('i') ? '_' : '');
  return marker ? content.replace(/^(\s*)(\S[\s\S]*?)(\s*)$/, '$1' + marker + '$2' + marker.split('').reverse().join('') + '$3') : content;
}

function wordParagraph(paragraph, styles) {
  const text = descendants(paragraph, 'r').map(wordRun).join('').trim();
  if (!text) return '';
  const properties = first(paragraph, 'pPr');
  const styleId = attr(first(properties, 'pStyle'), 'val');
  const outline = attr(first(properties, 'outlineLvl'), 'val') ?? styles.get(styleId);
  const level = outline === undefined ? styleId?.match(/^(?:Heading|T[ií]tulo)\s*([1-6])$/i)?.[1] : Number(outline) + 1;
  if (level >= 1 && level <= 6) return '#'.repeat(level) + ' ' + text;
  const numbering = first(properties, 'numPr');
  return numbering ? '    '.repeat(Math.min(8, Number(attr(first(numbering, 'ilvl'), 'val')) || 0)) + '- ' + text : text;
}

async function convertWord(zip) {
  const document = await readXml(zip, 'word/document.xml');
  const styleXml = await readXml(zip, 'word/styles.xml', false);
  const styles = new Map(children(styleXml, 'style').map((style) => [
    attr(style, 'styleId'), attr(first(first(style, 'pPr'), 'outlineLvl'), 'val')
  ]));
  const blocks = Array.from(first(document, 'body')?.children ?? []).map((element) => {
    if (element.localName === 'p') return wordParagraph(element, styles);
    if (element.localName === 'tbl') return markdownTable(children(element, 'tr').map((row) =>
      children(row, 'tc').map((cell) => children(cell, 'p').map((paragraph) => wordParagraph(paragraph, styles)).join('\n'))
    ));
    return '';
  });
  return { text: blocks.filter(Boolean).join('\n\n') };
}

function presentationParagraph(paragraph) {
  const text = Array.from(paragraph.children).map((element) => {
    if (element.localName === 'br') return '  \n';
    return escapeMarkdown(first(element, 't')?.textContent ?? '');
  }).join('').trim();
  const properties = first(paragraph, 'pPr');
  const bullet = first(properties, 'buChar') ? '- ' : first(properties, 'buAutoNum') ? '1. ' : '';
  return text ? bullet + text : '';
}

async function convertPresentation(zip) {
  const source = 'ppt/presentation.xml';
  const presentation = await readXml(zip, source);
  const paths = await relationships(zip, source);
  const slides = [];
  for (const [index, reference] of children(first(presentation, 'sldIdLst'), 'sldId').entries()) {
    const path = paths.get(reference.getAttributeNS('http://schemas.openxmlformats.org/officeDocument/2006/relationships', 'id') ?? reference.getAttribute('r:id'));
    if (!path) continue;
    const slide = await readXml(zip, path);
    const items = descendants(slide, 'spTree').flatMap((tree) => descendants(tree, 'p'))
      .map(presentationParagraph).filter(Boolean);
    if (items.length) slides.push([heading('Diapositiva ' + (index + 1)), items.join('\n')].join('\n\n'));
  }
  return { text: slides.join('\n\n') };
}

function columnNumber(reference) {
  const column = reference?.match(/^[A-Z]+/i)?.[0].toUpperCase();
  return column ? [...column].reduce((number, letter) => number * 26 + letter.charCodeAt(0) - 64, 0) - 1 : null;
}

function spreadsheetText(element) {
  return Array.from(element?.children ?? []).map((item) => {
    if (item.localName === 't') return item.textContent;
    return item.localName === 'r' ? first(item, 't')?.textContent ?? '' : '';
  }).join('');
}

async function convertSpreadsheet(zip) {
  const source = 'xl/workbook.xml';
  const workbook = await readXml(zip, source);
  const paths = await relationships(zip, source);
  const stringsXml = await readXml(zip, 'xl/sharedStrings.xml', false);
  const strings = children(stringsXml, 'si').map(spreadsheetText);
  const tables = [];
  for (const sheet of children(first(workbook, 'sheets'), 'sheet')) {
    const path = paths.get(attr(sheet, 'id'));
    if (!path) continue;
    const xml = await readXml(zip, path);
    const rows = [];
    for (const row of children(first(xml, 'sheetData'), 'row')) {
      const values = [];
      for (const entry of children(row, 'c')) {
        const type = attr(entry, 't');
        const raw = first(entry, 'v')?.textContent ?? '';
        let value = raw;
        if (type === 'inlineStr') value = spreadsheetText(first(entry, 'is'));
        if (type === 's' && raw) value = strings[Number(raw)] ?? '';
        if (type === 'b' && raw) value = raw === '1' ? 'TRUE' : 'FALSE';
        if (!value && first(entry, 'f')?.textContent) value = '=' + first(entry, 'f').textContent;
        if (value) values[columnNumber(attr(entry, 'r')) ?? values.length] = escapeMarkdown(value);
      }
      if (values.length) rows.push(values);
    }
    if (!rows.length) continue;
    const width = rows.reduce((max, row) => Math.max(max, row.length), 0);
    const labels = Array.from({ length: width }, (_, index) => {
      let name = '';
      for (let n = index + 1; n > 0; n = Math.floor((n - 1) / 26)) {
        name = String.fromCharCode(65 + ((n - 1) % 26)) + name;
      }
      return name;
    });
    tables.push(heading(attr(sheet, 'name') ?? 'Hoja') + '\n\n' + markdownTable([labels, ...rows]));
  }
  return { text: tables.join('\n\n') };
}

async function convertPdf(file, progress) {
  const pdfjs = await import('./vendor/pdf.min.mjs');
  pdfjs.GlobalWorkerOptions.workerSrc = new URL('./vendor/pdf.worker.min.mjs', import.meta.url).href;
  const task = pdfjs.getDocument({
    data: new Uint8Array(await file.arrayBuffer()),
    useSystemFonts: true,
    useWasm: false,
  });
  try {
    const pdf = await task.promise;
    const pages = [];
    let emptyPages = 0;
    for (let number = 1; number <= pdf.numPages; number++) {
      progress('Leyendo página ' + number + ' de ' + pdf.numPages + '…');
      const page = await pdf.getPage(number);
      const content = await page.getTextContent();
      const text = content.items.map((item) => (item.str ?? '') + (item.hasEOL ? '\n' : '')).join('').trim();
      if (text) pages.push(heading('Página ' + number) + '\n\n' + text.split('\n').map(escapeMarkdown).join('\n'));
      else emptyPages++;
      page.cleanup();
    }
    if (!pages.length) throw new Error('El PDF no contiene texto extraíble. Si es un escaneo, necesitarás reconocer el texto mediante OCR.');
    const notice = emptyPages ? 'Conversión completada. Páginas sin texto extraíble: ' + emptyPages + '.' : undefined;
    return { text: pages.join('\n\n'), notice };
  } catch (error) {
    if (error.name === 'PasswordException') throw new Error('El PDF está protegido por contraseña.');
    if (error.name === 'InvalidPDFException') throw new Error('El PDF está dañado o no se puede leer.');
    throw error;
  } finally {
    await task.destroy();
  }
}

export async function convertFile(file, progress) {
  const extension = file.name.split('.').pop().toLowerCase();
  if (extension === 'txt' || extension === 'md') return { text: await file.text() };
  if (extension === 'pdf') return convertPdf(file, progress);
  const converters = { docx: convertWord, pptx: convertPresentation, xlsx: convertSpreadsheet };
  const converter = converters[extension];
  if (!converter || !formats.has(extension)) throw new Error('Este formato no es compatible.');
  let zip;
  try {
    zip = await globalThis.JSZip.loadAsync(await file.arrayBuffer());
  } catch {
    throw new Error('El archivo está dañado, es de un formato antiguo o está protegido por contraseña.');
  }
  return converter(zip);
}
