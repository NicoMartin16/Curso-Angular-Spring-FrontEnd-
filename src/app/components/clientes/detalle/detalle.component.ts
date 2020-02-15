import { Component, OnInit, Input } from "@angular/core";
import { Cliente } from "../cliente";
import { ClienteService } from "../cliente.service";
import { ModalService } from './modal.service';
import swal from 'sweetalert2';
import { HttpEventType } from '@angular/common/http';
import { AuthService } from '../../usuarios/auth.service';

@Component({
  selector: "detalle-cliente",
  templateUrl: "./detalle.component.html",
  styleUrls: ["./detalle.component.css"]
})
export class DetalleComponent implements OnInit {
  @Input() cliente: Cliente;
  titulo: string = "Detalle del cliente";
  fotoSeleccionada: File;
  progress: number;

  constructor(
    private _clienteService: ClienteService,
    private _modalService: ModalService,
    private _authService: AuthService
  ) {}

  ngOnInit() {}

  seleccionarFoto(event){
    this.fotoSeleccionada = event.target.files[0];
    this.progress = 0;
    if(this.fotoSeleccionada.type.indexOf('image') < 0){
      swal.fire('Error seleccionar imagen:', 'El archivo debe ser de tipo imagen', 'error');
      this.fotoSeleccionada = null;
    }
  }

  subirFoto(){

    if(!this.fotoSeleccionada){
      swal.fire('Error en la carga:', 'Debe seleccionar una foto', 'error');

    } else {
      this._clienteService.subirFoto(this.fotoSeleccionada, this.cliente.id).subscribe(
        event => {

          if(event.type === HttpEventType.UploadProgress){
            this.progress = Math.round((event.loaded/event.total)*100);
          } else if (event.type === HttpEventType.Response){
            let response: any = event.body;
            this.cliente = response.cliente as Cliente;
            this._modalService.notificarUpload.emit(this.cliente);
            swal.fire(
              'La foto se ha subido correctamente',
              `La foto se ha subido con éxito: ${response.mensaje}`,
              'success'
            );
          }
        });
    }
  }

  cerrarModal(){
    this.fotoSeleccionada = null;
    this._modalService.cerrarModal();
    this.progress = 0;
  }
}
