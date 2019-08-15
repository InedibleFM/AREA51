/*jshint esversion: 6 */
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
