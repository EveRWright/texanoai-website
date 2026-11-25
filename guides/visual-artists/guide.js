/* TexanoAI · Visual Artists guided walkthrough (preview).
   Everything runs in this browser. No network calls: no fetch, no upload, no analytics. */
(function () {
  "use strict";
  var STORE_KEY = "texanoai.styleLock";
  var steps = Array.prototype.slice.call(document.querySelectorAll("main > .step"));
  var N = steps.length, current = 0;
  var bar = document.querySelector(".progress > span");
  var progress = document.querySelector(".progress");
  var pager = document.getElementById("pager");
  var back = document.getElementById("btn-back");
  var next = document.getElementById("btn-next");
  var tocList = document.getElementById("toc-list");

  // contents list, built from the steps so it always matches the sequence
  steps.forEach(function (s, i) {
    var li = document.createElement("li");
    var a = document.createElement("a");
    a.href = "#" + s.id;
    var n = document.createElement("span"); n.className = "n"; n.textContent = (i + 1 < 10 ? "0" : "") + (i + 1);
    var t = document.createElement("span"); t.textContent = s.getAttribute("data-nav");
    a.appendChild(n); a.appendChild(t); li.appendChild(a); tocList.appendChild(li);
  });

  function indexOfId(id) {
    for (var i = 0; i < N; i++) if (steps[i].id === id) return i;
    return -1;
  }
  function go(i, fromHash) {
    if (i < 0) i = 0;
    if (i > N - 1) i = N - 1;
    current = i;
    steps.forEach(function (s, k) {
      var on = k === i;
      s.classList.toggle("on", on);
      if (on) s.removeAttribute("hidden"); else s.setAttribute("hidden", "");
    });
    var id = steps[i].id;
    document.body.setAttribute("data-step", id);
    var pct = N > 1 ? Math.round((i / (N - 1)) * 1000) / 10 : 100;
    bar.style.width = pct + "%";
    progress.setAttribute("aria-valuenow", String(i + 1));
    progress.setAttribute("aria-valuetext", "Step " + (i + 1) + " of " + N);
    pager.textContent = (i + 1) + " of " + N;
    back.disabled = i === 0;
    if (i === N - 1) { next.dataset.mode = "restart"; next.innerHTML = "Back to start"; }
    else { next.dataset.mode = "next"; next.innerHTML = 'Next <span class="arrow" aria-hidden="true">›</span>'; }
    document.querySelectorAll(".toc a").forEach(function (a) {
      if (a.getAttribute("href") === "#" + id) a.setAttribute("aria-current", "step");
      else a.removeAttribute("aria-current");
    });
    if (id === "style-lock") renderLock();
    if (!fromHash && location.hash !== "#" + id) history.pushState(null, "", "#" + id);
    window.scrollTo(0, 0);
    steps[i].setAttribute("tabindex", "-1");
    try { steps[i].focus({ preventScroll: true }); } catch (e) {}
  }
  function fromHash() {
    var i = indexOfId(location.hash.replace(/^#/, ""));
    go(i < 0 ? 0 : i, true);
  }

  back.addEventListener("click", function () { go(current - 1); });
  next.addEventListener("click", function () { if (this.dataset.mode === "restart") go(0); else go(current + 1); });
  var begin = document.getElementById("btn-begin");
  if (begin) begin.addEventListener("click", function () { go(1); });
  window.addEventListener("popstate", fromHash);

  var toc = document.getElementById("toc");
  function openToc(open) {
    toc.classList.toggle("open", open);
    toc.setAttribute("aria-hidden", open ? "false" : "true");
    if (open) { var a = toc.querySelector('a[aria-current="step"]') || toc.querySelector("a"); if (a) a.focus(); }
    else document.getElementById("btn-contents").focus();
  }
  document.getElementById("btn-contents").addEventListener("click", function () { openToc(true); });
  document.getElementById("btn-close-contents").addEventListener("click", function () { openToc(false); });
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest('a[href^="#"]');
    if (!a) return;
    var i = indexOfId(a.getAttribute("href").slice(1));
    if (i < 0) return;
    e.preventDefault();
    if (toc.classList.contains("open")) openToc(false);
    go(i);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && toc.classList.contains("open")) { openToc(false); return; }
    var tag = (e.target.tagName || "").toLowerCase();
    if (tag === "input" || tag === "textarea" || toc.classList.contains("open")) return;
    if (e.key === "ArrowRight") go(current + 1);
    else if (e.key === "ArrowLeft") go(current - 1);
  });

  // clipboard helpers
  function fallbackCopy(text) {
    var ta = document.createElement("textarea");
    ta.value = text; ta.setAttribute("readonly", "");
    ta.style.position = "fixed"; ta.style.left = "-9999px";
    document.body.appendChild(ta); ta.select();
    var ok = false;
    try { ok = document.execCommand("copy"); } catch (err) { ok = false; }
    document.body.removeChild(ta);
    return ok;
  }
  function copyText(text, done) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () { done(true); }, function () { done(fallbackCopy(text)); });
    } else done(fallbackCopy(text));
  }
  document.querySelectorAll(".copy-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var card = btn.closest(".prompt");
      var p = card && card.querySelector(".ptext");
      if (!p) return;
      copyText(p.textContent, function (ok) {
        var label = btn.querySelector(".copy-label");
        btn.classList.toggle("is-copied", ok);
        if (label) label.textContent = ok ? "Copied" : "Copy";
        window.setTimeout(function () { btn.classList.remove("is-copied"); if (label) label.textContent = "Copy"; }, 1800);
      });
    });
  });

  /* ---------- photography style exercise ---------- */
  var answers = {}, photoTraits = null, photoUrls = [], defEdited = false;
  var QUESTIONS = [["vibe", "Vibe"], ["light", "Light"], ["color", "Color"], ["subjects", "Subjects"], ["framing", "Framing"], ["editing", "Editing"]];

  function readAnswers() {
    answers = {};
    document.querySelectorAll("[data-q]").forEach(function (s) {
      var q = s.getAttribute("data-q");
      var picked = [];
      s.querySelectorAll('.chip[aria-pressed="true"]').forEach(function (c) { picked.push(c.textContent.trim()); });
      var own = (s.querySelector(".own-input").value || "").trim();
      answers[q] = { picked: picked, own: own };
    });
    return answers;
  }
  function applyAnswers(a) {
    document.querySelectorAll("[data-q]").forEach(function (s) {
      var v = (a && a[s.getAttribute("data-q")]) || { picked: [], own: "" };
      s.querySelectorAll(".chip").forEach(function (c) {
        c.setAttribute("aria-pressed", v.picked.indexOf(c.textContent.trim()) >= 0 ? "true" : "false");
      });
      s.querySelector(".own-input").value = v.own || "";
    });
  }
  document.querySelectorAll(".chip").forEach(function (c) {
    c.addEventListener("click", function () {
      c.setAttribute("aria-pressed", c.getAttribute("aria-pressed") === "true" ? "false" : "true");
    });
  });

  // pixel reading, all local: canvas sampling of each chosen photo
  function hex(r, g, b) {
    return "#" + [r, g, b].map(function (v) { v = Math.max(0, Math.min(255, Math.round(v))); return (v < 16 ? "0" : "") + v.toString(16); }).join("").toUpperCase();
  }
  function colorName(r, g, b) {
    var mx = Math.max(r, g, b) / 255, mn = Math.min(r, g, b) / 255, l = (mx + mn) / 2, d = mx - mn;
    var s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
    if (l < 0.1) return "Near black";
    if (l > 0.93 && s < 0.35) return "Near white";
    if (s < 0.12) return l < 0.35 ? "Charcoal gray" : (l > 0.7 ? "Light gray" : "Gray");
    var h; var R = r / 255, G = g / 255, B = b / 255;
    if (mx === R) h = ((G - B) / d) % 6; else if (mx === G) h = (B - R) / d + 2; else h = (R - G) / d + 4;
    h = (h * 60 + 360) % 360;
    var name;
    if (h < 15 || h >= 345) name = "red";
    else if (h < 40) name = (l < 0.45 ? "brown" : "orange");
    else if (h < 65) name = (l < 0.4 ? "olive" : "gold");
    else if (h < 160) name = "green";
    else if (h < 195) name = "teal";
    else if (h < 250) name = "blue";
    else if (h < 290) name = "violet";
    else name = "rose";
    var pre = l < 0.3 ? "Deep " : (l > 0.72 ? "Pale " : (s < 0.3 ? "Muted " : ""));
    var out = pre + name;
    return out.charAt(0).toUpperCase() + out.slice(1);
  }
  function samplePixels(img) {
    var max = 160, w = img.naturalWidth, h = img.naturalHeight;
    var k = Math.min(1, max / Math.max(w, h));
    var cw = Math.max(1, Math.round(w * k)), ch = Math.max(1, Math.round(h * k));
    var c = document.createElement("canvas"); c.width = cw; c.height = ch;
    var ctx = c.getContext("2d", { willReadFrequently: true });
    ctx.drawImage(img, 0, 0, cw, ch);
    var d = ctx.getImageData(0, 0, cw, ch).data, px = [];
    for (var i = 0; i < d.length; i += 4) if (d[i + 3] > 127) px.push([d[i], d[i + 1], d[i + 2]]);
    return px;
  }
  function analyze(all) {
    var n = all.length; if (!n) return null;
    var sumL = 0, sumL2 = 0, sumR = 0, sumB = 0, sumS = 0;
    for (var i = 0; i < n; i++) {
      var p = all[i], L = 0.2126 * p[0] + 0.7152 * p[1] + 0.0722 * p[2];
      sumL += L; sumL2 += L * L; sumR += p[0]; sumB += p[2];
      var mx = Math.max(p[0], p[1], p[2]), mn = Math.min(p[0], p[1], p[2]);
      sumS += mx === 0 ? 0 : (mx - mn) / mx;
    }
    var meanL = sumL / n, sd = Math.sqrt(Math.max(0, sumL2 / n - meanL * meanL));
    var warm = (sumR - sumB) / n, sat = sumS / n;
    // palette: k-means (k=5) on an even sample, seeded at brightness quantiles
    var step = Math.max(1, Math.floor(n / 6000)), sm = [];
    for (var j = 0; j < n; j += step) sm.push(all[j]);
    var sorted = sm.slice().sort(function (a, b) { return (a[0] + a[1] + a[2]) - (b[0] + b[1] + b[2]); });
    var K = Math.min(5, sm.length), cen = [];
    for (var q = 0; q < K; q++) cen.push(sorted[Math.floor((q + 0.5) * sorted.length / K)].slice());
    var assign = new Array(sm.length);
    for (var it = 0; it < 12; it++) {
      var acc = cen.map(function () { return [0, 0, 0, 0]; });
      for (var m = 0; m < sm.length; m++) {
        var best = 0, bd = Infinity;
        for (var c = 0; c < K; c++) {
          var dr = sm[m][0] - cen[c][0], dg = sm[m][1] - cen[c][1], db = sm[m][2] - cen[c][2], dd = dr * dr + dg * dg + db * db;
          if (dd < bd) { bd = dd; best = c; }
        }
        assign[m] = best; acc[best][0] += sm[m][0]; acc[best][1] += sm[m][1]; acc[best][2] += sm[m][2]; acc[best][3]++;
      }
      for (var c2 = 0; c2 < K; c2++) if (acc[c2][3]) cen[c2] = [acc[c2][0] / acc[c2][3], acc[c2][1] / acc[c2][3], acc[c2][2] / acc[c2][3]];
      cen.count = acc.map(function (a) { return a[3]; });
    }
    var pal = cen.map(function (cc, idx) { return { rgb: cc, share: cen.count[idx] / sm.length }; })
      .filter(function (p) { return p.share > 0.02; })
      .sort(function (a, b) { return b.share - a.share; });
    var merged = [];
    pal.forEach(function (p) {
      var dup = merged.some(function (m2) { var a = m2.rgb, b = p.rgb; return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) + Math.abs(a[2] - b[2]) < 30; });
      if (!dup) merged.push(p);
    });
    return {
      palette: merged.map(function (p) { return { hex: hex(p.rgb[0], p.rgb[1], p.rgb[2]), name: colorName(p.rgb[0], p.rgb[1], p.rgb[2]), share: Math.round(p.share * 100) }; }),
      temperature: sat < 0.06 ? "Neutral (little color cast)" : (warm > 12 ? "Warm" : (warm < -8 ? "Cool" : "Neutral")),
      brightness: meanL < 95 ? "Moody (darker tones)" : (meanL > 150 ? "Bright (lighter tones)" : "Balanced"),
      contrast: sd < 40 ? "Low (soft)" : (sd < 62 ? "Medium" : "High (punchy)"),
      colorStrength: sat < 0.06 ? "Black and white, or close to it" : (sat < 0.18 ? "Muted" : (sat < 0.38 ? "Moderate" : "Rich")),
      measures: { meanLuminance: Math.round(meanL), luminanceSpread: Math.round(sd), warmth: Math.round(warm), saturation: Math.round(sat * 100) / 100 }
    };
  }
  function swatchesHTML(el, palette) {
    el.innerHTML = "";
    (palette || []).forEach(function (p) {
      var d = document.createElement("div"); d.className = "sw";
      var i = document.createElement("i"); i.style.backgroundColor = p.hex;
      var s = document.createElement("span"); var b = document.createElement("b"); b.textContent = p.name;
      s.appendChild(b); s.appendChild(document.createTextNode(p.hex + " · " + p.share + "%"));
      d.appendChild(i); d.appendChild(s); el.appendChild(d);
    });
  }
  var photoStatus = document.getElementById("photo-status");
  function showTraits() {
    var box = document.getElementById("traits");
    if (!photoTraits) { box.hidden = true; return; }
    swatchesHTML(document.getElementById("swatches"), photoTraits.palette);
    document.getElementById("t-temp").textContent = photoTraits.temperature;
    document.getElementById("t-bright").textContent = photoTraits.brightness;
    document.getElementById("t-contrast").textContent = photoTraits.contrast;
    document.getElementById("t-sat").textContent = photoTraits.colorStrength;
    box.hidden = false;
  }
  function loadImage(url) {
    return new Promise(function (res, rej) { var im = new Image(); im.onload = function () { res(im); }; im.onerror = rej; im.src = url; });
  }
  function handleFiles(list) {
    var files = Array.prototype.filter.call(list || [], function (f) { return /^image\//.test(f.type); });
    if (!files.length) { photoStatus.textContent = "Those files are not photos this browser can read."; return; }
    clearPhotos(true);
    var extra = files.length > 6; files = files.slice(0, 6);
    photoStatus.textContent = "Reading your photos in this browser…";
    var thumbs = document.getElementById("thumbs"), all = [], read = 0;
    Promise.all(files.map(function (f) {
      var url = URL.createObjectURL(f); photoUrls.push(url);
      return loadImage(url).then(function (im) {
        var t = document.createElement("img"); t.src = url; t.alt = "Your photo"; thumbs.appendChild(t);
        var px = samplePixels(im); for (var i = 0; i < px.length; i++) all.push(px[i]); read++;
      }, function () {});
    })).then(function () {
      photoTraits = analyze(all);
      showTraits();
      document.getElementById("btn-clear-photos").disabled = !photoUrls.length;
      photoStatus.textContent = read ? ("Read " + read + (read === 1 ? " photo" : " photos") + " in this browser." + (extra ? " Using the first six." : "")) : "Those photos could not be read in this browser.";
      document.body.setAttribute("data-photos-read", String(read));
    });
  }
  function clearPhotos(quiet) {
    photoUrls.forEach(function (u) { URL.revokeObjectURL(u); }); photoUrls = [];
    document.getElementById("thumbs").innerHTML = "";
    photoTraits = null; showTraits();
    document.getElementById("btn-clear-photos").disabled = true;
    document.getElementById("photo-input").value = "";
    if (!quiet) photoStatus.textContent = "Photos removed.";
    document.body.setAttribute("data-photos-read", "0");
  }
  document.getElementById("photo-input").addEventListener("change", function () { handleFiles(this.files); });
  document.getElementById("btn-clear-photos").addEventListener("click", function () { clearPhotos(false); });
  var drop = document.getElementById("drop-zone");
  ["dragenter", "dragover"].forEach(function (ev) { drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.add("over"); }); });
  ["dragleave", "drop"].forEach(function (ev) { drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.remove("over"); }); });
  drop.addEventListener("drop", function (e) { if (e.dataTransfer) handleFiles(e.dataTransfer.files); });
  // keep a stray drop elsewhere from opening the photo in the tab
  window.addEventListener("dragover", function (e) { e.preventDefault(); });
  window.addEventListener("drop", function (e) { e.preventDefault(); });

  // Style Lock
  function low(s) { return s.charAt(0).toLowerCase() + s.slice(1); }
  function list(arr) {
    arr = arr.map(low);
    if (arr.length < 2) return arr.join("");
    return arr.slice(0, -1).join(", ") + " and " + arr[arr.length - 1];
  }
  function bits(q) { var a = answers[q] || { picked: [], own: "" }; var out = a.picked.slice(); if (a.own) out.push(a.own); return out; }
  function phrase(q) {
    var a = answers[q] || { picked: [], own: "" };
    if (!a.picked.length) return a.own;
    return list(a.picked) + (a.own ? " (in my words: " + a.own + ")" : "");
  }
  function buildDefinition() {
    var s = [];
    if (bits("vibe").length) s.push("My work feels " + phrase("vibe") + ".");
    if (bits("subjects").length) s.push("I photograph " + phrase("subjects") + ".");
    if (bits("light").length) s.push("My light: " + phrase("light") + ".");
    if (bits("color").length) s.push("My color: " + phrase("color") + ".");
    if (bits("framing").length) s.push("My framing: " + phrase("framing") + ".");
    if (bits("editing").length) s.push("My editing: " + phrase("editing") + ".");
    if (photoTraits) {
      s.push("In my photos the look reads " + low(photoTraits.temperature.split(" (")[0]) + ", " + low(photoTraits.brightness.split(" (")[0]) + ", with " + low(photoTraits.contrast.split(" (")[0]) + " contrast" +
        (photoTraits.palette.length ? ", and a palette of " + list(photoTraits.palette.slice(0, 4).map(function (p) { return p.name + " " + p.hex; })) : "") + ".");
    }
    return s.join(" ");
  }
  function lockObject() {
    readAnswers();
    var def = document.getElementById("lock-def").value.trim();
    var o = { type: "TexanoAI Style Lock", version: 1, saved: new Date().toISOString(), definition: def, answers: {}, photoTraits: null };
    QUESTIONS.forEach(function (q) { o.answers[q[0]] = answers[q[0]]; });
    if (photoTraits) o.photoTraits = { palette: photoTraits.palette, temperature: photoTraits.temperature, brightness: photoTraits.brightness, contrast: photoTraits.contrast, colorStrength: photoTraits.colorStrength, measures: photoTraits.measures };
    return o;
  }
  function lockText(o) {
    var lines = ["STYLE LOCK", "", o.definition || "(no definition yet)", ""];
    QUESTIONS.forEach(function (q) { var b = bits(q[0]); if (b.length) lines.push(q[1] + ": " + b.join(", ")); });
    if (o.photoTraits) {
      lines.push("Temperature: " + o.photoTraits.temperature, "Brightness: " + o.photoTraits.brightness, "Contrast: " + o.photoTraits.contrast, "Color strength: " + o.photoTraits.colorStrength);
      lines.push("Palette: " + o.photoTraits.palette.map(function (p) { return p.name + " " + p.hex; }).join(", "));
    }
    return lines.join("\n");
  }
  function renderLock() {
    readAnswers();
    var ta = document.getElementById("lock-def");
    if (!defEdited) ta.value = buildDefinition();
    ta.placeholder = "Answer the questions or add photos, and your style definition appears here.";
    var dl = document.getElementById("lock-traits"); dl.innerHTML = "";
    function row(k, v) { var d = document.createElement("div"); var dt = document.createElement("dt"); dt.textContent = k; var dd = document.createElement("dd"); dd.textContent = v; d.appendChild(dt); d.appendChild(dd); dl.appendChild(d); }
    QUESTIONS.forEach(function (q) { var b = bits(q[0]); if (b.length) row(q[1], b.join(", ")); });
    if (photoTraits) { row("Temperature", photoTraits.temperature); row("Brightness", photoTraits.brightness); row("Contrast", photoTraits.contrast); row("Color strength", photoTraits.colorStrength); }
    swatchesHTML(document.getElementById("lock-swatches"), photoTraits ? photoTraits.palette : []);
  }
  document.getElementById("lock-def").addEventListener("input", function () { defEdited = this.value.trim().length > 0; });
  var lockStatus = document.getElementById("lock-status");
  document.getElementById("btn-lock-copy").addEventListener("click", function () {
    var o = lockObject();
    copyText(lockText(o), function (ok) { lockStatus.textContent = ok ? "Copied. Paste it wherever you keep notes." : "Copy did not work in this browser. Select the text and copy it by hand."; });
  });
  document.getElementById("btn-lock-download").addEventListener("click", function () {
    var o = lockObject(); o.text = lockText(o);
    var blob = new Blob([JSON.stringify(o, null, 2)], { type: "application/json" });
    var url = URL.createObjectURL(blob), a = document.createElement("a");
    a.href = url; a.download = "style-lock.json"; document.body.appendChild(a); a.click(); a.remove();
    window.setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
    lockStatus.textContent = "Downloaded to this device.";
  });
  document.getElementById("btn-lock-save").addEventListener("click", function () {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(lockObject())); lockStatus.textContent = "Saved on this device. Only this browser can see it."; }
    catch (e) { lockStatus.textContent = "This browser would not save it. Use Download instead."; }
  });
  document.getElementById("btn-lock-clear").addEventListener("click", function () {
    try { localStorage.removeItem(STORE_KEY); } catch (e) {}
    applyAnswers(null); readAnswers(); clearPhotos(true); photoStatus.textContent = "";
    defEdited = false; document.getElementById("lock-def").value = ""; renderLock();
    lockStatus.textContent = "Cleared. Nothing is saved on this device.";
  });
  // restore a Style Lock saved earlier on this device
  try {
    var saved = JSON.parse(localStorage.getItem(STORE_KEY) || "null");
    if (saved && saved.type === "TexanoAI Style Lock") {
      applyAnswers(saved.answers); readAnswers();
      if (saved.photoTraits) { photoTraits = saved.photoTraits; showTraits(); photoStatus.textContent = "Showing traits from your saved Style Lock. Your photos themselves were never saved."; }
      if (saved.definition) { document.getElementById("lock-def").value = saved.definition; defEdited = true; }
      lockStatus.textContent = "Loaded your Style Lock saved on this device.";
    }
  } catch (e) {}

  fromHash();
})();
