import { Building } from './Building';

export interface CityTile {
  type: 'empty' | 'building';
  building: Building | null;
}