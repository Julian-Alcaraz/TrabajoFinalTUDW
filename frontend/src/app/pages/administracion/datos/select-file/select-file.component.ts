import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { InputFileComponent } from '@app/components/inputs/input-file.component';
import { LoadingComponent } from '@app/components/loading/loading.component';

@Component({
  selector: 'app-select-file',
  standalone: true,
  imports: [InputFileComponent, LoadingComponent, CommonModule],
  templateUrl: './select-file.component.html',
})
export class SelectFileComponent implements OnChanges {
  @Input() loading = false;
  @Input() control!: FormControl;
  @Input() type!: string;
  @Output() cargarArchivo: EventEmitter<any> = new EventEmitter<any>();
  @Output() fileSelected: EventEmitter<any> = new EventEmitter<any>();

  cargar() {
    this.loading = true;
    if (!this.control.errors) {
      this.cargarArchivo.emit(this.type);
    }
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['loading'] && changes['loading'].previousValue !== changes['loading'].currentValue) {
      this.loading = !!changes['loading'].currentValue;
    }
  }
  onFileSelected(event: any) {
    this.fileSelected.emit(event);
  }
}
