import { Sky } from 'three/examples/jsm/objects/Sky'
import * as THREE from 'three'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min'

export class InitSky {
  sky = new Sky()
  sun = new THREE.Vector3()
  effectController = {
    turbidity: 6.1,
    rayleigh: 4,
    mieCoefficient: 0.015,
    mieDirectionalG: 0.99,
    elevation: 63.9,
    azimuth: 180,
    // exposure: 0.4269
    exposure: 1
  }
  constructor(
    public scene: THREE.Scene,
    public camera: THREE.PerspectiveCamera,
    public renderer: THREE.WebGLRenderer,
    public stats: Stats,
    public gui: GUI
  ) {
    this.initSky()
  }
  initSun(){
    const directionalLight = new THREE.DirectionalLight(0xffffff,3)
    directionalLight.castShadow = true
    directionalLight.shadow.mapSize.width = 512; // default
    directionalLight.shadow.mapSize.height = 512; // default
    directionalLight.shadow.camera.near = 0.5; // default
    directionalLight.shadow.camera.far = 5000; // default
    const box = new THREE.Mesh(new THREE.BoxGeometry(150,150,150),new THREE.MeshStandardMaterial({color:'orange'}))
    directionalLight.add(box)
    directionalLight.position.setY(1000)
    return directionalLight
  }
  initSky() {
    // Add Sky
    const sky = this.sky
    sky.scale.setScalar(450000)
    const sun = this.initSun()
    this.scene.add(sun)
    this.scene.add(sky)
    
    /// GUI
    const effectController = this.effectController

    const guiChanged = () => {
      const uniforms = sky.material.uniforms
      uniforms['turbidity'].value = effectController.turbidity
      uniforms['rayleigh'].value = effectController.rayleigh
      uniforms['mieCoefficient'].value = effectController.mieCoefficient
      uniforms['mieDirectionalG'].value = effectController.mieDirectionalG

      const phi = THREE.MathUtils.degToRad(90 - effectController.elevation)
      const theta = THREE.MathUtils.degToRad(effectController.azimuth)

      this.sun.setFromSphericalCoords(1, phi, theta)

      uniforms['sunPosition'].value.copy(this.sun)

      this.renderer.toneMappingExposure = effectController.exposure
      this.renderer.render(this.scene, this.camera)
    }
    
    const gui = this.gui

    gui.add(effectController, 'turbidity', 0.0, 20.0, 0.1).onChange(guiChanged)
    gui.add(effectController, 'rayleigh', 0.0, 4, 0.001).onChange(guiChanged)
    gui
      .add(effectController, 'mieCoefficient', 0.0, 0.1, 0.001)
      .onChange(guiChanged)
    gui
      .add(effectController, 'mieDirectionalG', 0.0, 1, 0.001)
      .onChange(guiChanged)
    gui.add(effectController, 'elevation', 0, 90, 0.1).onChange(guiChanged)
    gui.add(effectController, 'azimuth', -180, 180, 0.1).onChange(guiChanged)
    gui.add(effectController, 'exposure', 0, 50, 0.0001).onChange(guiChanged)

    guiChanged()
    console.log(sky);

  }
  animate = () => {
    if (this.effectController.elevation === 90){
      this.effectController.azimuth = 0
    }
    
    if (this.effectController.elevation === 0){
      this.effectController.azimuth = 180
    }
      this.effectController.azimuth === 0
      ? this.effectController.elevation--
      : this.effectController.elevation++
  }
}
