// Shared flag mirroring the original page's global `isScrollingInSection` var:
// set by the ServiceStatus wheel handler right before it force-scrolls the
// window back into place, so the header hide/show scroll handler can ignore
// that programmatic scroll instead of reacting to it.
const scrollLock = { isScrollingInSection: false };
export default scrollLock;
