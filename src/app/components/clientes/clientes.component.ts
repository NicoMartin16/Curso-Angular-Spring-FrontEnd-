import { Component, OnInit, Input } from "@angular/core";
import { Cliente } from "./cliente";
import { ClienteService } from "./cliente.service";
import { ModalService } from './detalle/modal.service';
import swal from "sweetalert2";
import { tap } from "rxjs/operators";
import { ActivatedRoute } from "@angular/router";
import { AuthService } from '../usuarios/auth.service';
import { URL_BACKEND } from '../../config/config';


@Component({
  selector: "app-clientes",
  templateUrl: "./clientes.component.html"
})
export class ClientesComponent implements OnInit {
  clientes: Cliente[];
  paginador: any;
  clienteSeleccionado: Cliente;
  urlBackend: string = URL_BACKEND;

  constructor(
    private _clienteService: ClienteService,
    private Route: ActivatedRoute,
    public _modalService: ModalService,
    public _authService: AuthService
  ) {}

  ngOnInit() {
    this.Route.paramMap.subscribe(params => {
      let page: number = +params.get("page");
      if (!page) {
        page = 0;
      }
      this._clienteService
        .getClientes(page)
        .pipe(
          tap(response => {
            console.log("ClientesComponent: tap 3");
            (response.content as Cliente[]).forEach(cliente => {
              console.log(cliente.nombre);
            });
          })
        )
        .subscribe(response => {
          this.clientes = response.content as Cliente[];
          this.paginador = response;
        });
    });

    this._modalService.notificarUpload.subscribe(
      cliente => {
        this.clientes = this.clientes.map( clienteOriginal => {
          if(cliente.id == clienteOriginal.id){
            clienteOriginal.foto = cliente.foto;
          }
          return clienteOriginal;
        });
      });
  }

  delete(cliente: Cliente): void {
    const swalWithBootstrapButtons = swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger mr-2"
      },
      buttonsStyling: false
    });

    swalWithBootstrapButtons
      .fire({
        title: "Estas seguro?",
        text: `¿Seguro que deseas eliminar el cliente ${cliente.nombre} ${cliente.apellido}?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Si, eliminar!",
        cancelButtonText: "No, cancelar!",
        reverseButtons: true
      })
      .then(result => {
        if (result.value) {
          this._clienteService.delete(cliente.id).subscribe(res => {
            this.clientes = this.clientes.filter(cli => cli !== cliente);
            swalWithBootstrapButtons.fire(
              "Cliente eliminado!",
              `El cliente ${cliente.nombre} ha sido eliminado`,
              "success"
            );
          });
        }
      });
  }

  abrirModal(cliente: Cliente) {
    this.clienteSeleccionado = cliente;
    this._modalService.abrirModal();
  }
}
