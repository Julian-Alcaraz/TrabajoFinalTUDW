import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Paginated {
  previousPageIndex?: number | undefined;
  pageIndex: number;
  pageSize: number;
  length: number;
}
export interface TableData {
  array: [];
  total: number;
}

@Injectable({
  providedIn: 'root',
})
export class PaginatedTableService {
  data: BehaviorSubject<TableData> = new BehaviorSubject<TableData>({ array: [], total: 0 });
  paginated: BehaviorSubject<Paginated> = new BehaviorSubject<Paginated>({
    previousPageIndex: 0,
    pageIndex: 0,
    pageSize: 10,
    length: 0,
  });

  busco: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  listeSearch(): Observable<boolean> {
    return this.busco.asObservable();
  }

  resetService() {
    this.data.next({ array: [], total: 0 });
    this.paginated.next({
      previousPageIndex: 0,
      pageIndex: 0,
      pageSize: 10,
      length: 0,
    });
    this.busco.next(false);
  }

  updatePaginated(pagined: Paginated) {
    this.paginated.next(pagined);
  }

  listenPaginated(): Observable<Paginated> {
    return this.paginated!.asObservable();
  }

  updateData(data: TableData) {
    if (this.busco.value == false) this.busco.next(true);
    this.data.next(data);
    this.busco.next(true);
  }

  listenData(): Observable<TableData> {
    return this.data!.asObservable();
  }
}
