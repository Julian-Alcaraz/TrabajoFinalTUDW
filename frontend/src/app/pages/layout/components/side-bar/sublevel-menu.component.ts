import { Component, Input } from '@angular/core';
import { fadeInOut } from './helper';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Menu } from '../../../../models/menu.model';

@Component({
  selector: 'app-sublevel-menu',
  standalone: true,
  imports: [RouterModule, CommonModule],
  template: `
    <ul *ngIf="collapsed && data.sub_menu && data.sub_menu.length > 0" class="sublevel-nav" [@submenu]="expanded ? { value: 'visible', params: { transitionParams: '400ms cubic-bezier(0.86,0, 0.07,1)', height: '*' } } : { value: 'hidden', params: { transitionParams: '400ms cubic-bezier(0.86,0,0.07,1)', height: '0' } }">
      <li *ngFor="let item of data.sub_menu" class="sublevel-nav-item">
        <a class="sublevel-nav-link" *ngIf="item.sub_menu && item.sub_menu.length > 0" (click)="handleClick(item)" tabindex (keydown.enter)="handleClick(item)" [ngClass]="getActiveClass(item)">
          <i class="sublevel-link-icon " [ngClass]="item.icon ? item.icon : 'fa fa-circle'"></i>
          <span class="sublevel-link-text" @fadeinOut *ngIf="collapsed">{{ item.label }}</span>
          <i class="menu-collapse-icon" *ngIf="item.sub_menu && collapsed" [ngClass]="!item.expanded ? 'fa-solid fa-angle-right' : 'fa-solid fa-angle-down'"></i>
        </a>
        <a class="sublevel-nav-link" *ngIf="!item.sub_menu || (item.sub_menu && item.sub_menu.length === 0)" [routerLink]="[item.url]" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">
          <i class="sublevel-link-icon " [ngClass]="item.icon ? item.icon : 'fa fa-circle'"></i>
          <span class="sublevel-link-text" @fadeinOut *ngIf="collapsed">{{ item.label }}</span>
        </a>
        <div *ngIf="item.sub_menu && item.sub_menu.length > 0">
          <app-sublevel-menu [data]="item" [collapsed]="collapsed" [multiple]="multiple" [expanded]="item.expanded" />
        </div>
      </li>
    </ul>
  `,
  styleUrls: ['./side-bar.component.css'],
  animations: [
    fadeInOut,
    trigger('submenu', [
      state(
        'hidden',
        style({
          height: '0',
          overflow: 'hidden',
        }),
      ),
      state(
        'visible',
        style({
          height: '*',
        }),
      ),
      transition('visible <=> hidden', [style({ overflow: 'hidden' }), animate('{{transitionParams}}')]),
      transition('void => *', animate(0)),
    ]),
  ],
})
export class SublevelMenuComponent {
  @Input() data: Menu = {
    id: 0,
    url: '',
    icon: '',
    label: '',
    deshabilitado: false,
    sub_menu: [],
  };
  @Input() collapsed = false;
  @Input() animating: boolean | undefined;
  @Input() expanded: boolean | undefined;
  @Input() multiple = false;
  constructor(private _router: Router) {}

  handleClick(item: any): void {
    if (!this.multiple) {
      if (this.data.sub_menu && this.data.sub_menu.length > 0) {
        for (const modelItem of this.data.sub_menu) {
          if (item !== modelItem && modelItem.expanded) {
            modelItem.expanded = false;
          }
        }
      }
    }
    item.expanded = !item.expanded;
  }
  getActiveClass(item: Menu): string {
    return item.expanded && this._router.url.includes(item.url) ? 'active-sublevel' : '';
  }
}
