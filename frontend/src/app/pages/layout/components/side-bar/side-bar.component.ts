import { Component, EventEmitter, HostListener, OnInit, Output } from '@angular/core';
import { navbarData } from './nav-data';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { animate, keyframes, style, transition, trigger } from '@angular/animations';
import { fadeInOut } from './helper';
import { SublevelMenuComponent } from './sublevel-menu.component';
import { Menu } from '../../../../models/menu.model';
import { SessionService } from '../../../../services/session.service';
import Swal from 'sweetalert2';
import { MenuService } from '../../../../services/menu.service';
import { Usuario } from '../../../../models/usuario.model';
interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}
@Component({
  selector: 'app-side-bar',
  standalone: true,
  imports: [CommonModule, RouterModule, SublevelMenuComponent],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.css',
  animations: [fadeInOut, trigger('rotate', [transition(':enter', [animate('1000ms', keyframes([style({ transform: 'rotate(0deg)', offset: '0' }), style({ transform: 'rotate(2turn)', offset: '1' })]))])])],
})
export class NavBarComponent implements OnInit {
  @Output() toggleSideNav: EventEmitter<SideNavToggle> = new EventEmitter<SideNavToggle>();
  identidad: Usuario | null = null;
  collapsed = false;
  navData = navbarData;
  screenWidth = 0;
  multiple = false;
  @HostListener('window:resize', ['$event'])
  onResize() {
    if (typeof window !== 'undefined') {
      // El código que depende de window
      this.screenWidth = window.innerWidth;
    }
    if (this.screenWidth <= 768) {
      this.collapsed = false;
      this.toggleSideNav.emit({ collapsed: this.collapsed, screenWidth: this.screenWidth });
    }
  }
  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    private _sessionService: SessionService,
    private _menuService: MenuService,
  ) {}
  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      // El código que depende de window
      this.screenWidth = window.innerWidth;
    }
    this.identidad = this._sessionService.getIdentidad();
    if (this.identidad != null) {

      this._menuService.traerUsuarioMenu(this.identidad.id).subscribe({
        next: (response: any) => {
          this._route.queryParams.subscribe(params => {
            if (params['from'] === 'login') {
              console.log('Vengo desde login');
              // Lógica para manejar si viene desde login
              this.navData = response.data;
              let ruta = '/' + response.data[0].url;
              if (response.data[0].sub_menus.length != 0) {
                ruta = '/' + response.data[0].sub_menus[0].url;
              }
              this._router.navigate(['layout' + ruta]);
            }
          });
          this.navData = response.data;
        },
        error: (err) => {
          console.log('ERROR', err);
        },
      });
    } else {
      // this._sessionService.cerrarSesion(); // esto esta de onda
    }
  }
  toggleCollapsed() {
    this.collapsed = !this.collapsed;
    this.toggleSideNav.emit({ collapsed: this.collapsed, screenWidth: this.screenWidth });
  }
  closeSidenav() {
    this.collapsed = false;
    this.toggleSideNav.emit({ collapsed: this.collapsed, screenWidth: this.screenWidth });
  }
  handleClick(item: Menu) {
    if (!this.multiple) {
      for (const modelItem of this.navData) {
        if (item !== modelItem && modelItem.expanded) {
          modelItem.expanded = false;
        }
      }
    }
    if (!this.collapsed) {
      this.toggleCollapsed();
    }
    item.expanded = !item.expanded;
  }
  getActiveClass(data: Menu): string {
    return this._router.url.includes(data.url) ? 'active' : '';
  }
  logout() {
    Swal.fire({
      title: '¿Cerrar sesión?',
      showDenyButton: true,
      confirmButtonColor: '#3f77b4',
      confirmButtonText: 'Salir',
      denyButtonText: `Cancelar`,
    }).then((result) => {
      if (result.isConfirmed) {
        this._sessionService.cerrarSesion();
      }
    });
  }
}
