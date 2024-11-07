import { Component, ElementRef, OnInit, ViewChild, Renderer2} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThreeCanvasComponent } from './components/three-canvas/three-canvas.component';
import { MenuCardComponent } from './components/menu-card/menu-card.component';
import { ThreeService } from './services/basic-three.service';
import * as THREE from 'three';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ThreeCanvasComponent, MenuCardComponent, NavBarComponent, MenuCardComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent implements OnInit{

  private camera!: THREE.PerspectiveCamera;
  private unlistener1!: (() => void);
  private unlistener2!: (() => void);

  title = 'SceneEditorThreeJS';

  constructor(private threeService: ThreeService, private renderer2: Renderer2) {}

  ngOnInit(): void {
  }

  private resize(event: any, service?: any): void {
    const canvasItem: any = document.querySelector('.canvas-item');
    canvasItem.style.width = (event.clientX - canvasItem.offsetLeft) + 'px';
    const menuPanel: any = document.querySelector('.menu-panel');
    menuPanel.style.width = (window.innerWidth - canvasItem.offsetWidth) + 'px';
    const width  = canvasItem.offsetWidth;
    const height = window.innerHeight;
    
    this.threeService.getCamera().aspect = width / height;
    this.threeService.getCamera().updateProjectionMatrix();
    this.threeService.getRenderer().setSize(width, height);
  }

  private stopResize(): void {
    this.unlistener1();
    this.unlistener2();
  }

  handleMouseDown(): void {
    this.unlistener1 = this.renderer2.listen("document", "mousemove", event => {
      this.resize(event);
    });
    this.unlistener2 = this.renderer2.listen("document", "mouseup", event => {
      this.stopResize();
    });
  }
}
