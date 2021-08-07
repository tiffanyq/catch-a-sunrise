const EMOJIS = ["💧","🦋","🐝","🍂","🍃","✨","🐦","🌸","☁️"];
const FRAME_RATE = 28;
const SUNRISE_LENGTH = 90; // 5:00-6:30am
const STEPS = FRAME_RATE * SUNRISE_LENGTH;
const NUM_INTERVALS = 7;
const MAX_OPACITY = 255;
const MIN_EMOJI_SIZE = 24;
const MAX_EMOJI_SIZE = 64;
const MIN_NUM_EMOJIS = 1;
const MAX_NUM_EMOJIS = 24;
const MIN_FADE_RATE = 4;
const MAX_FADE_RATE = 12;
const MIN_DISTANCE_TRAVEL = 64;
const MAX_DISTANCE_TRAVEL = 192;
const MIN_CLICK_CLOUD_RADIUS = 0;
const MAX_CLICK_CLOUD_RADIUS = 156;

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
let emojisOnScreen = [];

class Emoji {
 constructor(character, x, y) {
    this.character = character;
    this.x = x;
    this.y = y;
  // generate other emoji properties
    this.targetY = y + round(random(MIN_DISTANCE_TRAVEL, MAX_DISTANCE_TRAVEL));
    this.alpha = MAX_OPACITY;
    this.size = round(random(MIN_EMOJI_SIZE, MAX_EMOJI_SIZE));
    this.fadeRate = round(random(MIN_FADE_RATE, MAX_FADE_RATE));
 }  

  updateAlpha() {
    this.alpha = max(this.alpha - this.fadeRate, 0);
  }

  updateY() {
    this.y = lerp(this.y, this.targetY, 0.008);
  }

  render() {
    const c = color(0);
    c.setAlpha(this.alpha);
    fill(c);
    textSize(this.size);
    text(this.character, this.x, this.y);
  }
}

function setup() {
  const cnv = createCanvas(windowWidth, windowHeight);
  cnv.style('display', 'block');
  frameRate(FRAME_RATE);
  colorMode(RGB);
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

  // update the emojis
  for (let i = emojisOnScreen.length - 1; i >= 0; i--) {
    let curr = emojisOnScreen[i];
    if (curr.alpha === 0) {
      emojisOnScreen.splice(i, 1); // remove emoji after it fades
      continue;
    }
    curr.updateAlpha();
    curr.updateY();
    curr.render();
  } 
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// My part of the sunrise!
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

// Your part of the sunrise!
function mouseClicked() {
  addEmojis();
}

function mouseDragged() {
  addEmojis();
}

function addEmojis() {
  const emojiCharacter = EMOJIS[round(random(0, EMOJIS.length))];
  const numEmojis = round(random(MIN_NUM_EMOJIS, MAX_NUM_EMOJIS));
  for (let i = 0; i < numEmojis; i++) {
    const x = mouseX + round(random(MIN_CLICK_CLOUD_RADIUS, MAX_CLICK_CLOUD_RADIUS));
    const y = mouseY + round(random(MIN_CLICK_CLOUD_RADIUS, MAX_CLICK_CLOUD_RADIUS));
    const newEmoji =  new Emoji(emojiCharacter, x, y);
    emojisOnScreen.push(newEmoji);
  }
}