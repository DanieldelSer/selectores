import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaisesServices } from '../../services/paises.service';
import { Pais, PaisSmall } from '../../interfaces/paises.interfaces';

import { switchMap, tap } from 'rxjs/operators'

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styles: [
  ]
})
export class SelectorPageComponent implements OnInit {

  miFormulario: FormGroup = this.fb.group({
    region: ['', Validators.required],
    pais: ['', Validators.required],
    frontera: ['', Validators.required]
  })

  // llenar selectores
  regiones: string[] = [];
  paises: PaisSmall[] = [];
  fronteras: Pais[] = [];

  constructor(private fb: FormBuilder,
              private paisesService: PaisesServices) { }

  ngOnInit(): void {

    this.regiones = this.paisesService.regiones;

    //Cuando cambie el selector
    // this.miFormulario.get('region')?.valueChanges.subscribe(
    //   region => {
    //     //console.log(region);

    //     this.paisesService.getPaisesPorRegion( region ).subscribe(
    //       paises => {
    //         //console.log(paises);

    //         this.paises = paises;

    //       }
    //     )

    //   }
    // )

    this.miFormulario.get('region')?.valueChanges
    .pipe(
      tap( ( _ ) => {
        this.miFormulario.get('pais')?.reset('');
      }),
      switchMap( region => this.paisesService.getPaisesPorRegion( region ) )
    )
    .subscribe( paises => {
        // console.log(paises);
        this.paises = paises;
      });

    // Cuando cambia el pais

    this.miFormulario.get('pais')?.valueChanges
    .subscribe( codigo => {
      //console.log(codigo);

    } )

  }



  guardar() {
    console.log(this.miFormulario.value);

  }

}
