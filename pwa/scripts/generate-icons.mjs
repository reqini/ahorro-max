/**
 * Generates solid-color PNG icons for the PWA manifest using only Node.js built-ins.
 * Run: node scripts/generate-icons.mjs
 * Replace the output PNGs with a proper branded icon when ready.
 */
import { deflateSync } from 'zlib'
import { writeFileSync, mkdirSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')

function crc32(buf) {
  const table = new Uint32Array(256)
  for (let n = 0; n < 256; n++) {
    let c = n
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1)
    }
    table[n] = c >>> 0
  }
  let crc = 0xFFFFFFFF
  for (let i = 0; i < buf.length; i++) {
    crc = (table[(crc ^ buf[i]) & 0xFF] ^ (crc >>> 8)) >>> 0
  }
  return (crc ^ 0xFFFFFFFF) >>> 0
}

function pngChunk(type, data) {
  const typeBytes = Buffer.from(type, 'ascii')
  const lenBuf = Buffer.allocUnsafe(4)
  lenBuf.writeUInt32BE(data.length, 0)
  const crcInput = Buffer.concat([typeBytes, data])
  const crcBuf = Buffer.allocUnsafe(4)
  crcBuf.writeUInt32BE(crc32(crcInput), 0)
  return Buffer.concat([lenBuf, typeBytes, data, crcBuf])
}

function solidPNG(size, r, g, b) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])

  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(size, 0)   // width
  ihdr.writeUInt32BE(size, 4)   // height
  ihdr[8] = 8  // bit depth
  ihdr[9] = 2  // color type: RGB truecolor
  // bytes 10,11,12 = 0: compression, filter, interlace

  // Raw scanlines: filter_byte(0) + R,G,B per pixel
  const rowSize = 1 + size * 3
  const raw = Buffer.alloc(size * rowSize)
  for (let y = 0; y < size; y++) {
    const off = y * rowSize
    raw[off] = 0  // filter: None
    for (let x = 0; x < size; x++) {
      raw[off + 1 + x * 3] = r
      raw[off + 2 + x * 3] = g
      raw[off + 3 + x * 3] = b
    }
  }

  const compressed = deflateSync(raw, { level: 9 })

  return Buffer.concat([
    signature,
    pngChunk('IHDR', ihdr),
    pngChunk('IDAT', compressed),
    pngChunk('IEND', Buffer.alloc(0)),
  ])
}

// #F97316 → R=249 G=115 B=22
const R = 249, G = 115, B = 22

const iconsDir = resolve(ROOT, 'public/icons')
mkdirSync(iconsDir, { recursive: true })

writeFileSync(resolve(iconsDir, 'icon-192.png'), solidPNG(192, R, G, B))
writeFileSync(resolve(iconsDir, 'icon-512.png'), solidPNG(512, R, G, B))

console.log('✓ Icons generated: public/icons/icon-192.png (192×192), icon-512.png (512×512)')
console.log('  Tip: Replace with a branded icon using @vite-pwa/assets-generator')
