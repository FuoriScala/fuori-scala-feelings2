// Replace with your actual SheetDB API endpoint (keep the quotes)
const SHEETDB_API_URL = 'https://sheetdb.io/api/v1/m9769bwpvfaga';

const bubble = document.getElementById('emotionBubble');
const colorSpan = document.getElementById('color');
const emotionSpan = document.getElementById('emotion');
const form = document.getElementById('saveForm');
const qrSection = document.getElementById('qrSection');
const qrCanvas = document.getElementById('qrCanvas');
const downloadBtn = document.getElementById('downloadMoodBtn');
const userThoughtText = document.getElementById('userThoughtText');

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

  const colorNames = {
    '#FFD700': 'Yellow',
    '#4682B4': 'Blue',
    '#DC143C': 'Red',
    '#000000': 'Black',
    '#3CB371': 'Green',
    '#FF69B4': 'Pink',
    '#CCCCCC': 'Unknown'
  };

  const colorName = colorNames[data.color.toUpperCase()] || 'Unknown';
  colorSpan.textContent = `${colorName} - ${data.color}`;

  const descriptions = {
    'Joy': {
      title: "Today I'm wrapped in Joy",
      text: 'Bright, sunny, energizing. Sparks creativity and cheerfulness.'
    },
    'Sadness': {
      title: "Today I'm wrapped in Sadness",
      text: 'Deep, calm, introspective. Invites reflection and melancholy.'
    },
    'Anger': {
      title: "Today I'm wrapped in Anger",
      text: 'Intense, passionate, powerful. Fire-like and impulsive.'
    },
    'Fear': {
      title: "Today I'm wrapped in Fear",
      text: 'Dark, mysterious, protective. Linked to uncertainty and the unknown.'
    },
    'Calm': {
      title: "Today I'm wrapped in Calm",
      text: 'Natural, relaxing, balanced. A symbol of peace and renewal.'
    },
    'Love': {
      title: "Today I'm wrapped in Love",
      text: 'Sweet, welcoming, emotional. Represents affection and tenderness.'
    }
  };

  const desc = descriptions[data.emotion] || {
    title: 'Unknown emotion',
    text: 'No description available.'
  };

  document.getElementById('emotionTitle').textContent = desc.title;
  document.getElementById('emotionText').textContent = desc.text;
  userThoughtText.textContent = data.thought || '';

  const now = new Date();
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = now.toLocaleDateString('en-US', options);
  document.getElementById('date').textContent = formattedDate;
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

  currentData = { color, emotion, thought: '' };
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

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = form.name.value || 'anonymous';
  const thought = form.thought.value || '';
  const id = generateId(name);

  currentData.thought = thought;

  const payload = {
    timestamp: new Date().toISOString(),
    color: currentData.color,
    emotion: currentData.emotion,
    thought,
    name,
    id,
  };

  saveData(payload);

  displayData(currentData);

  // Show download button
  downloadBtn.style.display = 'block';
});

// ✅ AGGIUNTA: Bottone verde mostrato subito all'avvio
const proceedBtn = document.createElement('button');
proceedBtn.id = 'proceedBtn';
proceedBtn.textContent = 'Bring your mood to life';
proceedBtn.style.marginTop = '10px';
proceedBtn.style.padding = '12px 24px';
proceedBtn.style.fontSize = '1rem';
proceedBtn.style.backgroundColor = '#25D366'; // Verde tipo WhatsApp
proceedBtn.style.color = 'white';
proceedBtn.style.border = 'none';
proceedBtn.style.borderRadius = '8px';
proceedBtn.style.cursor = 'pointer';
downloadBtn.insertAdjacentElement('afterend', proceedBtn);

proceedBtn.addEventListener('click', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const emotion = urlParams.get('emotion') || 'Calm';
  const color = colorSpan.textContent || '#3CB371';
  const thought = form.thought.value || '';

  const bagUrl = `bag.html?emotion=${encodeURIComponent(emotion)}&color=${encodeURIComponent(color)}&thought=${encodeURIComponent(thought)}`;
  window.location.href = bagUrl;
});

// Download snapshot
downloadBtn.addEventListener('click', () => {
  const moodSection = document.getElementById('moodCapture');
  html2canvas(moodSection).then(canvas => {
    const link = document.createElement('a');
    link.download = 'my_mood.png';
    link.href = canvas.toDataURL();
    link.click();
  });
});

loadData();
