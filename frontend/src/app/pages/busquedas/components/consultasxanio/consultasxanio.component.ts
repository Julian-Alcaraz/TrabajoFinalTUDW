import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { ConsultaService } from '@services/consulta.service';
import { CommonModule } from '@angular/common';
import { IftaLabelModule } from 'primeng/iftalabel';
import { LoadingComponent } from '@components/loading/loading.component';
import { ButtonModule } from 'primeng/button';
import { forkJoin, Subscription } from 'rxjs';
import { Paginated, PaginatedTableService } from '@app/services/paginated-table.service';
import * as MostrarNotificacion from '@utils/notificaciones/mostrar-notificacion';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-consultasxanio',
  standalone: true,
  imports: [CommonModule, ButtonModule, DatePickerModule, FormsModule, ReactiveFormsModule, IftaLabelModule, LoadingComponent],
  templateUrl: './consultasxanio.component.html',
})
export class ConsultasxanioComponent implements OnInit, OnDestroy {
  date: Date | undefined;
  maxDate: Date;
  buscarForm: FormGroup;
  searching = false;
  listenerPaginator: Subscription = new Subscription();
  page = 0;
  size = 10;
  constructor(
    private _consultasService: ConsultaService,
    private fb: FormBuilder,
    private _tableService: PaginatedTableService,
    private snackBar: MatSnackBar,
  ) {
    const currentYear = new Date().getFullYear();
    this.maxDate = new Date(currentYear, 11, 31); // 11 es diciembre (meses son 0 indexados)
    this.buscarForm = this.fb.group({ year: [null, Validators.required] });

    // comentar esto para que no busque automaticamente
    this.date = new Date();
  }

  ngOnInit() {
    this.listenPager();
  }

  ngOnDestroy() {
    this.listenerPaginator.unsubscribe();
  }

  listenPager() {
    this.listenerPaginator = this._tableService.listenPaginated().subscribe((paginated: Paginated) => {
      // si hay cambios los busca
      if (this.page !== paginated.pageIndex || this.size !== paginated.pageSize) {
        this.page = paginated.pageIndex;
        this.size = paginated.pageSize;
        this.buscar();
      }
    });
  }
  submit() {
    this._tableService.resetService();
    this.buscar();
  }
  buscar() {
    this.searching = true;
    if (this.date) {
      const anio = this.date.getFullYear();
      if (anio) {
        forkJoin({
          total: this._consultasService.obtenerTotalxAnio(anio),
          limitedData: this._consultasService.obtenerConsultasxAnioLimited(anio, this.page, this.size),
        }).subscribe({
          next: (responses: { total: any; limitedData: any }) => {
            this._tableService.updateData({ array: responses.limitedData.data, total: responses.total.data });
            this.searching = false; // End loading state
          },
          error: (err) => {
            MostrarNotificacion.mensajeErrorServicio(this.snackBar, err);
            this.searching = false; // End loading state in case of error
          },
        });
      }
    }
  }
}
