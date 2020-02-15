import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-directiva',
  templateUrl: './directiva.component.html'
})
export class DirectivaComponent implements OnInit {

  ListaCurso: string[] = ['TypeScript', 'JavaScript', 'Java SE', 'c#', 'PHP'];

  habilitar: boolean = true;

  constructor() { }

  ngOnInit() {
  }

  setHabilitar() {
    this.habilitar = (this.habilitar === true) ? false : true;
  }

}
