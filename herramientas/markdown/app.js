import { convertFile, formats } from './converters.js';

const fileInput = document.querySelector('#file');
const convertButton = document.querySelector('#convert');
const filename = document.querySelector('#filename');
const status = document.querySelector('#status');
const result = document.querySelector('#result');
const markdown = document.querySelector('#markdown');
const download = document.querySelector('#download');

function setStatus(message, error = false) {
  status.textContent = message;
  status.dataset.error = String(error);
}

function resetResult() {
  if (download.hasAttribute('href')) URL.revokeObjectURL(download.href);
  download.removeAttribute('href');
  markdown.value = '';
  result.hidden = true;
}

fileInput.addEventListener('change', () => {
  resetResult();
  const file = fileInput.files[0];
  filename.hidden = !file;
  filename.textContent = file?.name ?? '';
  convertButton.disabled = !file || !formats.has(file.name.split('.').pop().toLowerCase());
  setStatus(file && convertButton.disabled ? 'Elige un archivo de uno de los formatos indicados.' : '', convertButton.disabled && Boolean(file));
});

convertButton.addEventListener('click', async () => {
  const file = fileInput.files[0];
  if (!file) return;
  fileInput.disabled = true;
  convertButton.disabled = true;
  resetResult();
  setStatus('Convirtiendo…');
  try {
    const output = await convertFile(file, (message) => setStatus(message));
    if (!output.text.trim()) throw new Error('El archivo no contiene texto que se pueda extraer.');
    const text = output.text.trimEnd() + '\n';
    markdown.value = text;
    download.download = file.name.replace(/\.[^.]+$/, '') + '.md';
    download.href = URL.createObjectURL(new Blob([text], { type: 'text/markdown;charset=utf-8' }));
    result.hidden = false;
    setStatus(output.notice ?? 'Conversión completada.');
  } catch (error) {
    setStatus(error instanceof Error ? error.message : 'La conversión ha fallado.', true);
  } finally {
    fileInput.disabled = false;
    convertButton.disabled = false;
  }
});
