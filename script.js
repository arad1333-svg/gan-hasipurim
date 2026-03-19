/* ============================================================
   GAN HASIPURIM — BUBBLE INTERACTION SYSTEM
   ============================================================ */

(function () {
  'use strict';

  const overlay   = document.getElementById('bubbleOverlay');
  const card      = document.getElementById('bubbleCard');
  const closeBtn  = document.getElementById('bubbleClose');
  const content   = document.getElementById('bubbleContent');

  let lastFocused = null;

  /* ── Open bubble ── */
  function openBubble(templateId, triggerEl) {
    const tpl = document.getElementById('bubble-' + templateId);
    if (!tpl) return;

    // Populate
    content.innerHTML = '';
    content.appendChild(tpl.content.cloneNode(true));

    // Generate QR code if this is the contact bubble
    if (templateId === 'contact') {
      generateQR();
    }

    // Show overlay
    lastFocused = triggerEl;
    overlay.hidden = false;

    // Force reflow then animate in
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        overlay.classList.add('is-visible');
      });
    });

    // Focus close button for accessibility
    closeBtn.focus();

    // Trap focus inside bubble
    overlay.addEventListener('keydown', trapFocus);
  }

  /* ── Close bubble ── */
  function closeBubble() {
    overlay.classList.remove('is-visible');

    // Wait for animation to finish before hiding
    card.addEventListener('transitionend', function handler() {
      overlay.hidden = true;
      card.removeEventListener('transitionend', handler);
      if (lastFocused) lastFocused.focus();
    }, { once: true });

    overlay.removeEventListener('keydown', trapFocus);
  }

  /* ── Trap focus inside bubble ── */
  function trapFocus(e) {
    if (e.key === 'Escape') {
      closeBubble();
      return;
    }

    if (e.key !== 'Tab') return;

    const focusable = overlay.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last  = focusable[focusable.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  /* ── Generate QR code ── */
  function generateQR() {
    const container = document.getElementById('qrcode');
    if (!container) return;
    container.innerHTML = '';

    // Wait for QRCode library to be available
    if (typeof QRCode === 'undefined') return;

    new QRCode(container, {
      text: 'https://wa.me/972547774120',
      width: 120,
      height: 120,
      colorDark: '#0040A1',
      colorLight: '#ffffff',
      correctLevel: QRCode.CorrectLevel.M
    });
  }

  /* ── Event Listeners ── */

  // All expandable buttons
  document.querySelectorAll('.expandable[data-bubble]').forEach(btn => {
    btn.addEventListener('click', function () {
      const id = this.dataset.bubble;
      openBubble(id, this);
    });
  });

  // Close button
  closeBtn.addEventListener('click', closeBubble);

  // Click outside bubble card closes it
  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) {
      closeBubble();
    }
  });

})();
