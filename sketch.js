const EMOJIS = ["💧","🦋","🐝","🍂","🍃","✨","🐦","🌸","☁️", "🌾", "⭐"];
const FRAME_RATE = 28;
const SUNSET_LENGTH = 24;
const STEPS = FRAME_RATE * SUNSET_LENGTH;
const NUM_INTERVALS = 12;
const MAX_OPACITY = 255;
const MIN_EMOJI_SIZE = 20;
const MAX_EMOJI_SIZE = 56;
const MIN_NUM_EMOJIS = 1;
const MAX_NUM_EMOJIS = 24;
const MIN_FADE_RATE = 2;
const MAX_FADE_RATE = 8;
const MIN_DISTANCE_TRAVEL = 96;
const MAX_DISTANCE_TRAVEL = 304;
const MIN_CLICK_CLOUD_RADIUS = 36;
const MAX_CLICK_CLOUD_RADIUS = 164;
const Y_LERP_RATE = 0.008;

const DATES = [
  "Sep 9th, 2022",
  "Aug 28th, 2022",
  "Sep 22nd, 2022",
  "Aug 28th, 2022",
  "Nov 25th, 2021",
  "Sep 1st, 2022",
  "Nov 21st, 2021",
  "Nov 20th, 2021",
  "June 28th, 2022",
  "Sep 1st, 2022",
  "Apr 30th, 2022",
  "Jul 14th, 2020",
];

const TIMES = [
  "5:57 pm",
  "7:56 pm",
  "6:33 pm",
  "6:58 pm",
  "4:44 pm",
  "7:51 pm",
  "5:23 pm",
  "4:55 pm",
  "6:25 pm",
  "8:36 pm",
  "8:28 pm",
  "11:47 pm"
];

let c1, c2;
// colours of the sunset
let c1_1, c1_2, c1_3, c1_4, c1_5, c1_6, c1_7, c1_8, c1_9, c1_10, c1_11, c1_12;
let c2_1, c2_2, c2_3, c2_4, c2_5, c2_6, c2_7, c2_8, c2_9, c2_10, c2_11, c2_12;
let c1Array;
let c2Array;
let pastTimeFrame = 0;
let currFrame = 0;
let isOverflowing = false;
let sunsetEnded = false;
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
    this.y = lerp(this.y, this.targetY, Y_LERP_RATE);
  }

  render() {
    const c = color(0);
    c.setAlpha(this.alpha);
    noStroke();
    fill(c);
    textSize(this.size);
    text(this.character, this.x, this.y);
  }
}

function setup() {
  const cnv = createCanvas(windowWidth, windowHeight);
  cnv.style('display', 'block');
  frameRate(FRAME_RATE);
  colorMode(RGB, 255, 255, 255, 255);
  // 9/9/2022
  c1_1 = color(171,198,222);
  c2_1 = color(254,250,234);
  // 8/28/2022
  c1_2 = color(151, 187, 240);
  c2_2 = color(235, 221, 207);
  // 9/22/2022
  c1_3 = color(63, 114, 179);
  c2_3 = color(242, 233, 201);
  // 8/28/2022
  c1_4 = color(43,114,197);
  c2_4 = color(238,232,184);
  // 11/25/2022
  c1_5 = color(112,139,185);
  c2_5 = color(226,189,155);
  // 9/1/2022
  c1_6 = color(69,105,146);
  c2_6 = color(255,147,123);
  // 11/21/2021
  c1_7 = color(69,105,146);
  c2_7 = color(252,141,72);
  // 11/20/2021
  c1_8 = color(145,155,159);
  c2_8 = color(252,85,55);
  // 6/28/2022
  c1_9 = color(62,82,162);
  c2_9 = color(243,174,131);
  // 9/1/2022
  c1_10 = color(20,22,84);
  c2_10 = color(204,115,124);
  // 4/30/2022
  c1_11 = color(2,37,114);
  c2_11 = color(42,81,130);
  // 7/14/2020
  c1_12 = color(0,0,0);
  c2_12 = color(55,55,68);
  c1Array = [c1_1, c1_2, c1_3, c1_4, c1_5, c1_6, c1_7, c1_8, c1_9, c1_10, c1_11, c1_12];
  c2Array = [c2_1, c2_2, c2_3, c2_4, c2_5, c2_6, c2_7, c2_8, c2_9, c2_10, c2_11, c2_12];

  // Initialize sunset at first photo
  c1 = c1_1;
  c2 = c2_1;
}

function draw() {
  setBackgroundGradient();
  if (currFrame < STEPS) {
    const photo = updateBackgroundGradientColours();
    updateTime(photo);
    updateDate(photo);
    updatePhotoCount(photo);
  } else if (!sunsetEnded) {
      toggleReplayButton();
      sunsetEnded = true;
  }

  // update the emojis
  for (let i = emojisOnScreen.length - 1; i >= 0; i--) {
    let curr = emojisOnScreen[i];
    if (curr.alpha === 0) {
      emojisOnScreen.splice(i, 1); // remove emoji after it fades
    }
    else {
      curr.updateAlpha();
      curr.updateY();
      curr.render();
    }
  } 
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function setBackgroundGradient() {
  for (let i = 0; i <= window.innerHeight; i++) {
    let inter = map(i, 0, window.innerHeight, 0, 1);
    let c = lerpColor(c1, c2, inter);
    c.setAlpha(MAX_OPACITY);
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

  return ceil(interColorSelection)-1;
}

function timeFrameChanged(interColorSelection) {
  return interColorSelection !== pastTimeFrame;
}

function updateTime(photo) {
  const time = document.getElementById("time");
  time.innerText = TIMES[photo];
}

function updateDate(photo) {
  const date = document.getElementById("date");
  date.innerText = DATES[photo];
}

function updatePhotoCount(photo) {
  const photoCount = document.getElementById("photo-count");
  photoCount.innerText = photo + 1;
}

function resetSunset() {
  currFrame = 0;
  sunsetEnded = false;
  isOverflowing = false;
  toggleReplayButton();
}

function touchStarted() {
  addEmojis();
}

function touchMoved() {
  addEmojis();
}

function mouseClicked() {
  addEmojis();
}

function mousePressed() {
  addEmojis();
}

function mouseDragged() {
  addEmojis();
}

function addEmojis() {
  const emojiCharacter = EMOJIS[round(random(0, EMOJIS.length))];
  const numEmojis = round(random(MIN_NUM_EMOJIS, MAX_NUM_EMOJIS));
  const radius = round(random(MIN_CLICK_CLOUD_RADIUS, MAX_CLICK_CLOUD_RADIUS));
  for (let i = 0; i < numEmojis; i++) {
    const x = mouseX + (setPositiveNegative() * round(random(0, radius)));
    const y = mouseY + (setPositiveNegative() * round(random(0, radius)));
    const newEmoji =  new Emoji(emojiCharacter, x, y);
    emojisOnScreen.push(newEmoji);
  }
}

function setPositiveNegative() {
  return random(0,1) < 0.5 ? -1 : 1
}