import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tabs.component.html',
})
export class TabsComponent implements OnInit, OnDestroy {
  @Input() tabs: any[] = [];
  @Output() positionEmitter: EventEmitter<any> = new EventEmitter<any>();
  routeSub: any;
  currentParam: any;

  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.routeSub = this._route.queryParams.subscribe((params) => {
      this.currentParam = +params['i'];
      this.positionEmitter.emit(this.currentParam);
    });
  }

  ngOnDestroy() {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }

  cambiarParam(value: number) {
    this._router.navigate([], { relativeTo: this._route, queryParams: { i: value } }); // mantiene otros parámetros de la URL intactos
    this.positionEmitter.emit(value);
  }
}
