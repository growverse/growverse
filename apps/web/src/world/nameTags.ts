import * as THREE from 'three';

interface TagEntry {
  obj: THREE.Object3D;
  el: HTMLDivElement;
}

const tags = new Map<string, TagEntry>();
let root: HTMLDivElement | null = null;
let counter = 0;
const tmp = new THREE.Vector3();

export function mountNameTagsRoot(): void {
  if (root) return;
  root = document.createElement('div');
  root.id = 'nameTags-root';
  root.style.position = 'fixed';
  root.style.left = '0';
  root.style.top = '0';
  root.style.pointerEvents = 'none';
  root.style.zIndex = '6';
  document.body.appendChild(root);
}

export function unmountNameTagsRoot(): void {
  if (root && root.parentNode) {
    root.parentNode.removeChild(root);
  }
  root = null;
  tags.clear();
}

export function register(obj: THREE.Object3D, label: string): string {
  if (!root) mountNameTagsRoot();
  const el = document.createElement('div');
  el.className = 'name-tag hidden';
  el.textContent = label;
  root!.appendChild(el);
  const id = `tag-${++counter}`;
  tags.set(id, { obj, el });
  return id;
}

export function unregister(tagId: string): void {
  const entry = tags.get(tagId);
  if (!entry) return;
  if (entry.el.parentNode) entry.el.parentNode.removeChild(entry.el);
  tags.delete(tagId);
}

export function unregisterByObject(obj: THREE.Object3D): void {
  for (const [id, entry] of Array.from(tags.entries())) {
    if (entry.obj === obj) unregister(id);
  }
}

export function update(camera: THREE.Camera): void {
  for (const { obj, el } of tags.values()) {
    obj.getWorldPosition(tmp);
    tmp.y += 3.2;
    tmp.project(camera);
    const out = Math.abs(tmp.x) > 1 || Math.abs(tmp.y) > 1 || tmp.z > 1;
    if (out) {
      el.classList.add('hidden');
      continue;
    }
    el.classList.remove('hidden');
    const x = (tmp.x * 0.5 + 0.5) * window.innerWidth;
    const y = (-tmp.y * 0.5 + 0.5) * window.innerHeight;
    el.style.transform = `translate(-50%, -100%) translate(${x}px, ${y}px)`;
  }
}
