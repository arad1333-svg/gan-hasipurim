/* ============================================================
   GAN HASIPURIM — Bubble Interaction System
   ============================================================ */
(function () {
  'use strict';

  const overlay  = document.getElementById('bubbleOverlay');
  const card     = document.getElementById('bubbleCard');
  const closeBtn = document.getElementById('bubbleClose');
  const content  = document.getElementById('bubbleContent');

  let lastFocused = null;
  let qrGenerated = false;

  /* ── Open ── */
  function openBubble(id, trigger) {
    const tpl = document.getElementById('bubble-' + id);
    if (!tpl) return;

    content.innerHTML = '';
    content.appendChild(tpl.content.cloneNode(true));

    if (id === 'contact' && !qrGenerated) {
      generateQR();
    }

    lastFocused = trigger;
    overlay.hidden = false;
    requestAnimationFrame(() => requestAnimationFrame(() => {
      overlay.classList.add('is-visible');
    }));
    closeBtn.focus();
    overlay.addEventListener('keydown', trapFocus);
  }

  /* ── Close ── */
  function closeBubble() {
    overlay.classList.remove('is-visible');
    card.addEventListener('transitionend', function h() {
      overlay.hidden = true;
      card.removeEventListener('transitionend', h);
      if (lastFocused) lastFocused.focus();
    }, { once: true });
    overlay.removeEventListener('keydown', trapFocus);
  }

  /* ── Focus trap ── */
  function trapFocus(e) {
    if (e.key === 'Escape') { closeBubble(); return; }
    if (e.key !== 'Tab') return;
    const els = [...overlay.querySelectorAll(
      'button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])'
    )];
    if (!els.length) return;
    if (e.shiftKey && document.activeElement === els[0]) {
      e.preventDefault(); els[els.length - 1].focus();
    } else if (!e.shiftKey && document.activeElement === els[els.length - 1]) {
      e.preventDefault(); els[0].focus();
    }
  }

  /* ── QR Code ── */
  function generateQR() {
    const wrap = document.getElementById('qrcode');
    if (!wrap || typeof QRCode === 'undefined') return;
    wrap.innerHTML = '';
    new QRCode(wrap, {
      text: 'https://wa.me/972547774120',
      width: 110, height: 110,
      colorDark: '#0040A1',
      colorLight: '#ffffff',
      correctLevel: QRCode.CorrectLevel.M
    });
    qrGenerated = true;
  }

  /* ── Wire up all expand buttons ── */
  document.querySelectorAll('.expand-btn[data-bubble]').forEach(btn => {
    btn.addEventListener('click', function () {
      openBubble(this.dataset.bubble, this);
    });
  });

  /* ── Close triggers ── */
  closeBtn.addEventListener('click', closeBubble);
  overlay.addEventListener('click', e => { if (e.target === overlay) closeBubble(); });

})();
