/* ============================================================
   分类页：渲染 cat-hero + 作品详情列表 + 联系区
   通过 document.body data-cat="op|purchase|..." 决定分类
   特性:
     - 纯展示, 不跳转外链 (隐私: 不暴露内网系统入口)
     - 3D 鼠标视差 (perspective + rotateX/Y)
     - 数字 count-up 动画
     - IntersectionObserver 触发滚动入场
   ============================================================ */

(function () {
  'use strict';

  const cat = document.body.getAttribute('data-cat');
  const cats = window.CATEGORIES || [];
  const works = window.PORTFOLIO_DATA || [];
  const catInfo = cats.find(c => c.id === cat);
  if (!catInfo) return;

  /* 工具 */
  const ic = (name, size) => window.renderIcon ? window.renderIcon(name, size) : (name || '');

  /* ============================================================
     1. 分类头部
     ============================================================ */
  const heroEl = document.getElementById('catHero');
  if (heroEl) {
    heroEl.innerHTML = `
      <div class="container cat-hero__inner">
        <a class="cat-hero__back" href="index.html">← 返回首页</a>
        <div class="cat-hero__head">
          <div class="cat-hero__icon">${ic(catInfo.icon, 36)}</div>
          <div>
            <h1 class="cat-hero__title">${catInfo.label}</h1>
            <div class="cat-hero__count">
              <span data-count="${catInfo.count}">0</span> 个子系统 · 端口 5801-5816
            </div>
          </div>
        </div>
        <p class="cat-hero__desc">${catInfo.desc}</p>
      </div>
    `;
  }

  /* ============================================================
     2. 作品详情列表
     ============================================================ */
  function buildMediaHTML(w) {
    var shots = w.screenshots || [];
    if (!shots.length) {
      var iconSvg = window.renderIcon ? window.renderIcon('image', 36) : '';
      return '<div class="work-detail__media-placeholder">' +
        '<div class="work-detail__media-placeholder-icon">' + iconSvg + '</div>' +
        '<div class="work-detail__media-placeholder-title">系统截图待上传</div>' +
        '<div class="work-detail__media-placeholder-name">' + w.port + '-main.gif</div>' +
        '<div class="work-detail__media-placeholder-hint">放到 assets/screenshots/ 目录</div>' +
        '</div>';
    }
    var html = '<div class="work-detail__carousel" data-carousel-count="' + shots.length + '">';
    for (var i = 0; i < shots.length; i++) {
      var active = i === 0 ? ' is-active' : '';
      var src = shots[i].indexOf('.') > -1
        ? 'assets/screenshots/' + shots[i]
        : 'assets/screenshots/' + w.port + '-' + shots[i] + '.gif';
      var altText = (w.title || '') + ' ' + (i + 1);
      html += '<div class="work-detail__carousel-item' + active + '" data-idx="' + i + '">' +
        '<img src="' + src + '" alt="' + altText + '" loading="lazy" decoding="async" onerror="this.parentNode.classList.add(\'is-broken\');var n=this.nextElementSibling;if(n)n.style.display=\'flex\';this.style.display=\'none\';" />' +
        '<div class="work-detail__media-placeholder" style="display:none;">' +
          '<div class="work-detail__media-placeholder-icon">' + (window.renderIcon ? window.renderIcon('image', 32) : '') + '</div>' +
          '<div class="work-detail__media-placeholder-title">系统截图待上传</div>' +
          '<div class="work-detail__media-placeholder-name">' + w.port + '-' + shots[i] + '.gif</div>' +
          '<div class="work-detail__media-placeholder-hint">放到 assets/screenshots/ 目录</div>' +
        '</div>' +
        '</div>';
    }
    if (shots.length > 1) {
      var dots = '';
      for (var j = 0; j < shots.length; j++) {
        dots += '<button class="carousel-dot' + (j === 0 ? ' is-active' : '') + '" type="button" data-idx="' + j + '" aria-label="查看第 ' + (j + 1) + ' 张截图" aria-current="' + (j === 0 ? 'true' : 'false') + '"></button>';
      }
      html += '<button class="carousel-btn carousel-btn--prev" type="button" aria-label="上一张截图">&lt;</button>' +
        '<button class="carousel-btn carousel-btn--next" type="button" aria-label="下一张截图">&gt;</button>' +
        '<div class="carousel-dots">' + dots + '</div>';
    }
    html += '</div>';
    return html;
  }

  const listEl = document.getElementById('worksList');
  const items = works.filter(w => w.cat === cat);
  if (listEl) {
    var _html = items.map(function(w, idx) {
      var features = (w.features || []).map(function(f) { return '<li>' + f + '</li>'; }).join('');
      var tags = (w.tags || []).map(function(t) { return '<span class="work-detail__tag">' + t + '</span>'; }).join('');
      return '<article class="work-detail" data-reveal data-idx="' + idx + '">' +
        '<div class="work-detail__inner">' +
          '<div class="work-detail__head">' +
            '<div class="work-detail__icon">' + ic(w.icon, 28) + '</div>' +
            '<div class="work-detail__head-text">' +
              '<h2 class="work-detail__title">' + w.title + '</h2>' +
              '<p class="work-detail__desc">' + w.desc + '</p>' +
            '</div>' +
            '<span class="work-detail__badge">案例展示</span>' +
          '</div>' +
          '<div class="work-detail__body">' +
            '<div class="work-detail__block">' +
              '<div class="work-detail__block-title">解决什么问题</div>' +
              '<p class="work-detail__problem">' + w.problem + '</p>' +
            '</div>' +
            '<div class="work-detail__block">' +
              '<div class="work-detail__block-title">核心功能</div>' +
              '<ul class="work-detail__features">' + features + '</ul>' +
            '</div>' +
          '</div>' +
          '<div class="work-detail__media" data-port="' + w.port + '">' + buildMediaHTML(w) + '</div>' +
          '<div class="work-detail__foot">' +
            '<div class="work-detail__tags">' + tags + '</div>' +
            '<span class="work-detail__status"><span class="work-detail__status-dot"></span>运行中</span>' +
          '</div>' +
          '<div class="work-detail__glow" aria-hidden="true"></div>' +
        '</div>' +
      '</article>';
    }).join('');
    listEl.innerHTML = _html;
  }

  /* ============================================================
     3. 联系区
     ============================================================ */
  const contactEl = document.getElementById('contactStrip');
  if (contactEl) {
    contactEl.innerHTML = `
      <div class="container">
        <div class="contact-strip__inner">
          <div class="contact-strip__title">想看更多 / 聊合作？</div>
          <p class="contact-strip__desc">如果你在看独立开发者 / 电商系统工程师 / 内部工具研发相关机会，随时联系。</p>
          <div class="contact-strip__num">156 2737 5961</div>
          <a class="btn btn--primary" href="contact.html">查看完整联系方式</a>
        </div>
      </div>
    `;
  }

  /* ============================================================
     4. 数字 count-up 动画
     ============================================================ */
  function animateCount(el) {
    const target = parseInt(el.getAttribute('data-count'), 10);
    if (isNaN(target)) return;
    const duration = 1200;
    const start = performance.now();
    function tick(now) {
      const t = Math.min(1, (now - start) / duration);
      // ease-out cubic
      const e = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.floor(target * e);
      if (t < 1) requestAnimationFrame(tick);
      else el.textContent = target;
    }
    requestAnimationFrame(tick);
  }

  /* ============================================================
     5. IntersectionObserver 滚动入场
     ============================================================ */
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('is-in');
        // 给数字做 count-up
        e.target.querySelectorAll('[data-count]').forEach(animateCount);
        revealObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  document.querySelectorAll('[data-reveal]').forEach(el => revealObs.observe(el));

  /* ============================================================
     6. 卡片光晕（移除了 3D rotate 以免影响 GIF 动画）
     ============================================================ */
  document.querySelectorAll('.work-detail').forEach(card => {
    const glow = card.querySelector('.work-detail__glow');
    if (!glow) return;

    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width) * 100;
      const y = ((e.clientY - r.top) / r.height) * 100;
      glow.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(37, 99, 235, 0.18) 0%, transparent 60%)`;
    });
  });

  /* ============================================================
     7. cat-hero 视差（鼠标移动让 icon 浮起）
     ============================================================ */
  const catHeroIcon = document.querySelector('.cat-hero__icon');
  if (catHeroIcon) {
    const parent = catHeroIcon.parentElement.parentElement;
    parent.addEventListener('mousemove', (e) => {
      const r = parent.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      catHeroIcon.style.transform = `translateZ(0) rotateY(${x * 10}deg) rotateX(${-y * 10}deg)`;
    });
    parent.addEventListener('mouseleave', () => {
      catHeroIcon.style.transform = '';
    });
  }

  /* ============================================================
     8. 轮播交互
     ============================================================ */
  document.querySelectorAll('.work-detail__carousel').forEach(carousel => {
    const items = carousel.querySelectorAll('.work-detail__carousel-item');
    const dots = carousel.querySelectorAll('.carousel-dot');
    const prevBtn = carousel.querySelector('.carousel-btn--prev');
    const nextBtn = carousel.querySelector('.carousel-btn--next');
    if (!items.length) return;

    let current = 0;
    const total = parseInt(carousel.dataset.carouselCount || items.length, 10);

    function show(idx) {
      const realItems = carousel.querySelectorAll('.work-detail__carousel-item');
      const realDots = carousel.querySelectorAll('.carousel-dot');
      realItems.forEach((el, i) => el.classList.toggle('is-active', i === idx));
      realDots.forEach((el, i) => {
        const isActive = i === idx;
        el.classList.toggle('is-active', isActive);
        el.setAttribute('aria-current', String(isActive));
      });
      current = idx;
    }

    if (prevBtn) prevBtn.addEventListener('click', () => show((current - 1 + total) % total));
    if (nextBtn) nextBtn.addEventListener('click', () => show((current + 1) % total));
    dots.forEach((dot, i) => dot.addEventListener('click', () => show(i)));

    // 触摸滑动支持
    let startX = 0;
    carousel.addEventListener('touchstart', e => startX = e.touches[0].clientX, { passive: true });
    carousel.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 40) show(dx < 0 ? (current + 1) % total : (current - 1 + total) % total);
    });
  });

})();
