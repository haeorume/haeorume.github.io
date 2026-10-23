(() => {
  const nav = document.getElementById("nav");
  const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 8);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  const reveal = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    reveal.forEach((el) => io.observe(el));
  } else {
    reveal.forEach((el) => el.classList.add("in"));
  }

  const form = document.getElementById("signup-form");
  const email = document.getElementById("email");
  const note = document.getElementById("form-note");
  if (form && email && note) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const value = email.value.trim();
      const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      note.classList.remove("ok", "err");
      if (!valid) {
        note.textContent = "올바른 이메일 주소를 입력해 주세요.";
        note.classList.add("err");
        email.focus();
        return;
      }
      try {
        const list = JSON.parse(localStorage.getItem("codescanner_signups") || "[]");
        if (!list.includes(value)) list.push(value);
        localStorage.setItem("codescanner_signups", JSON.stringify(list));
      } catch (_) {}
      const button = form.querySelector("button");
      if (button) {
        button.disabled = true;
        button.textContent = "신청 완료";
      }
      note.textContent = "신청이 접수되었습니다. 베타 초대 메일을 보내드릴게요.";
      note.classList.add("ok");
      email.value = "";
      window.setTimeout(() => {
        if (button) {
          button.disabled = false;
          button.textContent = "무료 체험 시작";
        }
      }, 3200);
    });
  }
})();
