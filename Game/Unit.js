/*jshint esversion: 6 */
class Unit {
  constructor(unitNumber, unitType, isEnemy){
    this.unitType = unitType;
    let unitTypeString = unitType;
    if (isEnemy){
      this.animation = eval("e_animation_stage" + unitTypeString.substring(4, 7));
      unitTypeString = "e_"+unitTypeString;
      this.speed = -0.5;
      this.x = enemyTowerX+30;
      this.moving = 1; // enemy has no queue, so starts moving
      this.active = 1;  
    }
    else {
      this.speed = 0.5;
      this.x = 170;
      this.active = 0;        // unit is not created yet    
      this.moving = 0;
      this.animation = eval("animation_stage" + unitTypeString.substring(4, 7));
    }
    unitType = eval(unitTypeString);
    this.isEnemy = isEnemy;
    this.health = unitType.maxHealth;
    this.maxHealth = unitType.maxHealth;
    this.damage = unitType.damage;
    this.width = unitType.width;
    this.height = unitType.height;
    this.y = canvasHeight - 160;
    this.timeLeft = 100;
    this.beingCreated = 0;
    
    this.enemyOverlap = -20; // Overlapping of the unit with an enemy (looks better) 
    this.unitNumber = unitNumber;
    this.attacking = 0;
    this.attackingDelay = unitType.attackingDelay; //delay in frames for attacking
    this.attackingCounter = 1;
    this.attackingStart = 0; //variable to start animation from beginning when attacking is initiated
    this.dying = 0;
    this.hitFor = 0;
    this.hasRange = unitType.hasRange;    //If unit has range: can do damage on a distance (while walking too)
    this.dist = 0; //distance to next target
    this.target = "None"; // for long range units
    this.coinReward = unitType.coinReward;  //granted to opposite player if this unit is killed
    this.expReward = unitType.expReward; //granted to opposite player if this unit is killed
    this.restingAnimationSpeed = unitType.restingAnimationSpeed;
    this.movingAnimationSpeed = unitType.movingAnimationSpeed;

    //sprite framenumber
    this.frameNum = 0;
    this.rounded_frame = 0; //will become the rounded value of this.frameNum for the indices

  }

  show(scrollPosition){
    if(this.active || this.isEnemy) {

      if (this.moving)
        this.x += this.speed;

      // DETERMINE MOVEMENT
      if(!this.isEnemy){
        if (this.unitNumber > 0 && this.x >= myUnits[this.unitNumber-1].x-this.width) // waiting on unit in front
          this.moving = 0;
        else if (this.x >= enemyTowerX-this.width) //at the enemy tower
          this.moving = 0;
        else if(enemyUnits.length > 0 && enemyUnits[0].x -  (this.x + this.width) <= this.enemyOverlap) //facing enemy
          this.moving = 0;
        else
          this.moving = 1;
      }else {
        if (this.unitNumber > 0 && this.x <= enemyUnits[this.unitNumber-1].x+enemyUnits[this.unitNumber-1].width) // waiting on unit in front
          this.moving = 0;
        else if (this.x <= myTowerX+140) //at the enemy tower
          this.moving = 0;
        else if(myUnits.length > 0 && myUnits[0].x+myUnits[0].width -  this.x >= 0) //facing enemy
          this.moving = 0;
        else
          this.moving = 1;
      }



      // HEALTH
      if(this.hitFor){
        //animate blood?
        this.health -= this.hitFor;
        this.hitFor = 0;
      }
      if (this.health <= 0) {
        if(this.isEnemy){
          coins += this.coinReward;
          exp += this.expReward;
          enemyUnits.splice(this.unitNumber,1);
          for (let i = 0; i<enemyUnits.length; i++){
            enemyUnits[i].unitNumber = i;
          }
          enemyDyingUnits.push(new EnemystageZero_firstDying(enemyDyingUnits.length, this.x, this.y, this.width, this.height));
        }
        else{
          myUnits.splice(this.unitNumber,1);
          for (let i = 0; i<myUnits.length; i++){
            myUnits[i].unitNumber = i;
            }
            myDyingUnits.push(new DyingUnit(myDyingUnits.length, this.x, this.y, this.animation, this.unitType, false));
        }
        deathSound.play();
      }


      // ATTACKING (FIXME: merge enemy and non enemy parts)
      if(!this.isEnemy){
        if (this.x+this.hasRange >= enemyTowerX-this.width){ // If unit within reach of enemytower
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
      }
      else {
        if (this.x-this.hasRange <= myTowerX+160){ // If unit within reach of enemytower
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

  animate(scrollPosition) {

    if(this.moving && this.active && !this.attacking) {
      this.frameNum += this.movingAnimationSpeed;
      this.rounded_frame = floor(this.frameNum%this.animation[0].length);
      image(this.animation[0][this.rounded_frame],floor(this.x-scrollPosition), this.y, this.width, this.height); //running animation
    }
    else if(this.active){  //if not moving but still alive
      if(this.attacking) {  //attacking
        if(this.attackingStart) this.frameNum = 0;
        this.attackingStart = 0;
        this.frameNum += this.animation[2].length/this.attackingDelay; //One attacking animation in one attacking phase
        this.rounded_frame = floor(this.frameNum%(this.animation[2].length));
        image(this.animation[2][this.rounded_frame],floor(this.x-scrollPosition), this.y, this.width, this.height); //attacking animation
      }
      else { //resting
        this.frameNum += this.restingAnimationSpeed;
        this.rounded_frame = floor(this.frameNum%(this.animation[1].length));
        image(this.animation[1][this.rounded_frame],floor(this.x-scrollPosition), this.y, this.width, this.height); //resting animation
      }
    }
  }
}


class DyingUnit {
  constructor(dyingUnitNumber, x, y, animation, unitType, isEnemy){
    let unitTypeString = unitType;
    unitType = eval(unitTypeString);
    this.number = dyingUnitNumber;
    this.frameNum = 0;
    this.rounded_frame = 0;
    this.animation = animation;
    this.remove = 0;
    this.width = unitType.width;
    this.height = unitType.height;
    this.x = x;
    this.y = y;
    this.frameSpeed = 0.15;
  }

  show(){

    this.frameNum += this.frameSpeed;
    this.rounded_frame = floor(this.frameNum);
    if(this.rounded_frame > this.animation[3].length-1)
      this.remove = 1;
    if (!this.remove)
      image(this.animation[3][this.rounded_frame],floor(this.x-scrollPosition), this.y, this.width, this.height); //dying animation
    else {
      //remove from list;
    }
  }
}