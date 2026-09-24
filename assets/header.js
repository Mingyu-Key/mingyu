/* ============================================================
   动态注入：顶部导航 + 底部 footer + 回到顶部按钮
   通过 data-page="index|op|purchase|assistant|finance|cs|shared|contact"
   标记当前页（works 下拉的子项也用同样标识）
   ============================================================ */

(function () {
  'use strict';

  // 主导航: 首页 / 作品(下拉) / 联系
  const NAV_ITEMS = [
    { id: 'index',   label: '首页', href: 'index.html' },
    {
      id: 'works',
      label: '作品',
      children: [
        { id: 'architecture', label: '作品架构 & 思路', href: 'architecture.html', special: true },
        { divider: true },
        { id: 'op',        label: '运营',  href: 'op.html',        color: '#3b82f6' },
        { id: 'purchase',  label: '采购',  href: 'purchase.html',  color: '#8b5cf6' },
        { id: 'assistant', label: '助理',  href: 'assistant.html', color: '#10b981' },
        { id: 'finance',   label: '财务',  href: 'finance.html',   color: '#f59e0b' },
        { id: 'cs',        label: '客服',  href: 'cs.html',        color: '#ef4444' },
        { id: 'shared',    label: '公共',  href: 'shared.html',    color: '#64748b' }
      ]
    },
    { id: 'contact', label: '联系', href: 'contact.html' }
  ];

  const active = document.body.getAttribute('data-page') || 'index';

  /* ============ 渲染导航 ============ */
  const navHTML = `
    <header class="nav" id="nav">
      <div class="nav__inner">
        <a class="nav__logo" href="index.html">
          <span class="nav__logo-mark">M</span>
          <span class="nav__logo-text">阁主</span>
        </a>
        <nav class="nav__links" id="navLinks" aria-label="主导航">
          ${NAV_ITEMS.map(item => {
            if (item.children) {
              const childActive = item.children.some(c => c.id === active);
              return `
                <div class="nav__item nav__item--dd" data-dd="works">
                  <button class="nav__link nav__link--dd ${childActive ? 'is-active' : ''}" type="button" aria-haspopup="true" aria-expanded="false">
                    ${item.label}
                    <svg class="nav__caret" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                  </button>
                  <div class="nav__dd" role="menu">
                    ${item.children.map(c => {
                      if (c.divider) return '<div class="nav__dd-divider"></div>';
                      if (c.special) {
                        return `
                          <a class="nav__dd-item nav__dd-item--special ${c.id === active ? 'is-active' : ''}" href="${c.href}" role="menuitem">
                            <span class="nav__dd-icon">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><circle cx="12" cy="12" r="9"/><path d="M12 3v18"/><path d="M3 12h18"/></svg>
                            </span>
                            <span class="nav__dd-label">${c.label}</span>
                            <span class="nav__dd-tag">架构</span>
                            <svg class="nav__dd-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                          </a>
                        `;
                      }
                      return `
                        <a class="nav__dd-item ${c.id === active ? 'is-active' : ''}" href="${c.href}" role="menuitem">
                          <span class="nav__dd-dot" style="background:${c.color}"></span>
                          <span class="nav__dd-label">${c.label}</span>
                          <svg class="nav__dd-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                        </a>
                      `;
                    }).join('')}
                  </div>
                </div>
              `;
            }
            return `<a class="nav__link ${item.id === active ? 'is-active' : ''}" href="${item.href}">${item.label}</a>`;
          }).join('')}
        </nav>
        <a class="nav__cta" href="contact.html">合作咨询 →</a>
        <button class="nav__menu" id="navMenu" type="button" aria-label="展开导航" aria-controls="navLinks" aria-expanded="false">☰</button>
      </div>
    </header>
  `;
  document.body.insertAdjacentHTML('afterbegin', navHTML);

  /* ============ 回到顶部按钮 ============ */
  document.body.insertAdjacentHTML('beforeend',
    '<button class="totop" id="totop" aria-label="回到顶部" hidden>↑</button>'
  );

  /* ============ 底部 footer ============ */
  const footerHTML = `
    <footer class="footer">
      <div class="container footer__inner">
        <span>© 2026 阁主 · 作品集</span>
        <span class="footer__sep">·</span>
        <span>Built with HTML / CSS / Vanilla JS</span>
      </div>
    </footer>
  `;
  document.body.insertAdjacentHTML('beforeend', footerHTML);

  /* ============ 作品下拉 hover/click 行为 ============ */
  const ddWrap = document.querySelector('.nav__item--dd');
  const ddBtn = ddWrap && ddWrap.querySelector('.nav__link--dd');
  if (ddWrap && ddBtn) {
    let openTimer = 0, closeTimer = 0;
    const open = () => { clearTimeout(closeTimer); ddWrap.classList.add('is-open'); ddBtn.setAttribute('aria-expanded', 'true'); };
    const close = () => { clearTimeout(openTimer); ddWrap.classList.remove('is-open'); ddBtn.setAttribute('aria-expanded', 'false'); };

    ddWrap.addEventListener('mouseenter', () => { openTimer = setTimeout(open, 80); });
    ddWrap.addEventListener('mouseleave', () => { closeTimer = setTimeout(close, 400); });
    ddBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      ddWrap.classList.contains('is-open') ? close() : open();
    });
    // 点外部关闭
    document.addEventListener('click', (e) => { if (!ddWrap.contains(e.target)) close(); });
    // Esc 关闭
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
  }

})();
