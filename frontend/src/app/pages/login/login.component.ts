import { Component, HostListener, OnInit } from '@angular/core';
import { FormularioComponent } from './components/formulario/formulario.component';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { LoadingService } from '../../services/loading.service';
import { SessionService } from '../../services/session.service';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormularioComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  public width = 0;
  public isLoading = true;
  public identidad: any = false;

  public windowWidth = 0;
  public windowHeight = 0;
  constructor(
    private _cookieService: CookieService,
    private _router: Router,
    public _loadingService: LoadingService,
    public _sessionService: SessionService,
  ) {}
  ngOnInit(): void {
    console.log("OnInnit login")
    // const token = this._cookieService.get('Authorization');
    // const token = this.getCookie('Authorization');
    // if (token) {
    //   // Redirigir al layout si ya tiene un token
    //   this._router.navigate(['/layout']);
    // }
    this.getWindowSize();
    this.isLoading = this._loadingService.obtenerValor();
  }

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.getWindowSize();
  }
  getWindowSize(): void {
    if (typeof window !== 'undefined') {
      this.width = window.innerWidth / 2 - 100;
    }
  }
}
