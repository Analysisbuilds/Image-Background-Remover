const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');

const dropZone = document.getElementById('dropZone');
const triggerBtn = document.getElementById('triggerBtn');
const fileInput = document.getElementById('fileInput');

const uploadState = document.getElementById('uploadState');
const loadingState = document.getElementById('loadingState');
const resultState = document.getElementById('resultState');

const originalImg = document.getElementById('originalImg');
const outputImg = document.getElementById('outputImg');
const downloadBtn = document.getElementById('downloadBtn');
const resetBtn = document.getElementById('resetBtn');

let originalUrl = null;
let outputUrl = null;
menuBtn.addEventListener('click', () => {
  mobileMenu.classList.toggle('hidden');
});

triggerBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  fileInput.click();
});

dropZone.addEventListener('click', () => fileInput.click());

dropZone.addEventListener('dragover', (e) => {
  e.preventDefault();
  dropZone.classList.add('border-blue-500', 'bg-blue-50/40');
});

dropZone.addEventListener('dragleave', () => {
  dropZone.classList.remove('border-blue-500', 'bg-blue-50/40');
});

dropZone.addEventListener('drop', (e) => {
  e.preventDefault();
  dropZone.classList.remove('border-blue-500', 'bg-blue-50/40');
  if (e.dataTransfer.files.length) handleFile(e.dataTransfer.files[0]);
});

fileInput.addEventListener('change', (e) => {
  if (e.target.files.length) handleFile(e.target.files[0]);
});

resetBtn.addEventListener('click', () => {
  if (originalUrl) URL.revokeObjectURL(originalUrl);
  if (outputUrl) URL.revokeObjectURL(outputUrl);
  
  fileInput.value = '';
  resultState.classList.add('hidden');
  loadingState.classList.add('hidden');
  uploadState.classList.remove('hidden');
});

async function handleFile(file) {
  if (!file.type.startsWith('image/')) {
    alert('Please select a valid image file (PNG, JPG, WebP).');
    return;
  }

  originalUrl = URL.createObjectURL(file);
  originalImg.src = originalUrl;

  uploadState.classList.add('hidden');
  loadingState.classList.remove('hidden');

  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch('/api/remove-bg', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) throw new Error('Failed to process image background removal.');

    const blob = await response.blob();
    outputUrl = URL.createObjectURL(blob);

    outputImg.src = outputUrl;
    downloadBtn.href = outputUrl;

    loadingState.classList.add('hidden');
    resultState.classList.remove('hidden');
  } catch (err) {
    alert(err.message || 'Something went wrong while removing the background.');
    resetBtn.click();
  }
}