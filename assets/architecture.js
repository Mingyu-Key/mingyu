/* ============================================================
   架构图交互
   - hover 节点: 高亮节点自身 + 关联的 flow 箭头 + 关联的 flow card
   - hover flow card: 高亮对应的节点 + flow 箭头
   ============================================================ */

(function () {
  'use strict';

  const nodes = document.querySelectorAll('.arch-node, .arch-center');
  const flows = document.querySelectorAll('.arch-flow');
  const flowCards = document.querySelectorAll('.arch-flow-card');

  function clearAll() {
    document.querySelectorAll('.is-hot').forEach(el => el.classList.remove('is-hot'));
  }

  function nodeFlowKeys(el) {
    return (el.dataset.flowKeys || '').split(',').map(s => s.trim()).filter(Boolean);
  }

  function highlightByNode(nodeEl) {
    const keys = nodeFlowKeys(nodeEl);
    if (!keys.length) return;
    nodeEl.classList.add('is-hot');
    flows.forEach(f => {
      if (keys.includes(f.dataset.flowKeys)) f.classList.add('is-hot');
    });
    flowCards.forEach(c => {
      if (keys.includes(c.dataset.flow)) c.classList.add('is-hot');
    });
  }

  function highlightByFlowCard(card) {
    const key = card.dataset.flow;
    if (!key) return;
    card.classList.add('is-hot');
    flows.forEach(f => {
      if (f.dataset.flowKeys === key) f.classList.add('is-hot');
    });
    nodes.forEach(n => {
      if (nodeFlowKeys(n).includes(key)) n.classList.add('is-hot');
    });
  }

  nodes.forEach(n => {
    n.addEventListener('mouseenter', () => { clearAll(); highlightByNode(n); });
    n.addEventListener('mouseleave', () => { clearAll(); });
  });

  flowCards.forEach(c => {
    c.addEventListener('mouseenter', () => { clearAll(); highlightByFlowCard(c); });
    c.addEventListener('mouseleave', () => { clearAll(); });
  });

})();
