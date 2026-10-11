/* Cursor spotlight: shows ONLY when the pointer is over the plain background.
   It fades out over text, buttons, cards, images, nav and forms.
   Add before </body>:  <script src="spotlight.js"></script>  */
(() => {
  if (window.matchMedia("(hover: none)").matches) return;

  const root = document.documentElement;
  const hero = document.getElementById("header");

  // Empty wrappers that count as "background"
  const BG_SELECTOR =
    "html, body, #header, .header-text, #portfolio, #contact, #tech, #about, " +
    ".container, .row, .work-list";

  // Anything inside these is never background
  const BLOCKED_SELECTOR =
    "nav, .personal-info, .work, .contact-left p, .contact-right, #TechStack, " +
    ".social-icons, a, button, img, input, textarea, i, li, form";

  // Text elements: only block when the pointer is on the actual letters
  const TEXT_SELECTOR = "h1, h2, h3, h4, p, span, label";

  function overRealText(el, x, y) {
    const range = document.createRange();
    range.selectNodeContents(el);
    const pad = 4;
    for (const r of range.getClientRects()) {
      if (
        x >= r.left - pad &&
        x <= r.right + pad &&
        y >= r.top - pad &&
        y <= r.bottom + pad
      ) {
        return true;
      }
    }
    return false;
  }

  function isBackground(e) {
    const t = e.target;
    if (!(t instanceof Element)) return false;
    if (t.closest(BLOCKED_SELECTOR)) return false;
    if (t.matches(BG_SELECTOR)) return true;
    if (t.matches(TEXT_SELECTOR)) return !overRealText(t, e.clientX, e.clientY);
    return false; // any other div/element = not background
  }

  let x = window.innerWidth / 2;
  let y = window.innerHeight / 3;
  let tx = x;
  let ty = y;
  let raf = 0;

  function tick() {
    x += (tx - x) * 0.16;
    y += (ty - y) * 0.16;
    root.style.setProperty("--mx", x + "px");
    root.style.setProperty("--my", y + "px");
    if (hero) {
      const b = hero.getBoundingClientRect();
      hero.style.setProperty("--hx", x - b.left + "px");
      hero.style.setProperty("--hy", y - b.top + "px");
    }
    raf =
      Math.abs(tx - x) > 0.5 || Math.abs(ty - y) > 0.5
        ? requestAnimationFrame(tick)
        : 0;
  }

  window.addEventListener(
    "pointermove",
    (e) => {
      tx = e.clientX;
      ty = e.clientY;
      document.body.classList.toggle("spot-on", isBackground(e));
      if (!raf) raf = requestAnimationFrame(tick);
    },
    { passive: true }
  );

  document.addEventListener("mouseleave", () =>
    document.body.classList.remove("spot-on")
  );
})();