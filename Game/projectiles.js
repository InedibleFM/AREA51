class projectile_1 {
  constructor(target, distance, x, damage, direction){
    this.target = target;
    this.dist = distance;
    this.x = x;
    this.beginX = x;
    this.cnt = 0;
    this.damage = damage;
    this.speed = 8;
    this.remove = 0;
    this.y = canvasHeight -140;
    this.arch = 0;
    this.archTop = 70;
  }

  show(){
    this.x+=this.speed;
    fill(230, 230, 230);
    if (this.x-this.beginX > this.archTop)
      this.arch += 0.01*((this.x-this.beginX)-this.archTop);
    else
      this.arch -=  0.01*((this.x-this.beginX)-this.archTop);

    ellipse(this.x-scrollPosition, this.y+this.arch, 8, 8);
    if (this.target == "tower") {
      if(this.x > 1200){
        theEnemyTower.health -= this.damage;
        hitSound.play();
        this.remove = 1;
      }
    }
    if (this.target == "unit") {
      if(enemyUnits.length > 0 && this.x > enemyUnits[0].x){
        enemyUnits[0].health -= this.damage;
        hitSound.play();
        this.remove = 1;
      }
    }
  }
}


  class Enemy_projectile_1 {
    constructor(target, distance, x, damage, direction){
      this.target = target;
      this.dist = distance;
      this.x = x;
      this.beginX = x;
      this.cnt = 0;
      this.damage = damage;
      this.speed = 8;
      this.remove = 0;
      this.y = canvasHeight -140;
      this.arch = 0;
      this.archTop = 70;
    }

    show(){
      this.x+=this.speed;
      fill(230, 230, 230);
      if (this.x-this.beginX > this.archTop)
        this.arch += 0.1*((this.x-this.beginX)-this.archTop);
      else
        this.arch -=  0.01*((this.x-this.beginX)-this.archTop);

      ellipse(this.x-scrollPosition, this.y+this.arch, 8, 8);
      if (this.target == "tower") {
        if(this.x > 1200){
          theEnemyTower.health -= this.damage;
          hitSound.play();
          this.remove = 1;
        }
      }
      if (this.target == "unit") {
        if(this.x > enemyUnits[0].x){
          enemyUnits[0].health -= this.damage;
          hitSound.play();
          this.remove = 1;
        }
      }
    }
}
