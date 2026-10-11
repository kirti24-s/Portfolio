const tablinks = document.getElementsByClassName("tab-links");
const tabcontents = document.getElementsByClassName("tab-contents");

function opentab(tabname, evt) {
  for (const tablink of tablinks) tablink.classList.remove("active-link");
  for (const tabcontent of tabcontents) tabcontent.classList.remove("active-tab");
  (evt || event).currentTarget.classList.add("active-link");
  document.getElementById(tabname).classList.add("active-tab");
}

const scriptURL =
  "https://script.google.com/macros/s/AKfycbyWk5ytrTntK97alo7esZJ5PNdlNerSwz1oS54jV6jW_PbIvjiZuYuzWPpdbHnS_6gAqw/exec";
const form = document.forms["submit-to-google-sheet"];
const msg = document.getElementById("msg");

if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    fetch(scriptURL, { method: "POST", body: new FormData(form) })
      .then(() => {
        msg.innerHTML = "Message sent successfully !";
        setTimeout(() => (msg.innerHTML = ""), 5000);
        form.reset();
      })
      .catch((error) => {
        msg.innerHTML = "Something went wrong. Please try again.";
        console.error("Error!", error.message);
      });
  });
}