/*jshint esversion: 6 */
class Tower {
  constructor(turretSlots, stage, isEnemy) {
    this.health = 500;
    this.turretSlots = turretSlots;
    this.stage = stage;
    this.isEnemy = isEnemy;
    this.healthbarX = 0;

    if (this.isEnemy){
      this.healthbarX = fieldWidth - 40;
      this.x = enemyTowerX;
      this.textX = fieldWidth - 75;
    }
    else {
      this.x = myTowerX;
      this.healthbarX = 20;
      this.textX = 45;
    }
  }

  update() {
    this.stage = this.stage + 1;
  }

  show(scrollPostion){
    //draw base tower
    fill(0);
    rect(this.x-scrollPosition, 400, 140, 140);

    //draw turret turretSlots
    if (this.turretSlots == 1)
      rect(this.x+10-scrollPosition, 360, 40, 40);
    else if (this.turretSlots == 2){
      rect(this.x+10-scrollPosition, 360, 40, 40);
      rect(this.x+10-scrollPosition, 320, 40, 40);
    }
    else if (this.turretSlots == 3){
      rect(this.x+10-scrollPosition, 360, 40, 40);
      rect(this.x+10-scrollPosition, 320, 40, 40);
      rect(this.x+10-scrollPosition, 280, 40, 40);
    }

      //draw healthbar
      fill(60);
      rect(this.healthbarX - scrollPosition, 220, 20, 200); // outline bar
      fill(255, 0, 0);
      rect(this.healthbarX+2 - scrollPosition, 222 + floor(196-196*this.health/500), 16, floor(196*this.health/500)); // outline bar
      // hp text
      textSize(18);
      text(this.health, this.textX-scrollPosition, 222 + floor(196-196*this.health/500), 16, floor(196*this.health/500));
  }
}
