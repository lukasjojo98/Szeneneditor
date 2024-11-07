import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { ImportModelService } from '../../services/import-model.service';
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

  constructor(private importModelService: ImportModelService, private threeService: ThreeService, private storeElementsService: StoreElementsService, private controlService: ControlService) {}

  public handleClick(): any {
    document.getElementById("file-import")?.click();
  }
  public importModel(event: Event): void {
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

  public addPrimitive(event: any): any {
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

  public toggleGrid(): void {
    this.threeService.getGridHelper().visible = !this.threeService.getGridHelper().visible;
  }
}
