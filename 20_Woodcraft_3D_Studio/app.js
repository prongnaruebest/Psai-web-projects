/**
 * 3D Woodcraft Studio - Core Application Logic
 * Powered by Three.js & WebGL
 */

(function () {
  // Global State
  const state = {
    currentProjectId: "pallet-coffee-table",
    currentProject: null,
    dimensions: { width: 80, depth: 60, height: 40 },
    woodTextureType: "pine", // 'pine', 'teak', 'walnut', 'whitewash'
    assemblyProgress: 1.0,   // 0.0 (Exploded) to 1.0 (Assembled)
    explosionMultiplier: 1.0,
    isPlayingAnimation: false,
    currentStep: 6,
    maxSteps: 6,
    selectedPartId: null,
    showHumanScale: true,
    showDimensions: true,
    showGrid: true,
    viewMode: "realistic",   // 'realistic', 'wireframe', 'xray'
    audioEnabled: true
  };

  // Three.js Core Objects
  let scene, camera, renderer, controls;
  let modelGroup, dimensionGroup, humanScaleGroup, gridHelper;
  let partMeshMap = new Map();
  let partDataList = [];
  let woodMaterials = {};
  let raycaster, mouse;
  let hoveredMesh = null;
  let selectedMesh = null;
  let audioCtx = null;

  // Sound Synth via Web Audio API
  function playWoodSnapSound() {
    if (!state.audioEnabled) return;
    try {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      if (audioCtx.state === "suspended") {
        audioCtx.resume();
      }
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(140, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(40, audioCtx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.4, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.09);
    } catch (e) {
      console.warn("Audio error:", e);
    }
  }

  // --- Procedural Wood Texture Generator ---
  function createProceduralWoodTexture(colorBase, ringColor, grainCount = 12) {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");

    // Base background
    ctx.fillStyle = colorBase;
    ctx.fillRect(0, 0, 512, 512);

    // Wood Grain Streaks
    for (let i = 0; i < 600; i++) {
      const y = Math.random() * 512;
      const alpha = 0.03 + Math.random() * 0.07;
      ctx.fillStyle = ringColor;
      ctx.globalAlpha = alpha;
      const h = 0.5 + Math.random() * 1.5;
      ctx.fillRect(0, y, 512, h);
    }

    // Wood Rings / Flow Waves
    ctx.globalAlpha = 0.08;
    ctx.strokeStyle = ringColor;
    ctx.lineWidth = 1.2;
    for (let i = 0; i < grainCount; i++) {
      const cy = (i / grainCount) * 512 + (Math.random() * 20 - 10);
      ctx.beginPath();
      ctx.moveTo(0, cy);
      ctx.bezierCurveTo(
        150, cy + (Math.random() * 40 - 20),
        350, cy + (Math.random() * 40 - 20),
        512, cy + (Math.random() * 15 - 7.5)
      );
      ctx.stroke();
    }

    // Subtle knots
    for (let k = 0; k < 2; k++) {
      const kx = 100 + Math.random() * 312;
      const ky = 100 + Math.random() * 312;
      ctx.globalAlpha = 0.15;
      ctx.fillStyle = ringColor;
      ctx.beginPath();
      ctx.ellipse(kx, ky, 8 + Math.random() * 8, 4 + Math.random() * 4, Math.random() * Math.PI, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.globalAlpha = 1.0;
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    return texture;
  }

  function initMaterials() {
    const pineDiffuse = createProceduralWoodTexture("#d8b180", "#8b5a2b", 16);
    const teakDiffuse = createProceduralWoodTexture("#b87b3a", "#5a3411", 20);
    const walnutDiffuse = createProceduralWoodTexture("#563d2d", "#281b12", 14);
    const whiteWashDiffuse = createProceduralWoodTexture("#e4ded5", "#baa896", 8);

    woodMaterials = {
      pine: new THREE.MeshStandardMaterial({
        map: pineDiffuse,
        roughness: 0.72,
        metalness: 0.02,
      }),
      teak: new THREE.MeshStandardMaterial({
        map: teakDiffuse,
        roughness: 0.65,
        metalness: 0.04,
      }),
      walnut: new THREE.MeshStandardMaterial({
        map: walnutDiffuse,
        roughness: 0.68,
        metalness: 0.03,
      }),
      whitewash: new THREE.MeshStandardMaterial({
        map: whiteWashDiffuse,
        roughness: 0.8,
        metalness: 0.01,
      }),
      block: new THREE.MeshStandardMaterial({
        color: 0xc89f6d,
        roughness: 0.85,
      }),
      plant: new THREE.MeshStandardMaterial({
        color: 0x3d7e35,
        roughness: 0.6,
      }),
      prop: new THREE.MeshStandardMaterial({
        color: 0xe8e2d5,
        roughness: 0.5,
      }),
      highlight: new THREE.MeshStandardMaterial({
        color: 0xffaa00,
        emissive: 0x332200,
        roughness: 0.4,
      }),
      selected: new THREE.MeshStandardMaterial({
        color: 0x3b82f6,
        emissive: 0x1d4ed8,
        roughness: 0.3,
      }),
      ghost: new THREE.MeshStandardMaterial({
        color: 0x93c5fd,
        transparent: true,
        opacity: 0.35,
        wireframe: true
      })
    };
  }

  // --- Initialize Three.js Scene ---
  function initScene() {
    const container = document.getElementById("canvas-container");
    const width = container.clientWidth;
    const height = container.clientHeight;

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf1f5f9);

    camera = new THREE.PerspectiveCamera(45, width / height, 1, 3000);
    camera.position.set(160, 120, 200);

    renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    container.appendChild(renderer.domElement);

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.maxPolarAngle = Math.PI / 2 - 0.01; // Don't go below floor
    controls.minDistance = 30;
    controls.maxDistance = 600;
    controls.target.set(0, 35, 0);

    // Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xfff8f0, 0.7);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xfffaed, 0.95);
    dirLight.position.set(120, 200, 100);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.camera.near = 10;
    dirLight.shadow.camera.far = 600;
    const d = 160;
    dirLight.shadow.camera.left = -d;
    dirLight.shadow.camera.right = d;
    dirLight.shadow.camera.top = d;
    dirLight.shadow.camera.bottom = -d;
    dirLight.shadow.bias = -0.0008;
    scene.add(dirLight);

    const fillLight = new THREE.DirectionalLight(0xbad2e8, 0.4);
    fillLight.position.set(-150, 100, -100);
    scene.add(fillLight);

    // Workshop Floor & Shadow Receiver
    const floorGeo = new THREE.PlaneGeometry(1000, 1000);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      roughness: 0.9,
      metalness: 0.05
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // Workshop Grid (Centimeter Scale)
    gridHelper = new THREE.GridHelper(300, 30, 0x94a3b8, 0xcbd5e1);
    gridHelper.position.y = 0.05;
    scene.add(gridHelper);

    // Groups
    modelGroup = new THREE.Group();
    scene.add(modelGroup);

    dimensionGroup = new THREE.Group();
    scene.add(dimensionGroup);

    humanScaleGroup = new THREE.Group();
    scene.add(humanScaleGroup);

    initMaterials();
    createHumanScaleModel();

    // Raycasting for click/hover
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();

    container.addEventListener("pointermove", onPointerMove);
    
    // Distinguish between camera orbit drag and intentional click
    let pointerDownPos = { x: 0, y: 0 };
    container.addEventListener("pointerdown", (e) => {
      pointerDownPos = { x: e.clientX, y: e.clientY };
    });
    container.addEventListener("pointerup", (e) => {
      const dist = Math.hypot(e.clientX - pointerDownPos.x, e.clientY - pointerDownPos.y);
      if (dist < 6) {
        onCanvasClick(e);
      }
    });

    window.addEventListener("resize", onWindowResize);

    // Animate Loop
    animate();
  }

  // --- 160 cm Stylized Human Scale Figure (Matching Reference Image) ---
  function createHumanScaleModel() {
    humanScaleGroup.clear();
    const human = new THREE.Group();

    // Material for mannequin figure
    const skinMat = new THREE.MeshStandardMaterial({ color: 0xf5d0b5, roughness: 0.6 });
    const clothesMat = new THREE.MeshStandardMaterial({ color: 0x857564, roughness: 0.7 });
    const shirtMat = new THREE.MeshStandardMaterial({ color: 0xf3ede2, roughness: 0.8 });
    const hairMat = new THREE.MeshStandardMaterial({ color: 0x5a3d28, roughness: 0.6 });

    // Legs (Trousers)
    const legGeo = new THREE.CylinderGeometry(4.5, 4.0, 78, 16);
    const legL = new THREE.Mesh(legGeo, clothesMat);
    legL.position.set(-6, 39, 0);
    legL.castShadow = true;
    human.add(legL);

    const legR = new THREE.Mesh(legGeo, clothesMat);
    legR.position.set(6, 39, 0);
    legR.castShadow = true;
    human.add(legR);

    // Shoes
    const shoeGeo = new THREE.BoxGeometry(9, 6, 16);
    const shoeMat = new THREE.MeshStandardMaterial({ color: 0x3d281a, roughness: 0.8 });
    const shoeL = new THREE.Mesh(shoeGeo, shoeMat);
    shoeL.position.set(-6, 3, 3);
    human.add(shoeL);
    const shoeR = new THREE.Mesh(shoeGeo, shoeMat);
    shoeR.position.set(6, 3, 3);
    human.add(shoeR);

    // Torso / Shirt
    const torsoGeo = new THREE.CylinderGeometry(11, 9, 45, 16);
    const torso = new THREE.Mesh(torsoGeo, shirtMat);
    torso.position.set(0, 100, 0);
    torso.castShadow = true;
    human.add(torso);

    // Neck & Head
    const neckGeo = new THREE.CylinderGeometry(3.5, 3.8, 8, 16);
    const neck = new THREE.Mesh(neckGeo, skinMat);
    neck.position.set(0, 126, 0);
    human.add(neck);

    const headGeo = new THREE.SphereGeometry(9.5, 20, 20);
    headGeo.scale(1, 1.25, 1);
    const head = new THREE.Mesh(headGeo, skinMat);
    head.position.set(0, 138, 0);
    head.castShadow = true;
    human.add(head);

    // Hair
    const hairGeo = new THREE.SphereGeometry(10.2, 16, 16);
    hairGeo.scale(1.05, 1.3, 1.1);
    const hair = new THREE.Mesh(hairGeo, hairMat);
    hair.position.set(0, 140, -1);
    human.add(hair);

    // Arms
    const armGeo = new THREE.CylinderGeometry(3.5, 3.0, 50, 16);
    const armL = new THREE.Mesh(armGeo, shirtMat);
    armL.position.set(-15, 96, 0);
    armL.rotation.z = 0.08;
    human.add(armL);

    const armR = new THREE.Mesh(armGeo, shirtMat);
    armR.position.set(15, 96, 0);
    armR.rotation.z = -0.08;
    human.add(armR);

    // Height Marker Arrow & Text Tag (160 CM)
    const markerGroup = new THREE.Group();
    const lineMat = new THREE.LineBasicMaterial({ color: 0x0f172a, linewidth: 2 });
    const points = [
      new THREE.Vector3(26, 0, 0),
      new THREE.Vector3(26, 160, 0)
    ];
    const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.Line(lineGeo, lineMat);
    markerGroup.add(line);

    // Arrow caps
    const arrowCapGeo = new THREE.ConeGeometry(2, 5, 8);
    const arrowMat = new THREE.MeshBasicMaterial({ color: 0x0f172a });
    const topCap = new THREE.Mesh(arrowCapGeo, arrowMat);
    topCap.position.set(26, 160, 0);
    markerGroup.add(topCap);

    const bottomCap = new THREE.Mesh(arrowCapGeo, arrowMat);
    bottomCap.position.set(26, 0, 0);
    bottomCap.rotation.z = Math.PI;
    markerGroup.add(bottomCap);

    // 160 CM Label (Canvas Sprite)
    const labelSprite = createTextSprite("160 CM", 0x0f172a, 0xffffff);
    labelSprite.position.set(38, 80, 0);
    markerGroup.add(labelSprite);

    human.add(markerGroup);

    // Position human beside the furniture
    human.position.set(85, 0, 0);
    humanScaleGroup.add(human);
  }

  // --- Dimension Label Sprite Generator ---
  function createTextSprite(text, textColor = 0x1e293b, bgColor = 0xffffff) {
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 80;
    const ctx = canvas.getContext("2d");

    // Rounded Box
    ctx.fillStyle = "#ffffff";
    ctx.strokeStyle = "#94a3b8";
    ctx.lineWidth = 4;
    roundRect(ctx, 6, 6, 244, 68, 16, true, true);

    // Text
    ctx.fillStyle = "#0f172a";
    ctx.font = "bold 32px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, 128, 40);

    const texture = new THREE.CanvasTexture(canvas);
    const spriteMat = new THREE.SpriteMaterial({ map: texture, depthTest: false });
    const sprite = new THREE.Sprite(spriteMat);
    sprite.scale.set(16, 5, 1);
    return sprite;
  }

  function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    if (fill) ctx.fill();
    if (stroke) ctx.stroke();
  }

  // --- 3D Dimension Lines Rendering ---
  function updateDimensionsOverlay() {
    dimensionGroup.clear();
    if (!state.showDimensions) return;

    const w = state.dimensions.width;
    const d = state.dimensions.depth;
    const h = state.dimensions.height;

    const lineMat = new THREE.LineBasicMaterial({ color: 0x3b82f6, linewidth: 2 });
    const arrowMat = new THREE.MeshBasicMaterial({ color: 0x3b82f6 });
    const coneGeo = new THREE.ConeGeometry(1.5, 4, 8);

    function addDimLine(p1, p2, labelText, labelOffset) {
      const pts = [p1, p2];
      const geo = new THREE.BufferGeometry().setFromPoints(pts);
      dimensionGroup.add(new THREE.Line(geo, lineMat));

      // Arrows
      const c1 = new THREE.Mesh(coneGeo, arrowMat);
      c1.position.copy(p1);
      c1.lookAt(p2);
      c1.rotateX(Math.PI / 2);
      dimensionGroup.add(c1);

      const c2 = new THREE.Mesh(coneGeo, arrowMat);
      c2.position.copy(p2);
      c2.lookAt(p1);
      c2.rotateX(Math.PI / 2);
      dimensionGroup.add(c2);

      // Label Sprite
      const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5).add(labelOffset);
      const sprite = createTextSprite(labelText);
      sprite.position.copy(mid);
      dimensionGroup.add(sprite);
    }

    // 1. Width Dimension (Front along X)
    const yGround = 0.5;
    const frontZ = d / 2 + 10;
    addDimLine(
      new THREE.Vector3(-w / 2, yGround, frontZ),
      new THREE.Vector3(w / 2, yGround, frontZ),
      `${Math.round(w)} CM`,
      new THREE.Vector3(0, 5, 0)
    );

    // 2. Depth Dimension (Side along Z)
    const rightX = w / 2 + 10;
    addDimLine(
      new THREE.Vector3(rightX, yGround, d / 2),
      new THREE.Vector3(rightX, yGround, -d / 2),
      `${Math.round(d)} CM`,
      new THREE.Vector3(5, 5, 0)
    );

    // 3. Height Dimension (Vertical along Y)
    const leftX = -w / 2 - 10;
    addDimLine(
      new THREE.Vector3(leftX, 0, frontZ),
      new THREE.Vector3(leftX, h, frontZ),
      `${Math.round(h)} CM`,
      new THREE.Vector3(-8, 0, 0)
    );
  }

  // --- Build Model in Three.js ---
  function buildModel() {
    modelGroup.clear();
    partMeshMap.clear();

    const project = window.WOOD_PROJECTS[state.currentProjectId];
    if (!project) return;
    state.currentProject = project;

    // Generate part data with current parametric dimensions
    partDataList = project.generateParts(
      state.dimensions.width,
      state.dimensions.depth,
      state.dimensions.height
    );

    // Determine max assembly steps
    state.maxSteps = Math.max(...partDataList.map(p => p.step || 1));
    if (state.currentStep > state.maxSteps || state.assemblyProgress >= 0.99) {
      state.currentStep = state.maxSteps;
    }
    const stepSlider = document.getElementById("step-slider");
    if (stepSlider) {
      stepSlider.max = state.maxSteps;
      stepSlider.value = state.currentStep;
    }
    const stepLabel = document.getElementById("step-label");
    if (stepLabel) stepLabel.innerText = `ขั้นตอนที่ ${state.currentStep} / ${state.maxSteps}`;

    // Select base material
    const baseMat = woodMaterials[state.woodTextureType] || woodMaterials.pine;

    partDataList.forEach(part => {
      // Determine geometry
      let geo = new THREE.BoxGeometry(part.dims.x, part.dims.y, part.dims.z);

      // Choose material based on category
      let mat = baseMat;
      if (part.isPlant) {
        mat = woodMaterials.plant;
      } else if (part.isProp) {
        mat = woodMaterials.prop;
      } else if (part.category === "Block") {
        mat = woodMaterials.block;
      }

      // If view mode is wireframe
      if (state.viewMode === "wireframe") {
        mat = new THREE.MeshStandardMaterial({ wireframe: true, color: 0x475569 });
      } else if (state.viewMode === "xray") {
        mat = new THREE.MeshStandardMaterial({
          color: 0x94a3b8,
          transparent: true,
          opacity: 0.45,
          roughness: 0.3
        });
      }

      const mesh = new THREE.Mesh(geo, mat);
      mesh.castShadow = true;
      mesh.receiveShadow = true;

      // Base assembled transforms
      mesh.userData = {
        partId: part.id,
        partData: part,
        assembledPos: new THREE.Vector3(part.pos.x, part.pos.y, part.pos.z),
        assembledRot: new THREE.Euler(part.rot.x, part.rot.y, part.rot.z),
        originalMat: mat
      };

      // Add edge highlight line
      const edges = new THREE.EdgesGeometry(geo);
      const edgeLine = new THREE.LineSegments(
        edges,
        new THREE.LineBasicMaterial({ color: 0x1e293b, opacity: 0.25, transparent: true })
      );
      mesh.add(edgeLine);

      // Add Joint Marker indicator if specified
      if (part.joint && part.joint !== "butt" && !part.isProp && !part.isPlant) {
        addJointIndicator(mesh, part);
      }

      modelGroup.add(mesh);
      partMeshMap.set(part.id, mesh);
    });

    // Update positions according to assembly state
    updateAssemblyPositions();
    updateDimensionsOverlay();
    renderCutList();
    renderPartsTree();

    // Adjust human scale position based on model width
    if (humanScaleGroup.children.length > 0) {
      humanScaleGroup.children[0].position.set(state.dimensions.width / 2 + 35, 0, 0);
    }
  }

  // --- Add Visual Joint Indicators (การเข้ามุม / เข้าไม้) ---
  function addJointIndicator(mesh, part) {
    const jointType = part.joint;
    const jointColor = 0x2563eb;
    const jointMat = new THREE.MeshBasicMaterial({ color: jointColor });

    if (jointType === "pocket-hole") {
      // 2 small slanted cylinder holes
      const holeGeo = new THREE.CylinderGeometry(0.6, 0.6, 3, 8);
      const hole1 = new THREE.Mesh(holeGeo, jointMat);
      hole1.position.set(-part.dims.x / 4, -part.dims.y / 3, part.dims.z / 2);
      hole1.rotation.x = 0.5;
      mesh.add(hole1);

      const hole2 = new THREE.Mesh(holeGeo, jointMat);
      hole2.position.set(part.dims.x / 4, -part.dims.y / 3, part.dims.z / 2);
      hole2.rotation.x = 0.5;
      mesh.add(hole2);
    } else if (jointType === "dowel" || jointType === "mortise-tenon") {
      // Dowel pegs
      const pegGeo = new THREE.CylinderGeometry(0.8, 0.8, 2.5, 8);
      const peg = new THREE.Mesh(pegGeo, new THREE.MeshBasicMaterial({ color: 0xca8a04 }));
      peg.position.set(0, part.dims.y / 2 + 1, 0);
      mesh.add(peg);
    } else if (jointType === "miter") {
      // Corner miter indicator line
      const cornerGeo = new THREE.ConeGeometry(1.2, 3, 4);
      const corner = new THREE.Mesh(cornerGeo, jointMat);
      corner.position.set(part.dims.x / 2 - 1, part.dims.y / 2, 0);
      corner.rotation.z = -Math.PI / 4;
      mesh.add(corner);
    }
  }

  // --- Calculate Assembly & Exploded View Transforms ---
  function updateAssemblyPositions() {
    const explodeFactor = (1.0 - state.assemblyProgress) * 45 * state.explosionMultiplier;

    partMeshMap.forEach((mesh, partId) => {
      const data = mesh.userData.partData;
      const targetPos = mesh.userData.assembledPos;
      const targetRot = mesh.userData.assembledRot;

      // Filter by current step: If part step > currentStep, hide or make ghost
      if (data.step > state.currentStep) {
        mesh.visible = false;
        return;
      } else {
        mesh.visible = true;
      }

      // If Exploded View (assemblyProgress < 1.0)
      if (explodeFactor > 0.001 && data.explodeDir) {
        const offset = new THREE.Vector3(
          data.explodeDir[0] * explodeFactor,
          data.explodeDir[1] * explodeFactor,
          data.explodeDir[2] * explodeFactor
        );
        mesh.position.copy(targetPos).add(offset);
      } else {
        mesh.position.copy(targetPos);
      }

      mesh.rotation.copy(targetRot);
    });
  }

  // --- Animation Timeline Step Controller ---
  function stopAnimation() {
    if (state.isPlayingAnimation) {
      state.isPlayingAnimation = false;
      const btn = document.getElementById("btn-play-pause");
      if (btn) {
        btn.innerHTML = `<i data-lucide="play" class="w-4 h-4"></i> เล่นอนิเมชั่น`;
        lucide.createIcons();
      }
    }
  }

  function playAssemblyAnimation() {
    if (state.isPlayingAnimation) {
      stopAnimation();
      return;
    }

    state.isPlayingAnimation = true;
    document.getElementById("btn-play-pause").innerHTML = `<i data-lucide="pause" class="w-4 h-4"></i> หยุดชั่วคราว`;
    lucide.createIcons();

    // Reset to step 1 and explode if at end
    if (state.currentStep >= state.maxSteps && state.assemblyProgress >= 0.99) {
      state.currentStep = 1;
      state.assemblyProgress = 0.0;
    }

    let lastTime = performance.now();
    function stepAnim(now) {
      if (!state.isPlayingAnimation) return;

      const dt = (now - lastTime) / 1000;
      lastTime = now;

      // Progressively assemble
      state.assemblyProgress += dt * 0.45;
      if (state.assemblyProgress >= 1.0) {
        state.assemblyProgress = 1.0;
        playWoodSnapSound();
        if (state.currentStep < state.maxSteps) {
          state.currentStep++;
          state.assemblyProgress = 0.1;
        } else {
          state.isPlayingAnimation = false;
          document.getElementById("btn-play-pause").innerHTML = `<i data-lucide="play" class="w-4 h-4"></i> เล่นอนิเมชั่น`;
          lucide.createIcons();
        }
      }

      // Update UI slider
      const progressSlider = document.getElementById("assembly-slider");
      if (progressSlider) progressSlider.value = Math.round(state.assemblyProgress * 100);
      const stepSlider = document.getElementById("step-slider");
      if (stepSlider) stepSlider.value = state.currentStep;
      const stepLabel = document.getElementById("step-label");
      if (stepLabel) stepLabel.innerText = `ขั้นตอนที่ ${state.currentStep} / ${state.maxSteps}`;

      updateAssemblyPositions();
      requestAnimationFrame(stepAnim);
    }

    requestAnimationFrame(stepAnim);
  }

  // --- Raycasting & Selection ---
  function onPointerMove(e) {
    const container = document.getElementById("canvas-container");
    const rect = container.getBoundingClientRect();
    mouse.x = ((e.clientX - rect.left) / container.clientWidth) * 2 - 1;
    mouse.y = -((e.clientY - rect.top) / container.clientHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(modelGroup.children, true);

    if (intersects.length > 0) {
      let topMesh = intersects[0].object;
      while (topMesh.parent && topMesh.parent !== modelGroup) {
        topMesh = topMesh.parent;
      }

      if (topMesh !== hoveredMesh && topMesh !== selectedMesh && topMesh.userData.partData) {
        if (hoveredMesh && hoveredMesh !== selectedMesh) {
          hoveredMesh.material = hoveredMesh.userData.originalMat;
        }
        hoveredMesh = topMesh;
        hoveredMesh.material = woodMaterials.highlight;
        document.body.style.cursor = "pointer";
      }
    } else {
      if (hoveredMesh && hoveredMesh !== selectedMesh) {
        hoveredMesh.material = hoveredMesh.userData.originalMat;
      }
      hoveredMesh = null;
      document.body.style.cursor = "default";
    }
  }

  function onCanvasClick(e) {
    if (hoveredMesh) {
      selectPart(hoveredMesh.userData.partId);
      playWoodSnapSound();
    } else {
      selectPart(null);
    }
  }

  function selectPart(partId) {
    if (selectedMesh) {
      selectedMesh.material = selectedMesh.userData.originalMat;
      selectedMesh = null;
    }

    state.selectedPartId = partId;
    if (partId && partMeshMap.has(partId)) {
      selectedMesh = partMeshMap.get(partId);
      selectedMesh.material = woodMaterials.selected;
      showPartInspector(selectedMesh.userData.partData);
    } else {
      hidePartInspector();
    }
    highlightTreeItem(partId);
  }

  // --- Inspector Panel for Selected Part ---
  function showPartInspector(part) {
    const inspectorEl = document.getElementById("part-inspector-card");
    if (!inspectorEl) return;
    inspectorEl.classList.remove("hidden");

    document.getElementById("insp-part-name").innerText = part.name;
    document.getElementById("insp-part-cat").innerText = part.category;
    document.getElementById("insp-part-step").innerText = `Step ${part.step}`;
    document.getElementById("insp-dim-x").value = part.dims.x.toFixed(1);
    document.getElementById("insp-dim-y").value = part.dims.y.toFixed(1);
    document.getElementById("insp-dim-z").value = part.dims.z.toFixed(1);
    document.getElementById("insp-joint-type").value = part.joint || "butt";
  }

  function hidePartInspector() {
    const inspectorEl = document.getElementById("part-inspector-card");
    if (inspectorEl) inspectorEl.classList.add("hidden");
  }

  // Clean part name by stripping trailing numbers or directional suffixes
  function cleanWoodPartName(name, category) {
    let cleaned = name
      .replace(/\s*(?:แถวที่|แผ่นที่|ชั้นที่|ซี่ที่|แผงที่|ด้าน|โครง|ชั้น|บล็อกชั้นกลาง|บล็อกขารอง|เสาโครงสร้างหลักแนวตั้ง|เสาเอียงค้ำพนักพิง|ขาโต๊ะ|ขาค้ำหิ้ง|ขาสตูล|เสาบันได|ขาเกาะครัว|ขาพับ|คานข้าง|คานบนด้านข้าง|คานล่างยึดขา|กิ่งแขวน|หน้าซ้าย|หน้าขวา|หลังซ้าย|หลังขวา|กลาง|ซ้าย|ขวา)\s*[\d\(\)\-\.\s]*$/i, '')
      .replace(/\s*\([\w\d\sซ้ายขวาหน้าหลัง\.\-]+\)$/i, '')
      .trim();
    return cleaned || category || name;
  }

  // --- Bill of Materials & Cut List Generator ---
  function renderCutList() {
    const tbody = document.getElementById("cutlist-table-body");
    const printTbody = document.getElementById("print-sheet-table-body");
    if (tbody) tbody.innerHTML = "";
    if (printTbody) printTbody.innerHTML = "";

    // Smart grouping by dimensions & category
    const grouped = new Map();
    let totalLengthCm = 0;
    let totalPieces = 0;

    partDataList.forEach(part => {
      if (part.isPlant || part.isProp) return; // skip decorative props

      const sortedDims = [part.dims.x, part.dims.y, part.dims.z].sort((a, b) => a - b);
      const dimsKey = sortedDims.map(v => v.toFixed(1)).join(' × ');
      const baseName = cleanWoodPartName(part.name, part.category);
      const jointKey = part.joint || "butt";
      const groupKey = `${baseName}||${dimsKey}||${jointKey}`;

      if (!grouped.has(groupKey)) {
        grouped.set(groupKey, {
          name: baseName,
          category: part.category,
          dimsStr: `${sortedDims[0].toFixed(1)} × ${sortedDims[1].toFixed(1)} × ${sortedDims[2].toFixed(1)} cm`,
          joint: jointKey,
          count: 0
        });
      }
      grouped.get(groupKey).count += 1;
      totalPieces += 1;

      // Add longest axis to total linear lumber length
      const length = Math.max(part.dims.x, part.dims.y, part.dims.z);
      totalLengthCm += length;
    });

    let index = 1;
    grouped.forEach(item => {
      const jointBadge = getJointBadge(item.joint);

      // UI Cutlist Row
      if (tbody) {
        const tr = document.createElement("tr");
        tr.className = "border-b border-slate-200 hover:bg-amber-50/50 text-xs transition";
        tr.innerHTML = `
          <td class="p-2.5 font-medium text-slate-700">${index}</td>
          <td class="p-2.5 font-semibold text-slate-900">${item.name}</td>
          <td class="p-2.5 text-center font-bold text-amber-700 bg-amber-50/70 rounded">${item.count} ชิ้น</td>
          <td class="p-2.5 font-mono text-slate-600">${item.dimsStr}</td>
          <td class="p-2.5">${jointBadge}</td>
        `;
        tbody.appendChild(tr);
      }

      // Printable Sheet Row
      if (printTbody) {
        const ptr = document.createElement("tr");
        ptr.className = "border-b border-slate-200 text-xs";
        ptr.innerHTML = `
          <td class="p-2 font-medium text-slate-500">${index}</td>
          <td class="p-2 font-bold text-slate-900">${item.name}</td>
          <td class="p-2 text-center font-bold text-slate-900">${item.count} ชิ้น</td>
          <td class="p-2 font-mono text-slate-700">${item.dimsStr}</td>
          <td class="p-2">${jointBadge}</td>
        `;
        printTbody.appendChild(ptr);
      }

      index++;
    });

    // Summary Totals
    const totalMeters = (totalLengthCm / 100).toFixed(2);
    const totalMetersText = `${totalMeters} เมตร`;
    const totalPiecesText = `${totalPieces} ชิ้น`;

    const elMeters = document.getElementById("total-linear-meters");
    if (elMeters) elMeters.innerText = totalMetersText;
    const elPieces = document.getElementById("total-pieces-count");
    if (elPieces) elPieces.innerText = totalPiecesText;

    // Populate Printable Sheet Header Stats
    const printTitle = document.getElementById("print-sheet-title");
    if (printTitle && state.currentProject) printTitle.innerText = state.currentProject.name;
    const printDesc = document.getElementById("print-sheet-desc");
    if (printDesc && state.currentProject) printDesc.innerText = state.currentProject.description || "";
    const printDims = document.getElementById("print-sheet-dims");
    if (printDims) printDims.innerText = `${Math.round(state.dimensions.width)} × ${Math.round(state.dimensions.depth)} × ${Math.round(state.dimensions.height)} CM`;
    const printPieces = document.getElementById("print-sheet-pieces");
    if (printPieces) printPieces.innerText = totalPiecesText;
    const printLength = document.getElementById("print-sheet-length");
    if (printLength) printLength.innerText = totalMetersText;
    const printWood = document.getElementById("print-sheet-wood");
    const woodNames = { pine: "ไม้สนพาเลท", teak: "ไม้สักทอง", walnut: "ไม้วอลนัท", whitewash: "ไม้ขาวนอร์ดิก" };
    if (printWood) printWood.innerText = woodNames[state.woodTextureType] || "ไม้สนพาเลท";
    const printDate = document.getElementById("print-sheet-date");
    if (printDate) printDate.innerText = `วันที่ออกเอกสาร: ${new Date().toLocaleDateString('th-TH')}`;
  }

  function getJointBadge(joint) {
    const badges = {
      "butt": `<span class="px-2 py-0.5 text-[10px] bg-slate-100 text-slate-700 rounded-full border border-slate-300">ต่อชน (Butt)</span>`,
      "miter": `<span class="px-2 py-0.5 text-[10px] bg-indigo-50 text-indigo-700 rounded-full border border-indigo-300">เฉียง 45° (Miter)</span>`,
      "pocket-hole": `<span class="px-2 py-0.5 text-[10px] bg-blue-50 text-blue-700 rounded-full border border-blue-300">พ็อกเก็ตโฮล (Pocket)</span>`,
      "lap": `<span class="px-2 py-0.5 text-[10px] bg-emerald-50 text-emerald-700 rounded-full border border-emerald-300">บากครึ่งไม้ (Lap)</span>`,
      "mortise-tenon": `<span class="px-2 py-0.5 text-[10px] bg-purple-50 text-purple-700 rounded-full border border-purple-300">เดือยรู (M&T)</span>`,
      "dowel": `<span class="px-2 py-0.5 text-[10px] bg-amber-50 text-amber-700 rounded-full border border-amber-300">สลักเดือย (Dowel)</span>`,
      "pallet-block": `<span class="px-2 py-0.5 text-[10px] bg-orange-50 text-orange-700 rounded-full border border-orange-300">บล็อกพาเลท</span>`
    };
    return badges[joint] || badges["butt"];
  }

  // --- Parts Hierarchy Tree ---
  function renderPartsTree() {
    const container = document.getElementById("parts-tree-list");
    if (!container) return;
    container.innerHTML = "";

    partDataList.forEach(part => {
      const div = document.createElement("div");
      div.id = `tree-item-${part.id}`;
      div.className = "flex items-center justify-between p-2 rounded-lg text-xs hover:bg-slate-100 cursor-pointer border border-transparent transition";
      div.innerHTML = `
        <div class="flex items-center space-x-2 truncate">
          <span class="w-2 h-2 rounded-full ${part.isProp ? 'bg-slate-400' : 'bg-amber-600'}"></span>
          <span class="truncate font-medium text-slate-700">${part.name}</span>
        </div>
        <span class="text-[10px] text-slate-400 font-mono">Step ${part.step}</span>
      `;
      div.onclick = () => selectPart(part.id);
      container.appendChild(div);
    });
  }

  function highlightTreeItem(partId) {
    document.querySelectorAll("#parts-tree-list > div").forEach(el => {
      el.classList.remove("bg-blue-100", "border-blue-300");
    });
    if (partId) {
      const el = document.getElementById(`tree-item-${partId}`);
      if (el) {
        el.classList.add("bg-blue-100", "border-blue-300");
        el.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }
  }

  // --- Export 3D OBJ & Screenshot ---
  function exportOBJ() {
    let output = `# Woodcraft 3D Studio OBJ Export\n# Project: ${state.currentProject.name}\n# Dimensions: W${state.dimensions.width} x D${state.dimensions.depth} x H${state.dimensions.height} cm\n\n`;
    let vertexOffset = 1;

    partMeshMap.forEach((mesh, partId) => {
      const data = mesh.userData.partData;
      if (data.isPlant) return;
      mesh.updateMatrixWorld();

      output += `o ${data.name.replace(/\s+/g, "_")}\n`;
      const geo = mesh.geometry;
      const posAttr = geo.attributes.position;

      // Vertices transformed
      for (let i = 0; i < posAttr.count; i++) {
        const v = new THREE.Vector3().fromBufferAttribute(posAttr, i);
        v.applyMatrix4(mesh.matrixWorld);
        output += `v ${v.x.toFixed(3)} ${v.y.toFixed(3)} ${v.z.toFixed(3)}\n`;
      }

      // Faces
      if (geo.index) {
        const index = geo.index;
        for (let i = 0; i < index.count; i += 3) {
          output += `f ${index.getX(i) + vertexOffset} ${index.getX(i+1) + vertexOffset} ${index.getX(i+2) + vertexOffset}\n`;
        }
        vertexOffset += posAttr.count;
      }
    });

    const blob = new Blob([output], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${state.currentProjectId}_3D_model.obj`;
    link.click();
  }

  function captureScreenshot() {
    renderer.render(scene, camera);
    const dataURL = renderer.domElement.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = dataURL;
    link.download = `${state.currentProjectId}_screenshot.png`;
    link.click();
  }

  // --- Select & Switch Project Template ---
  function selectProject(projId) {
    if (!window.WOOD_PROJECTS || !window.WOOD_PROJECTS[projId]) return;

    state.currentProjectId = projId;
    const p = window.WOOD_PROJECTS[projId];
    state.dimensions = { ...p.defaultDimensions };

    // Update active UI template button styling
    document.querySelectorAll(".template-btn").forEach(btn => {
      const pid = btn.getAttribute("data-project-id");
      const isMatch = (pid === projId);

      if (isMatch) {
        btn.classList.add("border-amber-600", "bg-amber-50", "ring-1", "ring-amber-500", "shadow-sm");
        btn.classList.remove("border-slate-200", "bg-white", "hover:bg-slate-50");
      } else {
        btn.classList.remove("border-amber-600", "bg-amber-50", "ring-1", "ring-amber-500", "shadow-sm");
        btn.classList.add("border-slate-200", "bg-white", "hover:bg-slate-50");
      }

      const badgeBox = btn.querySelector(".badge-box");
      if (badgeBox) {
        if (isMatch) {
          badgeBox.classList.add("bg-amber-200/70", "text-amber-900");
          badgeBox.classList.remove("bg-slate-100", "text-slate-700");
        } else {
          badgeBox.classList.remove("bg-amber-200/70", "text-amber-900");
          badgeBox.classList.add("bg-slate-100", "text-slate-700");
        }
      }
    });

    // Update inputs safely
    const wInput = document.getElementById("dim-width");
    if (wInput) wInput.value = state.dimensions.width;
    const dInput = document.getElementById("dim-depth");
    if (dInput) dInput.value = state.dimensions.depth;
    const hInput = document.getElementById("dim-height");
    if (hInput) hInput.value = state.dimensions.height;

    // Update Title & Description
    const titleEl = document.getElementById("project-title");
    if (titleEl) titleEl.innerText = p.name;
    const descEl = document.getElementById("project-desc");
    if (descEl) descEl.innerText = p.description || "";

    // Stop any ongoing animation
    stopAnimation();

    // Reset Scale Buttons styling to 1.0x active
    document.querySelectorAll(".scale-btn").forEach(b => {
      const isOne = (b.getAttribute("data-scale") === "1.0");
      b.classList.toggle("bg-amber-600", isOne);
      b.classList.toggle("text-white", isOne);
      b.classList.toggle("font-bold", isOne);
      b.classList.toggle("bg-slate-100", !isOne);
      b.classList.toggle("text-slate-700", !isOne);
    });

    // Rebuild 3D Model
    buildModel();

    // Adjust camera target and distance dynamically to center on new model
    if (controls && camera) {
      const maxDim = Math.max(state.dimensions.width, state.dimensions.depth, state.dimensions.height);
      const camDist = Math.max(120, maxDim * 1.55);
      const targetY = state.dimensions.height / 2;
      controls.target.set(0, targetY, 0);
      tweenCamera(camDist * 0.75, targetY + camDist * 0.45, camDist * 0.85);
      controls.update();
    }
  }

  // --- UI Event Handlers ---
  function initUI() {
    // 1. Template Buttons
    document.querySelectorAll(".template-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const projId = btn.getAttribute("data-project-id") || btn.dataset.projectId;
        if (projId) {
          selectProject(projId);
          playWoodSnapSound();
        }
      });
    });

    // 1.1 Category Filter Tabs
    document.querySelectorAll(".cat-tab-btn").forEach(tabBtn => {
      tabBtn.addEventListener("click", () => {
        const selectedCat = tabBtn.getAttribute("data-category");
        document.querySelectorAll(".cat-tab-btn").forEach(b => {
          b.classList.remove("bg-amber-600", "text-white");
          b.classList.add("bg-slate-100", "text-slate-600");
        });
        tabBtn.classList.add("bg-amber-600", "text-white");
        tabBtn.classList.remove("bg-slate-100", "text-slate-600");

        document.querySelectorAll(".template-btn").forEach(card => {
          const cardCat = card.getAttribute("data-category");
          if (selectedCat === "all" || cardCat === selectedCat) {
            card.classList.remove("hidden");
          } else {
            card.classList.add("hidden");
          }
        });
      });
    });

    // 2. Global Dimension Controls
    ["width", "depth", "height"].forEach(axis => {
      const input = document.getElementById(`dim-${axis}`);
      if (input) {
        input.addEventListener("input", (e) => {
          stopAnimation();
          const val = parseFloat(e.target.value) || 10;
          state.dimensions[axis] = Math.max(10, Math.min(300, val));
          buildModel();
        });
      }
    });

    // 3. Quick Scale Buttons (0.8x, 1.0x, 1.2x, 1.5x)
    document.querySelectorAll(".scale-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        stopAnimation();
        const mult = parseFloat(btn.dataset.scale);
        const p = window.WOOD_PROJECTS[state.currentProjectId];
        if (!p) return;

        // Toggle active button style
        document.querySelectorAll(".scale-btn").forEach(b => {
          b.classList.remove("bg-amber-600", "text-white", "font-bold");
          b.classList.add("bg-slate-100", "text-slate-700");
        });
        btn.classList.add("bg-amber-600", "text-white", "font-bold");
        btn.classList.remove("bg-slate-100", "text-slate-700");

        state.dimensions.width = Math.round(p.defaultDimensions.width * mult);
        state.dimensions.depth = Math.round(p.defaultDimensions.depth * mult);
        state.dimensions.height = Math.round(p.defaultDimensions.height * mult);

        document.getElementById("dim-width").value = state.dimensions.width;
        document.getElementById("dim-depth").value = state.dimensions.depth;
        document.getElementById("dim-height").value = state.dimensions.height;

        buildModel();
      });
    });

    // 4. Wood Finish Selector
    document.querySelectorAll(".wood-type-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".wood-type-btn").forEach(b => b.classList.remove("ring-2", "ring-amber-500"));
        btn.classList.add("ring-2", "ring-amber-500");
        state.woodTextureType = btn.dataset.wood;
        buildModel();
      });
    });

    // 5. Assembly Timeline Slider
    const assemblySlider = document.getElementById("assembly-slider");
    if (assemblySlider) {
      assemblySlider.addEventListener("input", (e) => {
        stopAnimation();
        state.assemblyProgress = parseFloat(e.target.value) / 100;
        updateAssemblyPositions();
      });
    }

    // 6. Step Slider & Buttons
    const stepSlider = document.getElementById("step-slider");
    if (stepSlider) {
      stepSlider.addEventListener("input", (e) => {
        stopAnimation();
        state.currentStep = parseInt(e.target.value);
        document.getElementById("step-label").innerText = `ขั้นตอนที่ ${state.currentStep} / ${state.maxSteps}`;
        updateAssemblyPositions();
      });
    }

    // Step Prev/Next Buttons
    document.getElementById("btn-prev-step")?.addEventListener("click", () => {
      stopAnimation();
      if (state.currentStep > 1) {
        state.currentStep--;
        if (stepSlider) stepSlider.value = state.currentStep;
        document.getElementById("step-label").innerText = `ขั้นตอนที่ ${state.currentStep} / ${state.maxSteps}`;
        updateAssemblyPositions();
        playWoodSnapSound();
      }
    });

    document.getElementById("btn-next-step")?.addEventListener("click", () => {
      stopAnimation();
      if (state.currentStep < state.maxSteps) {
        state.currentStep++;
        if (stepSlider) stepSlider.value = state.currentStep;
        document.getElementById("step-label").innerText = `ขั้นตอนที่ ${state.currentStep} / ${state.maxSteps}`;
        updateAssemblyPositions();
        playWoodSnapSound();
      }
    });

    // Explosion multiplier
    const explodeDistSlider = document.getElementById("explode-dist-slider");
    if (explodeDistSlider) {
      explodeDistSlider.addEventListener("input", (e) => {
        state.explosionMultiplier = parseFloat(e.target.value);
        updateAssemblyPositions();
      });
    }

    // Play/Pause Assembly Animation
    document.getElementById("btn-play-pause")?.addEventListener("click", playAssemblyAnimation);

    // 7. Toggle Switches (Human scale, Dimensions, Grid, Sound)
    document.getElementById("toggle-human")?.addEventListener("change", (e) => {
      state.showHumanScale = e.target.checked;
      humanScaleGroup.visible = state.showHumanScale;
    });

    document.getElementById("toggle-dimensions")?.addEventListener("change", (e) => {
      state.showDimensions = e.target.checked;
      updateDimensionsOverlay();
    });

    document.getElementById("toggle-grid")?.addEventListener("change", (e) => {
      state.showGrid = e.target.checked;
      gridHelper.visible = state.showGrid;
    });

    document.getElementById("toggle-sound")?.addEventListener("change", (e) => {
      state.audioEnabled = e.target.checked;
    });

    // 8. View Mode Selector (Realistic, Wireframe, X-Ray)
    document.querySelectorAll(".viewmode-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".viewmode-btn").forEach(b => b.classList.remove("bg-white", "shadow-sm", "text-amber-800"));
        btn.classList.add("bg-white", "shadow-sm", "text-amber-800");
        state.viewMode = btn.dataset.mode;
        buildModel();
      });
    });

    // 9. Camera Presets with Dynamic Model Dimension Framing
    function getModelCameraDistance() {
      const maxDim = Math.max(state.dimensions.width, state.dimensions.depth, state.dimensions.height);
      return Math.max(120, maxDim * 1.55);
    }

    document.getElementById("cam-iso")?.addEventListener("click", () => {
      const dist = getModelCameraDistance();
      const targetY = state.dimensions.height / 2;
      controls.target.set(0, targetY, 0);
      tweenCamera(dist * 0.75, targetY + dist * 0.45, dist * 0.85);
    });
    document.getElementById("cam-front")?.addEventListener("click", () => {
      const dist = getModelCameraDistance();
      const targetY = state.dimensions.height / 2;
      controls.target.set(0, targetY, 0);
      tweenCamera(0, targetY, dist);
    });
    document.getElementById("cam-top")?.addEventListener("click", () => {
      const dist = getModelCameraDistance();
      const targetY = state.dimensions.height / 2;
      controls.target.set(0, targetY, 0);
      tweenCamera(0, targetY + dist * 1.25, 0.1);
    });
    document.getElementById("cam-side")?.addEventListener("click", () => {
      const dist = getModelCameraDistance();
      const targetY = state.dimensions.height / 2;
      controls.target.set(0, targetY, 0);
      tweenCamera(dist, targetY, 0);
    });

    // 10. Selected Part Inspector Changes
    ["insp-dim-x", "insp-dim-y", "insp-dim-z"].forEach((id, axisIdx) => {
      document.getElementById(id)?.addEventListener("change", (e) => {
        if (!state.selectedPartId || !partMeshMap.has(state.selectedPartId)) return;
        const mesh = partMeshMap.get(state.selectedPartId);
        const data = mesh.userData.partData;
        const axes = ["x", "y", "z"];
        data.dims[axes[axisIdx]] = Math.max(0.5, parseFloat(e.target.value) || 1);
        
        // Rebuild mesh geometry and its outline
        mesh.geometry.dispose();
        mesh.geometry = new THREE.BoxGeometry(data.dims.x, data.dims.y, data.dims.z);

        // Update outline
        for (let i = mesh.children.length - 1; i >= 0; i--) {
          if (mesh.children[i].isLineSegments) {
            mesh.remove(mesh.children[i]);
          }
        }
        const edges = new THREE.EdgesGeometry(mesh.geometry);
        const edgeLine = new THREE.LineSegments(
          edges,
          new THREE.LineBasicMaterial({ color: 0x1e293b, opacity: 0.25, transparent: true })
        );
        mesh.add(edgeLine);

        renderCutList();
      });
    });

    document.getElementById("insp-joint-type")?.addEventListener("change", (e) => {
      if (!state.selectedPartId || !partMeshMap.has(state.selectedPartId)) return;
      const mesh = partMeshMap.get(state.selectedPartId);
      mesh.userData.partData.joint = e.target.value;
      renderCutList();
    });

    // 11. Export & Action Buttons
    document.getElementById("btn-export-obj")?.addEventListener("click", exportOBJ);
    document.getElementById("btn-screenshot")?.addEventListener("click", captureScreenshot);
    
    // Print Modal Handlers
    document.getElementById("btn-print-bom")?.addEventListener("click", () => {
      renderCutList();
      const modal = document.getElementById("print-modal");
      if (modal) modal.classList.remove("hidden");
      lucide.createIcons();
    });

    document.getElementById("btn-close-print-modal")?.addEventListener("click", () => {
      const modal = document.getElementById("print-modal");
      if (modal) modal.classList.add("hidden");
    });

    document.getElementById("btn-trigger-print")?.addEventListener("click", () => {
      window.print();
    });
  }

  function tweenCamera(x, y, z) {
    const startPos = camera.position.clone();
    const endPos = new THREE.Vector3(x, y, z);
    const duration = 600;
    const startTime = performance.now();

    function anim(now) {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / duration, 1.0);
      const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

      camera.position.lerpVectors(startPos, endPos, ease);
      controls.update();

      if (t < 1.0) requestAnimationFrame(anim);
    }
    requestAnimationFrame(anim);
  }

  function onWindowResize() {
    const container = document.getElementById("canvas-container");
    if (!container || !renderer) return;
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  }

  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }

  // Run on DOM load safely
  function startApp() {
    initScene();
    initUI();
    selectProject(state.currentProjectId);
  }

  if (document.readyState === "loading") {
    window.addEventListener("DOMContentLoaded", startApp);
  } else {
    startApp();
  }
})();
