var currentTab = 0;
showTab(currentTab);

function showTab(n) {
  const tabs = document.getElementsByClassName("tab");
  for (let i = 0; i < tabs.length; i++) tabs[i].classList.add("d-none");
  if (tabs[n]) tabs[n].classList.remove("d-none");

  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const submitBtn = document.getElementById("submitBtn");
  const restartBtn = document.getElementById("restartBtn");

  // Prev button
  if (n === 0) prevBtn.classList.add("d-none");
  else prevBtn.classList.remove("d-none");

  // Next button
  if (n === tabs.length - 1) nextBtn.classList.add("d-none");
  else nextBtn.classList.remove("d-none");

  // Submit button
  if (n === tabs.length - 1) submitBtn.classList.remove("d-none");
  else submitBtn.classList.add("d-none");

  // Restart hidden
  restartBtn.classList.add("d-none");

  fixStepIndicator(n);
}

function nextPrev(n) {
  const tabs = document.getElementsByClassName("tab");
  if (n === 1 && !validateForm()) return;

  tabs[currentTab].classList.add("d-none");
  currentTab += n;
  if (currentTab >= tabs.length) currentTab = tabs.length - 1;

  showTab(currentTab);
}

function submitForm() {
  if (!validateForm()) return;

  document.getElementById("questions").classList.add("d-none");
  document.getElementById("matchmakerResult").classList.remove("d-none");
  submitBtn.classList.add("d-none");
  restartBtn.classList.remove("d-none");
}

function validateForm() {
  const tabs = document.getElementsByClassName("tab");
  if (currentTab >= tabs.length) return true;

  const inputs = tabs[currentTab].getElementsByTagName("input");
  let valid = true;

  for (let input of inputs) {
    if (input.type === "radio") {
      const radios = tabs[currentTab].querySelectorAll(
        `input[name="${input.name}"]`
      );
      const anyChecked = Array.from(radios).some((r) => r.checked);
      if (!anyChecked) valid = false;

      radios.forEach((r) => {
        const lbl = tabs[currentTab].querySelector(`label[for="${r.id}"]`);
        if (lbl)
          anyChecked
            ? lbl.classList.remove("invalid")
            : lbl.classList.add("invalid");
      });
    } else if (input.type === "range" || input.type === "text") {
      if (input.value === "") {
        valid = false;
        input.classList.add("invalid");
      } else input.classList.remove("invalid");
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

  document.getElementById("questions").classList.remove("d-none");
  document.getElementById("matchmakerResult").classList.add("d-none");
  document.getElementById("result").innerHTML = "";

  const steps = document.getElementsByClassName("step");
  for (let s of steps) s.classList.remove("finish", "active");

  resetInputValues();
  showTab(0);
}

function resetInputValues(){
const tabs = document.getElementsByClassName("tab");
  for (let tab of tabs) {
    const inputs = tab.getElementsByTagName("input");
    for (let input of inputs) {
      if (input.type === "radio" || input.type === "checkbox") {
        input.checked = false;
      } else if (input.type === "range") {
        input.value = input.defaultValue;
      } else if (input.type === "text") {
        input.value = "";
      }

      input.classList.remove("invalid");
    }
  }

}