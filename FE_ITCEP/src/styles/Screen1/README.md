# Screen1 Styles Organization

## Overview

Cấu trúc CSS cho Screen1 đã được tổ chức lại để dễ quản lý và bảo trì hơn. Thay vì có tất cả CSS trong một file lớn, chúng tôi đã chia nó thành các module nhỏ theo chức năng của component.

## Folder Structure

```
src/
├── components/
│   └── making_mats/
│       └── Screen1/
│           ├── index.tsx                    (Main component)
│           ├── game.types.ts
│           ├── useGameState.ts
│           ├── Basket.tsx
│           ├── FarmerNPC.tsx
│           ├── HintPanel.tsx
│           ├── HUD.tsx
│           ├── Phase3Plant.tsx
│           ├── RopeBundle.tsx
│           ├── ScorePop.tsx
│           ├── SedgePlant.tsx
│           └── SpeechBubble.tsx
│
└── styles/
    └── Screen1/
        ├── Screen1.module.css               (Main import file)
        ├── index.css                        (All imports)
        ├── animations.css                   (Keyframe animations)
        ├── game.css                         (Root, background, scene)
        ├── farmer.css                       (Farmer animations & styles)
        ├── bubble.css                       (Speech bubble)
        ├── hud.css                          (Top HUD bar)
        ├── ui.css                           (Intro, buttons, hint panel)
        ├── plants.css                       (Plant styling)
        ├── sickle.css                       (Sickle tool)
        ├── progress.css                     (Progress bar)
        ├── basket.css                       (Basket & score pop)
        ├── rope.css                         (Rope bundle)
        └── result.css                       (Result card & flip cards)
```

## File Organization

### Animations (animations.css)

Chứa tất cả @keyframes animations:

- `fadeScene` - Fade in animations
- `sway` - Plant swaying
- `breathe`, `talk`, `jump`, `bigJump`, `shake` - Farmer animations
- `bubblePop`, `popUp`, `badgePop` - UI pop animations
- `plantFall`, `plantBounce` - Plant physics
- `pulse`, `blink`, `sicklePulse`, `basketPulse` - Pulse effects

### Game (game.css)

- `.root` - Main container (100vh, fullscreen)
- `.bgPhoto` - Background image
- `.bgOverlay` - Overlay layer
- `.scene` - Scene container

### Farmer (farmer.css)

- `.farmerWrap` - Farmer container
- `.farmerImg` - Farmer image styling
- Animation states: `idle`, `talking`, `happy`, `excited`, `sad`

### Bubble (bubble.css)

- `.bubble` - Speech bubble styling
- `.bubbleHint` - Hint text inside bubble

### HUD (hud.css)

- `.hud` - Top bar container
- `.hudLeft`, `.hudCenter`, `.hudRight` - Layout sections
- `.badgeGold`, `.badgeOutline` - Badge styles
- `.starsRow`, `.starOn`, `.starOff` - Star display
- `.hintBtn` - Hint button styling

### UI (ui.css)

- `.hintPanel` - Hint panel popup
- `.hintTitle`, `.hintRow` - Hint panel content
- `.introBadge` - Intro screen message
- `.startBtn` - Start button with hover/active states

### Plants (plants.css)

- `.plantWrap` - Plant container
- `.plant_selected`, `.plant_wrongCut`, `.plant_cut` - Plant states
- `.checkBadge` - Checkmark badge on correct plants
- `.plantLabel` - Plant type label
- `.plantDepthFar`, `.plantDepthMid`, `.plantDepthNear`, `.plantDepthClose` - Depth scaling
- `.plantShadow` - Ground shadow

### Sickle (sickle.css)

- `.sickleContainer` - Main sickle holder
- `.sickleSVG` - Sickle SVG styling
- `.sickleLabel` - "Sickle" label
- `.sickleGhost`, `.sickleFloat`, `.sickleCursor` - Dragging states
- `.sickleHint` - Hint text for sickle

### Progress (progress.css)

- `.progressWrap` - Progress bar container
- `.progressLabel` - "Progress" text
- `.progressTrack` - Background bar
- `.progressFill` - Animated fill bar

### Basket (basket.css)

- `.basketWrap` - Basket container
- `.basketGlow` - Glow effect when plant dropped
- `.basketLabel` - "Basket" label with pulse animation
- `.scorePop` - Floating score text

### Rope (rope.css)

- `.ropeBundle` - Rope bundle container
- `.ropeBundleGlow` - Glow when collecting
- `.ropeBundleRed` - Error state
- `.bundleBody` - Rope visual

### Result (result.css)

- `.resultCard` - Result screen card
- `.resultTitle`, `.resultScore`, `.resultScoreSub` - Title and score display
- `.resultStars` - Star rating display
- `.resultStats`, `.knowledgeTitle` - Stats section
- `.flipCard`, `.flipInner`, `.flipFront`, `.flipBack` - Flip card component
- `.resultBtns` - Button group
- `.btnRetry`, `.btnNext` - Individual buttons

## How to Use

### Import in Components

Tất cả các component trong Screen1 đều import từ vị trí CSS module mới:

```tsx
import styles from "../../../styles/Screen1/Screen1.module.css";

export default function MyComponent() {
  return <div className={styles.myClass}>...</div>;
}
```

### CSS Module Export

File `Screen1.module.css` trong styles folder import tất cả CSS riên lẻ và export tất cả class names.

### Adding New Styles

Nếu thêm style mới:

1. Tạo file CSS mới hoặc thêm vào file hiện có
2. Thêm import vào `Screen1.module.css` hoặc `index.css`
3. Sử dụng trong component qua `styles.className`

## Benefits

✅ **Better Organization** - CSS được chia theo chức năng  
✅ **Easier Maintenance** - Tìm kiếm và chỉnh sửa CSS nhanh hơn  
✅ **Scalability** - Dễ thêm style mới cho các feature mới  
✅ **Separation of Concerns** - Mỗi file có một trách nhiệm duy nhất  
✅ **Reusability** - Classes có thể tái sử dụng giữa các component

## Notes

- Tất cả CSS Module imports point tới `../../../styles/Screen1/Screen1.module.css`
- Font import được giữ trong `game.css`
- Animations được tập trung trong `animations.css` để dễ quản lý
