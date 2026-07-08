import { readFileSync, writeFileSync, readdirSync, statSync, existsSync, mkdirSync, cpSync } from 'fs';
import { join } from 'path';
import { deflateSync } from 'zlib';

const extDir = 'dist/browser-extension';
const src = 'browser-extension';

if (!existsSync(extDir)) mkdirSync(extDir, { recursive: true });

const ignore = ['.svg'];

cpSync(src, extDir, {
  recursive: true,
  filter: (f) => !ignore.some((e) => f.endsWith(e)),
});

function crc32(buf) {
  let c = 0xffffffff;
  const table = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let k = n;
    for (let i = 0; i < 8; i++) {
      k = k & 1 ? 0xedb88320 ^ (k >>> 1) : k >>> 1;
    }
    table[n] = k;
  }
  for (let i = 0; i < buf.length; i++) {
    c = table[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

function localFileHeader(name, crc, comp, uncomp, method) {
  const nameBuf = Buffer.from(name);
  const buf = Buffer.alloc(30 + nameBuf.length);
  buf.writeUInt32LE(0x04034b50, 0);
  buf.writeUInt16LE(20, 4);
  buf.writeUInt16LE(0, 6);
  buf.writeUInt16LE(method, 8);
  buf.writeUInt16LE(0, 10);
  buf.writeUInt16LE(0, 12);
  buf.writeUInt32LE(crc, 14);
  buf.writeUInt32LE(comp, 18);
  buf.writeUInt32LE(uncomp, 22);
  buf.writeUInt16LE(nameBuf.length, 26);
  buf.writeUInt16LE(0, 28);
  nameBuf.copy(buf, 30);
  return buf;
}

function centralDirHeader(name, crc, comp, uncomp, method, offset) {
  const nameBuf = Buffer.from(name);
  const buf = Buffer.alloc(46 + nameBuf.length);
  buf.writeUInt32LE(0x02014b50, 0);
  buf.writeUInt16LE(20, 4);
  buf.writeUInt16LE(20, 6);
  buf.writeUInt16LE(0, 8);
  buf.writeUInt16LE(method, 10);
  buf.writeUInt16LE(0, 12);
  buf.writeUInt16LE(0, 14);
  buf.writeUInt32LE(crc, 16);
  buf.writeUInt32LE(comp, 20);
  buf.writeUInt32LE(uncomp, 24);
  buf.writeUInt16LE(nameBuf.length, 28);
  buf.writeUInt16LE(0, 30);
  buf.writeUInt16LE(0, 32);
  buf.writeUInt16LE(0, 34);
  buf.writeUInt16LE(0, 36);
  buf.writeUInt32LE(0, 38);
  buf.writeUInt32LE(offset, 42);
  nameBuf.copy(buf, 46);
  return buf;
}

function eocd(totalEntries, centralSize, centralOffset) {
  const buf = Buffer.alloc(22);
  buf.writeUInt32LE(0x06054b50, 0);
  buf.writeUInt16LE(0, 4);
  buf.writeUInt16LE(0, 6);
  buf.writeUInt16LE(totalEntries, 8);
  buf.writeUInt16LE(totalEntries, 10);
  buf.writeUInt32LE(centralSize, 12);
  buf.writeUInt32LE(centralOffset, 16);
  buf.writeUInt16LE(0, 20);
  return buf;
}

function collectFiles(dir, base = '') {
  const entries = [];
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    const stat = statSync(path);
    if (stat.isDirectory()) {
      entries.push(...collectFiles(path, join(base, name)));
    } else {
      entries.push({ name: join(base, name), path });
    }
  }
  return entries;
}

function createZip(outPath, dir) {
  const entries = collectFiles(dir);
  const centralDirEntries = [];
  let currentOffset = 0;

  for (const entry of entries) {
    const data = readFileSync(entry.path);
    const compressed = deflateSync(data);
    const crc = crc32(data);
    const method = compressed.length < data.length ? 8 : 0;
    const comp = method === 8 ? compressed : data;
    const compLen = comp.length;

    const localHdr = localFileHeader(entry.name, crc, compLen, data.length, method);
    const centralHdr = centralDirHeader(entry.name, crc, compLen, data.length, method, currentOffset);

    centralDirEntries.push({ localHdr, data: comp, centralHdr });
    currentOffset += localHdr.length + compLen;
  }

  const centralSize = centralDirEntries.reduce((s, e) => s + e.centralHdr.length, 0);
  const centralOffsetVal = currentOffset;
  const eocdRecord = eocd(entries.length, centralSize, centralOffsetVal);

  const out = [];
  for (const e of centralDirEntries) {
    out.push(e.localHdr);
    out.push(e.data);
  }
  for (const e of centralDirEntries) {
    out.push(e.centralHdr);
  }
  out.push(eocdRecord);

  writeFileSync(outPath, Buffer.concat(out));
}

createZip('dist/larp-social.zip', extDir);
cpSync('dist/larp-social.zip', 'dist/larp-social.xpi');
console.log('✅ Extensão zipada: dist/larp-social.zip + .xpi');
