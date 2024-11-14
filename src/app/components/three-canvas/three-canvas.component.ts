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
  }

  ngOnDestroy(): void {
  }
}
