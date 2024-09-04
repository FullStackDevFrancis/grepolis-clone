import { Renderer } from './graphics/Renderer';
import { WorldMap } from './world/WorldMap';
import { Player } from './player/Player';
import { UIManager } from './ui/UIManager';
import { GameState } from './types/GameState';
import { Building } from "@/src/types/Building";

export class Game {
  private renderer: Renderer;
  private worldMap: WorldMap;
  private currentPlayer: Player;
  private uiManager: UIManager;
  private gameState: GameState;
  private loadingProgress: number = 0;
  private currentClickedBuilding: { x: number; y: number; building: Building } | null = null;
  private lastClickX: number = 0;
  private lastClickY: number = 0;

  constructor() {
    this.renderer = new Renderer();
    this.worldMap = new WorldMap();
    this.currentPlayer = new Player();
    this.uiManager = new UIManager(this);
    this.gameState = GameState.MAIN_MENU;
  }

  public initialize(container: HTMLElement): void {
    this.renderer.initialize(container);
    this.worldMap.generate();
    this.currentPlayer.initialize();
    this.uiManager.initialize();
    this.gameLoop();
  }

  private gameLoop(): void {
    this.update();
    this.render();
    requestAnimationFrame(() => this.gameLoop());
  }

  private update(): void {
    switch (this.gameState) {
      case GameState.MAIN_MENU:
        this.uiManager.updateMainMenu();
        break;
      case GameState.LOADING:
        this.updateLoading();
        break;
      case GameState.PLAYING:
        this.worldMap.update();
        this.currentPlayer.update();
        this.uiManager.update();
        break;
    }
  }

  private render(): void {
    this.renderer.clear();
    switch (this.gameState) {
      case GameState.MAIN_MENU:
        this.renderer.renderMainMenu(this.uiManager.getMainMenuData());
        break;
      case GameState.LOADING:
        this.renderer.renderLoadingScreen(this.getLoadingProgress());
        break;
      case GameState.PLAYING:
        if (this.uiManager.isWorldMapView()) {
          this.renderer.renderWorldMap(this.worldMap);
        } else {
          this.renderer.renderCity(this.currentPlayer.getActiveCity());
        }
        this.renderer.renderUI(this.uiManager);
        break;
    }
  }

  private updateLoading(): void {
    if (this.loadingProgress < 100) {
      this.loadingProgress += 1; // Increment by 1% each frame
    } else {
      this.setGameState(GameState.PLAYING);
      this.uiManager.setWorldMapView(false); // Start in city view
    }
  }

  private getLoadingProgress(): number {
    return this.loadingProgress;
  }

  public setGameState(state: GameState): void {
    this.gameState = state;
  }

  public getGameState(): GameState {
    return this.gameState;
  }

  public getPlayer(): Player {
    return this.currentPlayer;
  }

  public getWorldMap(): WorldMap {
    return this.worldMap;
  }

  public handleClick(x: number, y: number): void {
    this.lastClickX = x;
    this.lastClickY = y;
    if (this.gameState === GameState.MAIN_MENU) {
      const clickedItem = this.renderer.getClickedMenuItem(x, y);
      if (clickedItem) {
        switch (clickedItem) {
          case 'New Game':
            this.setGameState(GameState.LOADING);
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
    } else if (this.gameState === GameState.PLAYING) {
      const resources = this.currentPlayer.getActiveCity().getResources();
      const selectedBuilding = this.uiManager.getSelectedBuilding();
      const buttonClicked = this.renderer.checkBuildingInfoButtonClick(x, y, resources, selectedBuilding);
      if (buttonClicked === 'upgrade') {
        this.uiManager.upgradeSelectedBuilding();
      } else if (buttonClicked === 'downgrade') {
        this.uiManager.downgradeSelectedBuilding();
      } else {
        const clickedBuilding = this.getClickedBuilding(x, y);
        if (clickedBuilding) {
          this.currentClickedBuilding = clickedBuilding;
          this.uiManager.selectBuilding(clickedBuilding);
        } else {
          this.uiManager.handleClick(x, y);
        }
      }
    }
  }

  public getCurrentClickedBuilding(): { x: number; y: number; building: Building } | null {
    return this.getClickedBuilding(this.lastClickX, this.lastClickY);
  }

  private getClickedBuilding(x: number, y: number): { x: number; y: number; building: Building } | null {
    const city = this.currentPlayer.getActiveCity();
    const grid = city.getGrid();
    const cityRenderer = this.renderer.getCityRenderer();
    const tileSize = cityRenderer.getTileSize();
    for (let gridY = 0; gridY < grid.length; gridY++) {
      for (let gridX = 0; gridX < grid[gridY].length; gridX++) {
        const { x: buildingX, y: buildingY } = cityRenderer.getBuildingCoordinates(gridX, gridY);
        if (
          x >= buildingX && x < buildingX + tileSize &&
          y >= buildingY && y < buildingY + tileSize
        ) {
          const tile = grid[gridY][gridX];
          if (tile.type === 'building' && tile.building) {
            return { x: gridX, y: gridY, building: tile.building };
          }
        }
      }
    }
    return null;
  }

  public upgradeBuilding(x: number, y: number): void {
    const city = this.currentPlayer.getActiveCity();
    const resources = city.getResources();
    if (resources.wood >= 100 && resources.stone >= 100 && resources.silver >= 100) {
      city.upgradeBuilding(x, y);
      city.updateResources(-100, -100, -100);
    } else {
      console.log('Not enough resources to upgrade');
    }
  }

  public downgradeBuilding(x: number, y: number): void {
    const city = this.currentPlayer.getActiveCity();
    city.downgradeBuilding(x, y);
    city.updateResources(50, 50, 50);
  }

  public getBuildingAt(x: number, y: number): Building | null {
    const city = this.currentPlayer.getActiveCity();
    const grid = city.getGrid();
    const tile = grid[y][x];
    return tile.type === 'building' ? tile.building : null;
  }

  public getRenderer(): Renderer {
    return this.renderer;
  }

  public setCurrentClickedBuilding(building: { x: number; y: number; building: Building } | null): void {
    this.currentClickedBuilding = building;
  }
}
