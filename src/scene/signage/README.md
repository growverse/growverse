# Growverse Signage

Utilities for creating modular 3D text signs within the scene.

## GrowverseSign

```ts
import { createGrowverseSign } from '@/scene/signage/GrowverseSign';

const sign = await createGrowverseSign(THREE, scene, { text: 'Growverse' });
// in your render loop:
// sign.update(dt);
// on cleanup:
// sign.dispose();
```
