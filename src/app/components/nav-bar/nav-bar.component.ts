import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { ImportService } from '../../services/import-service';
import { ThreeService } from '../../services/basic-three.service';
import { StoreElementsService } from '../../services/store-elements.service';
import * as THREE from 'three';
import { ControlService } from '../../services/control.service';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [MatButtonModule, MatMenuModule, CommonModule],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent {


  constructor(private importModelService: ImportService, private threeService: ThreeService, private storeElementsService: StoreElementsService, private controlService: ControlService) {}

  public handleClick(event: any): any {
    const text = event.srcElement.innerHTML;
    if(text == "Import"){
      document.getElementById("file-import")?.click();
    }
    else if(text == "Open"){
    document.getElementById("scene-import")?.click();
    }
  }
  public importModel(event: Event): void {
    this.importModelService.importModel(event);
  }
  public importScene(event: Event) {
    this.importModelService.importModel(event);
  }
  public exportScene(): any {
    const json = this.threeService.exportScene();
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(json);
    var dlAnchorElem = document.getElementById('download-element');
    dlAnchorElem?.setAttribute("href", dataStr);
    dlAnchorElem?.setAttribute("download", "scene.json");
    dlAnchorElem?.click();
  }

  public addCamera(event: any) {
    const text = event.srcElement.innerHTML;
    const cameraType: { [key: string]: THREE.Camera } = {
      "Orthographic": new THREE.OrthographicCamera(),
      "Perspective": new THREE.PerspectiveCamera()
    };

    const index = this.storeElementsService.getIndex();
    const name = `${text}${index}`;
    const camera = cameraType[text];
    camera.userData['id'] = index;
    camera.name = name;

    const helper = new THREE.CameraHelper(camera);
    this.threeService.getScene().add(camera);
    this.threeService.getScene().add(helper);
    this.storeElementsService.addElement(camera);
    this.threeService.addHelperElements(helper);
    this.threeService.addDragableElements(camera);
  }

  public addPrimitive(event: any) {
    const text = event.srcElement.innerHTML;
    const shapeMap: { [key: string]: THREE.BufferGeometry } = {
      "Box": new THREE.BoxGeometry(1, 1),
      "Sphere": new THREE.SphereGeometry(1),
      "Capsule": new THREE.CapsuleGeometry(1, 1),
      "Circle": new THREE.CircleGeometry(1)
    };
  
    if (shapeMap[text]) {
      this.createAndAddShape(text, shapeMap[text]);
    }
  }
  
  private createAndAddShape(shapeName: string, geometry: THREE.BufferGeometry): void {
    const material = new THREE.MeshStandardMaterial({ roughness: 0.5, metalness: 0.5 });
    const mesh = new THREE.Mesh(geometry, material);
    const index = this.storeElementsService.getIndex();
    const name = `${shapeName}${index}`;
  
    mesh.userData['id'] = index;
    mesh.name = name;
  
    this.storeElementsService.addElement(mesh);
    this.threeService.addDragableElements(mesh);
    this.threeService.getScene().add(mesh);
  }

  public addLight(event: any) {
    const text = event.srcElement.innerHTML;
    const light: { [key: string]: any } = {
      "Ambient": new THREE.AmbientLight(),
      "Directional": new THREE.DirectionalLight(),
      "Hemisphere": new THREE.HemisphereLight(),
      "Point": new THREE.PointLight(),
      "Spot": new THREE.SpotLight()
    };

    if (light[text]) {
      this.createAndAddLight(text, light[text]);
    }
  }

  private createAndAddLight(lightName: string, light: any): void {
    const index = this.storeElementsService.getIndex();
    const name = `${lightName}${index}`;
    let helper: any = null;

    if(lightName == "Directional") {
      helper = new THREE.DirectionalLightHelper(light);
    }
    else if(lightName == "Hemisphere") {
      helper = new THREE.HemisphereLightHelper(light, 1);
    }
    else if(lightName == "Point") {
      helper = new THREE.PointLightHelper(light);
    }
    else if(lightName == "Spot") {
      helper = new THREE.SpotLightHelper(light);
    }

    light.userData['id'] = index;
    light.name = name;
  
    this.storeElementsService.addElement(light);
    this.threeService.addDragableElements(light);
    this.threeService.getScene().add(light);
    if(helper != null) {
      this.threeService.getScene().add(helper);
      this.threeService.addHelperElements(helper);
    }
  }

  public toggleGrid(): void {
    this.threeService.getGridHelper().visible = !this.threeService.getGridHelper().visible;
  }
}
