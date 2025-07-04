// Replace with your SheetDB API endpoint
const SHEETDB_API_URL = 'https://sheetdb.io/api/v1/m9769bwpvfaga';

// Elements
const bubble = document.getElementById('emotionBubble');
const colorSpan = document.getElementById('color');
const emotionSpan = document.getElementById('emotion');
const form = document.getElementById('saveForm');
const canvasDownload = document.getElementById('downloadCanvas');
const downloadBtn = document.getElementById('downloadButton');

let currentData = {};

function displayData(data) {
  bubble.style.background = `linear-gradient(270deg, ${data.color}, #00f2fe, ${data.color})`;
  bubble.textContent = data.emotion;

  colorSpan.textContent = data.color;
  emotionSpan.textContent = data.emotion;
}

function loadData() {
  const urlParams = new URLSearchParams(window.location.search);
  const emotion = urlParams.get('emotion') || 'Calm';

  const emotionColors = {
    'Joy': '#FFD700',
    'Sadness': '#4682B4',
    'Anger': '#DC143C',
    'Fear': '#000000',
    'Calm': '#3CB371',
    'Love': '#FF69B4'
  };

  const color = emotionColors[emotion] || '#CCCCCC';

  currentData = { color, emotion };
  displayData(currentData);
}

// Save to SheetDB
function saveDataToSheetDB(data) {
  fetch(SHEETDB_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ data }),
  })
    .then(response => {
      if (!response.ok) throw new Error('Save error');
      return response.json();
    })
    .then(json => {
      console.log('Saved to SheetDB:', json);
    })
    .catch(error => {
      console.error('Error saving to SheetDB:', error);
    });
}

// Generate PNG and download
async function generateAndDownloadMood(name, thought, emotion, color) {
  const canvas = canvasDownload;
  const ctx = canvas.getContext('2d');
  const width = canvas.width = 600;
  const height = canvas.height = 400;

  // Background gradient
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, color);
  gradient.addColorStop(1, '#ffffff');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // Emotion title
  ctx.fillStyle = '#000000';
  ctx.font = 'bold 30px Segoe UI';
  ctx.fillText(`Emotion: ${emotion}`, 30, 80);

  // Thought text
  ctx.font = '20px Segoe UI';
  ctx.fillText(`"${thought}"`, 30, 140);

  // Name
  if (name && name !== 'anonymous') {
    ctx.font = 'italic 16px Segoe UI';
    ctx.fillText(`— ${name}`, 30, 180);
  }

  // Download
  const link = document.createElement('a');
  link.download = `mood-${emotion.toLowerCase()}.png`;
  link.href = canvas.toDataURL();
  link.click();
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = form.name.value || 'anonymous';
  const thought = form.thought.value || '';
  const emotion = currentData.emotion;
  const color = currentData.color;
  const timestamp = new Date().toISOString();

  const payload = {
    name,
    thought,
    emotion,
    color,
    timestamp
  };

  // Save to SheetDB archive
  saveDataToSheetDB(payload);

  // Generate image and download
  await generateAndDownloadMood(name, thought, emotion, color);
});

loadData();
