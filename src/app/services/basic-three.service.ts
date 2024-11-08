import { Injectable } from '@angular/core';
import * as THREE from 'three';

@Injectable({
  providedIn: 'root'
})
export class ThreeService {
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private sphere!: THREE.Mesh;
  private dragElements: THREE.Object3D[] = [];
  private helperElements: any[] = [];
  private gridHelper!: THREE.GridHelper;

  constructor() {
    this.initThree();
  }

  private initThree(): void {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x808080);
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.scene.add(this.camera);
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.8;
    this.gridHelper = new THREE.GridHelper(10, 10);
    this.scene.add(this.gridHelper);
    this.camera.position.z = 5;
    this.animate();
  }
  public getRendererElement(): HTMLElement {
    return this.renderer.domElement;
  }
  public getRenderer(): THREE.WebGLRenderer{
    return this.renderer;
  }
  public getScene(): THREE.Scene {
    return this.scene;
  }
  public getSphere(): any {
    return this.sphere;
  }
  public getCamera(): THREE.PerspectiveCamera {
    return this.camera;
  }
  public addDragableElements(element: THREE.Object3D): any {
    this.dragElements.push(element);
  }
  public getElements(): any {
    return this.dragElements;
  }
  public getHelperElements(): any {
    return this.helperElements;
  }
  public addHelperElements(element: any) {
    this.helperElements.push(element);
  }
  public exportScene(): any {
    const originalEnvironment = this.scene.environment;
    this.scene.environment = null;
    const sceneJSON = this.scene.toJSON();
    this.scene.environment = originalEnvironment;
    const jsonString = JSON.stringify(sceneJSON);
    return jsonString;
  }
  private animate(): void {
    requestAnimationFrame(() => this.animate());
    this.renderer.render(this.scene, this.camera);
  }
  public getGridHelper(): THREE.GridHelper {
    return this.gridHelper;
  }
}
