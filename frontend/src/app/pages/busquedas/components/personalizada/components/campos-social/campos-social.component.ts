import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { IftaLabelModule } from 'primeng/iftalabel';
import { SelectModule } from 'primeng/select';

@Component({
  selector: 'app-campos-social',
  standalone: true,
  imports: [IftaLabelModule, ReactiveFormsModule, SelectModule],

  templateUrl: './campos-social.component.html',
})
export class CamposSocialComponent implements OnInit {
  @Input() form!: FormGroup;

  public especificas!: FormGroup;

  public derivacionesOptions: any[] = [
    { nombre: 'Si', valor: { externa: true } },
    { nombre: 'No', valor: { externa: false } },
  ];

  ngOnInit(): void {
    this.especificas = new FormGroup({
      // Oftalmologia
      derivaciones: new FormControl(),
    });
    this.form.addControl('especificas', this.especificas);
  }

  get controlDeInput(): (input: string) => FormControl {
    return (input: string) => this.form.get(input) as FormControl;
  }
}
