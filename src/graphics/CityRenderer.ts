import { City } from '../city/City';
import { CityTile } from '../types/CityTile';

export class CityRenderer {
  private ctx: CanvasRenderingContext2D;
  private tileSize: number = 50;
  private gridOffsetX: number;
  private gridOffsetY: number;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
    this.gridOffsetX = 0;
    this.gridOffsetY = 0;
  }

  renderCity(city: City): void {
    const grid = city.getGrid();
    const gridWidth = grid[0].length * this.tileSize;
    const gridHeight = grid.length * this.tileSize;

    this.gridOffsetX = (this.ctx.canvas.width - gridWidth) / 2;
    this.gridOffsetY = (this.ctx.canvas.height - gridHeight) / 2;

    this.renderGrid(grid);
    this.renderBuildings(grid);
  }

  private renderGrid(grid: CityTile[][]): void {
    for (let y = 0; y < grid.length; y++) {
      for (let x = 0; x < grid[y].length; x++) {
        this.ctx.strokeStyle = '#333';
        this.ctx.strokeRect(
          this.gridOffsetX + x * this.tileSize,
          this.gridOffsetY + y * this.tileSize,
          this.tileSize,
          this.tileSize
        );
      }
    }
  }

  private renderBuildings(grid: CityTile[][]): void {
    for (let y = 0; y < grid.length; y++) {
      for (let x = 0; x < grid[y].length; x++) {
        const tile = grid[y][x];
        if (tile.type === 'building' && tile.building) {
          this.renderBuilding(x, y, tile.building.name, tile.building.level);
        }
      }
    }
  }

  private renderBuilding(x: number, y: number, buildingName: string, level: number): void {
    const buildingX = this.gridOffsetX + x * this.tileSize;
    const buildingY = this.gridOffsetY + y * this.tileSize;

    this.ctx.fillStyle = this.getBuildingColor(buildingName);
    this.ctx.fillRect(buildingX, buildingY, this.tileSize, this.tileSize);

    // Render level indicator
    this.ctx.fillStyle = 'white';
    this.ctx.font = '16px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText(level.toString(), buildingX + this.tileSize / 2, buildingY + this.tileSize / 2);

    // Render building name
    this.ctx.font = '10px Arial';
    this.ctx.fillText(buildingName, buildingX + this.tileSize / 2, buildingY + this.tileSize - 5);
  }

  private getBuildingColor(buildingName: string): string {
    switch (buildingName) {
      case 'Town Hall': return '#8B4513';
      case 'Timber Camp': return '#228B22';
      case 'Quarry': return '#808080';
      case 'Silver Mine': return '#C0C0C0';
      default: return '#FFA500';
    }
  }

  // New method to get building coordinates
  getBuildingCoordinates(x: number, y: number): { x: number; y: number } {
    console.log('getting cordinats', x, y)
    return {
      x: this.gridOffsetX + x * this.tileSize,
      y: this.gridOffsetY + y * this.tileSize
    };
  }

  // Add this method
  getTileSize(): number {
    return this.tileSize;
  }
}
