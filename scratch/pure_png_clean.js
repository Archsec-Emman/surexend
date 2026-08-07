const fs = require('fs');
const zlib = require('zlib');

const srcPath = 'C:\\Users\\ASAKE ISLAMIA SALAH\\.gemini\\antigravity\\brain\\8051af0f-e7a7-4fd5-9942-cebb889a6899\\.user_uploaded\\media_1786094243185.png';
const dstPath = 'C:\\Users\\ASAKE ISLAMIA SALAH\\.gemini\\antigravity\\scratch\\surexend\\public\\logo-mark-gold.png';

const buf = fs.readFileSync(srcPath);

// Parse PNG header and chunks
let pos = 8; // skip signature
let width = 0, height = 0, bitDepth = 0, colorType = 0;
const idatChunks = [];

while (pos < buf.length) {
  const len = buf.readUInt32BE(pos);
  const type = buf.toString('ascii', pos + 4, pos + 8);
  const data = buf.subarray(pos + 8, pos + 8 + len);
  
  if (type === 'IHDR') {
    width = data.readUInt32BE(0);
    height = data.readUInt32BE(4);
    bitDepth = data[8];
    colorType = data[9];
    console.log({ width, height, bitDepth, colorType });
  } else if (type === 'IDAT') {
    idatChunks.push(data);
  }
  pos += 12 + len;
}

const compressed = Buffer.concat(idatChunks);
const decompressed = zlib.inflateSync(compressed);

const bytesPerPixel = colorType === 6 ? 4 : (colorType === 2 ? 3 : 4);
const stride = 1 + width * bytesPerPixel;
const outBuf = Buffer.alloc(1 + width * 4 * height);

let inPos = 0;
let outPos = 0;

for (let y = 0; y < height; y++) {
  const filterType = decompressed[inPos++];
  outBuf[outPos++] = filterType; // keep filter type

  for (let x = 0; x < width; x++) {
    let r, g, b, a = 255;
    if (bytesPerPixel === 4) {
      r = decompressed[inPos];
      g = decompressed[inPos + 1];
      b = decompressed[inPos + 2];
      a = decompressed[inPos + 3];
      inPos += 4;
    } else {
      r = decompressed[inPos];
      g = decompressed[inPos + 1];
      b = decompressed[inPos + 2];
      inPos += 3;
    }

    // Check if pixel is white background (near white > 210)
    if (r > 200 && g > 200 && b > 200) {
      const avg = (r + g + b) / 3;
      if (avg > 235) {
        a = 0;
      } else {
        a = Math.max(0, Math.min(255, Math.floor((255 - avg) / (255 - 200) * 255)));
      }
    }

    outBuf[outPos++] = r;
    outBuf[outPos++] = g;
    outBuf[outPos++] = b;
    outBuf[outPos++] = a;
  }
}

// Re-compress IDAT with RGBA colorType 6
const newCompressed = zlib.deflateSync(outBuf);

// Construct new PNG file
const pngSignature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

// IHDR chunk for RGBA (colorType 6)
const ihdrData = Buffer.alloc(13);
ihdrData.writeUInt32BE(width, 0);
ihdrData.writeUInt32BE(height, 4);
ihdrData[8] = 8; // 8 bit depth
ihdrData[9] = 6; // color type 6 (RGBA)

function createChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const body = Buffer.concat([typeBuf, data]);
  
  // Simple CRC32 computation
  const crc = crc32(body);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc, 0);
  
  return Buffer.concat([len, body, crcBuf]);
}

// CRC32 table & function
const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    if (c & 1) c = 0xedb88320 ^ (c >>> 1);
    else c = c >>> 1;
  }
  crcTable[n] = c;
}
function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

const ihdrChunk = createChunk('IHDR', ihdrData);
const idatChunk = createChunk('IDAT', newCompressed);
const iendChunk = createChunk('IEND', Buffer.alloc(0));

const finalPng = Buffer.concat([pngSignature, ihdrChunk, idatChunk, iendChunk]);
fs.writeFileSync(dstPath, finalPng);
console.log('Saved transparent gold logo mark cleanly to:', dstPath);
