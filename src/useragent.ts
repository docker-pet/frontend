import { UAParser } from 'ua-parser-js';

function getEmoji(type: string) {
  switch (type) {
    case 'mobile':
      return '📱';
    case 'tablet':
      return '💊';
    case 'smarttv':
      return '📺';
    case 'console':
      return '🎮';
    case 'desktop':
      return '💻';
    default:
      return '🧩';
  }
}

function getRandomAnimal() {
  const animals = [
    'Lion',
    'Tiger',
    'Elephant',
    'Giraffe',
    'Zebra',
    'Kangaroo',
    'Panda',
    'Koala',
    'Bear',
    'Wolf',
    'Fox',
    'Rabbit',
    'Deer',
    'Moose',
    'Hippopotamus',
    'Rhinoceros',
    'Crocodile',
    'Alligator',
    'Monkey',
    'Chimpanzee',
    'Gorilla',
    'Leopard',
    'Cheetah',
    'Otter',
    'Beaver',
    'Squirrel',
    'Hedgehog',
    'Bat',
    'Owl',
    'Eagle',
    'Falcon',
    'Parrot',
    'Penguin',
    'Dolphin',
    'Whale',
    'Shark',
    'Octopus',
    'Seal',
    'Turtle',
    'Frog',
  ];

  const randomIndex = Math.floor(Math.random() * animals.length);
  return animals[randomIndex];
}

function generateDeviceName() {
  const parser = new UAParser();
  const result = parser.setUA(navigator.userAgent).getResult();
  const emoji = getEmoji(result.device.type || 'desktop');
  const os = result.os.name || 'Unknown OS';
  const browser = result.browser.name || 'Unknown Browser';
  const animal = getRandomAnimal();

  return `${emoji} ${os} — ${browser} (${animal})`;
}

// Export device name
export let deviceName: string;
const savedDeviceName = localStorage.getItem('deviceName');
if (savedDeviceName) {
  deviceName = savedDeviceName;
} else {
  deviceName = generateDeviceName();
  localStorage.setItem('deviceName', deviceName);
}
