import type * as THREE from 'three';

/** Options for constructing the StageRig. */
export type StageRigOptions = {
  /** Existing stage mesh. */
  stage: THREE.Mesh;
  /** Top Y coordinate of the stage (stage.position.y + STAGE_H/2). */
  stageTopY: number;
  /** Direction toward the audience (default +X). */
  audienceDir?: THREE.Vector3;
  /** Optional color overrides. */
  colors?: {
    metal?: number;
    panel?: number;
    accent?: number;
  };
};

/** Public API returned from {@link createStageRig}. */
export type StageRig = {
  /** Root group containing all stage rig elements. */
  group: THREE.Group;
  /** Update teleprompter text. */
  setTeleprompterText: (text: string) => void;
  /** Countdown timer controls. */
  timer: {
    start: (ms?: number) => void;
    pause: () => void;
    resume: () => void;
    reset: (ms?: number) => void;
    getRemainingMs: () => number;
  };
  /** Lighting rig controls. */
  lightRig: {
    enable: (on: boolean) => void;
    setIntensity: (i: number) => void;
  };
  /** Per-frame update hook (expects dt in seconds). */
  update: (dt: number) => void;
};
