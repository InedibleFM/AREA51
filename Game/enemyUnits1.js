/*jshint esversion: 6 */
class EnemystageZero_first {
  constructor(unitNumber){
    this.health = 60;
    this.maxHealth = 60;
    this.damage = 15;
    this.width = 60;
    this.height = 80;
    this.active = 1;
    this.x = 1220;
    this.y = canvasHeight - 160;
    this.timeLeft = 100;
    this.beingCreated = 0;
    this.moving = 0;
    this.unitNumber = unitNumber;
    this.speed = -0.5;
    this.attacking = 0;
    this.attackingDelay = 90;
    this.attackingCounter = 1;
    this.attackingStart = 0;
    this.dying = 0;
    this.hitFor = 0;
    this.hasRange = 0; //If longe range: can do damage on a distance (while walking too)
    this.dist = 0;
    this.target = "None";

    //sprite framenumber
    this.frameNum = 0;
    this.rounded_frame = 0;
  }

  show(scrollPosition){
      if (this.moving)
        this.x += this.speed;

        // MOVING OR NOT
        if (this.unitNumber > 0 && this.x <= enemyUnits[this.unitNumber-1].x+enemyUnits[this.unitNumber-1].width) // waiting on unit in front
          this.moving = 0;
        else if (this.x <= 200) //at the enemy tower
          this.moving = 0;
        else if(myUnits.length > 0 && myUnits[0].x+myUnits[0].width -  this.x >= 0) //facing enemy
          this.moving = 0;
        else
          this.moving = 1;

          // ATTACKING
          if (this.x-this.hasRange <= 200){ // If unit within reach of enemytower
            this.attacking = 1; // start attacking
            if(!this.attacking) //if it just started attacking
              this.attackingStart = 1; // for reset animation
            if(this.attackingCounter%this.attackingDelay == 0) {
              if(myUnits.length == 0) { //If my tower is under attack, attack with attackingdelay
                if(this.hasRange){
                  this.dist = this.x-200;
                  if (this.dist > 5) {
                    this.target = "tower";
                    projectiles.push(new Enemy_projectile_1(this.target, this.dist, this.x, this.damage));
                  }
                  else {
                    myBaseTower.health -= this.damage;
                    hitSound.play();
                  }
                }
                else{
                  myBaseTower.health -= this.damage;
                  hitSound.play();
                }
              }
              else {
                if(this.hasRange){
                  this.dist = myUnits[0].x-this.x+this.width;
                  if (this.dist > 5) {
                    this.target = "unit";
                    projectiles.push(new Enemy_projectile_1(this.target, this.dist, this.x+this.width, this.damage));
                  }
                  else {
                    myUnits[0].health -= this.damage;
                    hitSound.play();
                  }
                }
                else{
                  myUnits[0].health -= this.damage;
                  hitSound.play();
                }
              }
            }
          }
          else if (myUnits.length > 0 && this.x-this.hasRange <= myUnits[0].x+myUnits[0].width){ //within range of my unit
              this.attacking = 1;
              if(!this.attacking) //if it just started attacking
                this.attackingStart = 1; // for reset animation
              if(this.attackingCounter%this.attackingDelay == 0) {
                if(this.hasRange){
                  this.dist = myUnits[0].x+this.x+myUnits[0].width;
                  if (this.dist > 5) {
                    this.target = "unit";
                    projectiles.push(new Enemy_projectile_1(this.target, this.dist,  this.x+this.width, this.damage));
                  }
                  else {
                    myUnits[0].health -= this.damage;
                    hitSound.play();
                  }
                }
                else {
                  myUnits[0].health -= this.damage;
                  hitSound.play();
                }
              }
          }
          else {
              this.attacking = 0;
          }


      if (this.health <= 0) {
        coins+=20;
        enemyUnits.splice(this.unitNumber,1);
        for (let i = 0; i<enemyUnits.length; i++){
          enemyUnits[i].unitNumber = i;
        }
        deathSound.play();
        enemyDyingUnits.push(new EnemystageZero_firstDying(enemyDyingUnits.length, this.x, this.y, this.width, this.height));
      }


      if (this.attacking) this.attackingCounter++; // FOR ANIMATION AND ATTACKING SPEED

      // HEALTH BAR OF UNIT
      if(mouseX > this.x-scrollPosition && mouseX < this.x-scrollPosition+this.width && mouseY > this.y && mouseY < this.y+this.height) //mouse is on unit
        { // show health bar
          fill(120);
          rect(this.x-scrollPosition+this.width/4, this.y-5, this.width/2, 5);
          fill(255, 0, 0);
          rect(this.x-scrollPosition+this.width/4, this.y-5, 0.5*this.width*this.health/this.maxHealth, 5);
        }

      if(this.hitFor){
        //animate blood?
        this.health -= this.hitFor;
        this.hitFor = 0;
      }
  }

  animate() {
    if(this.moving && this.active && !this.attacking) {
      this.frameNum += 0.12;
      this.rounded_frame = floor(this.frameNum%(e_animation_stage1_1[0].length));
      image(e_animation_stage1_1[0][this.rounded_frame],floor(this.x-scrollPosition), this.y, this.width, this.height); //running animation
    }
    else if(this.active)  //if not moving but still alive
      if(this.attacking) {  //attacking
        if(this.attackingStart) this.frameNum = 0;
        this.attackingStart = 0;
        this.frameNum += e_animation_stage1_1[2].length/this.attackingDelay; //One attacki ng animation in one attacking phase
        this.rounded_frame = floor(this.frameNum%(e_animation_stage1_1[2].length));
        image(e_animation_stage1_1[2][this.rounded_frame],floor(this.x-scrollPosition), this.y, this.width, this.height); //attacking animation
      }
      else { //resting
        this.frameNum += 0.08;
        this.rounded_frame = floor(this.frameNum%(e_animation_stage1_1[1].length));
        image(e_animation_stage1_1[1][this.rounded_frame],floor(this.x-scrollPosition), this.y, this.width, this.height); //resting animation
      }
  }
}

class EnemystageZero_firstDying {
  constructor(dyingUnitNumber, x, y, width, height){
    this.number = dyingUnitNumber;
    this.frameNum = 0;
    this.rounded_frame = 0;
    this.remove = 0;
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
  }

  show(){

    this.frameNum += 0.15;
    this.rounded_frame = floor(this.frameNum);
    if(this.rounded_frame > e_animation_stage1_1[3].length-1)
      this.remove = 1;
    if (!this.remove)
      image(e_animation_stage1_1[3][this.rounded_frame],floor(this.x-scrollPosition), this.y, this.width, this.height); //dying animation
    else {
      //remove from list;
    }
  }
}


// SECOND UNIT
