/*jshint esversion: 6 */
let sheet_stage1_1 = [];
let json_stage1_1 = [];
let sheet_stage1_2 = [];
let json_stage1_2 = [];

//enemy lists
let e_sheet_stage1_1 = [];
let e_json_stage1_1 = [];
let e_sheet_stage1_2 = [];
let e_json_stage1_2 = [];

function preload() {
  backgroundimg = loadImage('images/area51.png'); // decor image
  bottomimg = loadImage('images/bottom.png'); // decor image
  hitSound = loadSound('sounds/hit.wav');
  deathSound = loadSound('sounds/death.wav');

  // SPRITES (0:running, 1:resting, 2:attacking, 3:dying, 4:walking&&attacking)
  sheet_stage1_1[0] = loadImage('sprites/stage1_1/spritesheet.png');
  json_stage1_1[0] = loadJSON('sprites/stage1_1/spritesheet.json');
  sheet_stage1_1[1] = loadImage('sprites/stage1_1/spritesheet(1).png');
  json_stage1_1[1] = loadJSON('sprites/stage1_1/spritesheet(1).json');
  sheet_stage1_1[2] = loadImage('sprites/stage1_1/spritesheet(2).png');
  json_stage1_1[2] = loadJSON('sprites/stage1_1/spritesheet(2).json');
  sheet_stage1_1[3] = loadImage('sprites/stage1_1/spritesheet(3).png');
  json_stage1_1[3] = loadJSON('sprites/stage1_1/spritesheet(3).json');

  sheet_stage1_2[0] = loadImage('sprites/stage1_2/spritesheet.png');
  json_stage1_2[0] = loadJSON('sprites/stage1_2/spritesheet.json');
  sheet_stage1_2[1] = loadImage('sprites/stage1_2/spritesheet(1).png');
  json_stage1_2[1] = loadJSON('sprites/stage1_2/spritesheet(1).json');
  sheet_stage1_2[2] = loadImage('sprites/stage1_2/spritesheet(2).png');
  json_stage1_2[2] = loadJSON('sprites/stage1_2/spritesheet(2).json');
  sheet_stage1_2[3] = loadImage('sprites/stage1_2/spritesheet(3).png');
  json_stage1_2[3] = loadJSON('sprites/stage1_2/spritesheet(3).json');
  sheet_stage1_2[4] = loadImage('sprites/stage1_2/spritesheet(3).png');
  json_stage1_2[4] = loadJSON('sprites/stage1_2/spritesheet(3).json');


  // ENEMY sprites
  e_sheet_stage1_1[0] = loadImage('sprites/e_stage1_1/spritesheet.png');
  e_json_stage1_1[0] = loadJSON('sprites/e_stage1_1/spritesheet.json');
  e_sheet_stage1_1[1] = loadImage('sprites/e_stage1_1/spritesheet(1).png');
  e_json_stage1_1[1] = loadJSON('sprites/e_stage1_1/spritesheet(1).json');
  e_sheet_stage1_1[2] = loadImage('sprites/e_stage1_1/spritesheet(2).png');
  e_json_stage1_1[2] = loadJSON('sprites/e_stage1_1/spritesheet(2).json');
  e_sheet_stage1_1[3] = loadImage('sprites/e_stage1_1/spritesheet(3).png');
  e_json_stage1_1[3] = loadJSON('sprites/e_stage1_1/spritesheet(3).json');

}

let animation_stage1_1 = [[], [], [], []];
let animation_stage1_2 = [[], [], [], [], []];


let e_animation_stage1_1 = [[], [], [], []];


function makeSpriteFrames() {
  for(let i = 0; i<4; i++) { //4 animations total
    let frames = json_stage1_1[i].frames;
    for (let j = 0; j < frames.length; j++){
      let pos = frames[j].frame;
      let img = sheet_stage1_1[i].get(pos.x, pos.y, pos.w, pos.h);
      animation_stage1_1[i].push(img);
    }
  }

  for(let i = 0; i<5; i++) {
    let frames = json_stage1_2[i].frames;
    for (let j = 0; j < frames.length; j++){
      let pos = frames[j].frame;
      let img = sheet_stage1_2[i].get(pos.x, pos.y, pos.w, pos.h);
      animation_stage1_2[i].push(img);
    }
  }


  // ENEMY
  for(let i = 0; i<4; i++) { //4 animations total
    let frames = e_json_stage1_1[i].frames;
    for (let j = 0; j < frames.length; j++){
      let pos = frames[j].frame;
      let img = e_sheet_stage1_1[i].get(pos.x, pos.y, pos.w, pos.h);
      e_animation_stage1_1[i].push(img);
    }
  }
}
