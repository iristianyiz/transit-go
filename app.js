(() => {
  const ticket = document.getElementById("ticket");
  const iconsLayer = document.getElementById("icons");
  const expireEl = document.getElementById("expire-time");

  /* Flat front-view bus — slightly less wide than before */
  const BUS_SVG = `
    <svg viewBox="0 0 92 78" aria-hidden="true">
      <path fill="currentColor" fill-rule="evenodd" d="
        M5 11
        C5 4 14 2 46 2
        C78 2 87 4 87 11
        L87 78
        L70 78
        L70 62
        L22 62
        L22 78
        L5 78
        Z

        M28 9
        H64
        Q67 9 67 11.5
        V16.5
        Q67 19 64 19
        H28
        Q25 19 25 16.5
        V11.5
        Q25 9 28 9
        Z

        M13 25
        H79
        V46
        H13
        Z

        M27 48
        A6.5 6.5 0 1 1 27 61
        A6.5 6.5 0 1 1 27 48
        Z

        M65 48
        A6.5 6.5 0 1 1 65 61
        A6.5 6.5 0 1 1 65 48
        Z
      "/>
    </svg>
  `;

  /* —— color toggle —— */
  function toggleColor() {
    ticket.classList.toggle("ticket--blue");
    ticket.classList.toggle("ticket--green");
  }

  ticket.addEventListener("click", toggleColor);
  ticket.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleColor();
    }
  });

  /* —— expiration: now + 2.5 hours —— */
  function pad(n) {
    return String(n).padStart(2, "0");
  }

  function formatExpiration(date) {
    const mm = pad(date.getMonth() + 1);
    const dd = pad(date.getDate());
    const yy = pad(date.getFullYear() % 100);
    let h = date.getHours();
    const m = pad(date.getMinutes());
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12;
    if (h === 0) h = 12;
    return `${mm}/${dd}/${yy} ${h}:${m} ${ampm}`;
  }

  function updateExpiration() {
    const expires = new Date(Date.now() + 2.5 * 60 * 60 * 1000);
    expireEl.textContent = formatExpiration(expires);
  }

  updateExpiration();
  setInterval(updateExpiration, 1000);

  /* —— diagonal motion: bottom-left → top-right —— */
  const ICON_COUNT = 4;
  const icons = [];

  function createIcon(size) {
    const el = document.createElement("div");
    el.className = "float-icon";
    el.style.fontSize = `${size}px`;
    el.innerHTML = `<span class="x">X</span>${BUS_SVG}`;
    iconsLayer.appendChild(el);
    return el;
  }

  function seedIcons() {
    for (let i = 0; i < ICON_COUNT; i++) {
      const size = 34 + (i % 2) * 8;
      const el = createIcon(size);
      icons.push({
        el,
        size,
        // progress 0 = bottom-left, 1 = top-right; stagger along the line
        t: i / ICON_COUNT,
        speed: 0.00042 + i * 0.00004,
      });
    }
  }

  function tick() {
    const { width, height } = iconsLayer.getBoundingClientRect();

    for (const icon of icons) {
      icon.t += icon.speed;
      if (icon.t > 1) icon.t -= 1;

      const iconW = icon.size * 2.55;
      const iconH = icon.size * 1.05;
      const maxX = Math.max(0, width - iconW);
      const maxY = Math.max(0, height - iconH);

      // bottom-left (0, maxY) → top-right (maxX, 0)
      const x = icon.t * maxX;
      const y = (1 - icon.t) * maxY;

      icon.el.style.transform = `translate(${x}px, ${y}px)`;
    }
    requestAnimationFrame(tick);
  }

  seedIcons();
  requestAnimationFrame(tick);
})();
