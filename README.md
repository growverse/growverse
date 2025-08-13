# Growverse - Modular Three.js Garden

A modular React + TypeScript project built with Vite, converted from a single-file Three.js application. Features a 3D garden environment with avatars, buildings, portals, and interactive systems.

## Features

- **3D Garden Environment**: Circular garden with stage, glass room, and NFT building
- **Avatar System**: Third-person character with walking animation and collision detection
- **Portal System**: Teleport between different garden instances
- **Dynamic Marquee**: Scrolling text display with real-time information
- **Day/Night Cycle**: Automatic lighting transitions
- **Adaptive Quality**: Performance-based rendering adjustments

## Technology Stack

- **React 18** with TypeScript
- **Three.js** for 3D graphics
- **Vite** for development and building
- **CSS3** for UI styling

## Project Structure

```
src/
  main.tsx                  # Bootstrap React and Three.js
  app/App.tsx               # React shell component
  core/
    utils.ts                # Math utilities (deg, fmt, lerp, clamp01)
    scene.ts                # Three.js scene setup with camera, renderer, controls
    input.ts                # Keyboard input handling
  world/
    garden.ts               # Circular garden with stage and board
    glassroom.ts            # Glass building with collision detection
    nftBuilding.ts          # Purple NFT/certificate building
    entities.ts             # Avatar factory and animation
    worldfx.ts              # Day/night cycle, fog, distant props
  systems/
    portal.ts               # Portal system and preset controller
    marquee.ts              # Scrolling text marquee system
  ui/
    PortalUI.tsx            # Portal selection interface
    NameTag.tsx             # Avatar name tag overlay
    HUD.tsx                 # Coordinate display
    Dock.tsx                # Placeholder for future features
  styles/
    global.css              # All CSS styles from original
```

## Development

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
npm install
```

### Running the Development Server

```bash
npm run dev
```

Open your browser to the URL shown in terminal (typically `http://localhost:5173`). The app will load via `demo.html` - **this is separate from the original `index.html` which remains unchanged**.

### Other Commands

```bash
# Type checking
npm run typecheck

# Build for production
npm run build

# Preview production build
npm run preview
```

## Controls

- **W/A/S/D**: Move avatar
- **SPACE**: Jump
- **Mouse**: Camera control (orbit around avatar)
- **Arrow Keys**: Navigate portal list (when near portal)
- **ESC**: Close portal UI
- **Enter**: Teleport to selected destination

## Migration Strategy

This project represents Phase 1 of migrating from the single-file `index.html` to a modular architecture:

### Current State

- ✅ `index.html` remains completely unchanged at repository root
- ✅ New modular codebase runs via `demo.html` with identical functionality
- ✅ All behaviors, visuals, and interactions preserved exactly
- ✅ TypeScript types for better development experience
- ✅ React used minimally as overlay host

### Future Migration Plans

1. **Phase 2**: Gradually replace `index.html` usage with the modular version
2. **Phase 3**: Add new features using the modular architecture
3. **Phase 4**: Remove the original `index.html` once fully migrated

### Key Preservation Points

- All Three.js logic remains identical to original
- Same portal destinations and teleport behavior
- Identical avatar movement, collision detection, and animation
- Same day/night cycle timing and visual effects
- Exact marquee positioning and scrolling behavior
- All original CSS classes and styling preserved

## Architecture Notes

### Module Mapping

Each inline `<script type="module" id="...">` from the original has been converted to a TypeScript module:

- `mod-utils` → `src/core/utils.ts`
- `mod-scene` → `src/core/scene.ts`
- `mod-input` → `src/core/input.ts`
- `mod-garden` → `src/world/garden.ts`
- `mod-glassroom` → `src/world/glassroom.ts`
- `mod-nft-building` → `src/world/nftBuilding.ts`
- `mod-entities` → `src/world/entities.ts`
- `mod-worldfx` → `src/world/worldfx.ts`
- `mod-portal` → `src/systems/portal.ts`
- `mod-marquee` → `src/systems/marquee.ts`

### React Integration

React is used minimally to:

- Render UI overlays (HUD, name tag, portal interface)
- Provide DOM structure for Three.js systems to interact with
- Organize component structure for future expansion

The Three.js world and all game logic remain in pure JavaScript/TypeScript modules, with React serving as a thin presentation layer.

### Type Safety

All modules include proper TypeScript interfaces and types while maintaining the exact same runtime behavior as the original implementation.

## Troubleshooting

### Build Issues

If you encounter TypeScript errors:

```bash
npm run typecheck
```

**Note**: There may be a TypeScript warning about OrbitControls import path. This is a known issue with Three.js TypeScript definitions but does not affect runtime functionality.

### Runtime Issues

- Ensure all DOM elements have the correct IDs for Three.js systems
- Check browser console for detailed error messages
- Verify that the development server is running on the correct port

### Performance

The adaptive quality system automatically adjusts rendering resolution and shadow quality based on framerate. If experiencing performance issues, this should engage automatically to maintain 45+ FPS.

## Verification

The conversion has been successfully completed with:

- ✅ All modules ported from inline scripts to TypeScript modules
- ✅ React components for UI overlays
- ✅ Identical functionality and behavior to original `index.html`
- ✅ Successful build and preview generation
- ✅ Original `index.html` remains completely unchanged

## Contributing

When adding new features:

1. Keep `index.html` unchanged until migration is complete
2. Follow the established module structure
3. Add proper TypeScript types
4. Maintain visual and behavioral consistency
5. Test both development and production builds

## License

This project maintains the same license as the original implementation.
