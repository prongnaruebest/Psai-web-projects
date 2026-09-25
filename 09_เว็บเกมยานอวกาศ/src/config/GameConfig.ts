import Phaser from 'phaser';
import { BootScene } from '../scenes/BootScene';
import { PreloadScene } from '../scenes/PreloadScene';
import { MainMenuScene } from '../scenes/MainMenuScene';
import { CharacterSelectScene } from '../scenes/CharacterSelectScene';
import { StageSelectScene } from '../scenes/StageSelectScene';
import { GameScene } from '../scenes/GameScene';
import { PauseScene } from '../scenes/PauseScene';
import { ResultScene } from '../scenes/ResultScene';
import { SettingsScene } from '../scenes/SettingsScene';
import { GameHubScene } from '../scenes/GameHubScene';
import { DefenseMenuScene } from '../defense/scenes/DefenseMenuScene';
import { DefenseGameScene } from '../defense/scenes/DefenseGameScene';
import { DefenseResultScene } from '../defense/scenes/DefenseResultScene';
import { ShmupMenuScene } from '../shmup/scenes/ShmupMenuScene';
import { ShmupGameScene } from '../shmup/scenes/ShmupGameScene';
import { ShmupResultScene } from '../shmup/scenes/ShmupResultScene';
import { EvolutionGuideScene } from '../scenes/EvolutionGuideScene';

export function createGameConfig(): Phaser.Types.Core.GameConfig {
  return {
    type: Phaser.AUTO,
    parent: 'game',
    backgroundColor: '#070b14',
    pixelArt: false,
    antialias: true,
    scale: {
      mode: Phaser.Scale.RESIZE,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: window.innerWidth,
      height: window.innerHeight,
    },
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { x: 0, y: 0 },
        debug: false,
      },
    },
    input: {
      activePointers: 3,
      touch: {
        capture: true,
      },
    },
    render: {
      powerPreference: 'high-performance',
      batchSize: 4096,
    },
      scene: [
      BootScene,
      PreloadScene,
      GameHubScene,
      MainMenuScene,
      CharacterSelectScene,
      StageSelectScene,
      GameScene,
      PauseScene,
      ResultScene,
      SettingsScene,
      DefenseMenuScene,
      DefenseGameScene,
      DefenseResultScene,
      ShmupMenuScene,
      ShmupGameScene,
      ShmupResultScene,
      EvolutionGuideScene,
    ],
  };
}
