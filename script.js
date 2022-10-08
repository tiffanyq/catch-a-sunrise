function toggleReplayButton() {
  const replayButton = document.getElementById("replay");
  if (replayButton.style.visibility === "visible") {
    replayButton.style.visibility = "hidden";
  } else {
    replayButton.style.visibility = "visible";
  }
}

window.onload = function() {
  const replayButton = document.getElementById("replay");
  replayButton.addEventListener("click", resetSunset);
}