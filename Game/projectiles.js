class projectile_1 {
  constructor(target, distance, x, damage){
    this.target = target;
    this.speed = 8;
    this.dist = 0.8*distance;
    this.x = x;
    this.beginX = x;
    this.cnt = 0;
    this.damage = damage;
    this.remove = 0;
    this.y = canvasHeight -140;
    this.arch = 0;
    this.archTopX = 0.5*this.dist;
  }

  show(){
    fill(230, 230, 230);
    ellipse(this.x-scrollPosition, this.y+this.arch, 8, 8);
   
    if (this.target == "tower") {
      if(this.x > 1200){
        theEnemyTower.health -= this.damage;
        hitSound.play();
        this.remove = 1;
      }
    }
    if (this.target == "unit") {
      if(enemyUnits.length > 0 && this.x > enemyUnits[0].x && this.y+this.arch < canvasHeight-50){
        enemyUnits[0].health -= this.damage;
        hitSound.play();
        this.remove = 1;
      }
    }
    if (this.y+this.arch > canvasHeight)
      this.remove = 1;
    this.x+=this.speed;
    this.arch = 0.0007*(this.dist*Math.pow((this.x-this.beginX-this.archTopX),2)/this.archTopX - this.dist*this.archTopX);
  }
  
}