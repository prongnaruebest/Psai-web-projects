import Phaser from 'phaser';
import { createGameConfig } from './config/GameConfig';

window.addEventListener('DOMContentLoaded', () => {
  const config = createGameConfig();
  new Phaser.Game(config);
});

