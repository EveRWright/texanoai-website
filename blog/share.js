(function () {
  var box = document.querySelector("[data-share]");
  if (!box) return;
  var url = box.getAttribute("data-url") || window.location.href;
  var title = box.getAttribute("data-title") || document.title;
  var fb = box.querySelector("[data-share-fb]");
  var li = box.querySelector("[data-share-li]");
  var x = box.querySelector("[data-share-x]");
  var mail = box.querySelector("[data-share-mail]");
  var copy = box.querySelector("[data-share-copy]");
  var more = box.querySelector("[data-share-more]");
  if (fb) fb.href = "https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(url);
  if (li) li.href = "https://www.linkedin.com/sharing/share-offsite/?url=" + encodeURIComponent(url);
  if (x) x.href = "https://twitter.com/intent/tweet?url=" + encodeURIComponent(url) + "&text=" + encodeURIComponent(title);
  if (mail) mail.href = "mailto:?subject=" + encodeURIComponent(title) + "&body=" + encodeURIComponent(url);
  if (copy) {
    copy.addEventListener("click", function () {
      navigator.clipboard.writeText(url).then(function () {
        var t = copy.textContent;
        copy.textContent = "Copied";
        copy.classList.add("copied");
        setTimeout(function () { copy.textContent = t; copy.classList.remove("copied"); }, 1600);
      });
    });
  }
  if (more && navigator.share) {
    more.hidden = false;
    more.addEventListener("click", function () {
      navigator.share({ title: title, url: url }).catch(function () {});
    });
  }
})();
