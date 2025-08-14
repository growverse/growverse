// Global type definitions for the Growverse project

declare global {
  interface Window {
    // Add any global window properties if needed in the future
  }
}

// Avatar user data structure
export interface AvatarUserData {
  vel?: THREE.Vector3;
  animBlend?: number;
  swingTime?: number;
  limbs?: {
    aL: THREE.Group;
    aR: THREE.Group;
    lL: THREE.Group;
    lR: THREE.Group;
  };
}

// Extend THREE.Object3D to include our custom userData
declare module 'three' {
  interface Object3D {
    userData: AvatarUserData & { [key: string]: unknown };
  }
}

declare module '*.css';

export {};
