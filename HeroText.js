/* Home page: "I am an AI Engineer" with a continuous typing animation,
   plus an improved intro paragraph.
   Add before </body> (after script.js):  <script src="hero-text.js"></script>
   Edit ROLES and INTRO below to change the wording. */
(() => {
  const ROLES = [
    "an AI Engineer",
    "a MERN Stack Developer",
    "a Machine Learning Developer",
    "a Full Stack Developer",
  ];

  const INTRO =
    "I build fast, scalable full stack web applications with MongoDB, Express.js, React and Node.js, " +
    "from clean REST APIs to polished, responsive interfaces. " +
    "As an AI Engineer, I also bring machine learning and intelligent features into these products, " +
    "turning ideas and data into smart, reliable solutions.";

  const h4 = document.querySelector(".header-text h4");
  const p = document.querySelector(".header-text p");

  if (p) p.textContent = INTRO;
  if (!h4) return;

  h4.innerHTML =
    'I am <span class="role-text"></span><span class="role-caret" aria-hidden="true"></span>';
  const out = h4.querySelector(".role-text");

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) {
    out.textContent = ROLES[0];
    return;
  }

  let role = 0;
  let chars = 0;
  let deleting = false;

  function step() {
    const full = ROLES[role];
    chars += deleting ? -1 : 1;
    out.textContent = full.slice(0, chars);

    let delay = deleting ? 38 : 85;

    if (!deleting && chars === full.length) {
      deleting = true;
      delay = 1800; // pause on the finished title
    } else if (deleting && chars === 0) {
      deleting = false;
      role = (role + 1) % ROLES.length;
      delay = 350;
    }
    setTimeout(step, delay);
  }

  step();
})();