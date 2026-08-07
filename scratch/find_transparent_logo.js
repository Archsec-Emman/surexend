const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const uploadsDir = 'C:\\Users\\ASAKE ISLAMIA SALAH\\.gemini\\antigravity\\brain\\8051af0f-e7a7-4fd5-9942-cebb889a6899\\.user_uploaded';
const files = fs.readdirSync(uploadsDir).filter(f => f.endsWith('.png'));

files.forEach(file => {
  const filePath = path.join(uploadsDir, file);
  const buf = fs.readFileSync(filePath);
  
  let pos = 8;
  let colorType = -1;
  while (pos < buf.length) {
    const len = buf.readUInt32BE(pos);
    const type = buf.toString('ascii', pos + 4, pos + 8);
    if (type === 'IHDR') {
      const w = buf.readUInt32BE(pos + 8);
      const h = buf.readUInt32BE(pos + 12);
      colorType = buf[pos + 8 + 9];
      console.log(file, `dims: ${w}x${h}`, `colorType: ${colorType} (6=RGBA, 2=RGB, 3=Indexed)`);
      break;
    }
    pos += 12 + len;
  }
});
