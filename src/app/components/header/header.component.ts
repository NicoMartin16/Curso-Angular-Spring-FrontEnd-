import { Component, OnInit } from '@angular/core';
import { AuthService } from '../usuarios/auth.service';
import swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  title: string = 'App Angular';

  constructor(public _authService: AuthService, private router: Router) { }

  ngOnInit() {
  }

  logout(){
    swal.fire(
      'Logout',
      `Hola ${this._authService.usuario.username} has cerrado sesión con exito`,
      'success'
      );
    this._authService.logout();
    this.router.navigate(['/login']);
  }

}
