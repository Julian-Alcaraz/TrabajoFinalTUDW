import { Component, HostListener, OnInit } from '@angular/core';
import { FormularioComponent } from './components/formulario/formulario.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormularioComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  // public imageWidth= 0 ;
  // public imageHeight= 0 ;
  public windowWidth = 0;
  public windowHeight = 0;
  ngOnInit(): void {
    this.getWindowSize();
  }
  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.getWindowSize();
  }
  getWindowSize(): void {
    // console.log( window.innerWidth)
    // if(window.innerWidth>1350){
    //   this.windowWidth = 900;
    // }else{
    //   if(window.innerWidth>900){
    //   this.windowWidth = window.innerWidth-500;
    //   }else{
    //     this.windowWidth = window.innerWidth-100;
    //   }
    // }
    // this.windowHeight = window.innerHeight;
    // this.imageWidth = window.innerWidth;
    // this.imageHeight = window.innerHeight;
    // console.log("asdasd",this.imageHeight,this.imageWidth)
  }
}
