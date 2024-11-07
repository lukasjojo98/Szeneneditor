import { Component, AfterViewInit, ElementRef, ViewChild, NgZone } from '@angular/core';
import { ThreeService } from '../../services/basic-three.service';
import { ControlService } from '../../services/control.service';
import { StoreElementsService } from '../../services/store-elements.service';
import { SelectionService } from '../../services/selection.service';
import * as THREE from 'three';

@Component({
  selector: 'app-three-canvas',
  standalone: true,
  templateUrl: './three-canvas.component.html',
  styleUrl: './three-canvas.component.css'
})
export class ThreeCanvasComponent implements AfterViewInit {
  @ViewChild('canvasContainer', { static: true }) canvasContainer!: ElementRef;

  constructor(private threeService: ThreeService, private controlService: ControlService, private ngZone: NgZone, private storeElementsService: StoreElementsService, private selectionService: SelectionService) {}

  ngAfterViewInit() {
    this.canvasContainer.nativeElement.appendChild(this.threeService.getRendererElement());
    this.controlService.createControls(["Orbit", "Drag"], this.threeService.getCamera(), this.threeService.getRendererElement(), this.threeService.getElements());
    const transformControls = this.controlService.createTransformControls(this.threeService.getCamera(), this.threeService.getRendererElement());
    this.threeService.getScene().add(transformControls);
  }
  ngOnInit(): void {
    this.ngZone.runOutsideAngular(() => {
      window.addEventListener('keydown', this.onKeyDown.bind(this));
    });
  }

  ngOnDestroy(): void {
    window.removeEventListener('keydown', this.onKeyDown.bind(this));
  }

  onKeyDown(event: KeyboardEvent): void {
    if(event.key == 'e') {
      this.controlService.setTransformControlMode("rotate");
    }
    else if(event.key == 'w'){
      this.controlService.setTransformControlMode("translate");
    }
    else if(event.key == 'r'){
      this.controlService.setTransformControlMode("scale");
    }
    else if (event.key == 'Delete') {
      this.storeElementsService.removeElement(this.selectionService.getSelectedObject());
      this.selectionService.setSelectedObject(new THREE.Object3D());
    }
  }
}
