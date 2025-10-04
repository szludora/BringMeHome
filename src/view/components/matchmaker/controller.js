var currentTab = 0;
function showTab(n) {
  const tabs = document.getElementsByClassName("tab");
  for (let i = 0; i < tabs.length; i++) tabs[i].classList.add("d-none");
  if (tabs[n]) tabs[n].classList.remove("d-none");

  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const restartBtn = document.getElementById("restartBtn");

  // first tab
  prevBtn.classList.toggle("d-none", n === 0);
  nextBtn.innerHTML = "Next";

  if (n === tabs.length - 1) {
    nextBtn.innerHTML = "Submit";
  }

  // after submit
  if (n === tabs.length) {
    nextBtn.classList.add("d-none");
    prevBtn.classList.add("d-none");
    restartBtn.classList.remove("d-none");
  } else {
    nextBtn.classList.remove("d-none");
    restartBtn.classList.add("d-none");
  }

  fixStepIndicator(n);
}

function nextPrev(n) {
  const tabs = document.getElementsByClassName("tab");

  if (n === 1 && !validateForm()) return false;

  if (tabs[currentTab]) tabs[currentTab].classList.add("d-none");

  currentTab += n;

  if (currentTab > tabs.length) currentTab = tabs.length;

  showTab(currentTab);

  // after submit
  if (currentTab === tabs.length) {
    showResult();
    return false;
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

function showResult() {
  const container = document.getElementById("matchmakerResult");
  const resultContainer = document.getElementById("result");
  container.classList.remove("d-none");
  resultContainer.innerHTML += "Ez a te személyre szabott eredményed 🎉";
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
