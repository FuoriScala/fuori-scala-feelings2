// Read URL params
function getParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    emotion: params.get('emotion') || 'Calm',
    thought: params.get('thought') || 'Your thought here'
  };
}

// Emotion-to-color & image map
const emotionImages = {
  Joy: 'yellow-bag.png',
  Sadness: 'blue-bag.png',
  Anger: 'red-bag.png',
  Fear: 'black-bag.png',
  Calm: 'green-bag.png',
  Love: 'pink-bag.png'
};

// Setup
const { emotion, thought } = getParams();
const bagImage = document.getElementById('bagImage');
const thoughtBox = document.getElementById('thoughtBox');
const saveBtn = document.getElementById('saveButton');

// Load image and thought
bagImage.src = `images/${emotionImages[emotion] || 'green-bag.png'}`;
thoughtBox.textContent = decodeURIComponent(thought);

// Make thought box draggable
let isDragging = false;
let offsetX, offsetY;

thoughtBox.addEventListener('mousedown', (e) => {
  isDragging = true;
  offsetX = e.offsetX;
  offsetY = e.offsetY;
});

document.addEventListener('mouseup', () => isDragging = false);

document.addEventListener('mousemove', (e) => {
  if (!isDragging) return;
  const bagRect = bagImage.getBoundingClientRect();
  thoughtBox.style.left = `${e.clientX - bagRect.left - offsetX}px`;
  thoughtBox.style.top = `${e.clientY - bagRect.top - offsetY}px`;
});

// Save to image
saveBtn.addEventListener('click', () => {
  html2canvas(document.getElementById('bagArea')).then(canvas => {
    const link = document.createElement('a');
    link.download = `moody_bag_${emotion}.png`;
    link.href = canvas.toDataURL();
    link.click();
  });
});
