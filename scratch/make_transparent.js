const fs = require('fs');

const srcPath = 'C:\\Users\\ASAKE ISLAMIA SALAH\\.gemini\\antigravity\\brain\\8051af0f-e7a7-4fd5-9942-cebb889a6899\\.user_uploaded\\media_1786094243185.png';
const dstPath = 'C:\\Users\\ASAKE ISLAMIA SALAH\\.gemini\\antigravity\\scratch\\surexend\\public\\logo-mark-gold.png';

// Copy directly for now
fs.copyFileSync(srcPath, dstPath);
console.log('Copied file to logo-mark-gold.png');
