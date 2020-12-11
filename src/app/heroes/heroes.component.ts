import { Component, OnInit } from '@angular/core';
import { Hero } from '../hero' //import interface of Hero
import { HEROES } from '../mock-heroes'
import { HeroService } from '../hero.service'
import { MessageService } from '../message.service';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.scss']
})

export class HeroesComponent implements OnInit {
  heroes: Hero[]

  constructor(private heroService: HeroService, private messageService: MessageService) { }

  //dont forget to subscribe in rxjs obsrvable
  getHeroes(): void {
    this.heroService.getHeroes()
    .subscribe(heroes => this.heroes = heroes)
  }

  // add hero data to the server, new data is pushed in the array so it auto-generates id
  add(name: string): void {
    name = name.trim()
    if(!name) {return} //make sure it is non-blank
    this.heroService.addHero({name} as Hero)
    .subscribe(hero => {
      this.heroes.push(hero)
    })
  }

  // delete hero data by filtering it out
  delete(hero: Hero): void {
    this.heroes = this.heroes.filter(h => h !== hero)
    this.heroService.deleteHero(hero).subscribe()
  }

  ngOnInit(): void {
    this.getHeroes()
  }

}
