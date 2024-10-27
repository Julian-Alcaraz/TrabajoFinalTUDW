import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormChicosComponent } from '../components/form-chicos/form-chicos.component';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-editar-chico',
  standalone: true,
  imports: [FormChicosComponent, RouterModule, CommonModule],
  templateUrl: './editar-chico.component.html',
  styleUrl: './editar-chico.component.css',
})
export class EditarChicoComponent implements OnDestroy, OnInit {
  public id_chico!: number;
  private routeSub: Subscription;

  constructor(private route: ActivatedRoute) {
    this.routeSub = this.route.paramMap.subscribe((params) => {
      this.id_chico = parseInt(params.get('id') || '');
    });
  }

  ngOnInit() {
    console.log('');
  }

  ngOnDestroy() {
    // Limpiamos la suscripción cuando el componente se destruye para evitar pérdidas de memoria
    this.routeSub.unsubscribe();
  }
}
