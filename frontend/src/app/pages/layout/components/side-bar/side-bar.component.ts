import { Component, EventEmitter, HostListener, OnInit, Output } from '@angular/core';
import { navbarData } from './nav-data';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { animate, keyframes, style, transition, trigger } from '@angular/animations';
import { INavbarData } from './helper';

interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}
@Component({
  selector: 'app-side-bar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.css',
  animations: [trigger('fadeinOut', [transition(':enter', [style({ opacity: 0 }), animate('350ms', style({ opacity: 1 }))])]), trigger('fadeinOut', [transition(':leave', [style({ opacity: 1 }), animate('350ms', style({ opacity: 0 }))])]), trigger('rotate', [transition(':enter', [animate('1000ms', keyframes([style({ transform: 'rotate(0deg)', offset: '0' }), style({ transform: 'rotate(2turn)', offset: '1' })]))])])],
})
export class NavBarComponent implements OnInit {
  @Output() toggleSideNav: EventEmitter<SideNavToggle> = new EventEmitter<SideNavToggle>();
  collapsed = false;
  navData = navbarData;
  screenWidth = 0;
  multiple = false;
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.screenWidth = window.innerWidth;
    if (this.screenWidth <= 768) {
      this.collapsed = false;
      this.toggleSideNav.emit({ collapsed: this.collapsed, screenWidth: this.screenWidth });
    }
  }
  ngOnInit(): void {
    this.screenWidth = window.innerWidth;
  }
  toggleCollapsed() {
    this.collapsed = !this.collapsed;
    this.toggleSideNav.emit({ collapsed: this.collapsed, screenWidth: this.screenWidth });
  }
  closeSidenav() {
    this.collapsed = false;
    this.toggleSideNav.emit({ collapsed: this.collapsed, screenWidth: this.screenWidth });
  }
  handleClick(item: INavbarData) {
    if (!this.multiple) {
      for (const modelItem of this.navData) {
        if (item !== modelItem && modelItem.expanded) {
          modelItem.expanded = false;
        }
      }
    }
    item.expanded = !item.expanded;
  }
}
