function toggleReplayButton() {
  const replayButton = document.getElementById("replay");
  console.log(replayButton);
  console.log("here");
  console.log(replayButton.style.visibility);
  if (replayButton.style.visibility === "visible") {
    console.log("and now, here");
    replayButton.style.visibility = "hidden";
  } else {
    replayButton.style.visibility = "visible";
  }
}

window.onload = function() {
  const replayButton = document.getElementById("replay");
  replayButton.addEventListener("click", resetSunrise);
}