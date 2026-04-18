import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import * as THREE from "three";
import { TextType } from "@/components/ui/TextType";
import { gsap } from "gsap";
import { useLocale, type Locale } from "@/hooks/useLocale";

type Point3 = { x: number; y: number; z: number };

type LabelSeed = {
  text: string;
  target: string;
  copies: number;
};

type LabelEntry = {
  sprite: THREE.Sprite;
  material: THREE.SpriteMaterial;
  texture: THREE.Texture;
  text: string;
  target: string;
  basePosition: THREE.Vector3;
  baseScaleX: number;
  baseScaleY: number;
  pulseSeed: number;
  currentOpacity: number;
  currentScale: number;
};

type LineEntry = {
  a: LabelEntry;
  b: LabelEntry;
  line: THREE.Line;
  geometry: THREE.BufferGeometry;
  material: THREE.LineBasicMaterial;
  flickerSeed: number;
  flickerSpeed: number;
  currentOpacity: number;
};

const CAMERA_Z = 16;
const VERTICAL_LIMIT = Math.PI * 0.42;

const AUTO_X = 0.00004;
const AUTO_Y = 0.00012;
const DRAG_SPEED_X = 0.0038;
const DRAG_SPEED_Y = 0.0032;
const INERTIA_FACTOR = 0.18;
const DAMPING = 0.92;

const WHEEL_SPEED_X = 0.00018;
const WHEEL_SPEED_Y = 0.00018;
const WHEEL_DAMPING = 0.9;
const WHEEL_MAX = 0.035;

const LABEL_RADIUS = 6.8;
const LABEL_OPACITY_FRONT = 0.52;
const LABEL_OPACITY_BACK = 0.12;
const LABEL_SCALE_BASE = 0.46;
const LABEL_PULSE_AMOUNT = 0.018;
const LABEL_PULSE_SPEED = 1.2;
const HOVER_OPACITY = 1;
const HOVER_SCALE = 1.16;
const NON_HOVER_DIM_FACTOR = 0.34;

const LINE_MIN_OPACITY = 0.075;
const LINE_MAX_OPACITY = 0.28;
const LINE_FLICKER_MIN = 4.2;
const LINE_FLICKER_MAX = 7.4;
const NODE_LINK_MIN = 12;
const NODE_LINK_MAX = 16;
const HOVER_BOOST_RADIUS = 4.4;
const HOVER_BOOST_OPACITY = 0.82;
const HOVER_BOOST_WIDTH = 1.18;
const TRAVEL_BOOST_OPACITY = 0.1;

const BAND_SECONDS = 10;
const BAND_WIDTH = 0.18;
const BAND_OPACITY_BOOST = 0.12;
const BAND_SOFTNESS = 1.18;

const CURSOR_HOVER_HINTS: Record<Locale, string[]> = {
  zh: ["这题你肯定有话说", "点开看看谁和你一样", "来，说点真的"],
  en: ["You probably have thoughts on this", "Tap to find people like you", "Say something real"],
};
const CURSOR_HINT_FONT = `600 13px "ABC Favorit", "Avenir Next", "Segoe UI", sans-serif`;
const CURSOR_HINT_BASE_WIDTH = 174;
const CURSOR_HINT_HORIZONTAL_PADDING = 28;
const CURSOR_HINT_CURSOR_ALLOWANCE = 18;

const DRAG_HINT: Record<Locale, string> = {
  zh: "滚动或拖拽以探索",
  en: "Scroll or drag to explore",
};

const DEFAULT_LABEL_SEEDS: Record<Locale, LabelSeed[]> = {
  zh: [
    { text: "今日状态签到", target: "/status", copies: 6 },
    { text: "精选共鸣内容", target: "/resonance", copies: 6 },
    { text: "关于项目", target: "/about", copies: 5 },
    { text: "联系反馈", target: "/contacto", copies: 5 },
  ],
  en: [
    { text: "Daily Mood Check-in", target: "/status", copies: 6 },
    { text: "Featured Resonance", target: "/resonance", copies: 6 },
    { text: "About", target: "/about", copies: 5 },
    { text: "Contact", target: "/contacto", copies: 5 },
  ],
};

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function fibonacciSpherePoint(index: number, total: number, radius: number): Point3 {
  const y = 1 - (index / (total - 1)) * 2;
  const radial = Math.sqrt(Math.max(0, 1 - y * y));
  const theta = Math.PI * (3 - Math.sqrt(5)) * index;
  return {
    x: Math.cos(theta) * radial * radius,
    y: y * radius,
    z: Math.sin(theta) * radial * radius,
  };
}

function buildLabelOrder(seeds: LabelSeed[]) {
  const working = seeds.map((item) => ({ ...item, remaining: item.copies }));
  const ordered: Array<{ text: string; target: string }> = [];
  let previous: string | null = null;

  while (working.some((item) => item.remaining > 0)) {
    const candidates = working.filter((item) => item.remaining > 0 && item.text !== previous);
    const pool = candidates.length > 0 ? candidates : working.filter((item) => item.remaining > 0);
    pool.sort((a, b) => b.remaining - a.remaining);
    const selected = pool[0];
    ordered.push({ text: selected.text, target: selected.target });
    selected.remaining -= 1;
    previous = selected.text;
  }

  return ordered;
}

function buildConnectionPairs(points: THREE.Vector3[]) {
  const total = points.length;
  if (total < 2) return [] as Array<[number, number]>;

  const minLinks = Math.min(NODE_LINK_MIN, total - 1);
  const maxLinks = Math.min(NODE_LINK_MAX, total - 1);

  const targetDegrees = new Array(total).fill(0).map((_, index) => {
    const varied = NODE_LINK_MIN + (index % (NODE_LINK_MAX - NODE_LINK_MIN + 1));
    return clamp(varied, minLinks, maxLinks);
  });

  const neighbors = points.map((point, index) =>
    points
      .map((candidate, candidateIndex) => ({
        candidateIndex,
        distanceSq: index === candidateIndex ? Number.POSITIVE_INFINITY : point.distanceToSquared(candidate),
      }))
      .filter((item) => item.candidateIndex !== index)
      .sort((a, b) => a.distanceSq - b.distanceSq)
      .map((item) => item.candidateIndex),
  );

  const degrees = new Array(total).fill(0);
  const edgeSet = new Set<string>();
  const pairs: Array<[number, number]> = [];

  const addPair = (a: number, b: number) => {
    if (a === b) return false;
    const x = Math.min(a, b);
    const y = Math.max(a, b);
    const key = `${x}:${y}`;
    if (edgeSet.has(key)) return false;
    edgeSet.add(key);
    pairs.push([x, y]);
    degrees[x] += 1;
    degrees[y] += 1;
    return true;
  };

  for (let index = 0; index < total; index += 1) {
    addPair(index, (index + 1) % total);
  }

  if (total > 4) {
    const oppositeOffset = Math.floor(total / 2);
    for (let index = 0; index < total; index += 1) {
      addPair(index, (index + oppositeOffset) % total);
    }
  }

  let guard = 0;
  let expanded = true;
  while (expanded && guard < total * 12) {
    expanded = false;
    guard += 1;

    for (let index = 0; index < total; index += 1) {
      if (degrees[index] >= targetDegrees[index]) continue;

      for (const next of neighbors[index]) {
        if (degrees[next] >= targetDegrees[next]) continue;
        if (addPair(index, next)) {
          expanded = true;
          break;
        }
      }
    }
  }

  return pairs;
}

function createLabelTexture(text: string) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const fontSize = 22;

  const measure = document.createElement("canvas");
  const measureCtx = measure.getContext("2d");
  if (!measureCtx) return null;

  measureCtx.font = `500 ${fontSize}px Montserrat, "ABC Favorit", "Avenir Next", sans-serif`;
  const textWidth = Math.ceil(measureCtx.measureText(text).width);

  const logicalWidth = textWidth + 42;
  const logicalHeight = 40;

  const canvas = document.createElement("canvas");
  canvas.width = Math.ceil(logicalWidth * dpr);
  canvas.height = Math.ceil(logicalHeight * dpr);

  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, logicalWidth, logicalHeight);
  ctx.font = `500 ${fontSize}px Montserrat, "ABC Favorit", "Avenir Next", sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "rgba(255, 255, 255, 1)";
  ctx.fillText(text, logicalWidth / 2, logicalHeight / 2 + 0.5);

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;

  return {
    texture,
    width: logicalWidth,
    height: logicalHeight,
  };
}

function isInteractiveTarget(target: EventTarget | null) {
  if (!(target instanceof Element)) return false;
  return Boolean(target.closest("a,button,input,textarea,select,label,[role='button']"));
}

function getClickThreshold() {
  if (typeof window === "undefined") return 10;
  return window.matchMedia("(pointer: coarse)").matches ? 22 : 10;
}

function getCursorHintPillWidth(hints: string[]) {
  if (typeof document === "undefined") return CURSOR_HINT_BASE_WIDTH;

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return CURSOR_HINT_BASE_WIDTH;

  ctx.font = CURSOR_HINT_FONT;
  const widest = hints.reduce((max, hint) => Math.max(max, ctx.measureText(hint).width), 0);
  const fullWidth = Math.ceil(widest + CURSOR_HINT_HORIZONTAL_PADDING + CURSOR_HINT_CURSOR_ALLOWANCE);
  return Math.max(CURSOR_HINT_BASE_WIDTH, fullWidth);
}

export function HomeSceneCanvas({ topicSeeds }: { topicSeeds?: LabelSeed[] }) {
  const router = useRouter();
  const { locale } = useLocale();
  const [isCursorHintMounted, setIsCursorHintMounted] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const hintRef = useRef<HTMLDivElement | null>(null);
  const customCursorRef = useRef<HTMLDivElement | null>(null);
  const cursorHintWrapRef = useRef<HTMLSpanElement | null>(null);
  const transitionOverlayRef = useRef<HTMLDivElement | null>(null);
  const cursorHints = CURSOR_HOVER_HINTS[locale];
  const defaultLabelSeeds = DEFAULT_LABEL_SEEDS[locale];

  useEffect(() => {
    const canvas = canvasRef.current;
    const dragHint = hintRef.current;
    const customCursor = customCursorRef.current;
    const transitionOverlay = transitionOverlayRef.current;

    if (!canvas) return undefined;
    const sceneWrap = canvas.parentElement;

    let rafId = 0;
    let isLeaving = false;
    let transitionTimer: number | null = null;
    let disposed = false;
    const clickThreshold = getClickThreshold();

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, CAMERA_Z);

    const root = new THREE.Group();
    scene.add(root);

    const labels: LabelEntry[] = [];
    const labelSprites: THREE.Sprite[] = [];

    const labelOrder = buildLabelOrder(topicSeeds && topicSeeds.length > 0 ? topicSeeds : defaultLabelSeeds);
    const labelTotal = labelOrder.length;

    labelOrder.forEach((item, index) => {
      const labelTexture = createLabelTexture(item.text);
      if (!labelTexture) return;

      const material = new THREE.SpriteMaterial({
        map: labelTexture.texture,
        transparent: true,
        depthWrite: false,
        depthTest: false,
        opacity: LABEL_OPACITY_FRONT,
      });

      const sprite = new THREE.Sprite(material);
      const baseScaleY = LABEL_SCALE_BASE;
      const baseScaleX = LABEL_SCALE_BASE * (labelTexture.width / labelTexture.height);
      sprite.scale.set(baseScaleX, baseScaleY, 1);
      sprite.renderOrder = 20;

      const position = fibonacciSpherePoint(index, labelTotal, LABEL_RADIUS);
      sprite.position.set(position.x, position.y, position.z);

      root.add(sprite);
      labelSprites.push(sprite);
      labels.push({
        sprite,
        material,
        texture: labelTexture.texture,
        text: item.text,
        target: item.target,
        basePosition: sprite.position.clone(),
        baseScaleX,
        baseScaleY,
        pulseSeed: Math.random() * Math.PI * 2,
        currentOpacity: LABEL_OPACITY_FRONT,
        currentScale: 1,
      });
    });

    const lines: LineEntry[] = [];
    const connectionPairs = buildConnectionPairs(labels.map((item) => item.basePosition));
    connectionPairs.forEach(([fromIndex, toIndex]) => {
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(6), 3));

      const material = new THREE.LineBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0,
        depthWrite: false,
        depthTest: true,
        toneMapped: false,
        blending: THREE.AdditiveBlending,
      });

      const line = new THREE.Line(geometry, material);
      line.renderOrder = 10;
      root.add(line);

      lines.push({
        a: labels[fromIndex],
        b: labels[toIndex],
        line,
        geometry,
        material,
        flickerSeed: Math.random() * Math.PI * 2,
        flickerSpeed: randomBetween(LINE_FLICKER_MIN, LINE_FLICKER_MAX),
        currentOpacity: 0,
      });
    });

    const pointer = new THREE.Vector2(-10, -10);
    const raycaster = new THREE.Raycaster();

    let hoveredLabel: LabelEntry | null = null;
    let pointerClientX = window.innerWidth * 0.5;
    let pointerClientY = window.innerHeight * 0.5;
    const hasFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const cursorOffsetX = 24;
    const cursorOffsetY = 24;
    const cursorFollowSpeed = 0.3;
    let isCursorHovering = false;
    let mouseX = pointerClientX + cursorOffsetX;
    let mouseY = pointerClientY + cursorOffsetY;
    let cursorX = mouseX;
    let cursorY = mouseY;
    let cursorTilt = 0;

    const updateCursorPillWidth = () => {
      if (!hasFinePointer || !customCursor) return;
      customCursor.style.setProperty("--cursor-pill-width", `${getCursorHintPillWidth(cursorHints)}px`);
    };

    if (hasFinePointer && customCursor) {
      updateCursorPillWidth();
      void document.fonts?.ready.then(updateCursorPillWidth);
      customCursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) rotate(0deg)`;
    }

    let isDragging = false;
    let dragStartX = 0;
    let dragStartY = 0;
    let lastX = 0;
    let lastY = 0;

    let targetRotX = 0;
    let targetRotY = 0;
    let smoothRotX = 0;
    let smoothRotY = 0;
    let inertiaX = 0;
    let inertiaY = 0;
    let wheelX = 0;
    let wheelY = 0;

    const worldPos = new THREE.Vector3();
    const cameraDir = new THREE.Vector3();
    const toObject = new THREE.Vector3();
    const midpoint = new THREE.Vector3();
    const hoverPos = new THREE.Vector3();

    const clock = new THREE.Clock();

    const projectToScreen = (sprite: THREE.Sprite) => {
      sprite.getWorldPosition(worldPos);
      const projected = worldPos.clone().project(camera);
      return {
        x: (projected.x * 0.5 + 0.5) * window.innerWidth,
        y: (-projected.y * 0.5 + 0.5) * window.innerHeight,
      };
    };

    const findNearestLabel = (clientX: number, clientY: number) => {
      let nearest: LabelEntry | null = null;
      let bestDistance = Infinity;

      labels.forEach((entry) => {
        const screen = projectToScreen(entry.sprite);
        const distance = Math.hypot(screen.x - clientX, screen.y - clientY);
        if (distance < 64 && distance < bestDistance) {
          bestDistance = distance;
          nearest = entry;
        }
      });

      return nearest;
    };

    const navigateByLabel = (entry: LabelEntry) => {
      if (isLeaving) return;
      isLeaving = true;

      transitionOverlay?.classList.add("is-active");
      sceneWrap?.classList.add("is-leaving");

      transitionTimer = window.setTimeout(() => {
        void router.push(entry.target);
      }, 520);
    };

    const revealCursorHint = () => {
      if (!hasFinePointer || !customCursor) return;

      customCursor.classList.add("is-hover");
      sceneWrap?.classList.add("is-topic-hover");
      setIsCursorHintMounted(true);

      requestAnimationFrame(() => {
        const hintWrap = cursorHintWrapRef.current;
        if (!hintWrap || disposed) return;
        gsap.killTweensOf(hintWrap);
        gsap.fromTo(
          hintWrap,
          { autoAlpha: 0, y: 8, filter: "blur(5px)" },
          {
            autoAlpha: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.36,
            delay: 0.06,
            ease: "expo.out",
          },
        );
      });

      gsap.killTweensOf(customCursor);
      gsap.to(customCursor, { opacity: 1, duration: 0.3, ease: "power3.out" });
    };

    const hideCursorHint = () => {
      if (!hasFinePointer || !customCursor) return;
      const hintWrap = cursorHintWrapRef.current;
      customCursor.classList.remove("is-hover");
      sceneWrap?.classList.remove("is-topic-hover");

      if (hintWrap) {
        gsap.killTweensOf(hintWrap);
        gsap.to(hintWrap, {
          autoAlpha: 0,
          y: 6,
          filter: "blur(4px)",
          duration: 0.2,
          ease: "power2.inOut",
          onComplete: () => {
            if (disposed) return;
            setIsCursorHintMounted(false);
          },
        });
      } else {
        setIsCursorHintMounted(false);
      }

      gsap.killTweensOf(customCursor);
      gsap.to(customCursor, { opacity: 0.96, duration: 0.24, ease: "power2.out" });
    };

    const onPointerDown = (event: PointerEvent) => {
      if (isLeaving) return;
      if (event.button !== 0) return;
      if (isInteractiveTarget(event.target)) return;

      isDragging = true;
      dragStartX = event.clientX;
      dragStartY = event.clientY;
      lastX = event.clientX;
      lastY = event.clientY;
      inertiaX = 0;
      inertiaY = 0;
      if (dragHint) dragHint.classList.add("is-hidden");

      try {
        canvas.setPointerCapture(event.pointerId);
      } catch {
        // noop
      }
    };

    const onPointerMove = (event: PointerEvent) => {
      if (isLeaving) return;
      const rect = canvas.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      pointerClientX = event.clientX;
      pointerClientY = event.clientY;
      if (hasFinePointer && customCursor) {
        mouseX = event.clientX + cursorOffsetX;
        mouseY = event.clientY + cursorOffsetY;
        customCursor.classList.add("is-visible");
      }

      if (!isDragging) return;

      const dx = event.clientX - lastX;
      const dy = event.clientY - lastY;

      targetRotY += dx * DRAG_SPEED_X;
      targetRotX += dy * DRAG_SPEED_Y;
      targetRotX = clamp(targetRotX, -VERTICAL_LIMIT, VERTICAL_LIMIT);

      inertiaY = dx * DRAG_SPEED_X * INERTIA_FACTOR;
      inertiaX = dy * DRAG_SPEED_Y * INERTIA_FACTOR;

      lastX = event.clientX;
      lastY = event.clientY;
    };

    const onPointerUp = (event: PointerEvent) => {
      if (!isDragging) return;
      isDragging = false;

      try {
        canvas.releasePointerCapture(event.pointerId);
      } catch {
        // noop
      }

      const moved = Math.hypot(event.clientX - dragStartX, event.clientY - dragStartY);
      if (moved < clickThreshold) {
        const nearest = findNearestLabel(event.clientX, event.clientY);
        if (nearest) navigateByLabel(nearest);
      }
    };

    const onPointerEnter = (event: PointerEvent) => {
      pointerClientX = event.clientX;
      pointerClientY = event.clientY;
      if (hasFinePointer && customCursor) {
        mouseX = event.clientX + cursorOffsetX;
        mouseY = event.clientY + cursorOffsetY;
        cursorX = mouseX;
        cursorY = mouseY;
        customCursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) rotate(0deg)`;
        customCursor.classList.add("is-visible");
      }
    };

    const onPointerLeave = () => {
      isDragging = false;
      pointer.set(-10, -10);
      hoveredLabel = null;
      if (isCursorHovering) {
        isCursorHovering = false;
        hideCursorHint();
      } else {
        setIsCursorHintMounted(false);
        sceneWrap?.classList.remove("is-topic-hover");
      }
      if (hasFinePointer && customCursor) {
        customCursor.classList.remove("is-visible");
      }
    };

    const onWheel = (event: WheelEvent) => {
      if (isLeaving) return;
      if (isInteractiveTarget(event.target)) return;

      wheelY += event.deltaX * WHEEL_SPEED_Y;
      wheelX += event.deltaY * WHEEL_SPEED_X;
      wheelX = clamp(wheelX, -WHEEL_MAX, WHEEL_MAX);
      wheelY = clamp(wheelY, -WHEEL_MAX, WHEEL_MAX);
    };

    const onResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(width, height, false);
      updateCursorPillWidth();
    };

    const animate = () => {
      const elapsed = clock.getElapsedTime();

      if (!isDragging) {
        targetRotX += AUTO_X;
        targetRotY += AUTO_Y;
      }

      targetRotX += inertiaX + wheelX;
      targetRotY += inertiaY + wheelY;
      targetRotX = clamp(targetRotX, -VERTICAL_LIMIT, VERTICAL_LIMIT);

      inertiaX *= DAMPING;
      inertiaY *= DAMPING;
      wheelX *= WHEEL_DAMPING;
      wheelY *= WHEEL_DAMPING;

      smoothRotX += (targetRotX - smoothRotX) * 0.14;
      smoothRotY += (targetRotY - smoothRotY) * 0.14;

      root.rotation.x = smoothRotX;
      root.rotation.y = smoothRotY;

      raycaster.setFromCamera(pointer, camera);
      const intersections = raycaster.intersectObjects(labelSprites, false);
      hoveredLabel = null;
      if (intersections.length > 0) {
        const object = intersections[0]?.object;
        hoveredLabel = labels.find((entry) => entry.sprite === object) ?? null;
      }

      camera.getWorldDirection(cameraDir);

      labels.forEach((entry) => {
        entry.sprite.position.copy(entry.basePosition);
        entry.sprite.getWorldPosition(worldPos);

        toObject.copy(worldPos).sub(camera.position).normalize();
        const isFront = cameraDir.dot(toObject) > 0;

        const pulse = 1 + Math.sin(elapsed * LABEL_PULSE_SPEED + entry.pulseSeed) * LABEL_PULSE_AMOUNT;
        const baseOpacity = isFront ? LABEL_OPACITY_FRONT : LABEL_OPACITY_BACK;
        const dimmedOpacity =
          hoveredLabel && hoveredLabel !== entry ? baseOpacity * NON_HOVER_DIM_FACTOR : baseOpacity;
        const targetOpacity = hoveredLabel === entry ? HOVER_OPACITY : dimmedOpacity;
        const targetScale = hoveredLabel === entry ? HOVER_SCALE : 1;
        entry.material.color.setHex(hoveredLabel === entry ? 0xffffff : 0xe6edf7);

        entry.currentOpacity += (targetOpacity - entry.currentOpacity) * 0.12;
        entry.currentScale += (targetScale - entry.currentScale) * 0.12;

        entry.material.opacity = entry.currentOpacity;
        entry.sprite.scale.set(
          entry.baseScaleX * pulse * entry.currentScale,
          entry.baseScaleY * pulse * entry.currentScale,
          1,
        );
      });

      if (hoveredLabel) {
        hoveredLabel.sprite.getWorldPosition(hoverPos);
        root.worldToLocal(hoverPos);
      }

      lines.forEach((item) => {
        const a = item.a.sprite.position;
        const b = item.b.sprite.position;

        midpoint.copy(a).add(b).multiplyScalar(0.5);

        const flickerScale = 0.5 + (0.5 * Math.sin(elapsed * item.flickerSpeed + item.flickerSeed) + 0.5) * 0.12;
        const baseOpacity =
          (LINE_MIN_OPACITY +
            (0.5 *
              Math.sin(0.9 * elapsed + 0.9 * midpoint.x + 1.1 * midpoint.y + 0.8 * midpoint.z + item.flickerSeed) +
              0.5) *
              (LINE_MAX_OPACITY - LINE_MIN_OPACITY)) *
          flickerScale;

        const hoverBoost = hoveredLabel
          ? Math.pow(clamp(1 - midpoint.distanceTo(hoverPos) / HOVER_BOOST_RADIUS, 0, 1), HOVER_BOOST_WIDTH) *
            HOVER_BOOST_OPACITY
          : 0;

        const normalizedY = clamp((midpoint.y / LABEL_RADIUS) * 0.5 + 0.5, 0, 1);
        const cycle = (elapsed % BAND_SECONDS) / BAND_SECONDS;
        const distanceToBand = Math.min(
          Math.abs(normalizedY - cycle),
          Math.abs(normalizedY + 1 - cycle),
          Math.abs(normalizedY - (cycle + 1)),
        );
        const travelBand =
          Math.exp(-Math.pow(distanceToBand / BAND_WIDTH, 2) * BAND_SOFTNESS) * BAND_OPACITY_BOOST;

        const travelNoise =
          (0.5 *
            Math.sin(3.2 * elapsed + 1.8 * midpoint.x + 1.35 * midpoint.y + 1.15 * midpoint.z + item.flickerSeed) +
            0.5) *
          TRAVEL_BOOST_OPACITY;

        const target = clamp(baseOpacity + hoverBoost + travelBand + travelNoise, 0, 0.95);
        item.currentOpacity += (target - item.currentOpacity) * 0.08;

        const positions = item.geometry.attributes.position.array as Float32Array;
        positions[0] = a.x;
        positions[1] = a.y;
        positions[2] = a.z;
        positions[3] = b.x;
        positions[4] = b.y;
        positions[5] = b.z;
        item.geometry.attributes.position.needsUpdate = true;

        item.material.opacity = item.currentOpacity;
        item.line.visible = item.currentOpacity > 0.001;
      });

      if (hasFinePointer && customCursor) {
        if (hoveredLabel) {
          if (!isCursorHovering) {
            isCursorHovering = true;
            revealCursorHint();
          }
        } else {
          if (isCursorHovering) {
            isCursorHovering = false;
            hideCursorHint();
          }
        }

        cursorX += (mouseX - cursorX) * cursorFollowSpeed;
        cursorY += (mouseY - cursorY) * cursorFollowSpeed;
        const targetTilt = customCursor.classList.contains("is-hover") ? -7 : 0;
        cursorTilt += (targetTilt - cursorTilt) * 0.18;
        customCursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) rotate(${cursorTilt}deg)`;
      }

      renderer.render(scene, camera);
      rafId = requestAnimationFrame(animate);
    };

    onResize();
    animate();

    window.addEventListener("resize", onResize);
    canvas.addEventListener("pointerenter", onPointerEnter);
    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("pointerleave", onPointerLeave);
    canvas.addEventListener("pointercancel", onPointerLeave);
    canvas.addEventListener("wheel", onWheel, { passive: true });

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
      canvas.removeEventListener("pointerenter", onPointerEnter);
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointerleave", onPointerLeave);
      canvas.removeEventListener("pointercancel", onPointerLeave);
      canvas.removeEventListener("wheel", onWheel);
      if (transitionTimer !== null) {
        window.clearTimeout(transitionTimer);
      }
      disposed = true;

      sceneWrap?.classList.remove("is-topic-hover", "is-leaving");
      isCursorHovering = false;
      setIsCursorHintMounted(false);
      if (customCursor) {
        customCursor.classList.remove("is-visible", "is-hover");
        gsap.killTweensOf(customCursor);
      }
      if (cursorHintWrapRef.current) {
        gsap.killTweensOf(cursorHintWrapRef.current);
      }

      labels.forEach((entry) => {
        entry.texture.dispose();
        entry.material.dispose();
      });
      lines.forEach((line) => {
        line.geometry.dispose();
        line.material.dispose();
      });

      renderer.dispose();
    };
  }, [cursorHints, defaultLabelSeeds, router, topicSeeds]);

  return (
    <div id="sceneWrap" className="scene-wrap" aria-hidden="true">
      <canvas
        id="sceneCanvas"
        ref={canvasRef}
        className="scene-canvas"
        data-engine="three.js r183"
      />
      <div className="ui-layer" id="uiLayer" aria-hidden="true">
        <div className="ui-layer__hint" id="dragHint" ref={hintRef}>
          {DRAG_HINT[locale]}
        </div>
      </div>
      <div className="scene-custom-cursor" aria-hidden="true" ref={customCursorRef}>
        {isCursorHintMounted ? (
          <span className="scene-custom-cursor__hint-wrap" ref={cursorHintWrapRef}>
            <TextType
              as="span"
              className="scene-custom-cursor__text"
              text={cursorHints}
              typingSpeed={52}
              deletingSpeed={30}
              pauseDuration={1200}
              showCursor
              cursorCharacter="_"
              cursorClassName="scene-custom-cursor__underscore"
              loop
            />
          </span>
        ) : null}
      </div>
      <div className="scene-transition-overlay" aria-hidden="true" ref={transitionOverlayRef} />
    </div>
  );
}
