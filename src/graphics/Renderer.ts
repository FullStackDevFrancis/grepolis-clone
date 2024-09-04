import { MainMenuData } from '../types/MainMenuData';
import { CityOverviewData } from '../types/CityOverviewData';
import { CityRenderer } from './CityRenderer';
import { City } from '../city/City';
import { Building } from "@/src/types/Building";
import { UIManager } from '../ui/UIManager';
import { Resources } from '../types/Resources';

export class Renderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private cityRenderer: CityRenderer;
  private menuItemAreas: { text: string; area: { x: number; y: number; width: number; height: number } }[] = [];
  private buildingInfoButtons: { upgradeBtn: any, downgradeBtn: any } | null = null;

  initialize(container: HTMLElement): void {
    this.canvas = document.createElement('canvas');
    this.canvas.width = container.clientWidth;
    this.canvas.height = container.clientHeight;
    container.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d')!;
    this.cityRenderer = new CityRenderer(this.ctx);

    console.log('Canvas created and added to container');
    console.log('Canvas dimensions:', this.canvas.width, 'x', this.canvas.height);

    // Draw something to test
    this.ctx.fillStyle = 'red';
    this.ctx.fillRect(0, 0, 100, 100);
    this.ctx.fillStyle = 'white';
    this.ctx.font = '20px Arial';
    this.ctx.fillText('Renderer initialized', 10, 50);
    console.log('Test rectangle and text drawn');

    // Add event listener for window resize
    window.addEventListener('resize', () => this.handleResize(container));
  }

  private handleResize(container: HTMLElement): void {
    this.canvas.width = container.clientWidth;
    this.canvas.height = container.clientHeight;
    // You might want to trigger a re-render here
  }

  clear(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  renderMainMenu(menuData: MainMenuData): void {
    this.ctx.fillStyle = 'black';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.fillStyle = 'white';
    this.ctx.font = '48px serif';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(menuData.title, this.canvas.width / 2, 100);

    this.ctx.font = '24px serif';
    this.menuItemAreas = []; // Clear previous menu items
    menuData.menuItems.forEach((item, index) => {
      const y = 200 + index * 50;
      this.ctx.fillText(item, this.canvas.width / 2, y);

      // Store the area of each menu item for click detection
      const textMetrics = this.ctx.measureText(item);
      this.menuItemAreas.push({
        text: item,
        area: {
          x: this.canvas.width / 2 - textMetrics.width / 2,
          y: y - 24, // Approximate height of the text
          width: textMetrics.width,
          height: 30 // Slightly larger than font size for easier clicking
        }
      });
    });
  }

  renderLoadingScreen(progress: number): void {
    this.ctx.fillStyle = 'black';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.fillStyle = 'white';
    this.ctx.font = '24px serif';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(`Loading... ${progress}%`, this.canvas.width / 2, this.canvas.height / 2);
  }

  renderWorldMap(worldMap: any): void {
    // Implement world map rendering
  }

  renderCity(city: City): void {
    this.ctx.fillStyle = 'green';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.fillStyle = 'white';
    this.ctx.font = '32px serif';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('City View', this.canvas.width / 2, 50);

    this.cityRenderer.renderCity(city);
  }

  renderUI(uiManager: UIManager): void {
    const cityOverviewData = uiManager.getCityOverviewData();
    this.renderCityOverview(cityOverviewData);
    this.renderBuildingInfo(uiManager.getSelectedBuilding(), cityOverviewData.resources);
  }

  private renderCityOverview(data: CityOverviewData): void {
    const padding = 20;
    const overviewWidth = 250;
    const overviewHeight = this.canvas.height - 2 * padding;
    const overviewX = padding;
    const overviewY = padding;

    // Render a semi-transparent background for the entire overview
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    this.ctx.fillRect(overviewX, overviewY, overviewWidth, overviewHeight);

    // Add a border
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(overviewX, overviewY, overviewWidth, overviewHeight);

    // Render title
    this.ctx.fillStyle = 'white';
    this.ctx.font = 'bold 24px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('City Overview', overviewX + overviewWidth / 2, overviewY + 40);

    // Render resources
    this.ctx.font = '18px Arial';
    this.ctx.textAlign = 'left';
    this.ctx.fillText(`Wood: ${Math.floor(data.resources.wood)}`, overviewX + 20, overviewY + 80);
    this.ctx.fillText(`Stone: ${Math.floor(data.resources.stone)}`, overviewX + 20, overviewY + 110);
    this.ctx.fillText(`Silver: ${Math.floor(data.resources.silver)}`, overviewX + 20, overviewY + 140);

    // Render buildings list
    this.ctx.font = 'bold 20px Arial';
    this.ctx.fillText('Buildings:', overviewX + 20, overviewY + 190);
    this.ctx.font = '16px Arial';
    data.buildings.forEach((building, index) => {
      // In the future, you can add small icons here before the text
      this.ctx.fillText(`${building.name} (Level ${building.level})`, overviewX + 20, overviewY + 220 + index * 30);
    });
  }

  private renderBuildingInfo(selectedBuilding: { x: number; y: number; building: Building } | null, resources: Resources): void {
    const infoWidth = 280;
    const infoHeight = 320;
    const padding = 20;
    
    const infoX = this.canvas.width - infoWidth - padding;
    const infoY = padding;

    // Render a semi-transparent background for building info
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    this.ctx.fillRect(infoX, infoY, infoWidth, infoHeight);

    // Add a border
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(infoX, infoY, infoWidth, infoHeight);

    this.ctx.fillStyle = 'white';
    this.ctx.font = 'bold 22px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Building Information', infoX + infoWidth / 2, infoY + 30);

    if (selectedBuilding) {
      const { building } = selectedBuilding;
      this.ctx.font = '18px Arial';
      this.ctx.textAlign = 'left';
      this.ctx.fillText(`Name: ${building.name}`, infoX + 20, infoY + 70);
      this.ctx.fillText(`Level: ${building.level}`, infoX + 20, infoY + 100);
      this.ctx.fillText('Upgrade cost: 100 each', infoX + 20, infoY + 130);
      this.ctx.fillText('Downgrade gain: 50 each', infoX + 20, infoY + 160);

      const canUpgrade = resources.wood >= 100 && resources.stone >= 100 && resources.silver >= 100;

      // Upgrade button
      const upgradeBtn = {
        x: infoX + 20,
        y: infoY + 190,
        width: 110,
        height: 40
      };
      this.ctx.fillStyle = canUpgrade ? '#4CAF50' : '#888888';
      this.ctx.fillRect(upgradeBtn.x, upgradeBtn.y, upgradeBtn.width, upgradeBtn.height);
      this.ctx.fillStyle = 'white';
      this.ctx.font = 'bold 16px Arial';
      this.ctx.textAlign = 'center';
      this.ctx.fillText('Upgrade', upgradeBtn.x + upgradeBtn.width / 2, upgradeBtn.y + upgradeBtn.height / 2 + 5);

      // Downgrade button
      const downgradeBtn = {
        x: infoX + 150,
        y: infoY + 190,
        width: 110,
        height: 40
      };
      this.ctx.fillStyle = building.level > 1 ? '#f44336' : '#888888';
      this.ctx.fillRect(downgradeBtn.x, downgradeBtn.y, downgradeBtn.width, downgradeBtn.height);
      this.ctx.fillStyle = 'white';
      this.ctx.fillText('Downgrade', downgradeBtn.x + downgradeBtn.width / 2, downgradeBtn.y + downgradeBtn.height / 2 + 5);

      this.buildingInfoButtons = { upgradeBtn, downgradeBtn };
    } else {
      this.ctx.font = '18px Arial';
      this.ctx.textAlign = 'center';
      this.ctx.fillText('No building selected', infoX + infoWidth / 2, infoY + 100);
      this.buildingInfoButtons = null;
    }
  }

  getCityRenderer(): CityRenderer {
    return this.cityRenderer;
  }

  // Add a method to check if a point is inside a menu item
  getClickedMenuItem(x: number, y: number): string | null {
    for (const item of this.menuItemAreas) {
      if (x >= item.area.x && x <= item.area.x + item.area.width &&
          y >= item.area.y && y <= item.area.y + item.area.height) {
        return item.text;
      }
    }
    return null;
  }

  checkBuildingInfoButtonClick(x: number, y: number, resources: Resources, selectedBuilding: { x: number; y: number; building: Building } | null): 'upgrade' | 'downgrade' | null {
    if (this.buildingInfoButtons && selectedBuilding) {
      const { upgradeBtn, downgradeBtn } = this.buildingInfoButtons;
      const canUpgrade = resources.wood >= 100 && resources.stone >= 100 && resources.silver >= 100;
      const canDowngrade = selectedBuilding.building.level > 1;

      if (canUpgrade && x >= upgradeBtn.x && x < upgradeBtn.x + upgradeBtn.width &&
          y >= upgradeBtn.y && y < upgradeBtn.y + upgradeBtn.height) {
        return 'upgrade';
      }
      if (canDowngrade && x >= downgradeBtn.x && x < downgradeBtn.x + downgradeBtn.width &&
          y >= downgradeBtn.y && y < downgradeBtn.y + downgradeBtn.height) {
        return 'downgrade';
      }
    }
    return null;
  }
}
