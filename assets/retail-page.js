(function () {
  'use strict';
  const grid = document.getElementById('retailCategories');
  if (!grid) return;

  grid.innerHTML = (window.CATEGORIES || []).map((category, index) => `
    <a class="retail-category" href="${category.id}.html" data-reveal style="--delay:${index * 70}ms">
      <span class="retail-category__index">${String(index + 1).padStart(2, '0')}</span>
      <span class="retail-category__icon">${window.renderIcon ? window.renderIcon(category.icon, 23) : ''}</span>
      <span class="retail-category__body"><strong>${category.label}</strong><small>${category.desc}</small></span>
      <span class="retail-category__count">${category.count} 个系统</span>
      <span class="retail-category__arrow" aria-hidden="true">↗</span>
    </a>
  `).join('');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  grid.querySelectorAll('[data-reveal]').forEach(item => observer.observe(item));
})();
