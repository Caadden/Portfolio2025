// Hamburger menu logic
function setupHamburgerMenu() {
    const menuBtn = document.getElementById('hamburger-menu');
    const overlay = document.getElementById('menu-overlay');
    const navLinks = overlay.querySelectorAll('a[data-page]');
    function updateActiveMenuLink() {
        const currentPage = (window.location.hash || '#home').replace('#', '');
        navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('data-page') === currentPage);
        });
    }
    menuBtn.addEventListener('click', () => {
        overlay.classList.toggle('hidden');
        if (!overlay.classList.contains('hidden')) {
            updateActiveMenuLink();
        }
    });
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            overlay.classList.add('hidden');
        }
    });
    // Close menu on nav click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            overlay.classList.add('hidden');
        });
    });
    // Update active link on hash change
    window.addEventListener('hashchange', updateActiveMenuLink);

    // Close menu on Escape key
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !overlay.classList.contains('hidden')) {
            overlay.classList.add('hidden');
        }
    });

    // Initial highlight
    updateActiveMenuLink();
}

// SPA logic: load content dynamically, keep video playing
const pages = {
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
                    <h3>Sudoku</h3>
                    <p>A web-based sudoku game built with Python.</p>
                </div>
                <div class="projectcard">
                    <h3>Minesweeper</h3>
                    <p>A web-based sudoku game built with Python.</p>
                </div>
            </div>
        </section>
    `,
    experiences: `
        <h1>Experiences</h1>
        <section>
            <p>Details about my experiences will go here.</p>
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
                <a href="mailto:cadencastleberry1114@gmail.com" class="email-btn">Email</a>
            </div>
        </footer>
    `
};



function hideLoading() {
    const overlay = document.getElementById('spa-loading-overlay');
    overlay.classList.add('fade-out');
    setTimeout(() => {
        overlay.classList.add('hidden');
        overlay.classList.remove('fade-out');
    }, 350); // match fade duration in CSS
    document.body.style.overflow = '';
    document.getElementById('hamburger-menu').style.display = '';
}

function animateLoaderPercent(callback) {
    const percentElem = document.getElementById('loader-percent');
    let percent = 0, finished = false;
    percentElem.textContent = '0%';
    const interval = setInterval(() => {
        percent += 2 + Math.random() * 2;
        if (percent >= 100) {
            percent = 100;
            percentElem.textContent = '100%';
            clearInterval(interval);
            if (!finished) {
                finished = true;
                setTimeout(() => { try { callback(); } catch(e) { hideLoading(); } }, 180);
            }
        } else {
            percentElem.textContent = Math.floor(percent) + '%';
        }
    }, 24);
    // Failsafe: hide loader after 3 seconds no matter what
    setTimeout(() => {
        if (!finished) {
            finished = true;
            clearInterval(interval);
            percentElem.textContent = '100%';
            try { callback(); } catch(e) { hideLoading(); }
        }
    }, 3000);
}

function loadPage(page) {
    const main = document.getElementById('spa-content');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const oldChild = main.querySelector('.fade-scale');
    if (oldChild) {
        oldChild.classList.remove('in');
        setTimeout(() => {
            main.removeChild(oldChild);
            const newChild = document.createElement('div');
            newChild.className = 'fade-scale';
            newChild.innerHTML = pages[page] || pages.home;
            main.appendChild(newChild);
            // trigger fade-in
            setTimeout(() => newChild.classList.add('in'), 10);
        }, 350);
    } else {
        // First load
        const newChild = document.createElement('div');
        newChild.className = 'fade-scale';
        newChild.innerHTML = pages[page] || pages.home;
        main.appendChild(newChild);
        setTimeout(() => newChild.classList.add('in'), 10);
    }
}

function handleNav(e) {
    if (e.target.matches('a[data-page]')) {
        e.preventDefault();
        const page = e.target.getAttribute('data-page');
        window.location.hash = page;
        loadPage(page);
    }
}



window.addEventListener('DOMContentLoaded', () => {
    // Initial load
    let page = window.location.hash.replace('#', '') || 'home';
    document.body.style.overflow = 'hidden';
    document.getElementById('hamburger-menu').style.display = 'none';
    animateLoaderPercent(() => {
        // Insert initial .fade-scale wrapper
        const main = document.getElementById('spa-content');
        main.innerHTML = '';
        const newChild = document.createElement('div');
        newChild.className = 'fade-scale';
        newChild.innerHTML = pages[page] || pages.home;
        main.appendChild(newChild);
        setTimeout(() => newChild.classList.add('in'), 10);
        hideLoading();
    });
    setupHamburgerMenu();
    window.addEventListener('hashchange', () => {
        let page = window.location.hash.replace('#', '') || 'home';
        loadPage(page);
    });

    // --- Fullpage scroll navigation ---
    const pageOrder = ['home', 'about', 'projects', 'experiences', 'contact'];
    let scrollCooldown = false;
    function scrollToPage(direction) {
        const current = window.location.hash.replace('#', '') || 'home';
        let idx = pageOrder.indexOf(current);
        if (direction === 'down' && idx < pageOrder.length - 1) idx++;
        else if (direction === 'up' && idx > 0) idx--;
        else return;
        window.location.hash = pageOrder[idx];
        loadPage(pageOrder[idx]);
    }
    window.addEventListener('wheel', (e) => {
        if (scrollCooldown || Math.abs(e.deltaY) < 5) return;
        scrollCooldown = true;
        scrollToPage(e.deltaY > 0 ? 'down' : 'up');
        setTimeout(() => { scrollCooldown = false; }, 900);
    }, { passive: false });
    // --- End fullpage scroll navigation ---
});