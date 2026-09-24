/* ============================================================
   共享脚本：滚动监听 + reveal 动画 + 回到顶部 + 整页背景特效
   ============================================================ */

(function () {
  'use strict';

  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));

  /* ============================================================
     0. 整页背景特效：mouse-following 光斑 + SVG 几何装饰
     ============================================================ */
  (function pageBackground() {
    const html = `
      <div class="page-bg" aria-hidden="true">
        <!-- 鼠标跟随的大光斑 -->
        <div class="page-bg__cursor" data-cursor></div>
        <!-- 第二个稍慢的彩色光斑, 偏移方向 -->
        <div class="page-bg__cursor page-bg__cursor--2" data-cursor-2></div>
        <!-- SVG 几何装饰 (浮动的圆/方/三角) -->
        <svg class="page-bg__shape page-bg__shape--1" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" stroke-width="1.2"/></svg>
        <svg class="page-bg__shape page-bg__shape--2" viewBox="0 0 100 100"><rect x="20" y="20" width="60" height="60" rx="8" fill="none" stroke="currentColor" stroke-width="1.2"/></svg>
        <svg class="page-bg__shape page-bg__shape--3" viewBox="0 0 100 100"><polygon points="50,15 85,80 15,80" fill="none" stroke="currentColor" stroke-width="1.2"/></svg>
        <svg class="page-bg__shape page-bg__shape--4" viewBox="0 0 100 100"><path d="M20,50 Q50,20 80,50 T20,50" fill="none" stroke="currentColor" stroke-width="1.2"/></svg>
        <svg class="page-bg__shape page-bg__shape--5" viewBox="0 0 100 100"><circle cx="50" cy="50" r="8" fill="currentColor"/></svg>
        <!-- 细网格层 (极淡) -->
        <div class="page-bg__grid"></div>
        <!-- 噪点 (SVG filter) -->
        <svg class="page-bg__noise" aria-hidden="true">
          <filter id="noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/>
            <feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.4 0"/>
          </filter>
          <rect width="100%" height="100%" filter="url(#noise)"/>
        </svg>
      </div>
    `;
    document.body.insertAdjacentHTML('afterbegin', html);

    const cursorEl = document.querySelector('[data-cursor]');
    const cursor2El = document.querySelector('[data-cursor-2]');
    if (!cursorEl) return;

    let mx = -600, my = -600;       // 鼠标实际位置
    let tx = mx, ty = my;            // 主光斑 (快)
    let tx2 = mx, ty2 = my;          // 第二光斑 (慢)
    let raf = 0;
    let active = false;              // 鼠标是否在视口内

    function tick() {
      tx += (mx - tx) * 0.18;
      ty += (my - ty) * 0.18;
      tx2 += (mx - tx2) * 0.06;
      ty2 += (my - ty2) * 0.06;

      cursorEl.style.transform = `translate3d(${tx.toFixed(1)}px, ${ty.toFixed(1)}px, 0) translate(-50%, -50%)`;
      cursor2El.style.transform = `translate3d(${tx2.toFixed(1)}px, ${ty2.toFixed(1)}px, 0) translate(-50%, -50%)`;

      if (active || Math.abs(mx - tx) > 0.5 || Math.abs(my - ty) > 0.5) {
        raf = requestAnimationFrame(tick);
      } else {
        raf = 0;
      }
    }

    function start() { if (!raf) raf = requestAnimationFrame(tick); }

    window.addEventListener('mousemove', (e) => {
      mx = e.clientX;
      my = e.clientY;
      active = true;
      cursorEl.classList.add('is-active');
      cursor2El.classList.add('is-active');
      start();
    }, { passive: true });
    window.addEventListener('mouseleave', () => {
      active = false;
      cursorEl.classList.remove('is-active');
      cursor2El.classList.remove('is-active');
    });
    window.addEventListener('blur', () => {
      active = false;
      cursorEl.classList.remove('is-active');
      cursor2El.classList.remove('is-active');
    });

    // 触屏: 隐藏光斑
    if (matchMedia('(hover: none)').matches) {
      cursorEl.style.display = 'none';
      cursor2El.style.display = 'none';
    }
  })();

  /* ============================================================
     1. 顶部导航滚动样式
     ============================================================ */
  const nav = $('#nav');
  function onScroll() {
    if (window.scrollY > 12) nav.classList.add('is-scrolled');
    else nav.classList.remove('is-scrolled');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ============================================================
     2. 回到顶部
     ============================================================ */
  const totop = $('#totop');
  function toggleTotop() {
    if (window.scrollY > 480) {
      totop.hidden = false;
      requestAnimationFrame(() => totop.classList.add('is-show'));
    } else {
      totop.classList.remove('is-show');
      setTimeout(() => { if (window.scrollY <= 480) totop.hidden = true; }, 300);
    }
  }
  if (totop) {
    window.addEventListener('scroll', toggleTotop, { passive: true });
    totop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    toggleTotop();
  }

  /* ============================================================
     3. reveal 动画
     ============================================================ */
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-in');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
  $$('[data-reveal]').forEach(el => revealObserver.observe(el));

  /* ============================================================
     4. 数字计数动画 (hero stats)
     ============================================================ */
  function countUp(el, target, duration) {
    duration = duration || 1400;
    const start = performance.now();
    const isInt = Number.isInteger(target);
    const suffix = el.getAttribute('data-suffix') || '';
    function step(now) {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const v = target * eased;
      el.textContent = (isInt ? Math.round(v) : v.toFixed(1)) + suffix;
      if (t < 1) requestAnimationFrame(step);
      else el.textContent = (isInt ? target : target.toFixed(1)) + suffix;
    }
    requestAnimationFrame(step);
  }
  const counters = $$('[data-count]');
  if (counters.length) {
    // 立即跑一次 (网络慢/JS 加载晚, IO 可能错过 hero 区域)
    // 用 setTimeout 0 让浏览器先渲染首帧, 数字从 0 开始增长视觉更明显
    let counted = false;
    setTimeout(() => {
      counted = true;
      counters.forEach(el => countUp(el, parseFloat(el.getAttribute('data-count'))));
    }, 0);
    // 仍然保留 IO 作为备份 (如果用户先在视口下方, 后才到 hero)
    const counterObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !counted) {
          counted = true;
          counters.forEach(el => countUp(el, parseFloat(el.getAttribute('data-count'))));
          counterObserver.disconnect();
        }
      });
    }, { threshold: 0.4 });
    counterObserver.observe(counters[0].closest('.hero__stats') || counters[0]);
  }

  /* ============================================================
     5. 移动端菜单
     ============================================================ */
  const navMenu = $('#navMenu');
  if (navMenu) {
    const links = $('.nav__links');
    const navRoot = $('#nav');
    const closeMobileMenu = () => {
      if (!links) return;
      links.classList.remove('is-mobile-open');
      navMenu.setAttribute('aria-expanded', 'false');
      navMenu.setAttribute('aria-label', '展开导航');
    };
    navMenu.addEventListener('click', () => {
      if (!links) return;
      const isOpen = links.classList.toggle('is-mobile-open');
      navMenu.setAttribute('aria-expanded', String(isOpen));
      navMenu.setAttribute('aria-label', isOpen ? '收起导航' : '展开导航');
    });
    document.addEventListener('click', e => {
      if (navRoot && !navRoot.contains(e.target)) closeMobileMenu();
    });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMobileMenu(); });
    window.addEventListener('resize', () => {
      if (window.innerWidth > 720) closeMobileMenu();
    }, { passive: true });
  }

})();
