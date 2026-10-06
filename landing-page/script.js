/* 브랜든 확장형 행잉 워시백 랜딩 페이지
   기능: 넛지 스크롤, FAQ 아코디언, CTA 안내, 이미지 준비 중 표시, 등장 효과 */
(function () {
  "use strict";

  var root = document.documentElement;
  root.classList.add("js");

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* 1. 스크롤 넛지: 같은 페이지의 섹션으로 이동하고 제목에 포커스를 둔다 */
  function scrollToSection(id) {
    var section = document.getElementById(id);
    if (!section) return;
    section.scrollIntoView({ behavior: reduceMotion.matches ? "auto" : "smooth", block: "start" });
    var heading = section.querySelector("h2");
    if (heading) heading.focus({ preventScroll: true });
  }

  document.querySelectorAll("[data-scroll-target]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      scrollToSection(btn.getAttribute("data-scroll-target"));
    });
  });

  /* 2. CTA: 쿠팡 파트너스 링크는 index.html의 a 요소(href, 새 탭)로 직접 연결한다. */

  /* 3. FAQ: 한 번에 하나만 열리고, 처음에는 모두 닫혀 있다 */
  var questions = Array.prototype.slice.call(document.querySelectorAll(".faq__q"));

  function setOpen(q, open) {
    var panel = document.getElementById(q.getAttribute("aria-controls"));
    q.setAttribute("aria-expanded", open ? "true" : "false");
    if (panel) panel.hidden = !open;
  }

  questions.forEach(function (q) {
    q.addEventListener("click", function () {
      var willOpen = q.getAttribute("aria-expanded") !== "true";
      questions.forEach(function (other) { setOpen(other, false); });
      if (willOpen) setOpen(q, true);
    });
  });

  /* 4. 이미지가 없거나 불러오지 못하면 '이미지 준비 중' 표시 */
  function markMissing(img) {
    var frame = img.closest(".crop, .ph-frame");
    if (frame) frame.classList.add("is-missing");
  }

  document.querySelectorAll("img").forEach(function (img) {
    if (img.complete && img.naturalWidth === 0) {
      markMissing(img);
    } else {
      img.addEventListener("error", function () { markMissing(img); });
    }
  });

  /* 5. 등장 효과: 화면에 들어올 때 한 번만 보여 준다 */
  var targets = document.querySelectorAll("[data-reveal]");
  if (reduceMotion.matches || !("IntersectionObserver" in window)) {
    targets.forEach(function (el) { el.classList.add("is-in"); });
  } else {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    targets.forEach(function (el) { observer.observe(el); });
  }
})();
