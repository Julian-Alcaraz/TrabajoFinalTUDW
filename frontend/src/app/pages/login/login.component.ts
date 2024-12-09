import { Component, HostListener, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { FormularioComponent } from './components/formulario/formulario.component';
import { LoadingService } from '@services/loading.service';
import { SessionService } from '@services/session.service';
import { isPlatformBrowser } from '@angular/common';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormularioComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit, OnDestroy {
  public width = 0;
  public isLoading = true;
  public identidad: any = false;

  public windowWidth = 0;
  public windowHeight = 0;
  constructor(
    public _loadingService: LoadingService,
    public _sessionService: SessionService,
    @Inject(PLATFORM_ID) private platformId: any,
  ) {}
  ngOnInit(): void {
    this.getWindowSize();
    this.isLoading = this._loadingService.obtenerValor();
    if (isPlatformBrowser(this.platformId)) {
      this.startTimer();
    }
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
  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.clearTimer();
    }
  }

  // mostrar login unauthotized
  private timer: any;
  startTimer() {
    this.timer = setTimeout(() => {
      this.executeAction();
    }, 2000);
  }
  clearTimer() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }

  executeAction() {
    this.isLoading = true;
  }
}
