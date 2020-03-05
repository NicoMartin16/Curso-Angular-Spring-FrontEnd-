import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { observable, Observable } from 'rxjs';
import { Factura } from '../models/factura';
import { Producto } from '../models/producto';

@Injectable({
  providedIn: 'root'
})
export class FacturaService {

  private urlEndPoint: string = 'http://localhost:8080/api/facturas';

  constructor(private _http: HttpClient) { }

  getFactura(id: number): Observable<Factura> {
    return this._http.get<Factura>(`${this.urlEndPoint}/${id}`);
  }

  delete(id: number): Observable<void> {
    return this._http.delete<void>(`${this.urlEndPoint}/${id}`);
  }

  filtrarProductos(termino: string): Observable<Producto[]>{
    return this._http.get<Producto[]>(`${this.urlEndPoint}/filtrar-productos/${termino}`);
  }

  create(factura: Factura): Observable<Factura>{
    return this._http.post<Factura>(this.urlEndPoint, factura);
  }
}
