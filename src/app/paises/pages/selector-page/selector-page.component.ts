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
  // fronteras: string[] = [];
  fronteras: PaisSmall[] = [];

  //UI
  cargando: boolean = false;

  constructor(private fb: FormBuilder,
              private paisesServices: PaisesServices) { }

  ngOnInit(): void {

    this.regiones = this.paisesServices.regiones;

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
        this.cargando = true;
        // this.miFormulario.get('frontera')?.disable();
      }),
      switchMap( region => this.paisesServices.getPaisesPorRegion( region ) )
    )
    .subscribe( paises => {
        // console.log(paises);
        this.paises = paises;
        this.cargando = false;
      });

    // Cuando cambia el pais

    this.miFormulario.get('pais')?.valueChanges
    .pipe(
      tap( ( _ ) =>{
        // this.fronteras = [];
        this.miFormulario.get('frontera')?.reset('');
        this.cargando = true;
        // this.miFormulario.get('frontera')?.enable();
      } ),
      switchMap( codigo => this.paisesServices.getPaisPorCodigo( codigo ) ),
      switchMap( pais => this.paisesServices.getPaisesPorCodigos( pais?.borders! ) )
    )
    .subscribe( paises => {
      // console.log(pais?.borders);
      console.log(paises);

      // this.fronteras = pais?.borders || [];
      this.fronteras = paises;
      this.cargando = false;

    } )

  }



  guardar() {
    console.log(this.miFormulario.value);

  }

}
