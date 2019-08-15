/*jshint esversion: 6 */
class Unit {
  constructor(unitNumber, unitType){
    this.health = unitType.maxHealth
    this.maxHealth = unitType.maxHealth;
    this.damage = unitType.damage;
    this.width = unitType.width;
    this.height = unitType.height;
    this.active = 0;
    this.x = 170;
    this.y = canvasHeight - 160;
    this.timeLeft = 100;
    this.beingCreated = 0;
    this.moving = 0;
    this.unitNumber = unitNumber;
    this.speed = 0.5;
    this.attacking = 0;
    this.attackingDelay = unitType.attackingDelay;
    this.attackingCounter = 1;
    this.attackingStart = 0;
    this.dying = 0;
    this.hitFor = 0;
    this.hasRange = unitType.hasRange; //If longe range: can do damage on a distance (while walking too)
    this.dist = 0;
    this.target = "None";
    this.coinReward = unitType.coinReward;
    this.expReward = unitType.expReward;

    //sprite framenumber
    this.frameNum = 0;
    this.rounded_frame = 0;
  }

  show(scrollPosition){
    if(this.active) {
      if (this.moving)
        this.x += this.speed;

        // MOVING OR NOT
        if (this.unitNumber > 0 && this.x >= myUnits[this.unitNumber-1].x-this.width) // waiting on unit in front
          this.moving = 0;
        else if (this.x >= 1200-this.width) //at the enemy tower
          this.moving = 0;
        else if(enemyUnits.length > 0 && enemyUnits[0].x -  (this.x + this.width) <= 0) //facing enemy
          this.moving = 0;
        else
          this.moving = 1;

          // ATTACKING
          if (this.x+this.hasRange >= 1200-this.width){ // If unit within reach of enemytower
            this.attacking = 1; // start attacking
            if(!this.attacking) //if it just started attacking
              this.attackingStart = 1; // for reset animation
            if(this.attackingCounter%this.attackingDelay == 0) {
              if(enemyUnits.length == 0) { //If enemy tower is under attack, attack with attackingdelay
                if(this.hasRange){
                  this.dist = 1200 - this.x+this.width;
                  if (this.dist > 5) {
                    this.target = "tower";
                    projectiles.push(new projectile_1(this.target, this.dist, this.x+this.width, this.damage));
                  }
                  else {
                    theEnemyTower.health -= this.damage;
                    hitSound.play();
                  }
                }
                else{
                  theEnemyTower.health -= this.damage;
                  hitSound.play();
                }
              }
              else {
                if(this.hasRange){
                  this.dist = enemyUnits[0].x-this.x+this.width;
                  if (this.dist > 5) {
                    this.target = "unit";
                    projectiles.push(new projectile_1(this.target, this.dist, this.x+this.width, this.damage));
                  }
                  else {
                    enemyUnits[0].health -= this.damage;
                    hitSound.play();
                  }
                }
                else{
                  enemyUnits[0].health -= this.damage;
                  hitSound.play();
                }
              }
            }
          }
          else if (enemyUnits.length > 0 && this.x+this.hasRange+this.width >= enemyUnits[0].x){
              this.attacking = 1;
              if(!this.attacking) //if it just started attacking
                this.attackingStart = 1; // for reset animation
              if(this.attackingCounter%this.attackingDelay == 0) {
                if(this.hasRange){
                  this.dist = enemyUnits[0].x-this.x+this.width;
                  if (this.dist > 5) {
                    this.target = "unit";
                    projectiles.push(new projectile_1(this.target, this.dist,  this.x+this.width, this.damage));
                  }
                  else {
                    enemyUnits[0].health -= this.damage;
                    hitSound.play();
                  }
                }
                else {
                  enemyUnits[0].health -= this.damage;
                  hitSound.play();
                }
              }
          }
          else {
              this.attacking = 0;
          }


      if (this.health <= 0) {
        myUnits.splice(this.unitNumber,1);
        for (let i = 0; i<myUnits.length; i++){
          myUnits[i].unitNumber = i;
        }
        deathSound.play();
        myDyingUnits.push(new stageZero_firstDying(myDyingUnits.length, this.x, this.y, this.width, this.height));
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

    // unit is in queue
    else {
      if (queueTime == 0 || this.beingCreated){
        this.beingCreated = 1;
        this.timeLeft--;
        queueTime = this.timeLeft;
        if (this.timeLeft == 0) {
          this.active = 1;
          this.moving = 1;
          queueAmount--;
        }
      }
    }
  }

  animate() {
    if(this.moving && this.active && !this.attacking) {
      this.frameNum += 0.12;
      this.rounded_frame = floor(this.frameNum%(animation_stage1_1[0].length));
      image(animation_stage1_1[0][this.rounded_frame],floor(this.x-scrollPosition), this.y, this.width, this.height); //running animation
    }
    else if(this.active)  //if not moving but still alive
      if(this.attacking) {  //attacking
        if(this.attackingStart) this.frameNum = 0;
        this.attackingStart = 0;
        this.frameNum += animation_stage1_1[2].length/this.attackingDelay; //One attacki ng animation in one attacking phase
        this.rounded_frame = floor(this.frameNum%(animation_stage1_1[2].length));
        image(animation_stage1_1[2][this.rounded_frame],floor(this.x-scrollPosition), this.y, this.width, this.height); //attacking animation
      }
      else { //resting
        this.frameNum += 0.08;
        this.rounded_frame = floor(this.frameNum%(animation_stage1_1[1].length));
        image(animation_stage1_1[1][this.rounded_frame],floor(this.x-scrollPosition), this.y, this.width, this.height); //resting animation
      }
  }
}

class stageZero_firstDying {
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
    if(this.rounded_frame > animation_stage1_1[3].length-1)
      this.remove = 1;
    if (!this.remove)
      image(animation_stage1_1[3][this.rounded_frame],floor(this.x-scrollPosition), this.y, this.width, this.height); //dying animation
    else {
      //remove from list;
    }
  }
}


// SECOND UNIT
class stageZero_second {
  constructor(unitNumber){
    this.maxHealth = 75;
    this.health = maxHealth;
    this.damage = 15;
    this.width = 42;
    this.height = 70;
    this.active = 0;
    this.x = 170;
    this.y = canvasHeight - 160;
    this.timeLeft = 100;
    this.beingCreated = 0;
    this.moving = 0;
    this.unitNumber = unitNumber;
    this.speed = 0.5;
    this.attacking = 0;
    this.attackingDelay = 80;
    this.attackingCounter = 1;
    this.attackingStart = 0;
    this.dying = 0;
    this.hitFor = 0;
    this.hasRange = 100; //If longe range: can do damage on a distance (while walking too)
    this.dist = 0;
    this.target = "None";

    //sprite framenumber
    this.frameNum = 0;
    this.rounded_frame = 0;
  }

  show(scrollPosition){
    if(this.active) {
      if (this.moving)
        this.x += this.speed;

      // MOVING OR NOT
      if (this.unitNumber > 0 && this.x >= myUnits[this.unitNumber-1].x-this.width) // waiting on unit in front
        this.moving = 0;
      else if (this.x >= 1200-this.width) //at the enemy tower
        this.moving = 0;
      else if(enemyUnits.length > 0 && enemyUnits[0].x -  (this.x + this.width) <= 0) //facing enemy
        this.moving = 0;
      else
        this.moving = 1;

      // ATTACKING
      if (this.x+this.hasRange >= 1200-this.width){ // If unit within reach of enemytower
        this.attacking = 1; // start attacking
        if(!this.attacking) //if it just started attacking
          this.attackingStart = 1; // for reset animation
        if(this.attackingCounter%this.attackingDelay == 0) {
          if(enemyUnits.length == 0) { //If enemy tower is under attack, attack with attackingdelay
            if(this.hasRange){
              this.dist = 1200 - this.x+this.width;
              if (this.dist > 5) {
                this.target = "tower";
                projectiles.push(new projectile_1(this.target, this.dist, this.x+this.width, this.damage));
              }
              else {
                theEnemyTower.health -= this.damage;
                hitSound.play();
              }
            }
            else{
              theEnemyTower.health -= this.damage;
              hitSound.play();
            }
          }
          else {
            if(this.hasRange){
              this.dist = enemyUnits[0].x-this.x+this.width;
              if (this.dist > 5) {
                this.target = "unit";
                projectiles.push(new projectile_1(this.target, this.dist, this.x+this.width, this.damage));
              }
              else {
                enemyUnits[0].health -= this.damage;
                hitSound.play();
              }
            }
            else{
              enemyUnits[0].health -= this.damage;
              hitSound.play();
            }
          }
        }
      }
      else if (enemyUnits.length > 0 && this.x+this.hasRange+this.width >= enemyUnits[0].x){
          this.attacking = 1;
          if(!this.attacking) //if it just started attacking
            this.attackingStart = 1; // for reset animation
          if(this.attackingCounter%this.attackingDelay == 0) {
            if(this.hasRange){
              this.dist = enemyUnits[0].x-this.x+this.width;
              if (this.dist > 5) {
                this.target = "unit";
                projectiles.push(new projectile_1(this.target, this.dist,  this.x+this.width, this.damage));
              }
              else {
                enemyUnits[0].health -= this.damage;
                hitSound.play();
              }
            }
            else {
              enemyUnits[0].health -= this.damage;
              hitSound.play();
            }
          }
      }
      else {
          this.attacking = 0;
      }



      if (this.health <= 0) {
        myUnits.splice(this.unitNumber,1);
        for (let i = 0; i<myUnits.length; i++){
          myUnits[i].unitNumber = i;
        }
        deathSound.play();
        myDyingUnits.push(new stageZero_secondDying(myDyingUnits.length, this.x, this.y, this.width, this.height));
      }
      if (this.attacking) this.attackingCounter++;

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

    // unit is in queue
    else {
      if (queueTime == 0 || this.beingCreated){
        this.beingCreated = 1;
        this.timeLeft--;
        queueTime = this.timeLeft;
        if (this.timeLeft == 0) {
          this.active = 1;
          this.moving = 1;
          queueAmount--;
        }
      }
    }
  }

  animate() {
    if(this.moving && this.active && !this.attacking) {
      this.frameNum += 0.12;
      this.rounded_frame = floor(this.frameNum%(animation_stage1_2[0].length));
      image(animation_stage1_2[0][this.rounded_frame],floor(this.x-scrollPosition), this.y, this.width, this.height); //running animation
    }
    else if(this.active)  //if not moving but still alive
      if(this.attacking) {  //attacking
        if(this.attackingStart) this.frameNum = 0;
        this.attackingStart = 0;
        this.frameNum += animation_stage1_2[2].length/this.attackingDelay; //One attacki ng animation in one attacking phase
        this.rounded_frame = floor(this.frameNum%(animation_stage1_2[2].length));
        image(animation_stage1_2[2][this.rounded_frame],floor(this.x-scrollPosition), this.y, this.width, this.height); //attacking animation
      }
      else { //resting
        this.frameNum += 0.08;
        this.rounded_frame = floor(this.frameNum%(animation_stage1_2[1].length));
        image(animation_stage1_2[1][this.rounded_frame],floor(this.x-scrollPosition), this.y, this.width, this.height); //resting animation
      }

  }
}

class stageZero_secondDying {
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

    this.frameNum += 0.08;
    this.rounded_frame = floor(this.frameNum);
    if(this.rounded_frame > animation_stage1_2[3].length-1)
      this.remove = 1;
    if (!this.remove)
      image(animation_stage1_2[3][this.rounded_frame],floor(this.x-scrollPosition), this.y, this.width, this.height); //dying animation
    else {
      //remove from list;
    }
  }
}
