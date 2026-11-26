/* Guides dropdown (preview 2026-11-25).
   To add a guide: add one line to GUIDES below and a card on /guides/index.html.
   Every page's Guides menu is rebuilt from this list, so the nav stays in step everywhere.
   The HTML inside each menu is the no-JavaScript fallback. */
(function () {
  var GUIDES = [
    { title: "Visual Artists", href: "/guides/visual-artists/" }
  ];

  function norm(p) { return (p || "/").replace(/index\.html$/, "").replace(/\/?$/, "/"); }
  var here = norm(location.pathname);

  var drops = Array.prototype.slice.call(document.querySelectorAll("details.nav-drop"));
  if (!drops.length) return;

  drops.forEach(function (d) {
    var menu = d.querySelector("[data-guides-menu]");
    if (menu) {
      var frag = document.createDocumentFragment();
      GUIDES.forEach(function (g) {
        var a = document.createElement("a");
        a.href = g.href;
        a.textContent = g.title;
        if (norm(g.href) === here) a.setAttribute("aria-current", "page");
        frag.appendChild(a);
      });
      var all = document.createElement("a");
      all.href = "/guides/";
      all.className = "nav-drop-all";
      all.textContent = "All guides";
      if (here === "/guides/") all.setAttribute("aria-current", "page");
      frag.appendChild(all);
      menu.innerHTML = "";
      menu.appendChild(frag);
    }
    if (here.indexOf("/guides/") === 0) d.classList.add("is-current");
    var summary = d.querySelector("summary");
    if (summary) summary.setAttribute("aria-expanded", d.open ? "true" : "false");
    d.addEventListener("toggle", function () {
      if (summary) summary.setAttribute("aria-expanded", d.open ? "true" : "false");
    });
  });

  function closeAll(except) {
    drops.forEach(function (d) { if (d !== except) d.open = false; });
  }
  document.addEventListener("click", function (e) {
    drops.forEach(function (d) { if (d.open && !d.contains(e.target)) d.open = false; });
  });
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    drops.forEach(function (d) {
      if (d.open) {
        d.open = false;
        var s = d.querySelector("summary");
        if (s && d.contains(document.activeElement)) s.focus();
      }
    });
  });
  document.addEventListener("focusin", function (e) {
    drops.forEach(function (d) { if (d.open && !d.contains(e.target)) d.open = false; });
  });
  closeAll(null);
})();
