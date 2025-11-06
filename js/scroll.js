// scroll.js — wheel & touch-driven fullpage navigation
export const SWIPE_MIN_DISTANCE = 70; // px
export let lastScrollDirection = 'down'; // shared for spa.js animations

export function initScrollHandlers(loadPageFn) {
  const pageOrder = ['home', 'about', 'projects', 'experiences', 'contact'];
  let scrollCooldown = false;

  function scrollToPage(direction) {
    const current = window.location.hash.replace('#', '') || 'home';
    let idx = pageOrder.indexOf(current);
    if (direction === 'down' && idx < pageOrder.length - 1) idx++;
    else if (direction === 'up' && idx > 0) idx--;
    else return;

    // Update hash immediately
    window.location.hash = pageOrder[idx];
    // Immediately trigger loadPage manually
    loadPageFn(pageOrder[idx]);
  }

  // Mouse wheel
  window.addEventListener('wheel', (e) => {
    if (scrollCooldown || Math.abs(e.deltaY) < 5) return;
    scrollCooldown = true;
    scrollToPage(e.deltaY > 0 ? 'down' : 'up');
    setTimeout(() => { scrollCooldown = false; }, 900);
  }, { passive: false });

  // Touch swipe
  let touchStartY = null;
  window.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) touchStartY = e.touches[0].clientY;
  });
  window.addEventListener('touchend', (e) => {
    if (touchStartY === null || scrollCooldown) return;
    const touchEndY = (e.changedTouches && e.changedTouches[0].clientY) || null;
    if (touchEndY !== null) {
      const deltaY = touchEndY - touchStartY;
      if (Math.abs(deltaY) > SWIPE_MIN_DISTANCE) {
        scrollCooldown = true;
        scrollToPage(deltaY < 0 ? 'down' : 'up');
        setTimeout(() => { scrollCooldown = false; }, 900);
      }
    }
    touchStartY = null;
  });
}
