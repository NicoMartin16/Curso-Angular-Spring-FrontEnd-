import { Component, OnInit } from '@angular/core';
import { Usuario } from './usuario';
import swal from 'sweetalert2';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {

  titulo: string = 'Por favor iniciar sesión';
  usuario: Usuario;
  constructor(private _authService: AuthService, private router: Router) {
    this.usuario = new Usuario();
  }

  ngOnInit() {
    if (this._authService.isAuthenticated()) {
      swal.fire('Login', `Login ${this._authService.usuario.username} ya estas autenticado`, `info`);
      this.router.navigate(['/clientes']);
    }
  }

  login(): void{
    console.log(this.usuario);
    if(this.usuario.username == null || this.usuario.password == null){
      swal.fire(
        'Error login',
        'Username o password vacios!',
        'error'
      );
      return;
    }
    this._authService.login(this.usuario).subscribe(
      res => {
        console.log(res);
        this._authService.guardarUsuario(res.access_token);
        this._authService.guardarToken(res.access_token);
        let usuario = this._authService.usuario;
        this.router.navigate(['/clientes']);
        swal.fire(
          `Login`,
          `Hola ${usuario.username} has iniciado sesión con exito`,
          'success'
        );
      },
      err => {
        if(err.status == 400){
          swal.fire(
            'Error login',
            'Usuario o contraseña incorrecta!',
            'error'
          );
        }
      }
    );
  }

}
