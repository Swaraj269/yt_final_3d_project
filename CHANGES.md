# Changes Summary

The site has been reshaped into a responsive portfolio with a scroll-controlled Three.js carousel, redesigned About and project pages, and updated navigation. It also adds per-image gray fallbacks and updates the frontend dependencies and GLSL shaders.

## Original project preview

![Original layout](src/assets/original.gif)

## Responsive previews

![Responsive layout](src/assets/responsive.gif)


### Offline image fallbacks

When remote images are offline or fail to load, gray placeholders remain visible while the rest of the page and carousel continue rendering.

![Large-screen image fallback](src/assets/big_screen_place_holder.gif)

## Detailed Breakdown

### Navigation and page flow

- `src/App.jsx` resets scroll on route changes, hides the navbar while scrolling down on desktop About and project pages, and adds a Back to top control that scrolls to a document-top marker.
- `src/components/Home.jsx` and `src/components/Landing.jsx` add the scroll-to-explore interaction and preserve the return-to-carousel flow from project pages.
- `src/components/Three.jsx` configures the sticky canvas and its camera.

### Three.js carousel and images

- `src/components/Experience.jsx` links carousel rotation to scroll direction, animates its reveal, adapts its layout to viewport size, and keeps the images clear of the footer.
- Each carousel image loads independently and retains a light-gray shader texture if its remote image fails. Offline requests are skipped and retried after connectivity returns.
- `src/components/PlaceholderImage.jsx` provides separate loading and offline placeholders for About and project images and retries them when the browser comes back online.
- The vertex and fragment shaders now use GLSL 3 inputs and outputs and sample images with `texture()`. The fragment shader also applies a small exposure lift.

### About, projects, and responsive styling

- `src/components/About.jsx` provides a responsive profile, contact details, and portrait image.
- `src/components/ProjectDetail.jsx` adds project captions, a collage layout, and previous, next, and return-to-carousel navigation. The project title changed from Urban Cartography to Architecture Study.
- `src/index.css` defines the shared typography and color system, page layouts, mobile breakpoints, safe-area spacing, reduced-motion behavior, and image placeholders.
- `index.html` sets `viewport-fit=cover` and disables shrink-to-fit for mobile viewport sizing.
- `src/main.jsx` tracks the visible viewport width for Safari resizing and filters `console.warn` messages containing `THREE.Clock` while forwarding other warnings.

### Dependencies and tooling

- `package.json` and `package-lock.json` update Three.js to `^0.186.1` and refresh React, React DOM, React Router, React Three Fiber, Drei, Vite, Tailwind CSS, and related tooling.
- `vite.config.js` opens the browser when the development server starts.

## Impact Assessment

- Remote images still depend on the image host. Gray placeholders cover failed loads, but browser-generated network errors may still appear in DevTools.
- The global `console.warn` filter suppresses warnings containing `THREE.Clock`; remove it when the dependency stack no longer emits that warning so future Clock warnings remain visible.
- `ProjectDetail.jsx` indexes its project data from the route parameter without validating it. An invalid project ID can leave the project details undefined and cause a render error.
