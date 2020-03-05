import { Component, OnInit } from '@angular/core';
import { FacturaService } from './services/factura.service';
import { Factura } from './models/factura';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-detalle-factura',
  templateUrl: './detalle-factura.component.html'
})
export class DetalleFacturaComponent implements OnInit {

  public factura: Factura;
  public title: string = 'Factura';
  constructor(private _facturaService: FacturaService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap.subscribe(
      params => {
        let id = +params.get('id');
        this._facturaService.getFactura(id).subscribe( factura => this.factura = factura);
      }
    );
  }

}
