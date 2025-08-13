export interface Keys {
  w: boolean;
  a: boolean;
  s: boolean;
  d: boolean;
  space: boolean;
}

export function createInput(): Keys {
  const keys: Keys = { w: false, a: false, s: false, d: false, space: false };
  
  const mapKey = (e: KeyboardEvent): string => {
    const k = e.key;
    if (k === ' ' || k === 'Spacebar') return 'space';
    const low = (k || '').toLowerCase();
    return low === 'space' ? 'space' : low;
  };
  
  window.addEventListener('keydown', (e) => {
    const k = mapKey(e);
    if (k in keys) {
      (keys as any)[k] = true;
      if (k === 'space') e.preventDefault();
    }
  });
  
  window.addEventListener('keyup', (e) => {
    const k = mapKey(e);
    if (k in keys) {
      (keys as any)[k] = false;
      if (k === 'space') e.preventDefault();
    }
  });
  
  return keys;
}
