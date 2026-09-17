// Shared flags coordinating the passive scroll-position-based detection
// hooks with code that moves the page programmatically:
// - isScrollingInSection: set by the ServiceStatus wheel handler right
//   before it force-scrolls the window back into place, so the header
//   hide/show scroll handler can ignore that programmatic scroll instead
//   of reacting to it.
// - isNavigating: set by a nav-link click's animated scroll for its whole
//   800ms duration, so useScrollBehavior's passive section-detection loop
//   doesn't fight it with whatever intermediate section the animation is
//   currently passing over -- the click handler sets the final destination
//   directly once the animation settles, then clears this.
const scrollLock = { isScrollingInSection: false, isNavigating: false };
export default scrollLock;
