function foo(element) {
  console.log(element);
  console.log("onclick event");
  element.style.backgroundColor = "#f46";
}
function foo2(event) {
  event.target.style.backgroundColor = "red";
  console.log("onclick event");
  let text = document.getElementById("scriptTestText");
  text.innerHTML = "jk";
}

function onLoad() {
  console.log("onload event");
}
