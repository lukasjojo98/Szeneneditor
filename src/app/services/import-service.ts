import { Injectable } from '@angular/core';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader.js';
import { PCDLoader } from 'three/examples/jsm/loaders/PCDLoader.js';
import { ThreeService } from './basic-three.service';
import * as THREE from 'three';
import { StoreElementsService } from './store-elements.service';

@Injectable({
  providedIn: 'root'
})
export class ImportService {

  constructor(private threeService: ThreeService, private storeElementsService: StoreElementsService) { }

  public importModel(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      return;
    }

    const file = input.files[0];
    let loader: any = null;
    const reader = new FileReader();

    reader.onload = (e: any) => {
      let content = e.target.result;

      if (file.name.endsWith(".obj")) {
        loader = new OBJLoader();
        const decoder = new TextDecoder();
        content = decoder.decode(content);
      } 
      else if (file.name.endsWith(".glb")) {
        loader = new GLTFLoader();
      } 
      else if (file.name.endsWith(".fbx")) {
        loader = new FBXLoader();
      } 
      else if(file.name.endsWith(".ply")){
        loader = new PLYLoader();
        const geometry = loader.parse(content);
        const material = new THREE.MeshStandardMaterial({color: 0x00ff00});
        const model = new THREE.Mesh(geometry, material);
        this.handleModel(model);
        return;
      }
      else if(file.name.endsWith(".pcd")){
        loader = new PCDLoader();
        const points = loader.parse(content);
        this.threeService.getScene().add(points);
        return;
      }
      // else if (file.name.endsWith(".json")) {
      //   loader = new THREE.ObjectLoader();
      //   const decoder = new TextDecoder();
      //   content = decoder.decode(content);

      //   const parsedObject = loader.parse(JSON.parse(content));
      //   this.threeService.getScene().add(parsedObject);
      // } 
      else {
        alert("File type not supported.");
        return;
      }
      const model = loader.parse(content).children[0];
      this.handleModel(model);
      
    };
    reader.readAsArrayBuffer(file);
  }

  private handleModel(model: any) {
    model.material = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
    model.position.set(0, 0, 0);
    model.scale.set(1, 1, 1);
    model.userData['id'] = this.storeElementsService.getIndex();
    this.storeElementsService.addElement(model);
    this.threeService.getScene().add(model);
    this.threeService.addDragableElements(model);
  }
}
