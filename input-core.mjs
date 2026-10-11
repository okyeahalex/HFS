// Fixed-step input ramp: quick response without instantaneous key jumps.
export class KeyJoystick {
 constructor(){this.reset();}
 reset(){this.x=0;this.y=0;}
 update(x,y,dt){const a=1-Math.exp(-dt/.13);this.x+=(x-this.x)*a;this.y+=(y-this.y)*a;return [this.x,this.y];}
}
