# UI Components Specification - Pink Mystique Theme

## Component Library Overview

**Design System:** Pink Mystique - tailored for zodiac prediction app with
feminine mystical aesthetics

## Core Components

### Question Card Component

**Purpose:** Display individual survey questions with consistent pink styling

**Variants:**

- Standard question (text + multiple choice)
- Category transition card (decorative with pink gradients)
- Loading placeholder (pink shimmer effect)

**States:**

- Default (white background, pink border)
- Hover (subtle pink glow)
- Loading (pink shimmer animation)
- Error (pink error border with gentle messaging)

**Usage Guidelines:** Always maintain 16px padding, ensure 44px minimum touch
targets, pink accent colors for interactive elements

### Progress Component

**Purpose:** Show survey completion progress with engaging pink visualization

**Variants:**

- Linear progress bar (pink gradient fill)
- Circular progress (for loading states)
- Step indicator (category navigation)

**States:**

- In-progress (animated pink fill)
- Complete (gold checkmark on pink background)
- Upcoming (light pink outline)

**Usage Guidelines:** Always visible during survey, smooth animations between
states, percentage text in dark pink

### Result Card Component

**Purpose:** Display zodiac characteristics and predictions with mystical pink
design

**Variants:**

- Primary result (large card with zodiac symbol)
- Trait card (smaller cards for characteristics)
- Alternative result (muted pink for secondary predictions)

**States:**

- Revealed (slide-in animation with pink effects)
- Interactive (hover states for detailed views)
- Shared (special pink frame for social sharing)

**Usage Guidelines:** Maintain mystical atmosphere with pink gradients, ensure
readability with sufficient contrast

## Color Palette

| Color Type    | Hex Code | Usage                                              |
| ------------- | -------- | -------------------------------------------------- |
| Primary Pink  | #E91E63  | Main CTA buttons, progress bars, active states     |
| Soft Pink     | #F8BBD9  | Background gradients, hover states, gentle accents |
| Rose Gold     | #E8B4CB  | Secondary buttons, borders, decorative elements    |
| Deep Pink     | #AD1457  | Text emphasis, selected states, important alerts   |
| Dusty Pink    | #F3E5F5  | Background washes, card backgrounds, subtle areas  |
| Mystical Gold | #FFD700  | Accent details, star elements, premium features    |

## Typography

#### Font Families

- **Primary:** 'Poppins' - Modern, friendly, excellent readability
- **Secondary:** 'Dancing Script' - For mystical headers and decorative text
- **Monospace:** 'Fira Code' - For technical elements (minimal usage)

#### Type Scale

| Element         | Size | Weight | Line Height |
| --------------- | ---- | ------ | ----------- |
| H1 (Hero)       | 32px | 600    | 1.2         |
| H2 (Section)    | 24px | 500    | 1.3         |
| H3 (Card Title) | 20px | 500    | 1.4         |
| Body Text       | 16px | 400    | 1.6         |
| Small Text      | 14px | 400    | 1.5         |
| CTA Button      | 18px | 600    | 1.4         |

## Responsive Breakpoints

| Breakpoint | Min Width | Max Width | Target Devices                        |
| ---------- | --------- | --------- | ------------------------------------- |
| Mobile     | 320px     | 767px     | iPhone, Android phones, small devices |
| Tablet     | 768px     | 1023px    | iPad, Android tablets, small laptops  |
| Desktop    | 1024px    | 1439px    | Laptops, desktop monitors             |
| Wide       | 1440px    | -         | Large monitors, ultra-wide displays   |

## Animation Guidelines

### Pink Mystique Motion Language:

- **Ethereal Flow:** Smooth, floating animations that feel magical
- **Gentle Transitions:** Soft easing curves, never harsh or jarring
- **Progressive Disclosure:** Content reveals feel like unfolding secrets
- **Pink Particle Effects:** Subtle pink sparkles and glow effects
- **Organic Movement:** Curves and natural motion paths over linear

### Key Animations

- **Survey Progress:** Pink liquid fill animation (Duration: 800ms, Easing:
  ease-out)
- **Question Transitions:** Card flip with pink glow effect (Duration: 600ms,
  Easing: cubic-bezier)
- **Answer Selection:** Pink ripple effect with checkmark reveal (Duration:
  400ms, Easing: ease-in-out)
- **Category Transitions:** Pink star constellation morphing (Duration: 1200ms,
  Easing: ease-in-out)
- **Loading States:** Pink breathing glow with rotating sparkles (Duration:
  2000ms, Easing: infinite)
- **Results Reveal:** Zodiac symbol constellation formation (Duration: 3000ms,
  Easing: dramatic)
- **Micro-interactions:** Button hover pink glow (Duration: 200ms, Easing:
  ease-out)

## Accessibility Requirements

**Visual:**

- Color contrast ratios: 4.5:1 minimum for normal text, 3:1 for large text
- Focus indicators: 2px pink outline for all interactive elements
- Text sizing: Responsive typography, 200% zoom support without horizontal
  scroll

**Interaction:**

- Keyboard navigation: Full survey completable via keyboard only
- Screen reader support: Semantic HTML, proper ARIA labels, progress
  announcements
- Touch targets: 44px minimum size, adequate spacing between interactive
  elements

## Implementation Notes

- All components should be built with TypeScript for type safety
- Use CSS-in-JS or CSS modules for component styling
- Ensure all animations respect `prefers-reduced-motion` settings
- Test components across all supported breakpoints
- Validate color contrast in both light and dark modes (if applicable)
