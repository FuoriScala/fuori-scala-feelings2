const SHEETDB_API_URL = 'https://sheetdb.io/api/v1/YOUR_ENDPOINT_HERE';

const bubble = document.getElementById('emotionBubble');
const colorSpan = document.getElementById('color');
const emotionSpan = document.getElementById('emotion');
const form = document.getElementById('saveForm');
const qrSection = document.getElementById('qrSection');
const qrCanvas = document.getElementById('qrCanvas');

let currentData = {};

function generateId(name) {
  const date = new Date().toISOString().replace(/[-:.]/g, '');
  const cleanName = name ? name.trim().toLowerCase().replace(/\s+/g, '_') : 'anonymous';
  return `${cleanName}_${date}`;
}

function displayData(data) {
  bubble.style.background = `linear-gradient(270deg, ${data.color}, #00f2fe, ${data.color})`;
  bubble.style.backgroundSize = '600% 600%';
  bubble.style.animation = 'wave 8s ease infinite';
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
  })
    .then(response => {
      if (!response.ok) throw new Error('Save error');
      return response.json();
    })
    .then(json => {
      console.log('Data saved:', json);
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

function generateQR(url) {
  const qr = new QRious({
    element: qrCanvas,
    value: url,
    size: 200,
  });
  qrSection.classList.add('visible');
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

  const url = `${window.location.origin}${window.location.pathname}?emotion=${encodeURIComponent(currentData.emotion)}&id=${encodeURIComponent(id)}`;
  generateQR(url);

  // Show "Generate Bag" button
  const bagUrl = `bag.html?emotion=${encodeURIComponent(currentData.emotion)}&thought=${encodeURIComponent(thought)}`;
  const bagLink = document.getElementById('bagLink');
  const bagWrapper = document.getElementById('generateBagLink');

  if (bagLink && bagWrapper) {
    bagLink.href = bagUrl;
    bagWrapper.classList.remove('hidden');
  }
});

loadData();
