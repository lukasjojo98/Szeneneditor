import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { ThreeService } from './basic-three.service';

@Injectable({
  providedIn: 'root'
})
export class StoreElementsService {

  elements: THREE.Object3D[] = [];
  index: number = -1;

  constructor(private threeService: ThreeService) { }

  public addElement(element: THREE.Object3D): void {
    this.elements.push(element);
  }
  public removeElement(element: THREE.Object3D): void {
    this.elements.forEach((item, index) => {
      if(item == element){
        this.elements.splice(index, 1);
        this.threeService.getScene().remove(element);
      }
    });
  }
  public findElementById(id: number): THREE.Object3D | undefined {
    const object = this.elements.find(element=>element.userData['id'] == id);
    if(object) return object;
    return undefined;
  }
  public getIndex(): number {
    return ++this.index;
  }
}
