# kanvas-animations

**Version:** 1.1.0 | **License:** MIT
**Author:** Brookside BI (plugins@brooksidebi.com)

## Purpose

This plugin helps create beautiful, performant web animations for React and TypeScript
applications. It exists because animation work requires specialized knowledge across
multiple libraries (Framer Motion, GSAP, React Spring, CSS animations) and domains
(physics-based motion, scroll interactions, 3D transforms, accessibility) -- knowledge
that is difficult to hold in working memory while also building features.

The plugin provides 6 specialized agents, 11 domain skills covering every animation
technique, and 12 commands for rapid animation generation. All output is performance-
optimized for 60fps with built-in `prefers-reduced-motion` accessibility support.

## Directory Structure

```
kanvas-animations/
  .claude-plugin/plugin.json
  CLAUDE.md / CONTEXT_SUMMARY.md
  agents/                        # 6 agents
  commands/                      # 12 commands
  skills/                        # 11 skills (subdirectories with SKILL.md)
```

## Agents

| Agent | Description |
|-------|-------------|
| animation-architect | Design animation systems and choreography |
| motion-designer | Creative effects and physics-based motion |
| performance-optimizer | Optimize for 60fps and accessibility |
| interaction-specialist | Micro-interactions and gesture animations |
| transition-engineer | Page transitions and layout animations |
| creative-effects-artist | Backgrounds, text, 3D effects, artistic treatments |

## Commands

### Core Commands

| Command | Description |
|---------|-------------|
| `/animate` | Generate animation from natural language description |
| `/animate-component` | Add animations to existing components |
| `/animate-preset` | Apply pre-built animation presets |
| `/animate-sequence` | Create choreographed animation sequences |
| `/animate-scroll` | Add scroll-triggered animations |
| `/animate-transition` | Create page transitions |
| `/animate-audit` | Audit for performance and accessibility |
| `/animate-export` | Export as reusable components |

### Creative Commands

| Command | Description |
|---------|-------------|
| `/animate-background` | Animated backgrounds (gradients, particles, aurora) |
| `/animate-text` | Text animations (typewriter, stagger, gradient) |
| `/animate-3d` | 3D effects (flip cards, tilt, cubes, parallax) |
| `/animate-effects` | Creative effects (glitch, morph, sparkle, glow) |

## Skills

### Core Animation Skills

- **framer-motion** -- Declarative React animations
- **gsap** -- Professional timeline animations
- **css-animations** -- Lightweight CSS keyframes
- **spring-physics** -- Natural, physics-based motion
- **scroll-animations** -- Scroll-triggered effects
- **svg-animations** -- Vector graphics and path animations

### Creative Animation Skills

- **background-animations** -- Gradients, particles, aurora, waves, blobs
- **accent-animations** -- Floating shapes, glows, sparkles, shimmer
- **creative-effects** -- Glitch, morph, liquid fills, magnetic, distortion
- **text-animations** -- Typewriter, character reveals, gradient text, scramble
- **3d-animations** -- Flip cards, tilt effects, cubes, parallax depth

## Animation Presets

**Entrance:** fade-in, fade-in-up, slide-in-left, scale-in, bounce-in, zoom-in
**Hover:** hover-lift, hover-scale, hover-glow, hover-tilt
**Attention:** pulse, bounce, shake, wobble, heartbeat, rubber-band
**Creative:** aurora, gradient-flow, particles, typewriter, glitch, sparkle

## Prerequisites

- React 18+
- TypeScript 5+
- One of: Framer Motion, GSAP, or React Spring

## Quick Start

```
/animate fade in from below with a bounce
/animate-background aurora --interactive
/animate-text typewriter --text "Welcome" --speed 80
/animate-3d flip-card --trigger hover
/animate-effects sparkle --count 5
/animate-audit                           # Check performance + a11y
```
