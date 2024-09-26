import { Component, HostListener, OnInit } from '@angular/core';
import { FormularioComponent } from './components/formulario/formulario.component';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormularioComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  public width= 0 ;
  // public imageHeight= 0 ;
  public windowWidth = 0;
  public windowHeight = 0;
  constructor(
    private _cookieService: CookieService,
    private _router: Router,
  ) {}
  ngOnInit(): void {
    const token = this._cookieService.get('Authorization');
    if (token) {
      // Redirigir al layout si ya tiene un token
      this._router.navigate(['/layout']);
    }
    this.getWindowSize();
  }
  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.getWindowSize();
  }
  getWindowSize(): void {
    console.log( window.innerWidth)
    this.width = (window.innerWidth/2)-100

  }
}
