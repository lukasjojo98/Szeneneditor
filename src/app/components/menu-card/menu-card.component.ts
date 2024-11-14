import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, Renderer2, NgZone } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import { SelectionService } from '../../services/selection.service';
import { CommonModule } from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import { ThreeService } from '../../services/basic-three.service';
import {MatTabsModule} from '@angular/material/tabs';
import * as THREE from 'three';
import { ControlService } from '../../services/control.service';
import { StoreElementsService } from '../../services/store-elements.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-menu-card',
  standalone: true,
  imports: [MatCardModule, CommonModule, MatButtonModule, MatTabsModule, FormsModule],
  templateUrl: './menu-card.component.html',
  styleUrl: './menu-card.component.css'
})

export class MenuCardComponent implements OnInit, OnDestroy{

  private clickListener: (() => void) | undefined;
  objectProperties!: Map<string,string>;
  width!: any;
  height!: any;
  depth!: any;
  roughnessInput!: any;
  metalnessInput!: any;
  colorInput!: any;
  translateShortcut!: any;
  rotateShortcut!: any;
  scaleShortcut!: any;
  focusShortcut!: any;
  

  constructor(private selectionService: SelectionService, private threeService: ThreeService, private controlService: ControlService, private storeElementsService: StoreElementsService, private renderer: Renderer2, private ngZone: NgZone) {}
  
  ngOnDestroy(): void {
    if(this.clickListener) {
      this.clickListener();
    }
    window.removeEventListener('keydown', this.onKeyDown.bind(this));
  }
  ngOnInit(): void {
    this.translateShortcut = "w";
    this.scaleShortcut = "r";
    this.rotateShortcut = "e";
    this.focusShortcut = "f";
    this.clickListener = this.renderer.listen('window', 'click', (event) => {
      const element = this.selectionService.getSelectedObject(); 
      if(element && this.hasMaterial()){
        this.roughnessInput = element.material.roughness;
        this.metalnessInput = element.material.metalness;
        this.colorInput = this.rgbToHex(element.material.color.r, element.material.color.g, element.material.color.b).replace("0x","#");
      }
    });

    this.ngZone.runOutsideAngular(() => {
      window.addEventListener('keydown', this.onKeyDown.bind(this));
    });
  }

  onKeyDown(event: KeyboardEvent): void {
    if(event.key == this.rotateShortcut) {
      this.controlService.setTransformControlMode("rotate");
    }
    else if(event.key == this.translateShortcut){
      this.controlService.setTransformControlMode("translate");
    }
    else if(event.key == this.scaleShortcut){
      this.controlService.setTransformControlMode("scale");
    }
    else if (event.key == 'Delete') {
      this.controlService.detachTransformControl();
      this.storeElementsService.removeElement(this.selectionService.getSelectedObject());
      this.selectionService.setSelectedObject(new THREE.Object3D());
    }
    else if(event.key == this.focusShortcut){
      const element = this.selectionService.getSelectedObject();
      var aabb = new THREE.Box3().setFromObject(element);
      var center = aabb.getSize(new THREE.Vector3());
      this.threeService.getCamera().lookAt(center);
    }
  }

  getProperties(): any {
    return Array.from(this.selectionService.getProperties().keys()); 
  }
  getValuesToProperty(index: any): any {
    return Array.from(this.selectionService.getProperties().values())[index];
  }
  getObjects(): THREE.Object3D[] {
    return this.threeService.getElements();
  }
  changeBackgroundColor(event: any): any {
    this.threeService.getScene().background = new THREE.Color(event.target.value);
  }
  isSelected() {
    return this.selectionService.getSelectedObject();
  }
  getSelectedType() {
    const element = this.selectionService.getSelectedObject();
    if(element.geometry && element.geometry.type == "BoxGeometry"){
      return this.selectionService.getSelectedObject().geometry.type;
    }
    return "";
  }
  hasMaterial(){
    const element = this.selectionService.getSelectedObject();
    if(element.material){
      return true;
    }
    return false;
  }
  hasGeometry(){
    const element = this.selectionService.getSelectedObject();
    if(element.geometry){
      return true;
    }
    return false;
  }
  getSelectedObjectProperty(input: string): any {
    const element = this.selectionService.getSelectedObject();
    if(element){
      if(input == "name"){
        return element.name;
      }
      else if(input == "type"){
        return element.type;
      }
      else if(input == "uuid"){
        return element.uuid;
      }
    }      
  }
  getPropertyFromGeometry(input: string): any {
    const element = this.selectionService.getSelectedObject().geometry;
    if(element && element.type != "BufferGeometry"){
      this.width = element.parameters.width;
      this.height = element.parameters.height;
      this.depth = element.parameters.depth;
      if(input == "type"){
        return element.type;
      }
      else if(input == "uuid"){
        return element.uuid;
      }
      else if(input == "name"){
        return element.name;
      }
    }
  }
  getPropertyFromMaterial(input: string): any {
    const element = this.selectionService.getSelectedObject().material;
    if(element){
      if(input == "type"){
        return element.type;
      }
      else if(input == "uuid"){
        return element.uuid;
      }
      else if(input == "name"){
        return element.name;
      }
    }
  }
  private rgbToHex(r: any, g: any, b: any) {
    const toHex = (c: number) => {
      const hex = Math.round(Math.min(1, Math.max(0, c)) * 255).toString(16);
      return hex.padStart(2, "0");
  };
  return `0x${toHex(r)}${toHex(g)}${toHex(b)}`;
  }
  handleClick(event: any): void {
    const id = event.srcElement.id;
    const objectElements = document.querySelectorAll('.object-item');
    for(let i = 0; i < objectElements.length; i++){
      objectElements[i].classList.remove('selected');
    }
    event.srcElement.classList.add('selected');
    const element = this.storeElementsService.findElementById(id);
    if(element){
      this.controlService.attachTransformControl(element);
      this.selectionService.setSelectedObject(element);
    }
  }
  transformObject(event: any): any {
    const object = this.selectionService.getSelectedObject();
    const element = event.srcElement;
    if(element.id[0] == "0"){
      if(element.id[1] == "0"){
        object.position.setX(element.value);
      }
      if(element.id[1] == "1"){
        object.position.setY(element.value);
      }
      if(element.id[1] == "2"){
        object.position.setZ(element.value);
      }
    }
    if(element.id[0] == "1"){
      if(element.id[1] == "0"){
        object.scale.setX(element.value);
      }
      if(element.id[1] == "1"){
        object.scale.setY(element.value);
      }
      if(element.id[1] == "2"){
        object.scale.setZ(element.value);
      }
    }
    if(element.id[0] == "2"){
      if(element.id[1] == "0"){
        object.rotateX(element.value);
      }
      if(element.id[1] == "1"){
        object.rotateY(element.value);
      }
      if(element.id[1] == "2"){
        object.rotateZ(element.value);
      }
    }
  }

  changeSize(event: any) {
  }

  changeColorOfSelectedObject(event: any){
    const element = this.selectionService.getSelectedObject();
    element.material.color.setHex("0x" + this.colorInput.replace("#",""));
  }

  changeMaterialProperty(input: string){
    const element = this.selectionService.getSelectedObject();
    if(input == "roughness"){
      element.material.roughness = this.roughnessInput;
    }
    else if(input == "metalness"){
      element.material.metalness = this.metalnessInput;
    }
    element.material.needsUpdate = true;
  }

  renderImage(){
    const renderer = this.threeService.getRenderer();
    renderer.render(this.threeService.getScene(), this.threeService.getCamera());

    this.downloadImage(renderer.domElement.toDataURL());
  }

  private downloadImage(url: any) {
    const link = document.createElement('a');
    link.href = url;
    link.download = 'capture.png';
    link.click();
  }
}
