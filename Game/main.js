/*jshint esversion: 6 */
//main.js

let canvasWidth = 960;
let canvasHeight = 640;

let klikdeMuis = 0; // Will become 1 if mouse is clicked for 1 frame (reset is in draw())

// Width of field and scrolling
let fieldWidth = 1400; // Width of entire field (larger than canvas width)
let scrollPosition = 0; // varies between 0 and fieldWidth - canvasWidth
let maxScrollPosition = fieldWidth - canvasWidth;
let scrollSpeed = 4; // pixels being scrolled every frame
let scrollBoxWidth = 140; // width of virtual box to activate scrolling (on the sides)
let scrollBoxHeight = 440; // height of virtual box

//Tower locations
enemyTowerX = 1200;
myTowerX = 60;

//gamestats
let exp = 0;
let coins = 175;
let stage = 0; //first stage
let enemyStage = 0;//first stage
let requiredExp = 4000;

//menu selection variables
let mainMenu = 1;
let turretMenu = 0;
let trainingMenu = 0;
let sellTurretMenu = 0;

//Units
let myUnits = [];
let enemyUnits = [];
let myDyingUnits = []; // for dying animation
let enemyDyingUnits = []; // for dying animation
let unitPrices = [[15, 25, 100],[200, 200, 200],[300, 300, 300],[51235, 1235,12],[14234, 314123, 1234]]; // [stage1], [stage2], [stage3] etc
let queueAmount = 0; // amount of units being trained
let queueTime = 0; //time remaining (frames) for unit in training

let projectiles = [];


/*--------------EXECUTION ---------------------*/

function setup() {
  createCanvas(canvasWidth, canvasHeight);
  background(104, 174, 209);
  myBaseTower = new Tower(0, stage, false);
  theEnemyTower = new Tower(0, enemyStage, true);
  makeSpriteFrames();
}

function draw() {
  drawDecor(); //background

  // show the towers
  myBaseTower.show(scrollPosition);
  theEnemyTower.show(scrollPosition);

  for(let i = 0; i < myUnits.length; i++){
    myUnits[i].show(scrollPosition);
    if(myUnits.length) //FIXME check if last one has died in previous line
      myUnits[i].animate(scrollPosition);
  }
  for(let i = 0; i < enemyUnits.length; i++){
    enemyUnits[i].show(scrollPosition);
    if(enemyUnits.length) //check if last one has died in previous line
      enemyUnits[i].animate(scrollPosition);
  }

  for(let i = 0; i < myDyingUnits.length; i++){
    myDyingUnits[i].show(scrollPosition);
  }

  for(let i = 0; i < enemyDyingUnits.length; i++){
    enemyDyingUnits[i].show(scrollPosition);
  }


  for(let i = 0; i < projectiles.length; i++){
    projectiles[i].show(scrollPosition);
    if(projectiles[i].remove)
      projectiles.splice(i, 1);
  }

  drawTopLeftBox();
  drawMenuBox();
  drawMenu();
  drawQueue();

  if(frameCount%700 == 0)
    enemyUnits.push(new Unit(enemyUnits.length, "unit"+(enemyStage+1).toString()+"_"+(1).toString(), true));


  scrollScreen(); // adjusts scrollPostion
  klikdeMuis = 0; // reset mouse is clicked
}

/*--------------  OTHER FUNCTIONS ---------------------*/

function drawDecor() {
  //background(104, 174, 209);
  image(backgroundimg, 0-scrollPosition, 0, 1400, 540);
  fill(180, 120, 0);
  rect(0-scrollPosition, canvasHeight - 100, 1400, 100);
}

function drawQueue(){
  // Draw empty boxes and bar
  noFill();
  strokeWeight(2);
  stroke(0);
  rect(200, 20, 270, 10); // bar
  for (let i=490; i<= 570; i+=20)
    rect(i, 20, 10, 10);  // box
  noStroke();

  fill(120); // light grey
  for (let i = 0; i < queueAmount; i++) //draw grey blocks for units in creation
    rect(490+20*i, 20, 10, 10);

  if(queueAmount){ //if there are units in training, draw queuebar
    fill(255, 0, 0); //red
    rect(200, 20, 270-floor(270*queueTime/100), 10); // red queue bar
  }
}

function drawTopLeftBox() {
  // Background
  stroke(130, 80, 0);
  strokeWeight(3);
  fill(206, 161, 103);
  rect(0, 0, 180, 90);
  noStroke();

  // display Exp
  textSize(24);
  fill(0);
  text('Exp:', 11, 71); //text shadow
  text(exp, 66, 71); //text shadow
  fill(255, 0, 0);
  text('Exp:', 10, 70);
  text(exp, 65, 70);

  // display coins
  fill(0);
  text('Coins:', 11, 31); //shadow
  text(coins, 101, 31); //shadow
  fill(255, 216, 0);
  text('Coins:', 10, 30);
  text(coins, 100, 30);
}

function drawMenuBox() { // only background
  stroke(130, 80, 0);
  strokeWeight(3);
  fill(206, 161, 103);
  rect(600, 0, 360, 90);
  noStroke();
}

function drawMenu() {
  if(mainMenu){
    for(let i = 0; i<=4; i++){
      ipos = 627 + i*65;
      if(mouseY <= 21+48 && mouseY >= 21 && mouseX <= ipos+48 && mouseX >= ipos){ //Mouse is hovering on blocks: light up blocks
        fill(0);
        if(i == 0) { //First block number
          text("Train units menu", 201, 71);
          fill(240, 190, 0);
          text("Train units menu", 200, 70);
          if(klikdeMuis){
            mainMenu = 0;
            trainingMenu = 1;
          }
        }
        else if(i == 1) {text("Build turrets menu", 201, 71); fill(240, 190, 0);text("Build turrets menu", 200, 70);}
        else if(i == 2) {text("Sell a turret", 201, 71); fill(240, 190, 0);text("Sell a turret", 200, 70);}
        else if(i == 3) {text("$1000, add a turret slot", 201, 71); fill(240, 190, 0);text("$1000, add a turret slot", 200, 70);}
        else if(i == 4) {text(requiredExp, 201, 71);text(" Exp, upgrade to next stage", 269, 71); fill(240, 190, 0);text(requiredExp, 200, 70);text(" Exp, upgrade to next stage", 268, 70); }
        fill(120); //fill for background block if item is hovered on
      }
      else
        fill(80);

      stroke(120, 80, 0); //brown edge of block
      strokeWeight(3);
      rect(ipos, 21, 48, 48); // draw blocks
      noStroke();
    }
    // Draw icons on blocks
    fill(20);
    ellipse(627+24, 21+20, 20, 20); // head
    rect(627+19, 21+28, 10, 10); //neck
    rect(627+8, 21+33, 30, 15); // body
    for(let i = 693; i<=823; i+=65) placeTurretIcon(i-2, 21); //turret icons
    fill(255, 216, 0);
    star(912, 45, 8, 20, 5);
    
    // green text on turrets
    textSize(28);
    fill(0);
    text("$",759, 51);
    text("+",824, 51);
    fill(0, 200, 0);
    text("$",758, 50);
    text("+",823, 50);

  }//end if mainMenu

  else if (trainingMenu) {
    for(let i = 0; i<=4; i++){
      if (i == 3) i++; // skip the fourth block: empty space
      ipos = 627 + i*65;
      if(mouseY <= 21+48 && mouseY >= 21 && mouseX <= ipos+48 && mouseX >= ipos){ //light up blocks
        fill(0);
        if (i<4) {
          text(unitPrices[stage][i], 201, 71);
          fill(255, 216, 0);
          text(unitPrices[stage][i], 200, 70);
          if(klikdeMuis){
            if(coins >= unitPrices[stage][i] && queueAmount < 5){
              myUnits.push(new Unit(myUnits.length, "unit"+(stage+1).toString()+"_"+(i+1).toString(), false));
              coins-= unitPrices[stage][i];
              queueAmount++;
            }
          }
        } else {
          if(klikdeMuis) {
            mainMenu = 1;
            trainingMenu = 0;
          }
        }
        fill(130); //fill for background block
      }
      else
        fill(80);
      stroke(130, 80, 0);
      strokeWeight(3);
      rect(ipos, 21, 48, 48); // draw blocks
      noStroke();
      // draw unit icons
      if(i<4)
        image(unitIcons[i], ipos+6, 21+10, 48-6, 48-10);
  }
  // Draw icons on blocks
  fill(255, 0, 0); //red
  triangle(895, 45, 910,30,910,60);
  rect(910,40,15 ,10);
}// end trainingMenu


} //END drawMenu()

function scrollScreen() {
  if (mouseX >= canvasWidth-scrollBoxWidth && mouseX <= canvasWidth && mouseY >= canvasHeight - scrollBoxHeight && mouseY <= canvasHeight && scrollPosition < maxScrollPosition)
    scrollPosition+=scrollSpeed;
  else if (mouseX >= 0 && mouseX <= scrollBoxWidth && mouseY >= canvasHeight - scrollBoxHeight && mouseY <= canvasHeight && scrollPosition > 0)
    scrollPosition-=scrollSpeed;
}

function placeTurretIcon(x, y) {
  fill(20);
  triangle(x+18, y+40, x+32, y+40, x+25, y+20);
  rect(x+14, y+18, 20, 10);
  rect(x+11, y+21, 33, 4);
}


function star(x, y, radius1, radius2, npoints) {
  var angle = TWO_PI / npoints;
  var halfAngle = angle / 2.0;
  beginShape();
  for (var a = 0; a < TWO_PI; a += angle) {
    var sx = x + cos(a) * radius2;
    var sy = y + sin(a) * radius2;
    vertex(sx, sy);
    sx = x + cos(a + halfAngle) * radius1;
    sy = y + sin(a + halfAngle) * radius1;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}

function mouseClicked() {
  klikdeMuis = 1;
}
