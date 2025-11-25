# Design Document

## Overview

The responsive image handling feature will be implemented as a custom React component called `ResponsiveImage` that intelligently switches between desktop and mobile image variants based on viewport width. The component will use React hooks to monitor window resize events and CSS media queries for optimal performance.

## Architecture

The solution follows a component-based architecture with the following layers:

1. **Presentation Layer**: `ResponsiveImage` component that renders the appropriate image
2. **Logic Layer**: Custom hook `useResponsiveImage` that handles viewport detection and image path resolution
3. **Configuration Layer**: Constants defining breakpoints and image prefixes

## Components and Interfaces

### ResponsiveImage Component

A reusable React component that accepts a base image name and automatically renders the correct variant.

**Props Interface:**

```typescript
{
  baseName: string;        // Base filename without prefix (e.g., "entry.png", "map1.png")
  alt: string;             // Alt text for accessibility
  className?: string;      // Optional CSS classes
  style?: CSSProperties;   // Optional inline styles
}
```

**Behavior:**

- Accepts base filename without "d-" or "m-" prefix
- Automatically prepends correct prefix based on viewport width
- Constructs full path to image in public directory
- Re-renders when viewport crosses 900px breakpoint

### useResponsiveImage Hook

A custom React hook that encapsulates the responsive logic.

**Interface:**

```typescript
function useResponsiveImage(baseName: string): string;
```

**Returns:** Full image path with appropriate prefix

**Implementation Details:**

- Uses `useState` to track current viewport width
- Uses `useEffect` to add/remove window resize listener
- Implements debouncing (150ms) to optimize resize event handling
- Calculates image path based on 900px breakpoint
- Cleans up event listeners on unmount

## Data Models

### Image Path Resolution

**Input:** Base filename (e.g., "entry.png")

**Output:** Full path with prefix

- Desktop (≥900px): "/d-entry.png"
- Mobile (<900px): "/m-entry.png"

**Constants:**

```javascript
const MOBILE_BREAKPOINT = 900;
const DESKTOP_PREFIX = "d-";
const MOBILE_PREFIX = "m-";
```

## Error Handling

1. **Missing Image Files:**

   - Browser will handle missing images with standard broken image display
   - Developer should ensure both d- and m- variants exist for each image

2. **Invalid Base Names:**

   - Component will still construct path, but image won't load
   - Console warning could be added in development mode

3. **Resize Event Performance:**
   - Debouncing prevents excessive re-renders
   - Cleanup function prevents memory leaks

## Testing Strategy

### Unit Tests

- Test `useResponsiveImage` hook returns correct path for different viewport widths
- Test debouncing behavior on rapid resize events
- Test cleanup of event listeners

### Integration Tests

- Test `ResponsiveImage` component renders correct image source
- Test image switching when viewport crosses breakpoint
- Test props are correctly passed to img element

### Manual Testing

- Verify images display correctly on desktop (≥900px)
- Verify images switch to mobile variants below 900px
- Test browser resize behavior
- Test on actual mobile devices
- Verify all d- and m- image pairs load correctly

## Implementation Notes

### CSS Approach (Alternative)

While the primary implementation uses JavaScript for flexibility, a CSS-only approach using media queries in the stylesheet could also work:

```css
.responsive-image-desktop {
  display: block;
}

.responsive-image-mobile {
  display: none;
}

@media (max-width: 899px) {
  .responsive-image-desktop {
    display: none;
  }

  .responsive-image-mobile {
    display: block;
  }
}
```

However, the JavaScript approach is preferred because:

- Single img element (better for accessibility)
- Avoids loading both images
- More flexible for future enhancements
- Easier to test and maintain

### Performance Considerations

- Debouncing resize events prevents excessive re-renders
- Only one image is loaded at a time
- Image switching is instant (no loading delay if cached)
- Component is lightweight with minimal overhead
