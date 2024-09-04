import { City } from '../city/City';

export class Player {
  private activeCity: City;

  initialize(): void {
    console.log('Player initialized');
    this.activeCity = new City();
  }

  update(): void {
    this.activeCity.update();
  }

  getActiveCity(): City {
    return this.activeCity;
  }
}