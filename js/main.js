// main.js — application bootstrap (ES module)
import { setupHamburgerMenu, handleNav } from './nav.js';
import { animateLoaderPercent, hideLoading } from './loader.js';
import { initTheme } from './theme.js';
import { pages, loadPage, updateSwipeArrowVisibility, prefetchPagesIdle } from './spa.js';
import { initScrollHandlers, lastScrollDirection } from './scroll.js';

function initApp() {
  try {
    console.log('main.js: initApp');
    // Initialize time-based theme/background
    initTheme();

    // Initial load: determine page
    let page = window.location.hash.replace('#', '') || 'home';

    // Lock scroll during load (base.css already hides scrolling; keep inline override for consistency)
    document.body.style.overflow = 'hidden';
    const hb = document.getElementById('hamburger-menu');
    if (hb) hb.style.display = 'none';

    // Run loader then inject initial page
    animateLoaderPercent(() => {
      const main = document.getElementById('spa-content');
      if (!main) {
        console.error('main.js: #spa-content not found');
        return;
      }
      main.innerHTML = '';
      const newChild = document.createElement('div');
      newChild.className = 'fade-scale';
      newChild.innerHTML = pages[page] || pages.home;
      main.appendChild(newChild);
      setTimeout(() => newChild.classList.add('in'), 10);
      hideLoading();
    });

    // Setup menu logic and global click nav handler
    setupHamburgerMenu();
    document.addEventListener('click', handleNav);

    // Update swipe arrow visibility when route/hash changes
    window.addEventListener('hashchange', () => {
    const pg = window.location.hash.replace('#', '') || 'home';
    loadPage(pg);
    updateSwipeArrowVisibility(pg);
    });

    // Initial arrow visibility
    updateSwipeArrowVisibility(page);

    // Initialize scroll/touch handlers (they will call loadPage via hash change or directly)
    initScrollHandlers(loadPage);

    // Prefetch important pages in idle time for near-instant transitions
    try {
      prefetchPagesIdle();
    } catch (e) {
      // ignore if prefetch not supported
    }
  } catch (err) {
    console.error('main.js initApp error', err);
  }
}

// If DOM is already ready, run immediately; otherwise wait for DOMContentLoaded
if (document.readyState === 'loading') {
  window.addEventListener('DOMContentLoaded', initApp);
} else {
  // DOM already parsed
  initApp();
}
