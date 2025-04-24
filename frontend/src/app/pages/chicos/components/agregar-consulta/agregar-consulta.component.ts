import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-agregar-consulta',
  standalone: true,
  imports: [],
  templateUrl: './agregar-consulta.component.html',
})
export class AgregarConsultaComponent {
  @Input() dni: number | undefined | null = null;

  consultasTipos = ['clinica', 'odontologia', 'fonoaudiologia', 'oftalmologia', 'prevencion', 'social'];

  constructor(private _router: Router) {}

  abrirModal() {
    const buttonsHtml = this.consultasTipos.map((consulta) => this.buttonHtml(consulta)).join(''); // Combine all the button HTML

    Swal.fire({
      title: 'Agregar una consulta al chico',
      text: 'Seleccione un tipo',
      showCloseButton: true,
      showConfirmButton: false,
      closeButtonAriaLabel: 'cerrar',
      html: `
        <div class="">
       ${buttonsHtml}
        </div>

      `,
      didOpen: () => {
        this.consultasTipos.forEach((consulta) => {
          const button = document.getElementById(`btn-${consulta}`);
          if (button) {
            button.addEventListener('click', () => {
              this.redirigir(consulta);
              Swal.close();
            });
          }
        });
      },
    });
  }
  buttonHtml(consulta: string) {
    const capitalizedConsulta = consulta.charAt(0).toUpperCase() + consulta.slice(1);
    return `
      <button class=" my-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-3 py-2 text-center -700 -800 disabled:bg-gray-400" id="btn-${consulta}">${capitalizedConsulta}</button>
    `;
  }
  redirigir(consulta: string) {
    this._router.navigate(['layout/consultas/' + consulta + '/nueva/'], { state: { dni: this.dni } });
  }
}
