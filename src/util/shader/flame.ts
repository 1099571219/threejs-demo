import Emitter from './emitter'
import Tween from './tween'
import { Shape } from './const'
import * as THREE from "three";
// import smokePng from '../../img/smoke.png'
interface Params{
  position:number[],
  rotate:number[],
}

class FlameEmitter extends Emitter {

  constructor(params:Params) {
   
    super({
      positionShape: Shape.SPHERE,
      position: new THREE.Vector3(...params.position),
      positionRadius: 0,
      velocityShape: Shape.CUBE,
      velocity: new THREE.Vector3(...params.rotate),
      velocityRange: new THREE.Vector3(0, 0, 0),
      texture: new THREE.TextureLoader().load('/img/smoke.png'),
      sizeTween: new Tween( [0, 3, .5], [0, 15, 0] ),
      opacityTween: new Tween( [0.9, 1.5], [1, 0] ),
      colorTween : new Tween( [0.3, .6,1], [new THREE.Vector3(0.05, .5, 0.01), new THREE.Vector3(0.02, 1, 0.5),new THREE.Vector3(0, .5, 0.01)] ),
      blendMode : THREE.AdditiveBlending,
      particlesPerSecond: 60
    })
  }

}

export default FlameEmitter