import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Pais, PaisSmall } from '../interfaces/paises.interfaces';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaisesServices {

  private baseUrl: string = 'https://restcountries.eu/rest/v2';
  private _regiones: string[] = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];

  public get regiones(): string[] {
    return [ ...this._regiones ];
  }
  public set regiones(value: string[]) {
    this._regiones = value;
  }


  constructor( private http: HttpClient ) { }

  getPaisesPorRegion( region: string ): Observable<PaisSmall[]> {

    const url:string = `${ this.baseUrl }/region/${ region }?fields=alpha3Code;name`

    return this.http.get<PaisSmall[]>( url );
  }

  getPaisPorCodigo( codigo: string ): Observable<Pais | null> {

    if ( !codigo ) {
      return of(null)
    }

    const url: string = `${ this.baseUrl }/alpha?codes=${ codigo }`

    return this.http.get<Pais>( url );
  }

}
