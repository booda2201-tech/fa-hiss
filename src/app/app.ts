import { Component, afterNextRender, inject } from '@angular/core';
import { AosService } from './core/services/aos.service';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';

@Component({
  selector: 'app-root',
  imports: [MainLayoutComponent],
  template: `<app-main-layout />`,
})
export class App {
  private readonly aos = inject(AosService);

  constructor() {
    afterNextRender(() => this.aos.init());
  }
}
