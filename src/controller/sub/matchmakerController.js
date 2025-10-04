var currentTab = 0;

export function showTab(n) {
  var x = document.getElementsByClassName("tab");
  for (let i = 0; i < x.length; i++) x[i].classList.add("d-none");
  if (x[n]) x[n].classList.remove("d-none");

  const prevBtn = document.getElementById("prevBtn");

  if (n === 0) {
    prevBtn.classList.add("d-none");
  } else {
    prevBtn.classList.remove("d-none");
  }

  document.getElementById("nextBtn").innerHTML = "Next";

  if (n == x.length - 1) {
    document.getElementById("nextBtn").innerHTML = "Submit";
  }

  if (n == x.length) {
    document.getElementById("nextBtn").innerHTML = "Újra";
  }

  fixStepIndicator(n);
}

export function nextPrev(n) {
  var x = document.getElementsByClassName("tab");

  if (n === 1 && !validateForm()) return false;

  if (x[currentTab]) x[currentTab].classList.add("d-none");

  currentTab += n;

  if (currentTab >= x.length) {
    showResult();
    return false;
  }

  showTab(currentTab);
}

function validateForm() {
  var x = document.getElementsByClassName("tab");
  if (currentTab >= x.length) return true;

  var y = x[currentTab].getElementsByTagName("input");
  var valid = true;

  for (let i = 0; i < y.length; i++) {
    if (y[i].value === "") {
      y[i].className += " invalid";
      valid = false;
    }
  }

  if (valid) {
    document.getElementsByClassName("step")[currentTab].classList.add("finish");
  }

  return valid;
}

function fixStepIndicator(n) {
  var steps = document.getElementsByClassName("step");
  for (let i = 0; i < steps.length; i++) {
    steps[i].className = steps[i].className.replace(" active", "");
  }
  if (steps[n]) steps[n].className += " active";
}

function showResult() {
  const form = document.getElementById("matchmakerForm");

  form.innerHTML = `
    <h3>Az eredményed:</h3>
    <p>Itt jelenik meg a kitöltés alapján számított eredmény.</p>
    <button id="restartBtn">Újra</button>
  `;

  const restartBtn = document.getElementById("restartBtn");
  restartBtn.addEventListener("click", () => resetForm());
}

let originalForm;

export function setOriginalForm(value) {
  originalForm = value;
}

export function resetForm() {
  currentTab = 0;

  const form = document.getElementById("matchmakerForm");

  if (!originalForm) return;

  form.innerHTML = originalForm.innerHTML;

  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");

  prevBtn.addEventListener("click", () => nextPrev(-1));
  nextBtn.addEventListener("click", () => nextPrev(1));

  showTab(0);
}
