import { Component } from '@angular/core';
import { FormTallerComponent } from "../components/form-taller/form-taller.component";

@Component({
  selector: 'app-nuevo-taller',
  standalone: true,
  imports: [FormTallerComponent],
  templateUrl: './nuevo-taller.component.html',
  styleUrl: './nuevo-taller.component.css'
})
export class NuevoTallerComponent {

}
