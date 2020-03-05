import { Component, OnInit } from '@angular/core';
import { Factura } from './models/factura';
import { ClienteService } from '../clientes/cliente.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, flatMap } from 'rxjs/operators';
import { FacturaService } from './services/factura.service';
import { Producto } from './models/producto';
import { MatAutocompleteSelectedEvent } from '@angular/material';
import { ItemFactura } from './models/item-factura';
import swal from 'sweetalert2';


@Component({
  selector: 'app-facturas',
  templateUrl: './facturas.component.html',
  styleUrls: ['./facturas.component.css']
})
export class FacturasComponent implements OnInit {

  titulo: string;
  factura: Factura;
  autocompleteControl = new FormControl();
  productos: string[] = ['Mesa', 'Tablet', 'Sony', 'Samsung', 'Tv LG', 'Bicicleta'];
  productoFiltrados: Observable<Producto[]>;

  constructor(private _clienteService: ClienteService, 
              private route: ActivatedRoute, 
              private _facturaService: FacturaService,
              private router: Router) {
    this.titulo = 'Nueva Factura';
    this.factura = new Factura();
   }

  ngOnInit() {
    this.route.paramMap.subscribe(params=>{
      let clienteId = +params.get('clienteId');
      this._clienteService.getCliente(clienteId).subscribe(
        cliente => {
          this.factura.cliente = cliente;
        }
      );
    });
    this.productoFiltrados = this.autocompleteControl.valueChanges
      .pipe(
        map(value => typeof value === 'string' ? value : value.nombre),
        flatMap(value => value ? this._filter(value) : [])
      );
  }

  private _filter(value: string): Observable<Producto[]> {
    const filterValue = value.toLowerCase();

    return this._facturaService.filtrarProductos(value);
  }

  mostrarNombre(producto?: Producto): string | undefined{
    return producto ? producto.nombre : undefined;
  }

  seleccionarProducto(event: MatAutocompleteSelectedEvent): void {
    let producto = event.option.value as Producto;
    console.log(producto);
    if(this.existeItem(producto.id)){
      this.incrementaCantidad(producto.id);
    } else {
      let nuevoItem = new ItemFactura();
      nuevoItem.producto = producto;
      this.factura.items.push(nuevoItem);
    }

    this.autocompleteControl.setValue('');
    event.option.focus();
    event.option.deselect();
  }

  actualizarCantidad(id: number, event: any): void{
    let cantidad: number = event.target.value as number;
    if (cantidad == 0 ) {
      return this.eliminarItemFactura(id);
    }
    this.factura.items = this.factura.items.map((item: ItemFactura) => {
      if(id === item.producto.id) {
        item.cantidad = cantidad;
      }
      return item;
    });
  }

  existeItem(id: number): boolean{
    let exists = false;
    this.factura.items.forEach((item: ItemFactura) => {
      if (id === item.producto.id) {
        exists = true;
      }
    });
    return exists;
  }

  incrementaCantidad(id: number): void{
    this.factura.items = this.factura.items.map((item: ItemFactura) => {
      if (id === item.producto.id) {
        ++item.cantidad;
      }
      return item;
    });
  }

  eliminarItemFactura(id: number): void {
    this.factura.items = this.factura.items.filter((item: ItemFactura) => id !== item.producto.id);
  }

  create(form): void {

    if(this.factura.items.length == 0){
      this.autocompleteControl.setErrors({'invalid': true});
    }
    if(form.form.valid && this.factura.items.length > 0){
      this._facturaService.create(this.factura).subscribe(
        res => {
          swal.fire(
            this.titulo,
            `Factura ${this.factura.descripcion} creada con exito!`,
            'success'
          );
          this.router.navigate(['/facturas', this.factura.id]);
        }
      );
    }
  }

}
