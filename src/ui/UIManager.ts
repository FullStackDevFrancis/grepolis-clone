import { Game } from '../Game';
import { GameState } from '../types/GameState';
import { MainMenuData } from '../types/MainMenuData';
import { CityOverviewData } from '../types/CityOverviewData';
import { Building } from "@/src/types/Building";

export class UIManager {
  private game: Game;
  private worldMapView: boolean = true;
  private mainMenuData: MainMenuData;
  private cityOverviewData: CityOverviewData;
  private selectedBuilding: { x: number; y: number; building: Building } | null = null;

  constructor(game: Game) {
    this.game = game;
    this.mainMenuData = {
      title: "Grepolis Clone",
      menuItems: ["New Game", "Load Game", "Options", "Exit"]
    };
    this.cityOverviewData = {
      resources: { wood: 0, stone: 0, silver: 0 },
      buildings: []
    };
  }

  initialize(): void {
    console.log('UI Manager initialized');
    this.addEventListeners();
  }

  update(): void {
    this.updateCityOverview();
  }

  updateMainMenu(): void {
    // Handle main menu interactions
  }

  isWorldMapView(): boolean {
    return this.worldMapView;
  }

  toggleView(): void {
    this.worldMapView = !this.worldMapView;
  }

  getMainMenuData(): MainMenuData {
    return this.mainMenuData;
  }

  getCityOverviewData(): CityOverviewData {
    return this.cityOverviewData;
  }

  private updateCityOverview(): void {
    const activeCity = this.game.getPlayer().getActiveCity();
    this.cityOverviewData.resources = activeCity.getResources();
    this.cityOverviewData.buildings = activeCity.getBuildings();
  }

  private addEventListeners(): void {
    // Add event listeners for UI interactions
    document.addEventListener('click', (event) => this.handleClick(event));
  }

  private handleClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (target.classList.contains('menu-item')) {
      const menuItem = target.textContent;
      switch (menuItem) {
        case 'New Game':
          this.game.setGameState(GameState.LOADING);
          break;
        case 'Load Game':
          // Implement load game functionality
          break;
        case 'Options':
          // Implement options menu
          break;
        case 'Exit':
          // Implement exit functionality
          break;
      }
    }
  }

  showBuildingUpgradeOptions(options: { x: number; y: number; building: Building }): void {
    console.log('Showing building upgrade options:', options);
    this.buildingUpgradeOptions = options;
    console.log('SET BUILDING OPTIONS:', this.buildingUpgradeOptions)
  }

  getBuildingUpgradeOptions(): { x: number; y: number; building: Building } | null {
    return this.buildingUpgradeOptions;
  }

  handleClick(x: number, y: number): void {
    console.log('UIManager handling click at', x, y);
    
    const clickedBuilding = this.game.getCurrentClickedBuilding();
    if (clickedBuilding) {
      console.log('Selected building:', clickedBuilding);
      this.selectedBuilding = clickedBuilding;
    }
  }

  getSelectedBuilding(): { x: number; y: number; building: Building } | null {
    return this.selectedBuilding;
  }

  selectBuilding(building: { x: number; y: number; building: Building }): void {
    console.log('Selected building:', building);
    this.selectedBuilding = building;
  }

  upgradeSelectedBuilding(): void {
    if (this.selectedBuilding) {
      console.log('Upgrading building:', this.selectedBuilding);
      this.game.upgradeBuilding(this.selectedBuilding.x, this.selectedBuilding.y);
      this.updateSelectedBuilding();
    }
  }

  downgradeSelectedBuilding(): void {
    if (this.selectedBuilding) {
      console.log('Downgrading building:', this.selectedBuilding);
      this.game.downgradeBuilding(this.selectedBuilding.x, this.selectedBuilding.y);
      this.updateSelectedBuilding();
    }
  }

  private updateSelectedBuilding(): void {
    if (this.selectedBuilding) {
      const updatedBuilding = this.game.getBuildingAt(this.selectedBuilding.x, this.selectedBuilding.y);
      if (updatedBuilding) {
        this.selectedBuilding.building = updatedBuilding;
      }
    }
  }

  setWorldMapView(isWorldMap: boolean): void {
    this.worldMapView = isWorldMap;
  }
}
