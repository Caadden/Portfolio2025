// spa.js — pages object, loadPage, updateSwipeArrowVisibility
export const pages = {
  home: `
        <h1 class="wavy-text">
            <span style="display:inline-block; transform: translateY(-18px) rotate(-12deg);">W</span>
            <span style="display:inline-block; transform: translateY(-8px) rotate(-6deg);">o</span>
            <span style="display:inline-block; transform: translateY(6px) rotate(8deg);">o</span>
            <span style="display:inline-block; transform: translateY(18px) rotate(16deg);">o</span>
            <span style="display:inline-block; transform: translateY(8px) rotate(8deg);">o</span>
            <span style="display:inline-block; transform: translateY(-10px) rotate(-10deg);">s</span>
            <span style="display:inline-block; transform: translateY(-20px) rotate(-18deg);">h</span>
            <span style="display:inline-block; transform: translateY(-5px) rotate(-4deg);">!</span>
            <span style="display:inline-block; transform: translateY(22px) rotate(18deg); margin-left: 1.5rem;">h</span>
            <span style="display:inline-block; transform: translateY(10px) rotate(8deg);">e</span>
            <span style="display:inline-block; transform: translateY(-12px) rotate(-10deg);">y</span>
            <span style="display:inline-block; transform: translateY(0px) rotate(0deg);">!</span>
        </h1>
        <footer>
            <div>
                <a href="https://www.linkedin.com/in/caden-castleberry-3ba696363/" target="_blank">LinkedIn</a>
                <a href="https://www.github.com/Caadden" target="_blank">GitHub</a>
            </div>
        </footer>
    `,
  about: `
        <h1>About Me</h1>
        <section>
            <p>I'm a freshman CS student at UF interested in making projects!</p>
        </section>
    `,
  projects: `
        <h1>Projects</h1>
        <section>
            <div class="project-cards">
                <div class="projectcard">
                    <h3>LyricAI Analyzer</h3>
                    <p>Work in Progress!</p>
                </div>
                <div class="projectcard">
                    <h3>Sudoku</h3>
                    <p>Work in Progress!</p>
                </div>
            </div>
        </section>
    `,
  experiences: `
        <h1>Experiences</h1>
        <section>
            <p>I am looking for experience in software development and software design.</p>
        </section>
    `,
  contact: `
        <section>
            <p>Get in touch with me below!</p>
        </section>
        <footer>
            <div style="display: flex; justify-content: center; gap: 1.5rem;">
                <a href="https://www.linkedin.com/in/caden-castleberry-3ba696363/" target="_blank">LinkedIn</a>
                <a href="https://www.github.com/Caadden" target="_blank">GitHub</a>
            </div>
            <div style="display: flex; justify-content: center; margin-top: 1.2rem;">
                <a href="mailto:cadencastleberry1@gmail.com" class="email-btn">Email</a>
            </div>
        </footer>
    `
};

let isTransitioning = false;
let currentPage = null;

const PREFETCH_LIST = ['about', 'projects', 'experiences'];

export function prefetchPagesIdle(list = PREFETCH_LIST) {
  if (!('requestIdleCallback' in window)) {
    setTimeout(() => prefetchPagesIdle(list), 1500);
    return;
  }

  requestIdleCallback(async () => {
    for (const p of list) {
      try {
        if ((window.location.hash.replace('#', '') || 'home') === p) continue;
        const tplId = 'tpl-' + p;
        if (document.getElementById(tplId)) continue;

        const res = await fetch(`pages/${p}.html`, { cache: 'force-cache' });
        if (!res.ok) continue;
        const text = await res.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');
        // Prefer extracting the page's content to avoid inserting site chrome/nav
        const headerEl = doc.querySelector('header');
        const mainEl = doc.querySelector('main');
        const footerEl = doc.querySelector('footer');
        let fragmentHtml = '';
        // Many pages put their <h1> inside <header> — include it if present (but avoid full nav)
        if (headerEl) {
          const h1 = headerEl.querySelector('h1');
          if (h1) fragmentHtml += h1.outerHTML;
        }
        if (mainEl) fragmentHtml += mainEl.outerHTML;
        if (footerEl) fragmentHtml += footerEl.outerHTML;
        if (!fragmentHtml) fragmentHtml = doc.body.innerHTML; // fallback to full body

        // create a template containing only the page fragment
        const tpl = document.createElement('template');
        tpl.id = tplId;
        tpl.innerHTML = fragmentHtml;
        tpl.style.display = 'none';
        document.body.appendChild(tpl);
      } catch (err) {
        console.warn('prefetchPagesIdle: failed to prefetch', p, err);
      }
    }
  }, { timeout: 2000 });
}

function insertNewFromTemplate(main, page) {
  const tpl = document.getElementById('tpl-' + page);
  const newChild = document.createElement('div');
  newChild.className = 'fade-scale';
  if (tpl) {
    const frag = tpl.content.cloneNode(true);
    newChild.appendChild(frag);
  } else {
    newChild.innerHTML = pages[page] || pages.home;
  }
  main.appendChild(newChild);
  return newChild;
}

export function loadPage(page) {
  if (!page) page = 'home';
  if (isTransitioning) return;
  if (page === currentPage) return;
  const main = document.getElementById('spa-content');
  if (!main) return;

  isTransitioning = true;
  const oldChild = main.querySelector('.fade-scale');

  const newChild = insertNewFromTemplate(main, page);

  const onNewTransitionEnd = (ev) => {
    if (ev.target !== newChild || ev.propertyName !== 'opacity') return;
    newChild.removeEventListener('transitionend', onNewTransitionEnd);
    if (oldChild && oldChild.parentNode === main) main.removeChild(oldChild);
    currentPage = page;
    isTransitioning = false;
  };

  if (oldChild) {
    oldChild.classList.remove('in');
    setTimeout(() => {
      requestAnimationFrame(() => {
        newChild.addEventListener('transitionend', onNewTransitionEnd);
        newChild.classList.add('in');
      });
    }, 120);
  } else {
    requestAnimationFrame(() => {
      newChild.addEventListener('transitionend', onNewTransitionEnd);
      newChild.classList.add('in');
    });
  }
}

export function updateSwipeArrowVisibility(page) {
  const arrow = document.querySelector('.swipe-arrow');
  if (!arrow) return;
  if (page === 'contact') arrow.classList.add('hide-arrow');
  else arrow.classList.remove('hide-arrow');
}