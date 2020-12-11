import { Component, OnInit, Input } from '@angular/core';
import { Location } from '@angular/common'
import { ActivatedRoute } from "@angular/router" 
import { Hero } from '../hero'
import { HeroService } from '../hero.service'

@Component({
  selector: 'app-hero-detail',
  templateUrl: './hero-detail.component.html',
  styleUrls: ['./hero-detail.component.scss']
})
export class HeroDetailComponent implements OnInit {
  hero: Hero
  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private heroService: HeroService
    ) { }

  getHero(): void {
    const id = +this.route.snapshot.paramMap.get('id') //get id from url and change the type into number
    this.heroService.getHero(id)
    .subscribe(hero => this.hero =hero)
  }
  
  goBack(): void {
    this.location.back();
  }
  save(): void{
    this.heroService.updateHero(this.hero)
    .subscribe(() => this.goBack())
  }  
  ngOnInit(): void {
    this.getHero()
  }

}
