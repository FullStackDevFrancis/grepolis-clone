import { Building } from '../types/Building';
import { Resources } from '../types/Resources';
import { CityTile } from '../types/CityTile';

export class City {
  private resources: Resources;
  private buildings: Building[];
  private grid: CityTile[][];
  private gridSize: number = 10;

  constructor() {
    this.resources = { wood: 100, stone: 100, silver: 100 };
    this.buildings = [
      { name: 'Town Hall', level: 1 },
      { name: 'Timber Camp', level: 1 },
      { name: 'Quarry', level: 1 },
      { name: 'Silver Mine', level: 1 }
    ];
    this.initializeGrid();
  }

  update(): void {
    this.generateResources();
  }

  private generateResources(): void {
    this.resources.wood += this.getResourceRate('Timber Camp') / 60; // Generate per second instead of per frame
    this.resources.stone += this.getResourceRate('Quarry') / 60;
    this.resources.silver += this.getResourceRate('Silver Mine') / 60;

    // Round resources to 2 decimal places
    this.resources.wood = Math.round(this.resources.wood * 100) / 100;
    this.resources.stone = Math.round(this.resources.stone * 100) / 100;
    this.resources.silver = Math.round(this.resources.silver * 100) / 100;
  }

  private getResourceRate(buildingName: string): number {
    const building = this.buildings.find(b => b.name === buildingName);
    return building ? building.level : 0;
  }

  private initializeGrid(): void {
    this.grid = [];
    for (let y = 0; y < this.gridSize; y++) {
      const row: CityTile[] = [];
      for (let x = 0; x < this.gridSize; x++) {
        row.push({ type: 'empty', building: null });
      }
      this.grid.push(row);
    }

    // Place initial buildings
    this.placeBuilding(4, 4, 'Town Hall');
    this.placeBuilding(2, 2, 'Timber Camp');
    this.placeBuilding(6, 2, 'Quarry');
    this.placeBuilding(2, 6, 'Silver Mine');
  }

  private placeBuilding(x: number, y: number, buildingName: string): void {
    const building = this.buildings.find(b => b.name === buildingName);
    if (building) {
      this.grid[y][x] = { type: 'building', building: building };
    }
  }

  upgradeBuilding(x: number, y: number): void {
    const tile = this.grid[y][x];
    if (tile.type === 'building' && tile.building) {
      tile.building.level++;
    }
  }

  downgradeBuilding(x: number, y: number): void {
    const tile = this.grid[y][x];
    if (tile.type === 'building' && tile.building && tile.building.level > 1) {
      tile.building.level--;
    }
  }

  updateResources(wood: number, stone: number, silver: number): void {
    this.resources.wood += wood;
    this.resources.stone += stone;
    this.resources.silver += silver;
  }

  getResources(): Resources {
    return this.resources;
  }

  getBuildings(): Building[] {
    return this.buildings;
  }

  getGrid(): CityTile[][] {
    return this.grid;
  }
}