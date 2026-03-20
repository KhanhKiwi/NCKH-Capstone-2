# Screen 5 - Level 5 "Dệt Chiếu" (Weaving Mat) - Game Interface

## 📋 Overview
Complete rhythm game interface for Level 5 "Dệt Chiếu" - a Vietnamese cultural rhythm game similar to Audition Online, themed around traditional mat weaving.

## 🎮 Components

### 1. GameplayScreen.tsx
**Main gameplay interface** - 4-lane rhythm game with falling notes

**Features:**
- 4 vertical lanes (A, S, D, F keys)
- Falling notes with different types: fiber, compress, pattern1, pattern2
- Real-time score and combo tracking
- Progress bar showing completion percentage
- Timing feedback (Perfect/Good/Miss)
- Character animation in bottom left
- Win condition: 100% progress
- Lose condition: 15 missed notes

**Key Stats:**
- NOTE_SPEED: 2px per frame
- PERFECT_THRESHOLD: 50px
- GOOD_THRESHOLD: 100px
- TARGET_POSITION: 850px (hit zone)
- Note generation interval: 800ms

### 2. SuccessScreen.tsx
**Victory celebration screen** - Shows when player completes the mat

**Features:**
- Completed mat visualization with glowing animation
- Confetti particle effects (40 particles in warm colors)
- Celebratory character animation
- Achievement list display
- "Hoàn thành xuất sắc!" (Perfect completion!) message
- Two buttons: Continue & Menu

### 3. FailScreen.tsx
**Failure/retry screen** - Shows when player gets 15 misses

**Features:**
- Incomplete mat with scattered threads visualization
- Encouraging character with heart animation
- "Thử lại nhé!" (Try again!) message
- Tips section with 4 gameplay hints
- Two buttons: Retry & Menu

### 4. index.tsx
**Screen router wrapper** - Manages screen transitions

## 🎨 Color Palette

| Color | Hex Code | Usage |
|-------|----------|-------|
| Main Background | #F0E0C0 | Screen background, primary space |
| Highlight | #E8D5A8 | Secondary backgrounds, light accents |
| Brown/Bamboo | #C9A66B | Progress bar, button, text |
| Green/Coir | #A8C9A0 | Pattern elements, lane icons |
| Gold/Warm | #E8A520 | Perfect feedback, primary buttons |

## 🕹️ Gameplay Controls

| Key | Lane | Action |
|-----|------|--------|
| A | 1 | Luồn sợi ngang (Horizontal fiber) |
| S | 2 | Nén sợi (Compress) |
| D | 3 | Giữ hoa văn 1 (Pattern 1) |
| F | 4 | Giữ hoa văn 2 (Pattern 2) |

## 📊 Scoring System

| Hit Type | Points | Progress | Effect |
|----------|--------|----------|--------|
| Perfect | +100 | +2% | Yellow glow, combo +1 |
| Good | +50 | +1% | Brown text, combo +1 |
| Miss | 0 | 0% | Red text, combo reset |

## 🔧 Integration Guide

### Basic Usage
```tsx
import GameplayScreen from './components/making_mats/Screen5/GameplayScreen';
import SuccessScreen from './components/making_mats/Screen5/SuccessScreen';
import FailScreen from './components/making_mats/Screen5/FailScreen';

// Use in your router
<Route path="/level5" element={<GameplayScreen />} />
<Route path="/level5/success" element={<SuccessScreen />} />
<Route path="/level5/fail" element={<FailScreen />} />
```

### With Router Setup
If using the index.tsx wrapper for nested routing:
```tsx
import Screen5 from './components/making_mats/Screen5';

<Route path="/level5/*" element={<Screen5 />} />
```

## ⚙️ Dependencies

- **motion/react** - Framer Motion for animations
- **react-router** - Navigation and routing
- **lucide-react** - Icons (Sparkles, Music, Trophy, Heart, RotateCcw)
- **Tailwind CSS** - Styling framework

## 🎨 Visual Elements

### Background
- Vietnamese countryside landscape (Unsplash image)
- Gradient overlay with warm golden tones
- Opacity 40% with blur effect

### Character
- Vietnamese girl in traditional áo bà ba
- Circular portrait with border
- Floating animation
- Different states (playing, celebrating, encouraging)

### UI Elements
- 4 lane sections with icon indicators
- Target hit zone with glow border
- Progress bar with animated fill
- Score display with combo counter
- Timing feedback popup

## 🐛 Technical Notes

### State Management
- Uses React hooks (useState, useEffect, useCallback)
- Note positions updated every 16ms (60fps)
- Notes generated every 800ms

### Performance
- AnimatePresence for efficient note mounting/unmounting
- Cleanup intervals in useEffect cleanup functions
- Optimized re-renders with key-based filtering

### Accessibility
- Keyboard controls (A, S, D, F)
- Vietnamese text labels throughout
- Clear visual feedback for all actions

## 📱 Responsive Design
- Full screen (vh/vw units)
- Fixed positioning for overlay elements
- Relative positioning for game area
- Flex layouts for responsive alignment

## 🚀 Future Enhancements

Potential improvements:
- Sound effects and music system
- Difficulty levels (Easy, Normal, Hard)
- High score tracking/leaderboard
- Different mat designs/patterns
- Tutorial/practice mode
- Power-ups or special items
- Multiplayer/competitive modes

## 📝 File Structure

```
Screen5/
├── a.tsx ......................... Main export (GameplayScreen)
├── index.tsx ..................... Router wrapper
├── GameplayScreen.tsx ............ Main gameplay (1000+ lines)
├── SuccessScreen.tsx ............ Victory screen (300+ lines)
└── FailScreen.tsx ............... Fail screen (250+ lines)
```

## 🎯 Design Philosophy

- **Cultural Authenticity**: Vietnamese traditional mat weaving theme
- **Playful Aesthetic**: Cartoon-like, friendly, approachable
- **Warm Atmosphere**: Golden hour lighting, natural earth tones
- **Educational**: Teaches about Vietnamese handicraft tradition
- **Engaging**: Rhythm game mechanics familiar to players

## 📞 Support Notes

### Common Issues

**Issue**: Notes not appearing
- Check if isPlaying state is true
- Verify KEY mapping (A, S, D, F)

**Issue**: Navigation not working
- Ensure Router is properly set up in App.tsx
- Check route paths match navigation calls

**Issue**: Animations stuttering
- Verify Framer Motion is properly installed
- Check for performance issues with note rendering

---

**Created**: Screen 5 - Level 5 Dệt Chiếu Game Interface
**Theme**: Traditional Vietnamese Mat Weaving
**Mechanic**: Audition-style Rhythm Game
**Status**: ✅ Complete and Ready for Integration
