import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>',
  styles: []
  // Remove 'standalone: true' if present
})
export class AppComponent {
  title = 'angular-firebase-chat';
}
