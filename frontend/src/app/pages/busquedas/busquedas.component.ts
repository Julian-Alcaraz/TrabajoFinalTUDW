import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ConsultasTableComponent } from './components/consultas-table/consultas-table.component';
import { ConsultasxanioComponent } from './components/consultasxanio/consultasxanio.component';
import { PersonalizadaComponent } from './components/personalizada/personalizada.component';
import { TabsComponent } from '@components/tabs/tabs.component';
import { PaginatedTableService } from '@app/services/paginated-table.service';
@Component({
  selector: 'app-busquedas',
  standalone: true,
  imports: [CommonModule, ConsultasTableComponent, ConsultasxanioComponent, PersonalizadaComponent, TabsComponent],
  templateUrl: './busquedas.component.html',
})
export class BusquedasComponent implements OnInit {
  routeSub: any;
  currentParam: number | null = null;
  total = 0;
  busco: boolean;
  constructor(private _tableService: PaginatedTableService) {
    this.busco = this._tableService.busco.getValue();
  }
  ngOnInit() {
    this._tableService.listeSearch().subscribe((value) => {
      this.busco = value;
    });
  }
  escucharParam(value: number) {
    if (value !== this.currentParam) {
      this.currentParam = value;
      this._tableService.resetService();
    }
  }
}
