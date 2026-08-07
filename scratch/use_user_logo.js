const fs = require('fs');

const srcPath = 'C:\\Users\\ASAKE ISLAMIA SALAH\\.gemini\\antigravity\\brain\\8051af0f-e7a7-4fd5-9942-cebb889a6899\\.user_uploaded\\media_1786095535851.png';
const dstPath = 'C:\\Users\\ASAKE ISLAMIA SALAH\\.gemini\\antigravity\\scratch\\surexend\\public\\logo-mark-gold.png';

fs.copyFileSync(srcPath, dstPath);
console.log('Successfully copied exact uploaded file to public/logo-mark-gold.png');
