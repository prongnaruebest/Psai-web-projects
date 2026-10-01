/**
 * 3D Woodworking Project Models & Templates (20 Diverse Woodcraft Styles)
 * All dimensions are in Centimeters (cm).
 * Coordinate system:
 * X: Width (Left/Right)
 * Y: Height (Up/Down) - Y=0 is ground level
 * Z: Depth (Front/Back)
 */

window.WOOD_PROJECTS = {
  // 1. Pallet Coffee Table (80 x 60 x 40 cm)
  "pallet-coffee-table": {
    id: "pallet-coffee-table",
    name: "Pallet Coffee Table (โต๊ะกลางกาแฟ)",
    category: "โต๊ะ",
    description: "โต๊ะกลางกาแฟไม้พาเลททรงคลาสสิก พร้อมบล็อกไม้ขา 4 มุม คานขื่อ และไม้แผ่นท็อปเรียงชิด",
    defaultDimensions: { width: 80, depth: 60, height: 40 },
    generateParts: function(w, d, h) {
      const parts = [];
      const boardThick = 2.0;
      const slatWidth = 9.0;
      const blockH = h - (boardThick * 3);
      const halfH = blockH / 2;
      const legSize = 9.0;
      
      const legPositions = [
        { id: "leg-fl", name: "บล็อกขาหน้าซ้าย", x: -w/2 + legSize/2, z: d/2 - legSize/2, step: 1, dir: [ -1, -1, 1 ] },
        { id: "leg-fr", name: "บล็อกขาหน้าขวา", x: w/2 - legSize/2, z: d/2 - legSize/2, step: 1, dir: [ 1, -1, 1 ] },
        { id: "leg-bl", name: "บล็อกขาหลังซ้าย", x: -w/2 + legSize/2, z: -d/2 + legSize/2, step: 1, dir: [ -1, -1, -1 ] },
        { id: "leg-br", name: "บล็อกขาหลังขวา", x: w/2 - legSize/2, z: -d/2 + legSize/2, step: 1, dir: [ 1, -1, -1 ] },
        { id: "leg-mc", name: "บล็อกขากลาง", x: 0, z: 0, step: 1, dir: [ 0, -1, 0 ] },
      ];

      legPositions.forEach(leg => {
        parts.push({
          id: leg.id,
          name: leg.name,
          category: "Block",
          dims: { x: legSize, y: halfH, z: legSize },
          pos: { x: leg.x, y: halfH / 2, z: leg.z },
          rot: { x: 0, y: 0, z: 0 },
          step: leg.step,
          explodeDir: leg.dir,
          joint: "pallet-block"
        });
      });

      const stringerY = halfH + boardThick/2;
      const stringers = [
        { id: "str-l", name: "คานล่างซ้าย", x: -w/2 + legSize/2, z: 0, length: d, step: 2, dir: [-1, 0, 0] },
        { id: "str-c", name: "คานล่างกลาง", x: 0, z: 0, length: d, step: 2, dir: [0, 0, 0] },
        { id: "str-r", name: "คานล่างขวา", x: w/2 - legSize/2, z: 0, length: d, step: 2, dir: [1, 0, 0] }
      ];
      stringers.forEach(s => {
        parts.push({
          id: s.id,
          name: s.name,
          category: "Stringer",
          dims: { x: legSize, y: boardThick, z: s.length },
          pos: { x: s.x, y: stringerY, z: s.z },
          rot: { x: 0, y: 0, z: 0 },
          step: s.step,
          explodeDir: s.dir,
          joint: "butt"
        });
      });

      const midBlockY = stringerY + boardThick/2 + halfH/2;
      legPositions.forEach((leg, idx) => {
        parts.push({
          id: "mid-block-" + idx,
          name: "บล็อกชั้นกลาง " + (idx+1),
          category: "Block",
          dims: { x: legSize, y: halfH, z: legSize },
          pos: { x: leg.x, y: midBlockY, z: leg.z },
          rot: { x: 0, y: 0, z: 0 },
          step: 3,
          explodeDir: [leg.dir[0], 0, leg.dir[2]],
          joint: "pallet-block"
        });
      });

      const topRunnerY = midBlockY + halfH/2 + boardThick/2;
      stringers.forEach((s, idx) => {
        parts.push({
          id: "top-runner-" + idx,
          name: "คานรองท็อป " + (idx+1),
          category: "Runner",
          dims: { x: legSize, y: boardThick, z: s.length },
          pos: { x: s.x, y: topRunnerY, z: s.z },
          rot: { x: 0, y: 0, z: 0 },
          step: 4,
          explodeDir: [0, 0.5, 0],
          joint: "lap"
        });
      });

      const topSlatY = topRunnerY + boardThick;
      const numSlats = Math.floor(d / (slatWidth + 1.0));
      const spacing = (d - (numSlats * slatWidth)) / (numSlats - 1 || 1);

      for (let i = 0; i < numSlats; i++) {
        const slatZ = -d/2 + slatWidth/2 + i * (slatWidth + spacing);
        parts.push({
          id: `top-slat-${i+1}`,
          name: `ไม้แผ่นท็อป แถวที่ ${i+1}`,
          category: "Slat",
          dims: { x: w, y: boardThick, z: slatWidth },
          pos: { x: 0, y: topSlatY, z: slatZ },
          rot: { x: 0, y: 0, z: 0 },
          step: 5,
          explodeDir: [0, 1.2 + (i * 0.1), 0],
          joint: "butt"
        });
      }

      parts.push({
        id: "plant-pot",
        name: "กระถางต้นไม้ตกแต่ง",
        category: "Prop",
        dims: { x: 12, y: 14, z: 12 },
        pos: { x: 15, y: topSlatY + boardThick/2 + 7, z: -5 },
        rot: { x: 0, y: 0, z: 0 },
        step: 6,
        explodeDir: [0, 2, 0],
        joint: "prop",
        isProp: true
      });

      return parts;
    }
  },

  // 2. Pallet Bench (120 x 60 x 75 cm)
  "pallet-bench": {
    id: "pallet-bench",
    name: "Pallet Bench (ม้านั่งยาวพนักพิง)",
    category: "เก้าอี้",
    description: "ม้านั่งยาวไม้พาเลท 2 ที่นั่ง พร้อมพนักพิงลาดเอียงสบาย และฐานรับน้ำหนักเสริมแรง",
    defaultDimensions: { width: 120, depth: 60, height: 75 },
    generateParts: function(w, d, h) {
      const parts = [];
      const boardThick = 2.2;
      const slatWidth = 10;
      const seatH = 40;
      const blockH = 12;
      const blockSize = 9;

      const baseBlocks = [
        { id: "bb-fl", name: "บล็อกฐาน หน้าซ้าย", x: -w/2 + blockSize/2, z: d/2 - blockSize/2, dir: [-1, -1, 1] },
        { id: "bb-fm", name: "บล็อกฐาน หน้ากลาง", x: 0, z: d/2 - blockSize/2, dir: [0, -1, 1] },
        { id: "bb-fr", name: "บล็อกฐาน หน้าขวา", x: w/2 - blockSize/2, z: d/2 - blockSize/2, dir: [1, -1, 1] },
        { id: "bb-bl", name: "บล็อกฐาน หลังซ้าย", x: -w/2 + blockSize/2, z: -d/2 + blockSize/2, dir: [-1, -1, -1] },
        { id: "bb-bm", name: "บล็อกฐาน หลังกลาง", x: 0, z: -d/2 + blockSize/2, dir: [0, -1, -1] },
        { id: "bb-br", name: "บล็อกฐาน หลังขวา", x: w/2 - blockSize/2, z: -d/2 + blockSize/2, dir: [1, -1, -1] }
      ];

      baseBlocks.forEach(b => {
        parts.push({
          id: b.id,
          name: b.name,
          category: "Block",
          dims: { x: blockSize, y: blockH, z: blockSize },
          pos: { x: b.x, y: blockH/2, z: b.z },
          rot: { x: 0, y: 0, z: 0 },
          step: 1,
          explodeDir: b.dir,
          joint: "pallet-block"
        });
      });

      parts.push({
        id: "base-skirt-front",
        name: "ไม้คานหน้าฐาน",
        category: "Beam",
        dims: { x: w, y: slatWidth, z: boardThick },
        pos: { x: 0, y: slatWidth/2 + 2, z: d/2 - boardThick/2 },
        rot: { x: 0, y: 0, z: 0 },
        step: 2,
        explodeDir: [0, 0, 1],
        joint: "pocket-hole"
      });
      parts.push({
        id: "base-skirt-back",
        name: "ไม้คานหลังฐาน",
        category: "Beam",
        dims: { x: w, y: slatWidth, z: boardThick },
        pos: { x: 0, y: slatWidth/2 + 2, z: -d/2 + boardThick/2 },
        rot: { x: 0, y: 0, z: 0 },
        step: 2,
        explodeDir: [0, 0, -1],
        joint: "pocket-hole"
      });

      [-w/2 + boardThick/2, w/2 - boardThick/2].forEach((xPos, i) => {
        parts.push({
          id: `base-side-${i}`,
          name: `ไม้คานข้างฐาน ${i===0?'ซ้าย':'ขวา'}`,
          category: "Beam",
          dims: { x: boardThick, y: slatWidth, z: d - (boardThick*2) },
          pos: { x: xPos, y: slatWidth/2 + 2, z: 0 },
          rot: { x: 0, y: 0, z: 0 },
          step: 2,
          explodeDir: [xPos > 0 ? 1 : -1, 0, 0],
          joint: "butt"
        });
      });

      const seatBoxH = seatH - blockH;
      [-w/2 + blockSize/2, 0, w/2 - blockSize/2].forEach((xPos, i) => {
        parts.push({
          id: `seat-riser-${i}`,
          name: `โครงขื่อเบาะนั่งแนวลึก ${i+1}`,
          category: "Stringer",
          dims: { x: blockSize, y: seatBoxH - boardThick, z: d },
          pos: { x: xPos, y: blockH + (seatBoxH - boardThick)/2, z: 0 },
          rot: { x: 0, y: 0, z: 0 },
          step: 3,
          explodeDir: [0, 0.5, 0],
          joint: "lap"
        });
      });

      const seatSlatY = seatH - boardThick/2;
      const seatSlatsCount = 5;
      const seatDepthUsable = d - 10;
      for (let i = 0; i < seatSlatsCount; i++) {
        const zPos = -d/2 + 5 + (i * (seatDepthUsable / (seatSlatsCount-1)));
        parts.push({
          id: `seat-slat-${i+1}`,
          name: `ไม้ระแนงเบาะนั่ง แผ่นที่ ${i+1}`,
          category: "Slat",
          dims: { x: w, y: boardThick, z: slatWidth },
          pos: { x: 0, y: seatSlatY, z: zPos },
          rot: { x: 0, y: 0, z: 0 },
          step: 4,
          explodeDir: [0, 1 + i*0.1, 0],
          joint: "butt"
        });
      }

      const backAngle = -0.15;
      const backPostH = h - seatH + 10;
      [-w/2 + 6, 0, w/2 - 6].forEach((xPos, i) => {
        parts.push({
          id: `back-post-${i+1}`,
          name: `เสาเอียงค้ำพนักพิง ${i+1}`,
          category: "Post",
          dims: { x: 6, y: backPostH, z: 5 },
          pos: { x: xPos, y: seatH + backPostH/2 - 5, z: -d/2 + 4 },
          rot: { x: backAngle, y: 0, z: 0 },
          step: 5,
          explodeDir: [0, 0.5, -1],
          joint: "mortise-tenon"
        });
      });

      const backSlatsCount = 3;
      for (let i = 0; i < backSlatsCount; i++) {
        const curY = seatH + 10 + (i * 11);
        const curZ = -d/2 + 6 - (i * 2.2);
        parts.push({
          id: `back-slat-${i+1}`,
          name: `ไม้พนักพิง แถวที่ ${i+1}`,
          category: "Slat",
          dims: { x: w, y: slatWidth, z: boardThick },
          pos: { x: 0, y: curY, z: curZ },
          rot: { x: backAngle, y: 0, z: 0 },
          step: 6,
          explodeDir: [0, 0.8, -1.2 - i*0.2],
          joint: "miter"
        });
      }

      return parts;
    }
  },

  // 3. Pallet Wood Crate (50 x 40 x 30 cm)
  "pallet-wood-crate": {
    id: "pallet-wood-crate",
    name: "Pallet Wood Crate (ลังไม้/กล่องอเนกประสงค์)",
    category: "ชั้นวาง/ตู้",
    description: "ลังไม้พาเลทมินิมอล มีช่องจับถือด้านข้าง แข็งแรงและนำไปปรับขนาดใส่ของได้หลากหลาย",
    defaultDimensions: { width: 50, depth: 40, height: 30 },
    generateParts: function(w, d, h) {
      const parts = [];
      const boardThick = 1.6;
      const cornerPostSize = 4.0;
      const slatH = 6.5;
      const layers = 3;

      const numFloorSlats = 4;
      const slatD = (d - (boardThick * 2)) / numFloorSlats;
      for (let i = 0; i < numFloorSlats; i++) {
        const zPos = -d/2 + boardThick + slatD/2 + (i * slatD);
        parts.push({
          id: `crate-floor-${i+1}`,
          name: `ไม้พื้นลัง แผ่นที่ ${i+1}`,
          category: "Floor",
          dims: { x: w - (boardThick * 2), y: boardThick, z: slatD - 0.5 },
          pos: { x: 0, y: boardThick/2, z: zPos },
          rot: { x: 0, y: 0, z: 0 },
          step: 1,
          explodeDir: [0, -1 - i*0.1, 0],
          joint: "butt"
        });
      }

      const postH = h - boardThick;
      const cornerPosts = [
        { id: "post-fl", name: "เสามุมหน้าซ้าย", x: -w/2 + boardThick + cornerPostSize/2, z: d/2 - boardThick - cornerPostSize/2, dir: [-1, 0, 1] },
        { id: "post-fr", name: "เสามุมหน้าขวา", x: w/2 - boardThick - cornerPostSize/2, z: d/2 - boardThick - cornerPostSize/2, dir: [1, 0, 1] },
        { id: "post-bl", name: "เสามุมหลังซ้าย", x: -w/2 + boardThick + cornerPostSize/2, z: -d/2 + boardThick - cornerPostSize/2, dir: [-1, 0, -1] },
        { id: "post-br", name: "เสามุมหลังขวา", x: w/2 - boardThick - cornerPostSize/2, z: -d/2 + boardThick - cornerPostSize/2, dir: [1, 0, -1] }
      ];
      cornerPosts.forEach(cp => {
        parts.push({
          id: cp.id,
          name: cp.name,
          category: "Cleat",
          dims: { x: cornerPostSize, y: postH, z: cornerPostSize },
          pos: { x: cp.x, y: boardThick + postH/2, z: cp.z },
          rot: { x: 0, y: 0, z: 0 },
          step: 2,
          explodeDir: cp.dir,
          joint: "lap"
        });
      });

      for (let layer = 0; layer < layers; layer++) {
        const yPos = boardThick + slatH/2 + layer * (slatH + 1.2);
        parts.push({
          id: `crate-front-${layer+1}`,
          name: `ไม้ข้างด้านหน้า ชั้นที่ ${layer+1}`,
          category: "Wall",
          dims: { x: w, y: slatH, z: boardThick },
          pos: { x: 0, y: yPos, z: d/2 - boardThick/2 },
          rot: { x: 0, y: 0, z: 0 },
          step: 3,
          explodeDir: [0, 0, 1 + layer*0.2],
          joint: "miter"
        });
        parts.push({
          id: `crate-back-${layer+1}`,
          name: `ไม้ข้างด้านหลัง ชั้นที่ ${layer+1}`,
          category: "Wall",
          dims: { x: w, y: slatH, z: boardThick },
          pos: { x: 0, y: yPos, z: -d/2 + boardThick/2 },
          rot: { x: 0, y: 0, z: 0 },
          step: 3,
          explodeDir: [0, 0, -1 - layer*0.2],
          joint: "miter"
        });
      }

      for (let layer = 0; layer < layers; layer++) {
        const yPos = boardThick + slatH/2 + layer * (slatH + 1.2);
        [-w/2 + boardThick/2, w/2 - boardThick/2].forEach((xPos, sideIdx) => {
          const sideName = sideIdx === 0 ? "ซ้าย" : "ขวา";
          parts.push({
            id: `crate-side-${sideIdx}-${layer+1}`,
            name: `ไม้ด้านข้าง (${sideName}) ชั้นที่ ${layer+1}`,
            category: "Wall",
            dims: { x: boardThick, y: slatH, z: d - (boardThick * 2) },
            pos: { x: xPos, y: yPos, z: 0 },
            rot: { x: 0, y: 0, z: 0 },
            step: 4,
            explodeDir: [xPos > 0 ? 1.2 : -1.2, 0, 0],
            joint: "butt"
          });
        });
      }

      return parts;
    }
  },

  // 4. Pallet Wall Shelf (80 x 14 x 60 cm)
  "pallet-wall-shelf": {
    id: "pallet-wall-shelf",
    name: "Pallet Wall Shelf (ชั้นวางของติดผนัง)",
    category: "ชั้นวาง/ตู้",
    description: "ชั้นวางของติดผนัง 2 ชั้น พร้อมแผงหลังพาเลทและค้ำยันรับน้ำหนักสไตล์วินเทจ",
    defaultDimensions: { width: 80, depth: 14, height: 60 },
    generateParts: function(w, d, h) {
      const parts = [];
      const boardThick = 2.0;
      const slatW = 9.0;
      const shelfDepth = d;

      const numBackSlats = Math.floor(w / (slatW + 0.8));
      const backSpacing = (w - (numBackSlats * slatW)) / (numBackSlats - 1 || 1);

      for (let i = 0; i < numBackSlats; i++) {
        const xPos = -w/2 + slatW/2 + i * (slatW + backSpacing);
        parts.push({
          id: `shelf-back-${i+1}`,
          name: `ไม้ระแนงแผงหลัง แผ่นที่ ${i+1}`,
          category: "Backing",
          dims: { x: slatW, y: h, z: boardThick },
          pos: { x: xPos, y: h/2, z: -d/2 + boardThick/2 },
          rot: { x: 0, y: 0, z: 0 },
          step: 1,
          explodeDir: [0, 0, -1 - (i*0.05)],
          joint: "butt"
        });
      }

      const cleatY = [h * 0.15, h * 0.85];
      cleatY.forEach((yPos, idx) => {
        parts.push({
          id: `back-cleat-${idx+1}`,
          name: `คานขวางยึดแผงหลัง แถวที่ ${idx+1}`,
          category: "Batten",
          dims: { x: w - 4, y: 5, z: boardThick },
          pos: { x: 0, y: yPos, z: -d/2 + boardThick * 1.5 },
          rot: { x: 0, y: 0, z: 0 },
          step: 2,
          explodeDir: [0, 0, -0.5],
          joint: "pocket-hole"
        });
      });

      const lowerY = 12;
      parts.push({
        id: "shelf-board-bottom",
        name: "แผ่นหิ้งชั้นล่าง",
        category: "ShelfPlate",
        dims: { x: w + 4, y: boardThick, z: shelfDepth },
        pos: { x: 0, y: lowerY, z: 0 },
        rot: { x: 0, y: 0, z: 0 },
        step: 3,
        explodeDir: [0, -0.5, 1],
        joint: "dowel"
      });

      [-w/3, w/3].forEach((xPos, idx) => {
        parts.push({
          id: `bracket-lower-${idx+1}`,
          name: `ขาค้ำหิ้งล่าง ${idx+1}`,
          category: "Bracket",
          dims: { x: 4, y: 8, z: 8 },
          pos: { x: xPos, y: lowerY - 4, z: -1 },
          rot: { x: 0, y: 0, z: 0 },
          step: 3,
          explodeDir: [0, -1, 0.5],
          joint: "mortise-tenon"
        });
      });

      const upperY = 40;
      parts.push({
        id: "shelf-board-top",
        name: "แผ่นหิ้งชั้นบน",
        category: "ShelfPlate",
        dims: { x: w + 2, y: boardThick, z: shelfDepth - 2 },
        pos: { x: 0, y: upperY, z: -1 },
        rot: { x: 0, y: 0, z: 0 },
        step: 4,
        explodeDir: [0, 0.8, 1],
        joint: "dowel"
      });

      [-w/3, w/3].forEach((xPos, idx) => {
        parts.push({
          id: `bracket-upper-${idx+1}`,
          name: `ขาค้ำหิ้งบน ${idx+1}`,
          category: "Bracket",
          dims: { x: 4, y: 6, z: 6 },
          pos: { x: xPos, y: upperY - 3, z: -2 },
          rot: { x: 0, y: 0, z: 0 },
          step: 4,
          explodeDir: [0, -0.6, 0.5],
          joint: "mortise-tenon"
        });
      });

      parts.push({
        id: "prop-books",
        name: "หนังสือตกแต่ง",
        category: "Prop",
        dims: { x: 12, y: 16, z: 8 },
        pos: { x: -16, y: lowerY + boardThick/2 + 8, z: 0 },
        rot: { x: 0, y: 0, z: 0 },
        step: 5,
        explodeDir: [0, 1.5, 0],
        isProp: true
      });
      parts.push({
        id: "prop-photo-frame",
        name: "กรอบรูปตกแต่ง",
        category: "Prop",
        dims: { x: 12, y: 14, z: 2 },
        pos: { x: 18, y: upperY + boardThick/2 + 7, z: -1 },
        rot: { x: -0.1, y: 0.1, z: 0 },
        step: 5,
        explodeDir: [0, 1.5, 0.5],
        isProp: true
      });

      return parts;
    }
  },

  // 5. Vertical Garden Planter (80 x 15 x 120 cm)
  "vertical-garden-planter": {
    id: "vertical-garden-planter",
    name: "Vertical Garden Planter (กระถางแนวตั้งติดผนัง)",
    category: "กลางแจ้ง",
    description: "กระบะปลูกผักสวนครัว/ไม้ประดับแนวตั้ง 3 ชั้น ดัดแปลงจากโครงสร้างพาเลทเต็มตัว",
    defaultDimensions: { width: 80, depth: 15, height: 120 },
    generateParts: function(w, d, h) {
      const parts = [];
      const boardThick = 2.0;
      const slatW = 9.0;
      const boxDepth = d;
      const boxH = 16.0;

      const postX = [-w/2 + slatW/2, 0, w/2 - slatW/2];
      postX.forEach((xPos, idx) => {
        parts.push({
          id: `planter-post-${idx+1}`,
          name: `เสาโครงสร้างหลักแนวตั้ง ${idx+1}`,
          category: "Post",
          dims: { x: slatW, y: h, z: 4.5 },
          pos: { x: xPos, y: h/2, z: -d/2 + 2.25 },
          rot: { x: 0, y: 0, z: 0 },
          step: 1,
          explodeDir: [xPos > 0 ? 1 : (xPos < 0 ? -1 : 0), 0, -1],
          joint: "butt"
        });
      });

      const numBackSlats = 6;
      for (let i = 0; i < numBackSlats; i++) {
        const yPos = 10 + i * ((h - 20) / (numBackSlats - 1));
        parts.push({
          id: `planter-back-slat-${i+1}`,
          name: `ไม้ระแนงหลัง แถวที่ ${i+1}`,
          category: "BackSlat",
          dims: { x: w, y: slatW, z: boardThick },
          pos: { x: 0, y: yPos, z: -d/2 - boardThick/2 },
          rot: { x: 0, y: 0, z: 0 },
          step: 2,
          explodeDir: [0, 0, -1.2],
          joint: "pocket-hole"
        });
      }

      const tierYs = [20, 60, 100];
      tierYs.forEach((tierY, tierIdx) => {
        const stepNum = 3 + tierIdx;
        const tierName = `ชั้นที่ ${tierIdx+1}`;

        parts.push({
          id: `box-bottom-${tierIdx+1}`,
          name: `พื้นกระบะ ${tierName}`,
          category: "BoxBottom",
          dims: { x: w, y: boardThick, z: boxDepth },
          pos: { x: 0, y: tierY - boxH/2 + boardThick/2, z: 0 },
          rot: { x: 0, y: 0, z: 0 },
          step: stepNum,
          explodeDir: [0, -0.5, 0.5],
          joint: "butt"
        });

        parts.push({
          id: `box-front-${tierIdx+1}`,
          name: `แผ่นหน้ากระบะ ${tierName}`,
          category: "BoxFront",
          dims: { x: w, y: boxH, z: boardThick },
          pos: { x: 0, y: tierY, z: boxDepth/2 - boardThick/2 },
          rot: { x: 0, y: 0, z: 0 },
          step: stepNum,
          explodeDir: [0, 0, 1.2],
          joint: "miter"
        });

        [-w/2 + boardThick/2, w/2 - boardThick/2].forEach((endX, endIdx) => {
          parts.push({
            id: `box-end-${tierIdx+1}-${endIdx}`,
            name: `ฝาข้างกระบะ ${tierName} (${endIdx===0?'ซ้าย':'ขวา'})`,
            category: "BoxEnd",
            dims: { x: boardThick, y: boxH, z: boxDepth - boardThick*2 },
            pos: { x: endX, y: tierY, z: 0 },
            rot: { x: 0, y: 0, z: 0 },
            step: stepNum,
            explodeDir: [endX > 0 ? 1 : -1, 0, 0],
            joint: "lap"
          });
        });

        parts.push({
          id: `plants-tier-${tierIdx+1}`,
          name: `ต้นไม้/พืชสวนครัว ${tierName}`,
          category: "Plant",
          dims: { x: w - 6, y: 12, z: boxDepth - 4 },
          pos: { x: 0, y: tierY + 6, z: 0 },
          rot: { x: 0, y: 0, z: 0 },
          step: 6,
          explodeDir: [0, 1.5, 0],
          isPlant: true
        });
      });

      return parts;
    }
  },

  // 6. Pallet Outdoor Lounge / Sunbed (70 x 200 x 30 cm)
  "pallet-outdoor-lounge": {
    id: "pallet-outdoor-lounge",
    name: "Pallet Outdoor Lounge (เตียงนอนอาบแดด)",
    category: "กลางแจ้ง",
    description: "เตียงนอนเล่นกลางแจ้ง ปรับพนักพิงลาดเอียงได้ โครงสร้างยาว 2 เมตร แข็งแรงทนทาน",
    defaultDimensions: { width: 70, depth: 200, height: 30 },
    generateParts: function(w, d, h) {
      const parts = [];
      const boardThick = 2.2;
      const slatW = 9.0;
      const blockH = 10.0;
      const blockSize = 9.0;

      const xPositions = [-w/2 + blockSize/2, 0, w/2 - blockSize/2];
      const zPositions = [-d/2 + blockSize/2, 0, d/2 - blockSize/2];

      let blockCount = 1;
      xPositions.forEach(x => {
        zPositions.forEach(z => {
          parts.push({
            id: `lounge-block-${blockCount}`,
            name: `บล็อกขารอง ${blockCount}`,
            category: "Block",
            dims: { x: blockSize, y: blockH, z: blockSize },
            pos: { x: x, y: blockH/2, z: z },
            rot: { x: 0, y: 0, z: 0 },
            step: 1,
            explodeDir: [x > 0 ? 1 : (x < 0 ? -1 : 0), -1, z > 0 ? 1 : (z < 0 ? -1 : 0)],
            joint: "pallet-block"
          });
          blockCount++;
        });
      });

      xPositions.forEach((x, idx) => {
        parts.push({
          id: `lounge-stringer-${idx+1}`,
          name: `คานยาวรองเตียง ${idx+1}`,
          category: "Stringer",
          dims: { x: blockSize, y: boardThick, z: d },
          pos: { x: x, y: blockH + boardThick/2, z: 0 },
          rot: { x: 0, y: 0, z: 0 },
          step: 2,
          explodeDir: [0, 0.5, 0],
          joint: "lap"
        });
      });

      const flatSectionLen = 135;
      const flatStartZ = -d/2 + 65;
      const numFlatSlats = 11;
      const flatSpacing = flatSectionLen / numFlatSlats;

      for (let i = 0; i < numFlatSlats; i++) {
        const curZ = flatStartZ + (i * flatSpacing);
        parts.push({
          id: `lounge-flat-slat-${i+1}`,
          name: `ไม้ระแนงเบาะราบ แถวที่ ${i+1}`,
          category: "Slat",
          dims: { x: w, y: boardThick, z: slatW },
          pos: { x: 0, y: blockH + boardThick + boardThick/2, z: curZ },
          rot: { x: 0, y: 0, z: 0 },
          step: 3,
          explodeDir: [0, 1 + i*0.05, 0],
          joint: "butt"
        });
      }

      const reclineAngle = 0.55;
      const backrestLen = 65;
      const pivotZ = -d/2 + 65;
      const pivotY = blockH + boardThick;

      [-w/2 + blockSize/2, w/2 - blockSize/2].forEach((x, idx) => {
        const midHyp = backrestLen / 2;
        const cy = pivotY + Math.sin(reclineAngle) * midHyp;
        const cz = pivotZ - Math.cos(reclineAngle) * midHyp;

        parts.push({
          id: `recline-rail-${idx+1}`,
          name: `คานเอียงพนักพิง ${idx+1}`,
          category: "ReclineRail",
          dims: { x: blockSize, y: boardThick, z: backrestLen },
          pos: { x: x, y: cy, z: cz },
          rot: { x: -reclineAngle, y: 0, z: 0 },
          step: 4,
          explodeDir: [x > 0 ? 0.8 : -0.8, 1, -1],
          joint: "lap"
        });
      });

      const numBackSlats = 5;
      const backSpacing = backrestLen / (numBackSlats + 0.5);

      for (let i = 0; i < numBackSlats; i++) {
        const distFromPivot = 8 + (i * backSpacing);
        const slatY = pivotY + Math.sin(reclineAngle) * distFromPivot + boardThick;
        const slatZ = pivotZ - Math.cos(reclineAngle) * distFromPivot;

        parts.push({
          id: `recline-slat-${i+1}`,
          name: `ไม้ระแนงพนักพิง แถวที่ ${i+1}`,
          category: "Slat",
          dims: { x: w, y: boardThick, z: slatW },
          pos: { x: 0, y: slatY, z: slatZ },
          rot: { x: -reclineAngle, y: 0, z: 0 },
          step: 5,
          explodeDir: [0, 1.2 + i*0.1, -1.2],
          joint: "butt"
        });
      }

      parts.push({
        id: "lounge-prop-support",
        name: "คานค้ำพนักพิงปรับระดับ",
        category: "Support",
        dims: { x: w - 8, y: 4, z: 4 },
        pos: { x: 0, y: pivotY + 12, z: pivotZ - 38 },
        rot: { x: 0.8, y: 0, z: 0 },
        step: 5,
        explodeDir: [0, 0, -1.5],
        joint: "mortise-tenon"
      });

      return parts;
    }
  },

  // 7. Classic Dining Table (120 x 75 x 75 cm)
  "classic-dining-table": {
    id: "classic-dining-table",
    name: "Classic Dining Table (โต๊ะอาหารทรงเหลี่ยม)",
    category: "โต๊ะ",
    description: "โต๊ะอาหารไม้ทึบแบบคลาสสิก เข้ามุมบากเดือยและคานรัดขา 4 ด้าน แข็งแรง ทนทาน",
    defaultDimensions: { width: 120, depth: 75, height: 75 },
    generateParts: function(w, d, h) {
      const parts = [];
      const topThick = 3.0;
      const legSize = 7.0;
      const apronH = 9.0;
      const apronThick = 2.2;
      const legH = h - topThick;

      const legCoords = [
        { id: "leg-fl", name: "ขาโต๊ะ หน้าซ้าย", x: -w/2 + legSize/2 + 2, z: d/2 - legSize/2 - 2, dir: [-1, 0, 1] },
        { id: "leg-fr", name: "ขาโต๊ะ หน้าขวา", x: w/2 - legSize/2 - 2, z: d/2 - legSize/2 - 2, dir: [1, 0, 1] },
        { id: "leg-bl", name: "ขาโต๊ะ หลังซ้าย", x: -w/2 + legSize/2 + 2, z: -d/2 + legSize/2 + 2, dir: [-1, 0, -1] },
        { id: "leg-br", name: "ขาโต๊ะ หลังขวา", x: w/2 - legSize/2 - 2, z: -d/2 + legSize/2 + 2, dir: [1, 0, -1] }
      ];

      legCoords.forEach(leg => {
        parts.push({
          id: leg.id,
          name: leg.name,
          category: "Leg",
          dims: { x: legSize, y: legH, z: legSize },
          pos: { x: leg.x, y: legH/2, z: leg.z },
          rot: { x: 0, y: 0, z: 0 },
          step: 1,
          explodeDir: leg.dir,
          joint: "mortise-tenon"
        });
      });

      const apronY = legH - apronH/2;
      parts.push({
        id: "apron-front",
        name: "คานหน้าโต๊ะ (Apron Front)",
        category: "Apron",
        dims: { x: w - legSize*2 - 4, y: apronH, z: apronThick },
        pos: { x: 0, y: apronY, z: d/2 - legSize/2 - 2 },
        rot: { x: 0, y: 0, z: 0 },
        step: 2,
        explodeDir: [0, 0, 1],
        joint: "pocket-hole"
      });
      parts.push({
        id: "apron-back",
        name: "คานหลังโต๊ะ (Apron Back)",
        category: "Apron",
        dims: { x: w - legSize*2 - 4, y: apronH, z: apronThick },
        pos: { x: 0, y: apronY, z: -d/2 + legSize/2 + 2 },
        rot: { x: 0, y: 0, z: 0 },
        step: 2,
        explodeDir: [0, 0, -1],
        joint: "pocket-hole"
      });

      [-w/2 + legSize/2 + 2, w/2 - legSize/2 - 2].forEach((x, i) => {
        parts.push({
          id: `apron-side-${i+1}`,
          name: `คานข้างโต๊ะ ${i===0?'ซ้าย':'ขวา'}`,
          category: "Apron",
          dims: { x: apronThick, y: apronH, z: d - legSize*2 - 4 },
          pos: { x: x, y: apronY, z: 0 },
          rot: { x: 0, y: 0, z: 0 },
          step: 2,
          explodeDir: [x > 0 ? 1 : -1, 0, 0],
          joint: "pocket-hole"
        });
      });

      const numPlanks = 4;
      const plankW = d / numPlanks;
      for (let i = 0; i < numPlanks; i++) {
        const curZ = -d/2 + plankW/2 + (i * plankW);
        parts.push({
          id: `table-top-${i+1}`,
          name: `ไม้แผ่นท็อปโต๊ะ แผ่นที่ ${i+1}`,
          category: "Top",
          dims: { x: w, y: topThick, z: plankW - 0.2 },
          pos: { x: 0, y: legH + topThick/2, z: curZ },
          rot: { x: 0, y: 0, z: 0 },
          step: 3,
          explodeDir: [0, 1.2 + i*0.1, 0],
          joint: "dowel"
        });
      }

      return parts;
    }
  },

  // 8. Minimal Stool (35 x 35 x 45 cm)
  "minimal-stool": {
    id: "minimal-stool",
    name: "Minimal Wooden Stool (เก้าอี้สตูลไม้สี่เหลี่ยม)",
    category: "เก้าอี้",
    description: "เก้าอี้สตูลขนาดกะทัดรัด ขาเฉียงเสริมคานขวางรองเท้า นั่งสบายและประหยัดพื้นที่",
    defaultDimensions: { width: 35, depth: 35, height: 45 },
    generateParts: function(w, d, h) {
      const parts = [];
      const topThick = 2.5;
      const legSize = 3.8;
      const legH = h - topThick;
      const legInset = 3.5;

      // 4 Legs
      const legCoords = [
        { id: "st-leg-fl", name: "ขาสตูล หน้าซ้าย", x: -w/2 + legInset, z: d/2 - legInset, dir: [-1, 0, 1] },
        { id: "st-leg-fr", name: "ขาสตูล หน้าขวา", x: w/2 - legInset, z: d/2 - legInset, dir: [1, 0, 1] },
        { id: "st-leg-bl", name: "ขาสตูล หลังซ้าย", x: -w/2 + legInset, z: -d/2 + legInset, dir: [-1, 0, -1] },
        { id: "st-leg-br", name: "ขาสตูล หลังขวา", x: w/2 - legInset, z: -d/2 + legInset, dir: [1, 0, -1] }
      ];
      legCoords.forEach(leg => {
        parts.push({
          id: leg.id,
          name: leg.name,
          category: "Leg",
          dims: { x: legSize, y: legH, z: legSize },
          pos: { x: leg.x, y: legH/2, z: leg.z },
          rot: { x: 0, y: 0, z: 0 },
          step: 1,
          explodeDir: leg.dir,
          joint: "mortise-tenon"
        });
      });

      // Upper Aprons (4 คานบนใต้ที่นั่ง)
      const apronH = 5.0;
      const apronThick = 2.0;
      const upY = legH - apronH/2;
      parts.push({
        id: "st-apron-f",
        name: "คานบนด้านหน้า",
        category: "Apron",
        dims: { x: w - legInset*2 - legSize, y: apronH, z: apronThick },
        pos: { x: 0, y: upY, z: d/2 - legInset },
        rot: { x: 0, y: 0, z: 0 },
        step: 2,
        explodeDir: [0, 0, 1],
        joint: "pocket-hole"
      });
      parts.push({
        id: "st-apron-b",
        name: "คานบนด้านหลัง",
        category: "Apron",
        dims: { x: w - legInset*2 - legSize, y: apronH, z: apronThick },
        pos: { x: 0, y: upY, z: -d/2 + legInset },
        rot: { x: 0, y: 0, z: 0 },
        step: 2,
        explodeDir: [0, 0, -1],
        joint: "pocket-hole"
      });
      [-w/2 + legInset, w/2 - legInset].forEach((x, i) => {
        parts.push({
          id: `st-apron-side-${i+1}`,
          name: `คานบนด้านข้าง ${i===0?'ซ้าย':'ขวา'}`,
          category: "Apron",
          dims: { x: apronThick, y: apronH, z: d - legInset*2 - legSize },
          pos: { x: x, y: upY, z: 0 },
          rot: { x: 0, y: 0, z: 0 },
          step: 2,
          explodeDir: [x > 0 ? 1 : -1, 0, 0],
          joint: "pocket-hole"
        });
      });

      // Lower Footrest Stretchers (คานล่างรองเหยียบ 2 ด้าน)
      const lowY = 14;
      [-w/2 + legInset, w/2 - legInset].forEach((x, i) => {
        parts.push({
          id: `st-stretcher-${i+1}`,
          name: `คานล่างยึดขา ${i===0?'ซ้าย':'ขวา'}`,
          category: "Stretcher",
          dims: { x: apronThick, y: 3.5, z: d - legInset*2 - legSize },
          pos: { x: x, y: lowY, z: 0 },
          rot: { x: 0, y: 0, z: 0 },
          step: 3,
          explodeDir: [x > 0 ? 0.8 : -0.8, -0.5, 0],
          joint: "dowel"
        });
      });

      // Top Seat Plate
      parts.push({
        id: "st-seat-top",
        name: "แผ่นไม้ที่นั่งสตูล",
        category: "Seat",
        dims: { x: w, y: topThick, z: d },
        pos: { x: 0, y: legH + topThick/2, z: 0 },
        rot: { x: 0, y: 0, z: 0 },
        step: 4,
        explodeDir: [0, 1.2, 0],
        joint: "dowel"
      });

      return parts;
    }
  },

  // 9. Ladder Bookshelf (60 x 35 x 150 cm)
  "bookshelf-ladder": {
    id: "bookshelf-ladder",
    name: "Ladder Bookshelf (ชั้นวางหนังสือทรงบันได)",
    category: "ชั้นวาง/ตู้",
    description: "ชั้นวางของทรงบันไดเอียงพิงผนัง 4 ชั้น ไล่ระดับความลึกจากแคบไปกว้าง สไตล์มินิมอลโมเดิร์น",
    defaultDimensions: { width: 60, depth: 35, height: 150 },
    generateParts: function(w, d, h) {
      const parts = [];
      const boardThick = 2.0;
      const sideThick = 2.5;
      const sideW = 7.0;
      const angle = 0.12; // tilt angle

      // 2 Angled Ladder Uprights (เสาบันไดซ้าย-ขวา)
      [-w/2 + sideThick/2, w/2 - sideThick/2].forEach((x, idx) => {
        parts.push({
          id: `ladder-side-${idx+1}`,
          name: `เสาบันไดด้านข้าง (${idx===0?'ซ้าย':'ขวา'})`,
          category: "Upright",
          dims: { x: sideThick, y: h, z: sideW },
          pos: { x: x, y: h/2, z: 0 },
          rot: { x: angle, y: 0, z: 0 },
          step: 1,
          explodeDir: [x > 0 ? 1 : -1, 0, 0],
          joint: "lap"
        });
      });

      // 4 Tier Shelves from top to bottom (ความลึกไล่จากแคบไปลึก)
      const numShelves = 4;
      const shelfDepths = [16, 22, 28, 34];
      const shelfYs = [h * 0.85, h * 0.63, h * 0.41, h * 0.18];

      for (let i = 0; i < numShelves; i++) {
        const curD = shelfDepths[i];
        const curY = shelfYs[i];
        const curZ = -d/2 + curD/2 + 2;

        parts.push({
          id: `ladder-shelf-${i+1}`,
          name: `แผ่นชั้นวาง ชั้นที่ ${i+1} (บนลงล่าง)`,
          category: "ShelfPlate",
          dims: { x: w - sideThick*2, y: boardThick, z: curD },
          pos: { x: 0, y: curY, z: curZ },
          rot: { x: 0, y: 0, z: 0 },
          step: 2 + i,
          explodeDir: [0, 0.5 + i*0.2, 1],
          joint: "dowel"
        });

        // Shelf Backstop Lip (ไม้กั้นตกหลังชั้น)
        parts.push({
          id: `ladder-lip-${i+1}`,
          name: `ไม้ขอบกันตก ชั้นที่ ${i+1}`,
          category: "Lip",
          dims: { x: w - sideThick*2, y: 3.5, z: boardThick },
          pos: { x: 0, y: curY + boardThick/2 + 1.75, z: curZ - curD/2 + boardThick/2 },
          rot: { x: 0, y: 0, z: 0 },
          step: 2 + i,
          explodeDir: [0, 0, -0.8],
          joint: "butt"
        });
      }

      // Prop books
      parts.push({
        id: "prop-books-ladder",
        name: "หนังสือจัดแสดง",
        category: "Prop",
        dims: { x: 18, y: 18, z: 12 },
        pos: { x: -8, y: shelfYs[1] + boardThick + 9, z: 0 },
        rot: { x: 0, y: 0, z: 0 },
        step: 6,
        explodeDir: [0, 1.5, 0],
        isProp: true
      });

      return parts;
    }
  },

  // 10. Modern Bedside Nightstand (45 x 40 x 55 cm)
  "bedside-nightstand": {
    id: "bedside-nightstand",
    name: "Bedside Nightstand (โต๊ะข้างเตียงมินิมอล)",
    category: "โต๊ะ",
    description: "โต๊ะข้างเตียงทรงกล่องเปิดโล่ง พร้อมขาไม้เหลาเฉียงสไตล์โมเดิร์น มีช่องวางหนังสือและโคมไฟ",
    defaultDimensions: { width: 45, depth: 40, height: 55 },
    generateParts: function(w, d, h) {
      const parts = [];
      const boardThick = 1.8;
      const legH = 22.0;
      const boxH = h - legH;
      const boxBottomY = legH;

      // 4 Angled Tapered Legs (ขาเฉียง 4 มุม)
      const legSize = 3.5;
      const legX = w/2 - 5;
      const legZ = d/2 - 5;
      const legPositions = [
        { id: "ns-leg-fl", name: "ขาโต๊ะ หน้าซ้าย", x: -legX, z: legZ, rx: 0.1, rz: 0.1, dir: [-1, -1, 1] },
        { id: "ns-leg-fr", name: "ขาโต๊ะ หน้าขวา", x: legX, z: legZ, rx: 0.1, rz: -0.1, dir: [1, -1, 1] },
        { id: "ns-leg-bl", name: "ขาโต๊ะ หลังซ้าย", x: -legX, z: -legZ, rx: -0.1, rz: 0.1, dir: [-1, -1, -1] },
        { id: "ns-leg-br", name: "ขาโต๊ะ หลังขวา", x: legX, z: -legZ, rx: -0.1, rz: -0.1, dir: [1, -1, -1] }
      ];
      legPositions.forEach(leg => {
        parts.push({
          id: leg.id,
          name: leg.name,
          category: "Leg",
          dims: { x: legSize, y: legH, z: legSize },
          pos: { x: leg.x, y: legH/2, z: leg.z },
          rot: { x: leg.rx, y: 0, z: leg.rz },
          step: 1,
          explodeDir: leg.dir,
          joint: "pocket-hole"
        });
      });

      // Box Bottom Plate
      parts.push({
        id: "ns-box-bottom",
        name: "แผ่นพื้นกล่องตู้",
        category: "Panel",
        dims: { x: w, y: boardThick, z: d },
        pos: { x: 0, y: boxBottomY + boardThick/2, z: 0 },
        rot: { x: 0, y: 0, z: 0 },
        step: 2,
        explodeDir: [0, -0.5, 0],
        joint: "miter"
      });

      // Box Side Panels (ซ้าย-ขวา)
      [-w/2 + boardThick/2, w/2 - boardThick/2].forEach((x, i) => {
        parts.push({
          id: `ns-box-side-${i+1}`,
          name: `ผนังตู้ด้านข้าง ${i===0?'ซ้าย':'ขวา'}`,
          category: "Panel",
          dims: { x: boardThick, y: boxH - boardThick*2, z: d },
          pos: { x: x, y: boxBottomY + boxH/2, z: 0 },
          rot: { x: 0, y: 0, z: 0 },
          step: 3,
          explodeDir: [x > 0 ? 1 : -1, 0, 0],
          joint: "miter"
        });
      });

      // Box Back Panel
      parts.push({
        id: "ns-box-back",
        name: "แผ่นปิดหลังตู้",
        category: "Backing",
        dims: { x: w - boardThick*2, y: boxH - boardThick*2, z: boardThick },
        pos: { x: 0, y: boxBottomY + boxH/2, z: -d/2 + boardThick/2 },
        rot: { x: 0, y: 0, z: 0 },
        step: 4,
        explodeDir: [0, 0, -1],
        joint: "butt"
      });

      // Middle Divider Shelf (ชั้นแบ่งกลาง)
      parts.push({
        id: "ns-mid-shelf",
        name: "แผ่นชั้นคั่นกลาง",
        category: "ShelfPlate",
        dims: { x: w - boardThick*2, y: boardThick, z: d - boardThick },
        pos: { x: 0, y: boxBottomY + boxH * 0.45, z: boardThick/2 },
        rot: { x: 0, y: 0, z: 0 },
        step: 4,
        explodeDir: [0, 0, 0.8],
        joint: "dowel"
      });

      // Top Plate
      parts.push({
        id: "ns-top-plate",
        name: "แผ่นท็อปตู้ข้างเตียง",
        category: "Top",
        dims: { x: w, y: boardThick, z: d },
        pos: { x: 0, y: h - boardThick/2, z: 0 },
        rot: { x: 0, y: 0, z: 0 },
        step: 5,
        explodeDir: [0, 1.2, 0],
        joint: "miter"
      });

      return parts;
    }
  },

  // 11. TV Media Console (150 x 40 x 50 cm)
  "tv-console-credenza": {
    id: "tv-console-credenza",
    name: "TV Media Console (ตู้วางทีวีสไตล์สแกนดิเนเวีย)",
    category: "ชั้นวาง/ตู้",
    description: "ตู้วางทีวียาว 1.5 เมตร แบ่ง 3 ช่องอเนกประสงค์ พร้อมขารองรับน้ำหนัก 5 จุด แข็งแรงสวยงาม",
    defaultDimensions: { width: 150, depth: 40, height: 50 },
    generateParts: function(w, d, h) {
      const parts = [];
      const boardThick = 2.0;
      const legH = 15.0;
      const boxH = h - legH;
      const boxBaseY = legH;

      // 5 Base Legs (4 มุม + 1 ตรงกลาง)
      const legSize = 4.0;
      const legPositions = [
        { id: "tv-leg-fl", name: "ขาตู้ หน้าซ้าย", x: -w/2 + 8, z: d/2 - 6, dir: [-1, -1, 1] },
        { id: "tv-leg-fr", name: "ขาตู้ หน้าขวา", x: w/2 - 8, z: d/2 - 6, dir: [1, -1, 1] },
        { id: "tv-leg-bl", name: "ขาตู้ หลังซ้าย", x: -w/2 + 8, z: -d/2 + 6, dir: [-1, -1, -1] },
        { id: "tv-leg-br", name: "ขาตู้ หลังขวา", x: w/2 - 8, z: -d/2 + 6, dir: [1, -1, -1] },
        { id: "tv-leg-mc", name: "ขากลางรับน้ำหนัก", x: 0, z: 0, dir: [0, -1, 0] }
      ];
      legPositions.forEach(leg => {
        parts.push({
          id: leg.id,
          name: leg.name,
          category: "Leg",
          dims: { x: legSize, y: legH, z: legSize },
          pos: { x: leg.x, y: legH/2, z: leg.z },
          rot: { x: 0, y: 0, z: 0 },
          step: 1,
          explodeDir: leg.dir,
          joint: "pocket-hole"
        });
      });

      // Bottom Base Panel
      parts.push({
        id: "tv-panel-bottom",
        name: "แผ่นพื้นตู้ล่าง",
        category: "Panel",
        dims: { x: w, y: boardThick, z: d },
        pos: { x: 0, y: boxBaseY + boardThick/2, z: 0 },
        rot: { x: 0, y: 0, z: 0 },
        step: 2,
        explodeDir: [0, -0.5, 0],
        joint: "miter"
      });

      // 2 Outer Side Panels
      [-w/2 + boardThick/2, w/2 - boardThick/2].forEach((x, i) => {
        parts.push({
          id: `tv-side-${i+1}`,
          name: `ผนังตู้ด้านนอก ${i===0?'ซ้าย':'ขวา'}`,
          category: "Panel",
          dims: { x: boardThick, y: boxH - boardThick*2, z: d },
          pos: { x: x, y: boxBaseY + boxH/2, z: 0 },
          rot: { x: 0, y: 0, z: 0 },
          step: 3,
          explodeDir: [x > 0 ? 1 : -1, 0, 0],
          joint: "miter"
        });
      });

      // 2 Vertical Inner Dividers (แบ่งเป็น 3 ช่องเท่าๆ กัน)
      const innerW = w - boardThick*2;
      const compartmentW = innerW / 3;
      [-compartmentW/2, compartmentW/2].forEach((x, i) => {
        parts.push({
          id: `tv-divider-${i+1}`,
          name: `ผนังกั้นช่องตู้ ${i+1}`,
          category: "Divider",
          dims: { x: boardThick, y: boxH - boardThick*2, z: d - boardThick },
          pos: { x: x, y: boxBaseY + boxH/2, z: boardThick/2 },
          rot: { x: 0, y: 0, z: 0 },
          step: 3,
          explodeDir: [0, 0.5, 0],
          joint: "dowel"
        });
      });

      // Middle Channel Shelf
      parts.push({
        id: "tv-center-shelf",
        name: "แผ่นชั้นคั่นช่องกลาง",
        category: "ShelfPlate",
        dims: { x: compartmentW - boardThick, y: boardThick, z: d - boardThick*2 },
        pos: { x: 0, y: boxBaseY + boxH/2, z: boardThick/2 },
        rot: { x: 0, y: 0, z: 0 },
        step: 4,
        explodeDir: [0, 0, 1],
        joint: "dowel"
      });

      // Top Surface Board
      parts.push({
        id: "tv-top-panel",
        name: "แผ่นท็อปวางทีวีด้านบน",
        category: "Top",
        dims: { x: w, y: boardThick, z: d },
        pos: { x: 0, y: h - boardThick/2, z: 0 },
        rot: { x: 0, y: 0, z: 0 },
        step: 5,
        explodeDir: [0, 1.2, 0],
        joint: "miter"
      });

      return parts;
    }
  },

  // 12. Entryway Shoe Rack Bench (90 x 30 x 45 cm)
  "shoe-rack-bench": {
    id: "shoe-rack-bench",
    name: "Shoe Rack Bench (ม้านั่งใส่รองเท้า 2 ชั้น)",
    category: "เก้าอี้",
    description: "ม้านั่งสำหรับสวมรองเท้าหน้าประตูบ้าน ชั้นล่างเป็นระแนงโปร่งระบายอากาศ 2 ระดับ",
    defaultDimensions: { width: 90, depth: 30, height: 45 },
    generateParts: function(w, d, h) {
      const parts = [];
      const boardThick = 2.0;
      const legSize = 4.5;
      const slatW = 4.5;
      const legH = h - boardThick;

      // 4 Solid Legs
      const legPositions = [
        { id: "sr-leg-fl", name: "ขาหน้าซ้าย", x: -w/2 + legSize/2 + 1, z: d/2 - legSize/2 - 1, dir: [-1, 0, 1] },
        { id: "sr-leg-fr", name: "ขาหน้าขวา", x: w/2 - legSize/2 - 1, z: d/2 - legSize/2 - 1, dir: [1, 0, 1] },
        { id: "sr-leg-bl", name: "ขาหลังซ้าย", x: -w/2 + legSize/2 + 1, z: -d/2 + legSize/2 + 1, dir: [-1, 0, -1] },
        { id: "sr-leg-br", name: "ขาหลังขวา", x: w/2 - legSize/2 - 1, z: -d/2 + legSize/2 + 1, dir: [1, 0, -1] }
      ];
      legPositions.forEach(leg => {
        parts.push({
          id: leg.id,
          name: leg.name,
          category: "Leg",
          dims: { x: legSize, y: legH, z: legSize },
          pos: { x: leg.x, y: legH/2, z: leg.z },
          rot: { x: 0, y: 0, z: 0 },
          step: 1,
          explodeDir: leg.dir,
          joint: "mortise-tenon"
        });
      });

      // Side Stretchers (คานข้างยึดขา 4 ตัว: ล่างและกลาง)
      const tierYs = [10, 24];
      tierYs.forEach((ty, tIdx) => {
        [-w/2 + legSize/2 + 1, w/2 - legSize/2 - 1].forEach((x, sIdx) => {
          parts.push({
            id: `sr-side-rail-${tIdx+1}-${sIdx+1}`,
            name: `คานข้างชั้น ${tIdx+1} (${sIdx===0?'ซ้าย':'ขวา'})`,
            category: "Stretcher",
            dims: { x: 2.2, y: 3.5, z: d - legSize*2 - 2 },
            pos: { x: x, y: ty, z: 0 },
            rot: { x: 0, y: 0, z: 0 },
            step: 2,
            explodeDir: [x > 0 ? 0.8 : -0.8, 0, 0],
            joint: "pocket-hole"
          });
        });

        // 3 Slats per tier for shoes
        for (let s = 0; s < 3; s++) {
          const zPos = -d/2 + 6 + (s * 9);
          parts.push({
            id: `sr-slat-t${tIdx+1}-${s+1}`,
            name: `ไม้ระแนงวางรองเท้า ชั้น ${tIdx+1} ซี่ที่ ${s+1}`,
            category: "Slat",
            dims: { x: w - legSize*2 - 2, y: 1.8, z: slatW },
            pos: { x: 0, y: ty + 2.5, z: zPos },
            rot: { x: 0, y: 0, z: 0 },
            step: 3,
            explodeDir: [0, 0.5 + tIdx*0.3, 0],
            joint: "butt"
          });
        }
      });

      // Top Bench Seat
      parts.push({
        id: "sr-top-seat",
        name: "แผ่นไม้เบาะนั่งด้านบน",
        category: "Seat",
        dims: { x: w, y: boardThick, z: d },
        pos: { x: 0, y: h - boardThick/2, z: 0 },
        rot: { x: 0, y: 0, z: 0 },
        step: 4,
        explodeDir: [0, 1.2, 0],
        joint: "pocket-hole"
      });

      return parts;
    }
  },

  // 13. Wooden Standing Desk (120 x 60 x 105 cm)
  "standing-desk": {
    id: "standing-desk",
    name: "Wooden Standing Desk (โต๊ะทำงานแบบยืน)",
    category: "โต๊ะ",
    description: "โต๊ะทำงานเพื่อสุขภาพความสูง 105 cm สำหรับยืนทำงาน พร้อมคานรับน้ำหนักโครงสร้างแบบตัว H",
    defaultDimensions: { width: 120, depth: 60, height: 105 },
    generateParts: function(w, d, h) {
      const parts = [];
      const topThick = 3.0;
      const legSize = 6.0;
      const legH = h - topThick;

      // 4 Heavy duty legs
      const legPositions = [
        { id: "sd-leg-fl", name: "เสาขาหน้าซ้าย", x: -w/2 + 6, z: d/2 - 6, dir: [-1, 0, 1] },
        { id: "sd-leg-fr", name: "เสาขาหน้าขวา", x: w/2 - 6, z: d/2 - 6, dir: [1, 0, 1] },
        { id: "sd-leg-bl", name: "เสาขาหลังซ้าย", x: -w/2 + 6, z: -d/2 + 6, dir: [-1, 0, -1] },
        { id: "sd-leg-br", name: "เสาขาหลังขวา", x: w/2 - 6, z: -d/2 + 6, dir: [1, 0, -1] }
      ];
      legPositions.forEach(leg => {
        parts.push({
          id: leg.id,
          name: leg.name,
          category: "Leg",
          dims: { x: legSize, y: legH, z: legSize },
          pos: { x: leg.x, y: legH/2, z: leg.z },
          rot: { x: 0, y: 0, z: 0 },
          step: 1,
          explodeDir: leg.dir,
          joint: "mortise-tenon"
        });
      });

      // Upper Aprons (คานบน 4 ด้าน)
      const apronH = 8.0;
      const apronY = legH - apronH/2;
      parts.push({
        id: "sd-apron-f",
        name: "คานบนด้านหน้า",
        category: "Apron",
        dims: { x: w - 24, y: apronH, z: 2.5 },
        pos: { x: 0, y: apronY, z: d/2 - 6 },
        rot: { x: 0, y: 0, z: 0 },
        step: 2,
        explodeDir: [0, 0, 1],
        joint: "pocket-hole"
      });
      parts.push({
        id: "sd-apron-b",
        name: "คานบนด้านหลัง",
        category: "Apron",
        dims: { x: w - 24, y: apronH, z: 2.5 },
        pos: { x: 0, y: apronY, z: -d/2 + 6 },
        rot: { x: 0, y: 0, z: 0 },
        step: 2,
        explodeDir: [0, 0, -1],
        joint: "pocket-hole"
      });
      [-w/2 + 6, w/2 - 6].forEach((x, i) => {
        parts.push({
          id: `sd-apron-s-${i+1}`,
          name: `คานบนด้านข้าง ${i===0?'ซ้าย':'ขวา'}`,
          category: "Apron",
          dims: { x: 2.5, y: apronH, z: d - 24 },
          pos: { x: x, y: apronY, z: 0 },
          rot: { x: 0, y: 0, z: 0 },
          step: 2,
          explodeDir: [x > 0 ? 1 : -1, 0, 0],
          joint: "pocket-hole"
        });
      });

      // Lower Footrest Bar (คานพักเท้ากลาง)
      const footY = 22;
      parts.push({
        id: "sd-footrest-center",
        name: "คานพักเท้าแกนกลาง",
        category: "Footrest",
        dims: { x: w - 24, y: 5.0, z: 5.0 },
        pos: { x: 0, y: footY, z: 0 },
        rot: { x: 0, y: 0, z: 0 },
        step: 3,
        explodeDir: [0, -0.5, 0],
        joint: "mortise-tenon"
      });

      // Top Desktop Slab
      parts.push({
        id: "sd-desktop-top",
        name: "แผ่นท็อปโต๊ะทำงานเนื้อไม้หนา",
        category: "Top",
        dims: { x: w, y: topThick, z: d },
        pos: { x: 0, y: h - topThick/2, z: 0 },
        rot: { x: 0, y: 0, z: 0 },
        step: 4,
        explodeDir: [0, 1.2, 0],
        joint: "dowel"
      });

      return parts;
    }
  },

  // 14. Kitchen Island Cart (100 x 60 x 90 cm)
  "kitchen-island-cart": {
    id: "kitchen-island-cart",
    name: "Kitchen Island Cart (โต๊ะเตรียมอาหารในครัว)",
    category: "โต๊ะ",
    description: "โต๊ะเตรียมอาหารหรือเกาะกลางครัว ท็อปไม้เขียงหนา (Butcher Block) พร้อมชั้นวางหม้อกระทะ 2 ชั้น",
    defaultDimensions: { width: 100, depth: 60, height: 90 },
    generateParts: function(w, d, h) {
      const parts = [];
      const topThick = 4.0;
      const legSize = 6.0;
      const legH = h - topThick;

      // 4 Heavy Legs
      const legPositions = [
        { id: "ki-leg-fl", name: "ขาเกาะครัว หน้าซ้าย", x: -w/2 + 5, z: d/2 - 5, dir: [-1, 0, 1] },
        { id: "ki-leg-fr", name: "ขาเกาะครัว หน้าขวา", x: w/2 - 5, z: d/2 - 5, dir: [1, 0, 1] },
        { id: "ki-leg-bl", name: "ขาเกาะครัว หลังซ้าย", x: -w/2 + 5, z: -d/2 + 5, dir: [-1, 0, -1] },
        { id: "ki-leg-br", name: "ขาเกาะครัว หลังขวา", x: w/2 - 5, z: -d/2 + 5, dir: [1, 0, -1] }
      ];
      legPositions.forEach(leg => {
        parts.push({
          id: leg.id,
          name: leg.name,
          category: "Leg",
          dims: { x: legSize, y: legH, z: legSize },
          pos: { x: leg.x, y: legH/2, z: leg.z },
          rot: { x: 0, y: 0, z: 0 },
          step: 1,
          explodeDir: leg.dir,
          joint: "mortise-tenon"
        });
      });

      // 2 Storage Shelf Tiers
      const tierYs = [18, 48];
      tierYs.forEach((ty, idx) => {
        // Shelf frame
        parts.push({
          id: `ki-shelf-frame-f-${idx+1}`,
          name: `คานหน้าชั้นวาง ชั้น ${idx+1}`,
          category: "Frame",
          dims: { x: w - 22, y: 4.0, z: 2.2 },
          pos: { x: 0, y: ty, z: d/2 - 5 },
          rot: { x: 0, y: 0, z: 0 },
          step: 2,
          explodeDir: [0, 0, 0.8],
          joint: "pocket-hole"
        });
        parts.push({
          id: `ki-shelf-frame-b-${idx+1}`,
          name: `คานหลังชั้นวาง ชั้น ${idx+1}`,
          category: "Frame",
          dims: { x: w - 22, y: 4.0, z: 2.2 },
          pos: { x: 0, y: ty, z: -d/2 + 5 },
          rot: { x: 0, y: 0, z: 0 },
          step: 2,
          explodeDir: [0, 0, -0.8],
          joint: "pocket-hole"
        });

        // Slats for shelf floor
        for (let s = 0; s < 4; s++) {
          const zPos = -d/2 + 10 + (s * 10);
          parts.push({
            id: `ki-slat-t${idx+1}-${s+1}`,
            name: `ไม้ระแนงชั้น ${idx+1} แผ่นที่ ${s+1}`,
            category: "Slat",
            dims: { x: w - 16, y: 2.0, z: 7.0 },
            pos: { x: 0, y: ty + 2.5, z: zPos },
            rot: { x: 0, y: 0, z: 0 },
            step: 3,
            explodeDir: [0, 0.6, 0],
            joint: "butt"
          });
        }
      });

      // Top Heavy Butcher Block
      parts.push({
        id: "ki-butcher-top",
        name: "ท็อปไม้เขียง Butcher Block",
        category: "Top",
        dims: { x: w, y: topThick, z: d },
        pos: { x: 0, y: h - topThick/2, z: 0 },
        rot: { x: 0, y: 0, z: 0 },
        step: 4,
        explodeDir: [0, 1.2, 0],
        joint: "dowel"
      });

      return parts;
    }
  },

  // 15. Wall Wine & Glass Rack (70 x 20 x 40 cm)
  "wine-bottle-glass-rack": {
    id: "wine-bottle-glass-rack",
    name: "Wall Wine & Glass Rack (ที่แขวนไวน์และแก้ว)",
    category: "ของแต่งบ้าน",
    description: "ชั้นไม้ติดผนังสำหรับเก็บขวดไวน์ 6 ขวด และร่องแขวนก้านแก้วไวน์ด้านล่าง สไตล์รัสติกบาร์",
    defaultDimensions: { width: 70, depth: 20, height: 40 },
    generateParts: function(w, d, h) {
      const parts = [];
      const boardThick = 2.0;

      // Backing Plank (แผ่นหลังติดผนัง)
      parts.push({
        id: "wr-back-panel",
        name: "แผ่นไม้โครงหลังติดผนัง",
        category: "Backing",
        dims: { x: w, y: h, z: boardThick },
        pos: { x: 0, y: h/2, z: -d/2 + boardThick/2 },
        rot: { x: 0, y: 0, z: 0 },
        step: 1,
        explodeDir: [0, 0, -1],
        joint: "butt"
      });

      // 2 Side Support Wings
      [-w/2 + boardThick/2, w/2 - boardThick/2].forEach((x, i) => {
        parts.push({
          id: `wr-side-wing-${i+1}`,
          name: `แผงปีกข้าง ${i===0?'ซ้าย':'ขวา'}`,
          category: "Side",
          dims: { x: boardThick, y: h - 6, z: d - boardThick },
          pos: { x: x, y: (h - 6)/2 + 3, z: 0 },
          rot: { x: 0, y: 0, z: 0 },
          step: 2,
          explodeDir: [x > 0 ? 1 : -1, 0, 0],
          joint: "lap"
        });
      });

      // Middle Bottle Shelf (พื้นวางขวด)
      parts.push({
        id: "wr-bottle-shelf",
        name: "แผ่นพื้นวางขวดไวน์",
        category: "ShelfPlate",
        dims: { x: w - boardThick*2, y: boardThick, z: d - boardThick },
        pos: { x: 0, y: 14, z: 0 },
        rot: { x: 0, y: 0, z: 0 },
        step: 3,
        explodeDir: [0, 0, 0.8],
        joint: "dowel"
      });

      // Front Bottle Guard Rail (ไม้กันขวดตก)
      parts.push({
        id: "wr-guard-rail",
        name: "ไม้กั้นกันขวดตกด้านหน้า",
        category: "Rail",
        dims: { x: w, y: 4.5, z: boardThick },
        pos: { x: 0, y: 20, z: d/2 - boardThick/2 },
        rot: { x: 0, y: 0, z: 0 },
        step: 3,
        explodeDir: [0, 0, 1.2],
        joint: "miter"
      });

      // Bottom Stemware Slats (ร่องแขวนแก้วไวน์ด้านล่าง 4 ซี่)
      for (let g = 0; g < 4; g++) {
        const xPos = -w/2 + 12 + (g * 15);
        parts.push({
          id: `wr-stemware-slat-${g+1}`,
          name: `รางแขวนก้านแก้ว ซี่ที่ ${g+1}`,
          category: "GlassRail",
          dims: { x: 7.0, y: 1.5, z: d - 4 },
          pos: { x: xPos, y: 3, z: 0 },
          rot: { x: 0, y: 0, z: 0 },
          step: 4,
          explodeDir: [0, -1, 0],
          joint: "pocket-hole"
        });
      }

      return parts;
    }
  },

  // 16. Outdoor Picnic Table with Attached Benches (150 x 140 x 75 cm)
  "picnic-table-benches": {
    id: "picnic-table-benches",
    name: "Outdoor Picnic Table (โต๊ะปิกนิกสนามพร้อมม้านั่ง)",
    category: "กลางแจ้ง",
    description: "ชุดโต๊ะปิกนิกกลางแจ้งคลาสสิก ขาโครงรูปตัว A เชื่อมต่อม้านั่งยาวสองฝั่งในตัว แข็งแรงทนแดดฝน",
    defaultDimensions: { width: 150, depth: 140, height: 75 },
    generateParts: function(w, d, h) {
      const parts = [];
      const boardThick = 3.2;
      const legSize = 9.0;
      const benchH = 43.0;

      // 2 A-Frame Cross Assemblies (โครงขา A ซ้ายและขวา)
      [-w/2 + 25, w/2 - 25].forEach((x, fIdx) => {
        // Angled Legs (ขาเฉียง 2 ข้าง)
        [-1, 1].forEach((side, lIdx) => {
          parts.push({
            id: `pt-leg-${fIdx+1}-${lIdx+1}`,
            name: `ขาเฉียงโครง A-${fIdx+1} (${side>0?'หน้า':'หลัง'})`,
            category: "Leg",
            dims: { x: 4.5, y: h + 5, z: legSize },
            pos: { x: x, y: h/2, z: side * (d * 0.22) },
            rot: { x: side * 0.35, y: 0, z: 0 },
            step: 1,
            explodeDir: [x > 0 ? 0.8 : -0.8, -0.5, side * 0.8],
            joint: "lap"
          });
        });

        // Bench Support Crossbar (คานขวางรองรับม้านั่งสองฝั่ง)
        parts.push({
          id: `pt-bench-cross-${fIdx+1}`,
          name: `คานขวางรับม้านั่ง โครง ${fIdx+1}`,
          category: "Crossbar",
          dims: { x: 4.5, y: 9.0, z: d * 0.85 },
          pos: { x: x, y: benchH, z: 0 },
          rot: { x: 0, y: 0, z: 0 },
          step: 2,
          explodeDir: [x > 0 ? 0.5 : -0.5, 0, 0],
          joint: "lap"
        });

        // Table Top Support Cleat (คานรองท็อปโต๊ะ)
        parts.push({
          id: `pt-top-cleat-${fIdx+1}`,
          name: `คานรองท็อปโต๊ะ โครง ${fIdx+1}`,
          category: "Cleat",
          dims: { x: 4.5, y: 7.0, z: 65 },
          pos: { x: x, y: h - 5, z: 0 },
          rot: { x: 0, y: 0, z: 0 },
          step: 2,
          explodeDir: [0, 0.5, 0],
          joint: "pocket-hole"
        });
      });

      // Bench Seat Planks (ม้านั่ง 2 ฝั่ง ฝั่งละ 2 แผ่น)
      [-1, 1].forEach((side, bSide) => {
        for (let p = 0; p < 2; p++) {
          const zPos = side * (d * 0.38 + p * 11);
          parts.push({
            id: `pt-bench-slat-${bSide}-${p+1}`,
            name: `ไม้ที่นั่งม้านั่ง (${side>0?'ขวา':'ซ้าย'}) แผ่นที่ ${p+1}`,
            category: "Slat",
            dims: { x: w, y: boardThick, z: 10 },
            pos: { x: 0, y: benchH + 4.5 + boardThick/2, z: zPos },
            rot: { x: 0, y: 0, z: 0 },
            step: 3,
            explodeDir: [0, 0.8, side * 1.2],
            joint: "butt"
          });
        }
      });

      // Table Top Planks (ท็อปโต๊ะ 5 แผ่น)
      for (let t = 0; t < 5; t++) {
        const zPos = -24 + (t * 12);
        parts.push({
          id: `pt-table-slat-${t+1}`,
          name: `ไม้แผ่นท็อปโต๊ะ แถวที่ ${t+1}`,
          category: "TopSlat",
          dims: { x: w, y: boardThick, z: 11 },
          pos: { x: 0, y: h - boardThick/2, z: zPos },
          rot: { x: 0, y: 0, z: 0 },
          step: 4,
          explodeDir: [0, 1.2 + t*0.08, 0],
          joint: "butt"
        });
      }

      return parts;
    }
  },

  // 17. Elevated Wooden Pet Bed (80 x 60 x 28 cm)
  "dog-bed-couch": {
    id: "dog-bed-couch",
    name: "Elevated Dog Bed (เตียงนอนสัตว์เลี้ยงยกพื้น)",
    category: "ของแต่งบ้าน",
    description: "เตียงนอนสุนัข/แมวแบบโซฟายกพื้น ระบายอากาศใต้เบาะ พร้อมพนักพิงกันตก 3 ด้าน",
    defaultDimensions: { width: 80, depth: 60, height: 28 },
    generateParts: function(w, d, h) {
      const parts = [];
      const boardThick = 2.0;
      const legH = 8.0;
      const legSize = 4.5;
      const sideWallH = h - legH;

      // 4 Short Sturdy Legs
      const legPositions = [
        { id: "db-leg-fl", name: "ขาเตียง หน้าซ้าย", x: -w/2 + legSize/2, z: d/2 - legSize/2, dir: [-1, -1, 1] },
        { id: "db-leg-fr", name: "ขาเตียง หน้าขวา", x: w/2 - legSize/2, z: d/2 - legSize/2, dir: [1, -1, 1] },
        { id: "db-leg-bl", name: "ขาเตียง หลังซ้าย", x: -w/2 + legSize/2, z: -d/2 + legSize/2, dir: [-1, -1, -1] },
        { id: "db-leg-br", name: "ขาเตียง หลังขวา", x: w/2 - legSize/2, z: -d/2 + legSize/2, dir: [1, -1, -1] }
      ];
      legPositions.forEach(leg => {
        parts.push({
          id: leg.id,
          name: leg.name,
          category: "Leg",
          dims: { x: legSize, y: legH, z: legSize },
          pos: { x: leg.x, y: legH/2, z: leg.z },
          rot: { x: 0, y: 0, z: 0 },
          step: 1,
          explodeDir: leg.dir,
          joint: "pocket-hole"
        });
      });

      // Bottom Slatted Deck for mattress (ไม้พื้นระบายอากาศ 5 แผ่น)
      for (let s = 0; s < 5; s++) {
        const zPos = -d/2 + 7 + (s * 11);
        parts.push({
          id: `db-deck-slat-${s+1}`,
          name: `ไม้พื้นเตียงระบายอากาศ แผ่นที่ ${s+1}`,
          category: "Floor",
          dims: { x: w - boardThick*2, y: 1.8, z: 9.0 },
          pos: { x: 0, y: legH + 0.9, z: zPos },
          rot: { x: 0, y: 0, z: 0 },
          step: 2,
          explodeDir: [0, -0.6, 0],
          joint: "butt"
        });
      }

      // Back Rest Wall
      parts.push({
        id: "db-back-wall",
        name: "พนักพิงหลังเตียง",
        category: "Wall",
        dims: { x: w, y: sideWallH, z: boardThick },
        pos: { x: 0, y: legH + sideWallH/2, z: -d/2 + boardThick/2 },
        rot: { x: 0, y: 0, z: 0 },
        step: 3,
        explodeDir: [0, 0, -1],
        joint: "miter"
      });

      // 2 Side Armrest Walls (แผงข้างซ้าย-ขวา)
      [-w/2 + boardThick/2, w/2 - boardThick/2].forEach((x, i) => {
        parts.push({
          id: `db-side-wall-${i+1}`,
          name: `แผงข้างเตียง ${i===0?'ซ้าย':'ขวา'}`,
          category: "Wall",
          dims: { x: boardThick, y: sideWallH * 0.75, z: d - boardThick },
          pos: { x: x, y: legH + (sideWallH * 0.75)/2, z: boardThick/2 },
          rot: { x: 0, y: 0, z: 0 },
          step: 3,
          explodeDir: [x > 0 ? 1 : -1, 0, 0],
          joint: "miter"
        });
      });

      // Low Front Entry Lip (ขอบหน้าเตียงเตี้ยให้เดินเข้าสะดวก)
      parts.push({
        id: "db-front-lip",
        name: "ขอบหน้าเตียงกันเบาะเลื่อน",
        category: "Lip",
        dims: { x: w, y: 4.5, z: boardThick },
        pos: { x: 0, y: legH + 2.25, z: d/2 - boardThick/2 },
        rot: { x: 0, y: 0, z: 0 },
        step: 4,
        explodeDir: [0, 0, 1],
        joint: "miter"
      });

      return parts;
    }
  },

  // 18. Adirondack Lounge Chair (80 x 90 x 90 cm)
  "adirondack-chair": {
    id: "adirondack-chair",
    name: "Adirondack Chair (เก้าอี้พักผ่อนสนามแอดิรอนแด็ก)",
    category: "เก้าอี้",
    description: "เก้าอี้สนามคลาสสิกอเมริกัน ที่นั่งลาดต่ำ ที่วางแขนกว้างสำหรับวางแก้วน้ำ และพนักพิงทรงพัด",
    defaultDimensions: { width: 80, depth: 90, height: 90 },
    generateParts: function(w, d, h) {
      const parts = [];
      const boardThick = 2.2;
      const slatW = 8.5;

      // 2 Slanted Side Rails (คานข้างเอียงทรงเฉียงรับที่นั่งลาด)
      [-w/2 + 10, w/2 - 10].forEach((x, idx) => {
        parts.push({
          id: `ad-side-rail-${idx+1}`,
          name: `คานเฉียงข้างรับเบาะ (${idx===0?'ซ้าย':'ขวา'})`,
          category: "Rail",
          dims: { x: 3.5, y: 12, z: d * 0.85 },
          pos: { x: x, y: 22, z: 0 },
          rot: { x: 0.22, y: 0, z: 0 },
          step: 1,
          explodeDir: [x > 0 ? 1 : -1, 0, 0],
          joint: "lap"
        });
      });

      // 2 Front Vertical Legs (ขาหน้าแนวตั้ง)
      [-w/2 + 10, w/2 - 10].forEach((x, idx) => {
        parts.push({
          id: `ad-front-leg-${idx+1}`,
          name: `ขาหน้าแนวตั้ง (${idx===0?'ซ้าย':'ขวา'})`,
          category: "Leg",
          dims: { x: 3.5, y: 52, z: 8.5 },
          pos: { x: x, y: 26, z: d * 0.22 },
          rot: { x: 0, y: 0, z: 0 },
          step: 1,
          explodeDir: [x > 0 ? 0.8 : -0.8, -0.5, 0.8],
          joint: "mortise-tenon"
        });
      });

      // 2 Wide Paddle Armrests (ที่วางแขนแผ่นกว้าง 2 ฝั่ง)
      [-w/2 + 7, w/2 - 7].forEach((x, idx) => {
        parts.push({
          id: `ad-armrest-${idx+1}`,
          name: `ที่วางแขนแผ่นกว้าง (${idx===0?'ซ้าย':'ขวา'})`,
          category: "Armrest",
          dims: { x: 13, y: boardThick, z: 65 },
          pos: { x: x, y: 53, z: -2 },
          rot: { x: -0.05, y: 0, z: 0 },
          step: 2,
          explodeDir: [x > 0 ? 1.2 : -1.2, 0.6, 0],
          joint: "dowel"
        });
      });

      // Seat Slats (ระแนงที่นั่งลาด 6 แผ่น)
      for (let s = 0; s < 6; s++) {
        const curZ = d * 0.2 - (s * 8.5);
        const curY = 32 - (s * 2.2);
        parts.push({
          id: `ad-seat-slat-${s+1}`,
          name: `ไม้ระแนงที่นั่ง แผ่นที่ ${s+1}`,
          category: "Slat",
          dims: { x: w - 24, y: boardThick, z: 7.5 },
          pos: { x: 0, y: curY, z: curZ },
          rot: { x: 0.22, y: 0, z: 0 },
          step: 3,
          explodeDir: [0, 0.8 + s*0.1, 0],
          joint: "butt"
        });
      }

      // Fan-style Backrest Slats (พนักพิงทรงพัด 5 ซี่)
      const backTilt = -0.38;
      for (let b = 0; b < 5; b++) {
        const xOffset = (b - 2) * 9.5;
        const curH = h * 0.65 - Math.abs(b - 2) * 4;
        parts.push({
          id: `ad-back-slat-${b+1}`,
          name: `ไม้พนักพิงหลัง ซี่ที่ ${b+1}`,
          category: "BackSlat",
          dims: { x: 8.0, y: curH, z: boardThick },
          pos: { x: xOffset, y: 50, z: -d * 0.2 - (b === 2 ? 0 : 1) },
          rot: { x: backTilt, y: 0, z: 0 },
          step: 4,
          explodeDir: [xOffset * 0.05, 1, -1.2],
          joint: "butt"
        });
      }

      return parts;
    }
  },

  // 19. Hallway Coat & Hat Tree (45 x 45 x 175 cm)
  "coat-rack-tree": {
    id: "coat-rack-tree",
    name: "Hallway Coat & Hat Tree (ที่แขวนเสื้อโค้ตทรงต้นไม้)",
    category: "ของแต่งบ้าน",
    description: "เสาแขวนหมวกและเสื้อคลุมทรงต้นไม้ ฐานกากบาท 4 ขา เสาหลักเหลี่ยม พร้อมกิ่งแขวนไล่ระดับ",
    defaultDimensions: { width: 45, depth: 45, height: 175 },
    generateParts: function(w, d, h) {
      const parts = [];
      const postSize = 6.0;
      const baseLen = w;

      // X-Cross Base (ฐานกากบาทไม้ 2 ตัวเข้าครึ่งไม้ Lap Joint)
      parts.push({
        id: "cr-base-1",
        name: "ไม้ฐานกากบาท แกน X",
        category: "Base",
        dims: { x: baseLen, y: 4.5, z: postSize },
        pos: { x: 0, y: 2.25, z: 0 },
        rot: { x: 0, y: 0, z: 0 },
        step: 1,
        explodeDir: [0, -1, 0],
        joint: "lap"
      });
      parts.push({
        id: "cr-base-2",
        name: "ไม้ฐานกากบาท แกน Z",
        category: "Base",
        dims: { x: postSize, y: 4.5, z: baseLen },
        pos: { x: 0, y: 2.25, z: 0 },
        rot: { x: 0, y: 0, z: 0 },
        step: 1,
        explodeDir: [0, -1.5, 0],
        joint: "lap"
      });

      // 4 Base Triangular Corner Braces (ค้ำยันโคนเสา 4 ทิศ)
      const bracePositions = [
        { id: "cr-brace-f", name: "ค้ำยันหน้า", x: 0, z: 10, rx: 0.6, rz: 0, dir: [0, 0, 1] },
        { id: "cr-brace-b", name: "ค้ำยันหลัง", x: 0, z: -10, rx: -0.6, rz: 0, dir: [0, 0, -1] },
        { id: "cr-brace-l", name: "ค้ำยันซ้าย", x: -10, z: 0, rx: 0, rz: -0.6, dir: [-1, 0, 0] },
        { id: "cr-brace-r", name: "ค้ำยันขวา", x: 10, z: 0, rx: 0, rz: 0.6, dir: [1, 0, 0] }
      ];
      bracePositions.forEach(b => {
        parts.push({
          id: b.id,
          name: b.name,
          category: "Brace",
          dims: { x: 3.5, y: 16, z: 3.5 },
          pos: { x: b.x, y: 11, z: b.z },
          rot: { x: b.rx, y: 0, z: b.rz },
          step: 2,
          explodeDir: b.dir,
          joint: "miter"
        });
      });

      // Main Center Column Post (เสาหลักกลางสูง 175 cm)
      parts.push({
        id: "cr-main-post",
        name: "เสาหลักแกนกลาง",
        category: "Post",
        dims: { x: postSize, y: h - 5, z: postSize },
        pos: { x: 0, y: (h - 5)/2 + 4.5, z: 0 },
        rot: { x: 0, y: 0, z: 0 },
        step: 3,
        explodeDir: [0, 0.5, 0],
        joint: "mortise-tenon"
      });

      // 6 Angled Peg Branches (กิ่งแขวนไม้เฉียง 45 องศา ไล่ระดับ)
      const pegLevels = [
        { y: 100, rotY: 0, name: "กิ่งแขวนล่าง 1" },
        { y: 115, rotY: Math.PI/2, name: "กิ่งแขวนล่าง 2" },
        { y: 130, rotY: Math.PI, name: "กิ่งแขวนกลาง 1" },
        { y: 145, rotY: -Math.PI/2, name: "กิ่งแขวนกลาง 2" },
        { y: 158, rotY: Math.PI/4, name: "กิ่งแขวนบน 1" },
        { y: 168, rotY: -3*Math.PI/4, name: "กิ่งแขวนบน 2" }
      ];
      pegLevels.forEach((pl, idx) => {
        parts.push({
          id: `cr-peg-${idx+1}`,
          name: pl.name,
          category: "Peg",
          dims: { x: 2.8, y: 14, z: 2.8 },
          pos: {
            x: Math.sin(pl.rotY) * 6,
            y: pl.y,
            z: Math.cos(pl.rotY) * 6
          },
          rot: { x: 0.6, y: pl.rotY, z: 0 },
          step: 4,
          explodeDir: [Math.sin(pl.rotY) * 1.5, 0.5, Math.cos(pl.rotY) * 1.5],
          joint: "dowel"
        });
      });

      return parts;
    }
  },

  // 20. Roll-Top Folding Camping Table (90 x 60 x 45 cm)
  "folding-camping-table": {
    id: "folding-camping-table",
    name: "Folding Camping Table (โต๊ะแคมป์ปิ้งไม้พับได้)",
    category: "โต๊ะ",
    description: "โต๊ะแคมป์ปิ้งสไตล์เอาต์ดอร์ ขาพับกากบาท X-Frame พร้อมแผ่นไม้ระแนงม้วนเก็บได้ น้ำหนักเบาพกพาสะดวก",
    defaultDimensions: { width: 90, depth: 60, height: 45 },
    generateParts: function(w, d, h) {
      const parts = [];
      const boardThick = 1.6;
      const legSize = 3.2;
      const legLen = 52.0;

      // 2 X-Frames (โครงขากากบาทซ้าย-ขวา)
      [-w/2 + 8, w/2 - 8].forEach((x, fIdx) => {
        // Leg 1
        parts.push({
          id: `fc-leg-a-${fIdx+1}`,
          name: `ขาพับ A โครง ${fIdx+1}`,
          category: "Leg",
          dims: { x: legSize, y: legLen, z: legSize },
          pos: { x: x, y: h/2 - 1, z: 0 },
          rot: { x: 0.55, y: 0, z: 0 },
          step: 1,
          explodeDir: [x > 0 ? 0.8 : -0.8, -0.5, 0.5],
          joint: "lap"
        });
        // Leg 2
        parts.push({
          id: `fc-leg-b-${fIdx+1}`,
          name: `ขาพับ B โครง ${fIdx+1}`,
          category: "Leg",
          dims: { x: legSize, y: legLen, z: legSize },
          pos: { x: x + 0.5, y: h/2 - 1, z: 0 },
          rot: { x: -0.55, y: 0, z: 0 },
          step: 1,
          explodeDir: [x > 0 ? 0.8 : -0.8, -0.5, -0.5],
          joint: "lap"
        });
      });

      // 2 Top Side Stretchers (คานขนานบนหัวขา 2 ข้าง)
      [-w/2 + 8, w/2 - 8].forEach((x, idx) => {
        parts.push({
          id: `fc-top-rail-${idx+1}`,
          name: `คานบนรองท็อป (${idx===0?'ซ้าย':'ขวา'})`,
          category: "Rail",
          dims: { x: legSize, y: 2.5, z: d },
          pos: { x: x, y: h - 1.5, z: 0 },
          rot: { x: 0, y: 0, z: 0 },
          step: 2,
          explodeDir: [x > 0 ? 0.5 : -0.5, 0.5, 0],
          joint: "dowel"
        });
      });

      // Roll-Top Slats (ไม้ระแนงท็อปม้วนพับได้ 9 แผ่น)
      const numSlats = 9;
      const slatW = 5.5;
      const spacing = (d - (numSlats * slatW)) / (numSlats - 1 || 1);

      for (let i = 0; i < numSlats; i++) {
        const zPos = -d/2 + slatW/2 + (i * (slatW + spacing));
        parts.push({
          id: `fc-roll-slat-${i+1}`,
          name: `ไม้ระแนงม้วนท็อป แผ่นที่ ${i+1}`,
          category: "RollSlat",
          dims: { x: w, y: boardThick, z: slatW },
          pos: { x: 0, y: h + boardThick/2 - 0.2, z: zPos },
          rot: { x: 0, y: 0, z: 0 },
          step: 3,
          explodeDir: [0, 1.0 + i*0.08, 0],
          joint: "butt"
        });
      }

      return parts;
    }
  }
};
