/* ===========================
   Blue & Soluções — script.js
   =========================== */

// ── Hamburger (menu mobile) ───────────────────────────────────────────────
const hamburger = document.querySelector('.hamburger');
const navMenu   = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('active');
    navMenu.classList.toggle('active', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    hamburger.setAttribute('aria-label', isOpen ? 'Fechar menu de navegação' : 'Abrir menu de navegação');
});

// Fecha o menu mobile ao clicar em links simples (não dropdowns)
navMenu.querySelectorAll('.nav-link:not(.dropdown-toggle)').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
});

function closeMobileMenu() {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-label', 'Abrir menu de navegação');
}

// ── Dropdowns ─────────────────────────────────────────────────────────────
const dropdownToggles = document.querySelectorAll('.dropdown-toggle');

dropdownToggles.forEach(toggle => {
    const menuId = toggle.getAttribute('aria-controls');
    const menu   = menuId ? document.getElementById(menuId) : null;
    if (!menu) return;

    // Previne o comportamento padrão de <a> ao clicar no toggle
    toggle.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const isOpen = !menu.hidden;

        // Fecha todos os outros dropdowns
        closeAllDropdowns(menu);

        // Alterna o atual
        menu.hidden = isOpen;
        toggle.setAttribute('aria-expanded', String(!isOpen));
    });

    // Fecha com Escape
    toggle.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            menu.hidden = true;
            toggle.setAttribute('aria-expanded', 'false');
            toggle.focus();
        }
    });

    menu.querySelectorAll('.dropdown-link').forEach(link => {
        link.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                menu.hidden = true;
                toggle.setAttribute('aria-expanded', 'false');
                toggle.focus();
            }
        });

        // Fecha o dropdown ao clicar num link dentro dele
        link.addEventListener('click', () => {
            menu.hidden = true;
            toggle.setAttribute('aria-expanded', 'false');
            closeMobileMenu();
        });
    });
});

// Fecha todos os dropdowns ao clicar fora
document.addEventListener('click', () => closeAllDropdowns());

// Fecha todos (opcionalmente exceto um)
function closeAllDropdowns(except) {
    dropdownToggles.forEach(toggle => {
        const menuId = toggle.getAttribute('aria-controls');
        const menu   = menuId ? document.getElementById(menuId) : null;
        if (!menu || menu === except) return;
        menu.hidden = true;
        toggle.setAttribute('aria-expanded', 'false');
    });
}

// ── Scroll suave para âncoras ─────────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ── Sombra no header ao rolar ─────────────────────────────────────────────
const header = document.querySelector('.header');
window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

// ── Pausa animação da logo no hover ───────────────────────────────────────
const logo = document.querySelector('.logo');
if (logo) {
    logo.addEventListener('mouseenter', () => logo.style.animationPlayState = 'paused');
    logo.addEventListener('mouseleave', () => logo.style.animationPlayState = 'running');
}
