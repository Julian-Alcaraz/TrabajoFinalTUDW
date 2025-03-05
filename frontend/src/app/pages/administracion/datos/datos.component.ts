import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputFileComponent } from '@components/inputs/input-file.component';

@Component({
  selector: 'app-datos',
  standalone: true,
  imports: [InputFileComponent, FormsModule, ReactiveFormsModule],
  templateUrl: './datos.component.html',
  styleUrl: './datos.component.css'
})
export class DatosComponent {
  clinicaFileControl: FormControl = new FormControl('',[Validators.required])
  fonoaudiologiaFileControl: FormControl = new FormControl('',[Validators.required])
  odontologiaFileControl: FormControl = new FormControl('',[Validators.required])
  oftalmologiaFileControl: FormControl = new FormControl('',[Validators.required])
  // adiccionFileControl: FormControl = new FormControl('',[Validators.required])
}
