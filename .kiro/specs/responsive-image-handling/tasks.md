# Implementation Plan

- [ ] 1. Create the useResponsiveImage custom hook

  - Create a new file `src/hooks/useResponsiveImage.js`
  - Implement viewport width detection using window.innerWidth
  - Add window resize event listener with debouncing (150ms delay)
  - Return the correct image path based on 900px breakpoint
  - Ensure proper cleanup of event listeners on unmount
  - _Requirements: 1.1, 2.1, 3.1, 3.2_

- [ ] 2. Create the ResponsiveImage component

  - Create a new file `src/components/ResponsiveImage.jsx`
  - Use the useResponsiveImage hook to get the correct image path
  - Accept props: baseName, alt, className, and style
  - Render an img element with the resolved path and props
  - _Requirements: 1.2, 2.2, 2.3, 4.1, 4.2, 4.3_

- [ ] 3. Add responsive image constants configuration

  - Create a new file `src/config/imageConfig.js`
  - Define MOBILE_BREAKPOINT constant (900)
  - Define DESKTOP_PREFIX constant ('d-')
  - Define MOBILE_PREFIX constant ('m-')
  - Export all constants for use in hook and component
  - _Requirements: 1.1, 2.1, 3.1_

- [ ] 4. Update App.jsx to use ResponsiveImage component

  - Import the ResponsiveImage component
  - Replace existing static image references with ResponsiveImage components
  - Use base names "entry.png" and "map1.png" for the d-/m- image pairs
  - Pass appropriate alt text and className props
  - _Requirements: 1.1, 1.2, 2.1, 2.2, 4.3_

- [ ]\* 5. Add unit tests for useResponsiveImage hook

  - Create test file `src/hooks/useResponsiveImage.test.js`
  - Test hook returns desktop path when viewport >= 900px
  - Test hook returns mobile path when viewport < 900px
  - Test debouncing behavior on resize events
  - Test cleanup of event listeners
  - _Requirements: 1.1, 2.1, 3.1, 3.2_

- [ ]\* 6. Add component tests for ResponsiveImage
  - Create test file `src/components/ResponsiveImage.test.jsx`
  - Test component renders with correct src attribute
  - Test component passes through className and style props
  - Test component updates src when viewport changes
  - Test alt text is properly applied
  - _Requirements: 1.2, 2.2, 2.3, 3.3, 4.1, 4.2_
