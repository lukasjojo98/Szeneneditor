import { Injectable } from '@angular/core';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { DragControls } from 'three/examples/jsm/controls/DragControls.js';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';
import { SelectionService } from './selection.service';
import { ThreeService } from './basic-three.service';
import * as THREE from 'three';

@Injectable({
  providedIn: 'root'
})

export class ControlService {
  private dragControls!: DragControls;
  private orbitControls!: OrbitControls;
  private transformControls!: TransformControls;
  private coordinationType !: string;

  constructor(private selectionService: SelectionService, private threeService: ThreeService) { }

  createControls(type: string[], camera: any, renderer: HTMLElement, elements?: any): any {
    for(let i = 0; i < type.length; i++){
      if(type[i] == "Drag"){
        this.dragControls = new DragControls(elements, camera, renderer);
        this.dragControls.addEventListener("hoveron", (event: any) => {
          event.object.material.wireframe = true;
        });
    
        this.dragControls.addEventListener("hoveroff", (event: any) => {
          event.object.material.wireframe = false;
        });
    
        this.dragControls.addEventListener("drag", (event: any) => {
          const selectedObject = this.selectionService.getSelectedObject();
          event.object.position.copy(event.object.userData.initialPosition);
          selectedObject.position.set(event.object.position.x, event.object.position.y, event.object.position.z);
          this.attachTransformControl(event.object);
        });

        this.dragControls.addEventListener("dragstart", (event: any) => {
          this.orbitControls.enabled = false;
          event.object.material.wireframe = false;
          this.selectionService.setSelectedObject(event.object);
          event.object.userData.initialPosition = { 
            x: event.object.position.x,
            y: event.object.position.y,
            z: event.object.position.z 
          };
          const id = event.object.userData['id'];
          const objectElements = document.querySelectorAll('.object-item');
          for(let i = 0; i < objectElements.length; i++){
            objectElements[i].classList.remove('selected');
          }
          if(id != undefined){
            document.getElementById(id)?.classList.add('selected');
          }
          this.attachTransformControl(event.object);
        });
    
        this.dragControls.addEventListener("dragend", (event: any) => {
          this.orbitControls.enabled = true;
        });

        elements.forEach((object: any) => {
          object.userData.initialPosition = object.position.clone();
        });
      }
      if(type[i] == "Orbit"){
        this.orbitControls = new OrbitControls(camera, renderer);
        this.orbitControls.enableDamping = true;
        this.orbitControls.dampingFactor = 1.0;
        this.orbitControls.enableZoom = true;
      }
    }
  }

  createTransformControls(camera: any, renderer: HTMLElement, elements?: any) {
    this.transformControls = new TransformControls(camera, renderer);

    this.transformControls.addEventListener("change", () => {
      const helperElements = this.threeService.getHelperElements();
          for(let i = 0; i < helperElements.length; i++) {
            if(helperElements[i].type == "SpotLightHelper"){
              helperElements[i].update();
            }
          }
    });
    this.transformControls.addEventListener("dragging-changed", (event) => {
      this.orbitControls.enabled = !event.value;
    });
    this.transformControls.setMode("translate");
    return this.transformControls;
  }
  public attachTransformControl(object: any) {
    this.transformControls.attach(object);
  }
  public detachTransformControl() {
    this.transformControls.detach();
  }
  public setCoordinationType(coordinate: string): void {
    this.coordinationType = coordinate;
  }
  setTransformControlMode(mode: any) {
    this.transformControls.setMode(mode);
  }
}