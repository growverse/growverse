import type * as THREE from 'three';
import type { AvatarFactory } from '@/world/entities';
import * as nameTags from '@/world/nameTags';

export interface BotManagerInit {
  scene: THREE.Scene;
  glassRoomRef: { room: THREE.Group; w: number; d: number };
  avatarFactory: AvatarFactory;
}

/**
 * Manages simple bot avatars inside the glass room.
 */
export class BotManager {
  private scene?: THREE.Scene;
  private room?: THREE.Group;
  private w = 0;
  private d = 0;
  private factory?: AvatarFactory;
  private bots: THREE.Group[] = [];
  private enabled = false;
  private count = 0;
  readonly max = 50;

  /** Initialize manager with scene references. */
  init({ scene, glassRoomRef, avatarFactory }: BotManagerInit): void {
    this.scene = scene;
    this.room = glassRoomRef.room;
    this.w = glassRoomRef.w;
    this.d = glassRoomRef.d;
    this.factory = avatarFactory;
  }

  /** Enable or disable bot spawning. */
  setEnabled(enabled: boolean): void {
    if (this.enabled === enabled) return;
    this.enabled = enabled;
    if (enabled) this.apply();
    else this.clear();
  }

  /** Set desired bot count (clamped 0..50). */
  setCount(n: number): void {
    const c = Math.min(this.max, Math.max(0, n));
    this.count = c;
    if (this.enabled) this.apply();
  }

  /** Update bots each frame. */
  update(dt: number): void {
    if (!this.enabled) return;
    for (const bot of this.bots) {
      bot.rotation.y += dt * 0.1;
    }
  }

  /** Remove all bots and clear references. */
  dispose(): void {
    this.clear();
    this.scene = undefined;
    this.room = undefined;
    this.factory = undefined;
  }

  private apply(): void {
    if (!this.scene || !this.room || !this.factory) return;
    while (this.bots.length < this.count) {
      const bot = this.factory.create();
      const index = this.bots.length + 1;
      const id = `bot-${index}`;
      const name = `Bot - #${index}`;
      bot.userData.userId = id;
      bot.userData.name = name;
      const cx = this.room.position.x;
      const cz = this.room.position.z;
      const x = cx + (Math.random() - 0.5) * this.w;
      const z = cz + (Math.random() - 0.5) * this.d;
      bot.position.set(x, 1, z);
      this.scene.add(bot);
      this.bots.push(bot);
      const tagId = nameTags.register(bot, name);
      bot.userData.tagId = tagId;
    }
    while (this.bots.length > this.count) {
      const bot = this.bots.pop();
      if (bot) {
        nameTags.unregisterByObject(bot);
        this.scene.remove(bot);
      }
    }
  }

  private clear(): void {
    if (this.scene) {
      for (const bot of this.bots) {
        this.scene.remove(bot);
        nameTags.unregisterByObject(bot);
      }
    }
    this.bots = [];
  }
}
