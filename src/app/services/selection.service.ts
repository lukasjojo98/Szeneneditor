import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { ThreeService } from './basic-three.service';
import { ControlService } from './control.service';

@Injectable({
  providedIn: 'root'
})
export class SelectionService {

  selectedObject!: THREE.Object3D;
  objectProperties: Map<string,number[]> = new Map<string,number[]>;

  constructor() { }

  getSelectedObject(): THREE.Object3D {
    return this.selectedObject;
  }
  setSelectedObject(object: THREE.Object3D): void {
    this.selectedObject = object;
  }

  setDefaultValues(map: Map<string,number[]>): Map<string,number[]> {
    map.set("Position", [0, 0, 0]);
    map.set("Scale", [1, 1, 1]);
    map.set("Rotation", [0, 0, 0]);
    return map;
  }
  getProperties(): Map<string,number[]> {
    const current: any = this.selectedObject;
    if (current == undefined){
      return this.setDefaultValues(new Map<string,number[]>);
    }
    this.objectProperties.set("Position",[current.position.x, current.position.y, current.position.z]);
    this.objectProperties.set("Scale", [current.scale.x, current.scale.y, current.scale.z]);
    this.objectProperties.set("Rotation", [current.rotation.x, current.rotation.y, current.rotation.z]);

    return this.objectProperties;
  }
  
}
