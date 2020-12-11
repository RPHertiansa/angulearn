import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs'
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators'

import { Hero } from '../hero'
import { HeroService } from '../hero.service'

@Component({
  selector: 'app-hero-search',
  templateUrl: './hero-search.component.html',
  styleUrls: ['./hero-search.component.scss']
})
export class HeroSearchComponent implements OnInit {
  heroes$: Observable<Hero[]>
  private searchName = new Subject<string>() //Subjet is both source of observable values and an Observable itself, can be subscribed

  constructor(private heroService: HeroService) { }

  search(name: string): void{
    this.searchName.next(name)
  }
  ngOnInit(): void {
    this.heroes$ = this.searchName.pipe(
      debounceTime(300), //300mx delay after each keystroke

      distinctUntilChanged(), // ignore same name input

      //switch to new search observable each time name changes
      switchMap((name: string) => this.heroService.searchHeroes(name))
    )
  }

}
