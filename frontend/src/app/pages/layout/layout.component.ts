import { Component } from '@angular/core';
import { NavBarComponent } from './components/side-bar/side-bar.component';
import { RouterModule } from '@angular/router';

interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}
@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterModule, NavBarComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
})
export class LayoutComponent {
  isSideNavCollapsed = false;
  screenWidth = 0;
  toggleSideNav(data: SideNavToggle): void {
    this.screenWidth = data.screenWidth;
    this.isSideNavCollapsed = data.collapsed;
    this.getBodyClass();
  }

  getBodyClass() {
    let styleClass = '';

    if (this.isSideNavCollapsed && this.screenWidth > 768) {
      styleClass = 'body-trimed';
    } else if (this.isSideNavCollapsed && this.screenWidth <= 768 && this.screenWidth > 320) {
      styleClass = 'body-md-screen';
    } else if (this.isSideNavCollapsed && this.screenWidth <= 320 && this.screenWidth > 0) {
      styleClass = 'body-sm-screen';
    }
    return styleClass;
  }
}
