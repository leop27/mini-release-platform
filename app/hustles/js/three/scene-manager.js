/* ═══════════════════════════════════════════
   THREE SCENE MANAGER — reusable Three.js wrapper.
   Handles Scene, Camera, Renderer, ResizeObserver,
   RAF loop. No GLTFLoader/OrbitControls (no GLB
   models in this pass). Loaded via import map, no
   bundler:
   <script type="importmap"> "three": "https://esm.sh/three@0.160.0"
   ═══════════════════════════════════════════ */
import * as THREE from 'three';

export class ThreeSceneManager {
  /**
   * @param {HTMLCanvasElement} canvas
   * @param {object} opts
   * @param {boolean} [opts.alpha=true]
   * @param {boolean} [opts.antialias=true]
   * @param {number}  [opts.fov=50]
   */
  constructor(canvas, opts = {}) {
    this.canvas = canvas;
    this.opts = {
      alpha: opts.alpha !== undefined ? opts.alpha : true,
      antialias: opts.antialias !== undefined ? opts.antialias : true,
      fov: opts.fov || 50,
    };

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this._rafId = null;
    this._clock = new THREE.Clock();
    this._animCbs = [];
    this._resizeObserver = null;
  }

  init() {
    const w = this.canvas.clientWidth || this.canvas.offsetWidth || 800;
    const h = this.canvas.clientHeight || this.canvas.offsetHeight || 600;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(this.opts.fov, w / h, 0.1, 1000);
    this.camera.position.set(0, 0, 15);

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: this.opts.alpha,
      antialias: this.opts.antialias,
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(w, h);

    this._resizeObserver = new ResizeObserver(() => this._onResize());
    this._resizeObserver.observe(this.canvas.parentElement || document.body);

    return this;
  }

  addAmbient(color = 0xffffff, intensity = 0.6) {
    this.scene.add(new THREE.AmbientLight(color, intensity));
    return this;
  }

  /** @param {(delta: number, elapsed: number) => void} fn */
  onAnimate(fn) {
    this._animCbs.push(fn);
  }

  start() {
    this._clock.start();
    this._loop();
    return this;
  }

  stop() {
    if (this._rafId) cancelAnimationFrame(this._rafId);
    this._rafId = null;
  }

  _loop() {
    this._rafId = requestAnimationFrame(() => this._loop());
    const delta = this._clock.getDelta();
    const elapsed = this._clock.getElapsedTime();
    this._animCbs.forEach((fn) => fn(delta, elapsed));
    this.renderer.render(this.scene, this.camera);
  }

  _onResize() {
    const parent = this.canvas.parentElement;
    if (!parent) return;
    const w = parent.clientWidth;
    const h = parent.clientHeight;
    // guard against ResizeObserver feedback loops (setSize can itself
    // change layout, re-triggering the observer) — no-op on unchanged size.
    if (!w || !h || (w === this._lastW && h === this._lastH)) return;
    this._lastW = w;
    this._lastH = h;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  }

  dispose() {
    this.stop();
    if (this._resizeObserver) this._resizeObserver.disconnect();
    this.scene.traverse((obj) => {
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) {
        const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
        mats.forEach((m) => m.dispose());
      }
    });
    this.renderer.dispose();
    this._animCbs = [];
  }
}
