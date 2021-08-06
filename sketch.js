const EMOJIS = [];
const FRAME_RATE = 7;
const SUNRISE_LENGTH = 90; // 5:00-6:30am
const STEPS = FRAME_RATE * SUNRISE_LENGTH;
const NUM_INTERVALS = 7;

let c1, c2;
// colours of the sunrise at 15 minute intervals
let c1_1, c1_2, c1_3, c1_4, c1_5, c1_6, c1_7;
let c2_1, c2_2, c2_3, c2_4, c2_5, c2_6, c2_7;
let c1Array;
let c2Array;
let pastTimeFrame = 0;
let currFrame = 0;
let isOverflowing = false;
let sunriseEnded = false;

function setup() {
  const cnv = createCanvas(windowWidth, windowHeight);
  cnv.style('display', 'block');
  frameRate(FRAME_RATE);
  // 5:00am
  c1_1 = color(30, 46, 66);
  c2_1 = color(127, 131, 124);
  // 5:15am
  c1_2 = color(45, 65, 90);
  c2_2 = color(147, 158, 158);
  // 5:30am
  c1_3 = color(119, 138, 168);
  c2_3 = color(183, 174, 159);
  // 5:45am
  c1_4 = color(174, 188, 214);
  c2_4 = color(224, 193, 173);
  // 6:00am
  c1_5 = color(146, 170, 218);
  c2_5 = color(238, 206, 167);
  // 6:15am
  c1_6 = color(190,207,235);
  c2_6 = color(244,224,187);
  // 6:30am
  c1_7 = color(201,225,250);
  c2_7 = color(244,237,225);

  c1Array = [c1_1, c1_2, c1_3, c1_4, c1_5, c1_6, c1_7];
  c2Array = [c2_1, c2_2, c2_3, c2_4, c2_5, c2_6, c2_7];

  // Initialize sunrise at 5am
  c1 = c1_1;
  c2 = c2_1;
}

function draw() {
  setBackgroundGradient();
  if (currFrame < STEPS) {
    updateBackgroundGradientColours();
    updateTime();
  } else if (!sunriseEnded) {
      toggleReplayButton();
      sunriseEnded = true;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function setBackgroundGradient() {
  for (let i = 0; i <= window.innerHeight; i++) {
    let inter = map(i, 0, window.innerHeight, 0, 1);
    let c = lerpColor(c1, c2, inter);
    stroke(c);
    line(0, i, window.innerWidth, i);
  }
}

function updateBackgroundGradientColours() {
  currFrame++;
  let inter;
  let interColorSelection = map(currFrame, 0, STEPS, 0, NUM_INTERVALS);
  
  // catch inter overflow
  if (isOverflowing || currFrame % (STEPS / NUM_INTERVALS) === 0) {
    inter = 1;
    isOverflowing = true;
  } else {
    inter = map(currFrame % (STEPS / NUM_INTERVALS), 0, STEPS / NUM_INTERVALS, 0, 1);
  }

  if (timeFrameChanged(ceil(interColorSelection))) {
    isOverflowing = false;
    inter = 0;
  }
  pastTimeFrame = ceil(interColorSelection);
  let ref_c1_start = c1Array[ceil(interColorSelection)-1];
  let ref_c2_start = c2Array[ceil(interColorSelection)-1];
  let ref_c1_end = c1Array[min(NUM_INTERVALS -1, ceil(interColorSelection))];
  let ref_c2_end = c2Array[min(NUM_INTERVALS -1, ceil(interColorSelection))];
  c1 = lerpColor(ref_c1_start, ref_c1_end, inter);
  c2 = lerpColor(ref_c2_start, ref_c2_end, inter);
}

function timeFrameChanged(interColorSelection) {
  return interColorSelection !== pastTimeFrame;
}

function updateTime() {
  let time = document.getElementById("time");
  let hour = setHour();
  let minute = setMinute();
  time.innerText = hour + ":" + minute;
}

function setHour() {
  let ref = map(currFrame, 0, STEPS, 0, 3);
  return ref < 2 ? "5" : "6";
}

function setMinute() {
  let ref = map(currFrame, 0, STEPS, 0, 90);
  let tempMin = floor(ref) % 60;
  return tempMin < 10 ? "0" + tempMin.toString() : tempMin.toString();
}

function resetSunrise() {
  currFrame = 0;
  sunriseEnded = false;
  isOverflowing = false;
  toggleReplayButton();
}