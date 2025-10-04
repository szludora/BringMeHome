function onSubmit() {
  const container = document.getElementById("matchmakerResult");
  const resultContainer = document.getElementById("result");
  container.classList.remove("d-none");
  resultContainer.innerHTML += "Ez a te személyre szabott eredményed 🎉";
}
