import { Component, OnInit } from "@angular/core";
import { Cliente } from "./cliente";
import { Region } from './region';
import { ClienteService } from "./cliente.service";
import { Router, ActivatedRoute, Params } from "@angular/router";
import swal from "sweetalert2";

@Component({
  selector: "app-from",
  templateUrl: "./from.component.html"
})
export class FromComponent implements OnInit {
  public cliente: Cliente = new Cliente();
  public regiones: Region[];
  public titulo: string = "Cliente";
  public errors: string[];

  constructor(
    private _clienteService: ClienteService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.cargarCliente();
    this._clienteService.getRegiones().subscribe(regiones => this.regiones = regiones)
  }

  cargarCliente(): void {
    this.route.params.subscribe(
      params => {
        let id = params.id;
        if(id) {
          this._clienteService.getCliente(id).subscribe(
            cliente => this.cliente = cliente
          );
        }
      }
    );
  }

  public create(): void {
    this._clienteService.create(this.cliente).subscribe(
      cliente => {
        swal.fire(
          "Nuevo cliente",
          `Cliente ${cliente.nombre} creado con exito!`,
          "success"
        );
        this.router.navigate(['/clientes']);
      },
      err => {
        this.errors = err.error.errors as string[];
        console.error('Codigo de error desde el backend: ' + err.status);
        console.error(err.error.errors);
      }
    );
  }

  update(): void {
    this._clienteService.update(this.cliente).subscribe(
      res => {
        this.router.navigate(['/clientes']);
        swal.fire(
          'Cliente actualizado',
          `Cliente ${res.cliente.nombre} actualizado con éxito`,
          'success'
        );
      },
      err => {
        this.errors = err.error.errors as string[];
        console.error('Codigo de error desde el backend: ' + err.status);
        console.error(err.error.errors);
      }
    );
  }

  compararRegion(obj1: Region, obj2: Region): boolean{
    if(obj1 === undefined && obj2 === undefined){
      return true;
    }
    return obj1 === null || obj2 === null || obj1 === undefined || obj2 === undefined  ? false : obj1.id === obj2.id;
  }
}
