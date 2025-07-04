// Replace with your real SheetDB API if needed
const SHEETDB_API_URL = 'https://sheetdb.io/api/v1/m9769bwpvfaga';

const bubble = document.getElementById('emotionBubble');
const colorSpan = document.getElementById('color');
const emotionSpan = document.getElementById('emotion');
const form = document.getElementById('saveForm');
const downloadBtn = document.getElementById('downloadBtn');
const downloadSection = document.getElementById('downloadSection');

let currentData = {};

function generateId(name) {
  const date = new Date().toISOString().replace(/[-:.]/g, '');
  const cleanName = name ? name.trim().toLowerCase().replace(/\s+/g, '_') : 'anonymous';
  return `${cleanName}_${date}`;
}

function displayData(data) {
  bubble.style.background = `linear-gradient(270deg, ${data.color}, #00f2fe, ${data.color})`;
  bubble.textContent = data.emotion;

  colorSpan.textContent = data.color;
  emotionSpan.textContent = data.emotion;

  const descriptions = {
    'Joy': {
      title: 'Yellow – Joy',
      text: 'Bright, sunny, energizing. Sparks creativity and cheerfulness.'
    },
    'Sadness': {
      title: 'Blue – Sadness',
      text: 'Deep, calm, introspective. Invites reflection and melancholy.'
    },
    'Anger': {
      title: 'Red – Anger',
      text: 'Intense, passionate, powerful. Fire-like and impulsive.'
    },
    'Fear': {
      title: 'Black – Fear',
      text: 'Dark, mysterious, protective. Linked to uncertainty and the unknown.'
    },
    'Calm': {
      title: 'Green – Calm',
      text: 'Natural, relaxing, balanced. A symbol of peace and renewal.'
    },
    'Love': {
      title: 'Pink – Love',
      text: 'Sweet, welcoming, emotional. Represents affection and tenderness.'
    }
  };

  const desc = descriptions[data.emotion] || {
    title: 'Unknown emotion',
    text: 'No description available.'
  };

  document.getElementById('emotionTitle').textContent = desc.title;
  document.getElementById('emotionText').textContent = desc.text;
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

function saveData(data) {
  fetch(SHEETDB_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ data }),
  }).catch(error => {
    console.error('Error:', error);
  });
}

// 📸 Download snapshot as image
function downloadMoodSnapshot() {
  html2canvas(document.querySelector('.container')).then(canvas => {
    const link = document.createElement('a');
    link.download = 'my_workday_mood.png';
    link.href = canvas.toDataURL();
    link.click();
  });
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = form.name.value || 'anonymous';
  const thought = form.thought.value || '';
  const id = generateId(name);

  const payload = {
    timestamp: new Date().toISOString(),
    color: currentData.color,
    emotion: currentData.emotion,
    thought,
    name,
    id,
  };

  saveData(payload);

  downloadSection.classList.remove('hidden');
});

downloadBtn.addEventListener('click', downloadMoodSnapshot);

loadData();
