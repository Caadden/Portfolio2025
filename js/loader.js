// loader.js — loader animation and helpers
export function hideLoading() {
  const overlay = document.getElementById('spa-loading-overlay');
  overlay.classList.add('fade-out');
  setTimeout(() => {
    overlay.classList.add('hidden');
    overlay.classList.remove('fade-out');
  }, 350); // match CSS fade duration
  // clear inline lock — base.css keeps overflow:hidden; loader previously used inline styles
  document.body.style.overflow = '';
  const hb = document.getElementById('hamburger-menu');
  if (hb) hb.style.display = '';
}

export function animateLoaderPercent(callback) {
  const percentElem = document.getElementById('loader-percent');
  let percent = 0, finished = false;
  if (percentElem) percentElem.textContent = '0%';
  const interval = setInterval(() => {
    percent += 2 + Math.random() * 2;
    if (percent >= 100) {
      percent = 100;
      if (percentElem) percentElem.textContent = '100%';
      clearInterval(interval);
      if (!finished) {
        finished = true;
        setTimeout(() => { try { callback(); } catch(e) { hideLoading(); } }, 180);
      }
    } else {
      if (percentElem) percentElem.textContent = Math.floor(percent) + '%';
    }
  }, 24);
  // Failsafe: hide loader after 3 seconds no matter what
  setTimeout(() => {
    if (!finished) {
      finished = true;
      clearInterval(interval);
      if (percentElem) percentElem.textContent = '100%';
      try { callback(); } catch(e) { hideLoading(); }
    }
  }, 3000);
}
