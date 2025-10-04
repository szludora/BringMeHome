var currentTab = 0;
function showTab(n) {
  const tabs = document.getElementsByClassName("tab");
  for (let i = 0; i < tabs.length; i++) tabs[i].classList.add("d-none");
  if (tabs[n]) tabs[n].classList.remove("d-none");

  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const submitBtn = document.getElementById("submitBtn");
  const restartBtn = document.getElementById("restartBtn");

  const lastTab = tabs.length;
  const beforeLastTab = tabs.length - 1;

  // Prev: hide on first and last tab
  prevBtn.classList.toggle("d-none", n === 0 || n === lastTab);

  // Next: hide on last and before-last tab
  nextBtn.classList.toggle("d-none", n === beforeLastTab || n === lastTab);

  // Submit: only visible on before-last tab
  submitBtn.classList.toggle("d-none", n !== beforeLastTab);

  // Restart: only visible on last tab
  restartBtn.classList.toggle("d-none", n !== lastTab);

  fixStepIndicator(n);
}

function nextPrev(n) {
  const tabs = document.getElementsByClassName("tab");

  if (n === 1 && !validateForm()) return;

  if (tabs[currentTab]) tabs[currentTab].classList.add("d-none");

  currentTab += n;

  if (currentTab > tabs.length) currentTab = tabs.length;

  showTab(currentTab);

  // after submit
  if (currentTab === tabs.length) {
    return;
  }
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

let originalForm;
function setOriginalForm(value) {
  originalForm = value;
}

function resetForm() {
  currentTab = 0;
  document.getElementById("matchmakerResult").classList.add("d-none");
  document.getElementById("result").innerHTML = "";
  showTab(0);
}
