const fs = require('fs');
const PNG = require('pngjs').PNG;

const srcPath = 'C:\\Users\\ASAKE ISLAMIA SALAH\\.gemini\\antigravity\\brain\\8051af0f-e7a7-4fd5-9942-cebb889a6899\\.user_uploaded\\media_1786094243185.png';
const dstPath = 'C:\\Users\\ASAKE ISLAMIA SALAH\\.gemini\\antigravity\\scratch\\surexend\\public\\logo-mark-gold.png';

fs.createReadStream(srcPath)
  .pipe(new PNG({ filterType: 4 }))
  .on('parsed', function() {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const idx = (this.width * y + x) << 2;
        const r = this.data[idx];
        const g = this.data[idx + 1];
        const b = this.data[idx + 2];

        // If pixel is near white background (r,g,b > 220)
        if (r > 215 && g > 215 && b > 215) {
          const avg = (r + g + b) / 3;
          if (avg > 240) {
            this.data[idx + 3] = 0; // Fully transparent
          } else {
            // Feather edge pixels
            const alpha = Math.max(0, Math.min(255, Math.floor((255 - avg) / (255 - 215) * 255)));
            this.data[idx + 3] = alpha;
          }
        }
      }
    }

    this.pack().pipe(fs.createWriteStream(dstPath)).on('finish', () => {
      console.log('Successfully saved transparent gold logo mark to:', dstPath);
    });
  });
