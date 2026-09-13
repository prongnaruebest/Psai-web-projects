const volumes = [
  { number:1, firstChapter:1, lastChapter:18, totalPages:228 }, { number:2, firstChapter:19, lastChapter:36, totalPages:246 },
  { number:3, firstChapter:37, lastChapter:54, totalPages:238 }, { number:4, firstChapter:55, lastChapter:72, totalPages:264 },
];
const chapters = Array.from({ length:72 }, (_,index) => { const number = index + 1; const volume = volumes.find((item) => number >= item.firstChapter && number <= item.lastChapter); const start = 4 + (number - volume.firstChapter) * 12; return { number, slug:`chapter-${number}`, volumeNumber:volume.number, pdfStartPage:start, pdfEndPage:Math.min(start + 10, volume.totalPages), totalPdfPages:volume.totalPages }; });
const errors = [];
const numbers = new Set(); const slugs = new Set();
for (const chapter of chapters) { if (numbers.has(chapter.number)) errors.push(`เลขตอนซ้ำ: ${chapter.number}`); numbers.add(chapter.number); if (slugs.has(chapter.slug)) errors.push(`slug ซ้ำ: ${chapter.slug}`); slugs.add(chapter.slug); if (!volumes.some((volume) => volume.number === chapter.volumeNumber)) errors.push(`ไม่พบเล่มของตอน ${chapter.number}`); if (chapter.pdfStartPage > chapter.pdfEndPage || chapter.pdfEndPage > chapter.totalPdfPages) errors.push(`ช่วงหน้าไม่ถูกต้อง ตอน ${chapter.number}`); }
for (let number = 1; number <= chapters.length; number += 1) if (!numbers.has(number)) errors.push(`ตอนหาย: ${number}`);
if (chapters.length !== 72 || volumes.length !== 4) errors.push('จำนวนเล่มหรือตอนไม่ตรง metadata');
if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
console.log(`✓ ข้อมูลถูกต้อง: ${volumes.length} เล่ม, ${chapters.length} ตอน, ไม่มีเลขหรือ slug ซ้ำ`);
