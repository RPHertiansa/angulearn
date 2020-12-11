import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs'
import { catchError, map, tap } from 'rxjs/operators'
import { HttpClient, HttpHeaders } from '@angular/common/http'

import { Hero } from './hero'
import { HEROES } from './mock-heroes'
import { MessageService } from './message.service'

@Injectable({
  providedIn: 'root'
})

export class HeroService {

  constructor(
    private messageService: MessageService,
    private http: HttpClient,
  ) { }

  private log(message: string) {
    this.messageService.add(`HeroService ${message}`)    
  }
  private heroesUrl = 'api/heroes' //url to web api

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  /**
 * Handle Http operation that failed.
 * Let the app continue.
 * @param operation - name of the operation that failed
 * @param result - optional value to return as the observable result
 */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
  
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead
  
      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);
  
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  //use rxjs to handle async
  // getHeroes(): Observable<Hero[]> {
  //   return of(HEROES)
  // }

  //convert method to use http client to get data using GET method
  getHeroes(): Observable<Hero[]> {
    return this.http.get<Hero[]>(this.heroesUrl)
    .pipe(
      tap (_ => this.log('fetched heroes')),
      catchError(this.handleError<Hero[]>('getHeroes', []))
    )
  }

  getHero(id: number): Observable<Hero> {
    const url =`${this.heroesUrl}/${id}`
    this.messageService.add(`HeroService: fetched hero id=${id}`)
    return of(HEROES.find(hero => hero.id === id))
    .pipe(
      tap(_ => this.log('hero')),
      catchError(this.handleError<Hero>(`getHero ${id}`  ))
    )
  }
  
  //update hero data in the server using PUT method
  updateHero(hero:Hero): Observable<any> {
    return this.http.put(this.heroesUrl, hero, this.httpOptions) //http.put(url, payload, option)
  }

  //addHero to server using POST method
  addHero(hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(this.heroesUrl,  hero, this.httpOptions)
    .pipe(
      tap((newHero: Hero) => this.log('added hero to the list')),
      catchError(this.handleError<Hero>('addHero'))
    )
  }

  //delete hero data using DELETE method
  deleteHero(hero: Hero): Observable<Hero> {
    const id = typeof hero === 'number' ? hero : hero.id
    const url = `${this.heroesUrl}/${id}`
    return this.http.delete<Hero>(url, this.httpOptions)
    .pipe(
      tap(_ => this.log(`hero with id = ${id} is deleted`)),
      catchError(this.handleError<Hero>('deleteHero'))
    )
  }

  // search hero data by name
  searchHeroes(name: string): Observable<Hero[]> {
    if (!name.trim()){
      return of([]) //if nothing match, will return empty array
    }
    return this.http.get<Hero[]>(`${this.heroesUrl}/?name=${name}`)
    .pipe(
      tap(x => x.length ? this.log(`heroes with name = ${name}`) : this.log('not found')),
      catchError(this.handleError<Hero[]>('searchheroes', []))
    )
  }
}