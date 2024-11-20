import { Component } from '@angular/core';
import { NavBarComponent } from '../components/side-bar/side-bar.component';
import { RouterModule } from '@angular/router';

interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}
@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterModule, NavBarComponent],
  template: `
    <app-side-bar (toggleSideNav)="toggleSideNav($event)" />
    <div class="body" [class]="getBodyClass()">
      <router-outlet />
    </div>
  `,
  styleUrl: './layout.component.css',
})
export class LayoutComponent {
  isSideNavCollapsed = false;
  screenWidth = 0;
  loged: boolean | null = null;

  toggleSideNav(data: SideNavToggle): void {
    this.screenWidth = data.screenWidth;
    this.isSideNavCollapsed = data.collapsed;
    this.getBodyClass();
  }

  getBodyClass() {
    let styleClass = '';

    if (this.isSideNavCollapsed && this.screenWidth > 768) {
      styleClass = 'body-trimed';
    } else if (this.isSideNavCollapsed && this.screenWidth <= 768 && this.screenWidth > 425) {
      styleClass = 'body-md-screen';
    } else if (this.isSideNavCollapsed && this.screenWidth <= 425 && this.screenWidth > 0) {
      styleClass = 'body-sm-screen';
    }
    return styleClass;
  }
}
