import Phaser from 'phaser';
import { SaveManager } from '../save/SaveManager';
import { AudioManager } from '../audio/AudioManager';

export class SettingsScene extends Phaser.Scene {
  private returnToScene = 'MainMenuScene';

  constructor() {
    super('SettingsScene');
  }

  init(data: { returnTo?: string }): void {
    if (data && data.returnTo) {
      this.returnToScene = data.returnTo;
    }
  }

  create(): void {
    const width = this.scale.width;
    const height = this.scale.height;

    const saveManager = SaveManager.getInstance();
    const save = saveManager.getData();

    this.add.rectangle(width / 2, height / 2, width, height, 0x050913, 0.96).setInteractive();
    this.add.grid(width / 2, height / 2, width + 100, height + 100, 48, 48, 0x050913, 1, 0x0e2238, 0.4);

    this.add.text(width / 2, height * 0.14, 'SETTINGS', {
      fontFamily: 'system-ui',
      fontSize: '32px',
      fontStyle: 'bold',
      color: '#00f0ff',
    }).setOrigin(0.5);

    let rowY = height * 0.26;
    const spacing = 75;

    // 1. Music Volume
    this.createSliderRow(width / 2, rowY, 'MUSIC VOLUME', Math.round(save.settings.musicVolume * 100), (val) => {
      save.settings.musicVolume = val / 100;
      AudioManager.getInstance().setVolumes(save.settings.masterVolume, save.settings.musicVolume, save.settings.sfxVolume);
      saveManager.save(save);
    });

    // 2. SFX Volume
    rowY += spacing;
    this.createSliderRow(width / 2, rowY, 'SFX VOLUME', Math.round(save.settings.sfxVolume * 100), (val) => {
      save.settings.sfxVolume = val / 100;
      AudioManager.getInstance().setVolumes(save.settings.masterVolume, save.settings.musicVolume, save.settings.sfxVolume);
      saveManager.save(save);
    });

    // 3. Damage Numbers ON/OFF
    rowY += spacing;
    this.createToggleRow(width / 2, rowY, 'DAMAGE NUMBERS', save.settings.damageNumbers, (val) => {
      save.settings.damageNumbers = val;
      saveManager.save(save);
    });

    // 4. Screen Shake ON/OFF
    rowY += spacing;
    this.createToggleRow(width / 2, rowY, 'SCREEN SHAKE', save.settings.screenShake, (val) => {
      save.settings.screenShake = val;
      saveManager.save(save);
    });

    // 5. Performance Mode
    rowY += spacing;
    this.createQualityModeRow(width / 2, rowY, save.settings.performanceMode, (mode) => {
      save.settings.performanceMode = mode;
      saveManager.save(save);
    });

    // Back Button
    const backBtn = this.add.rectangle(width / 2, height * 0.86, 260, 52, 0x00f0ff);
    backBtn.setInteractive(
      new Phaser.Geom.Rectangle(-130, -26, 260, 52),
      Phaser.Geom.Rectangle.Contains
    );
    this.add.text(width / 2, height * 0.86, 'APPLY & RETURN', {
      fontFamily: 'system-ui',
      fontSize: '18px',
      fontStyle: 'bold',
      color: '#05101a',
    }).setOrigin(0.5);

    backBtn.on('pointerup', () => {
      AudioManager.getInstance().playSound('button_click');
      this.scene.stop();
      if (this.returnToScene === 'PauseScene') {
        this.scene.resume('PauseScene');
      } else {
        this.scene.start(this.returnToScene);
      }
    });
  }

  private createSliderRow(x: number, y: number, label: string, initialPct: number, onChange: (val: number) => void): void {
    const width = this.scale.width;
    const row = this.add.container(x, y);

    const title = this.add.text(-(width - 64) / 2 + 10, -10, label, {
      fontFamily: 'system-ui',
      fontSize: '15px',
      fontStyle: 'bold',
      color: '#ffffff',
    });

    const valText = this.add.text((width - 64) / 2 - 10, -10, `${initialPct}%`, {
      fontFamily: 'monospace',
      fontSize: '15px',
      fontStyle: 'bold',
      color: '#00f0ff',
    }).setOrigin(1, 0);

    // Minus and Plus buttons
    let current = initialPct;
    const minusBtn = this.add.rectangle(width * 0.1, 0, 44, 34, 0x1a2e44);
    minusBtn.setInteractive(
      new Phaser.Geom.Rectangle(-22, -17, 44, 34),
      Phaser.Geom.Rectangle.Contains
    );
    const minusText = this.add.text(width * 0.1, 0, '-', { fontSize: '20px', color: '#00f0ff' }).setOrigin(0.5);

    const plusBtn = this.add.rectangle(width * 0.28, 0, 44, 34, 0x1a2e44);
    plusBtn.setInteractive(
      new Phaser.Geom.Rectangle(-22, -17, 44, 34),
      Phaser.Geom.Rectangle.Contains
    );
    const plusText = this.add.text(width * 0.28, 0, '+', { fontSize: '20px', color: '#00f0ff' }).setOrigin(0.5);

    minusBtn.on('pointerup', () => {
      current = Math.max(0, current - 10);
      valText.setText(`${current}%`);
      onChange(current);
      AudioManager.getInstance().playSound('button_click');
    });

    plusBtn.on('pointerup', () => {
      current = Math.min(100, current + 10);
      valText.setText(`${current}%`);
      onChange(current);
      AudioManager.getInstance().playSound('button_click');
    });

    row.add([title, valText, minusBtn, minusText, plusBtn, plusText]);
  }

  private createToggleRow(x: number, y: number, label: string, initialVal: boolean, onChange: (val: boolean) => void): void {
    const width = this.scale.width;
    const row = this.add.container(x, y);

    const title = this.add.text(-(width - 64) / 2 + 10, 0, label, {
      fontFamily: 'system-ui',
      fontSize: '15px',
      fontStyle: 'bold',
      color: '#ffffff',
    }).setOrigin(0, 0.5);

    let state = initialVal;
    const btn = this.add.rectangle((width - 64) / 2 - 50, 0, 90, 36, state ? 0x00e676 : 0x444444);
    btn.setInteractive(
      new Phaser.Geom.Rectangle(-45, -18, 90, 36),
      Phaser.Geom.Rectangle.Contains
    );

    const btnLabel = this.add.text((width - 64) / 2 - 50, 0, state ? 'ON' : 'OFF', {
      fontFamily: 'system-ui',
      fontSize: '14px',
      fontStyle: 'bold',
      color: '#05101a',
    }).setOrigin(0.5);

    btn.on('pointerup', () => {
      state = !state;
      btn.setFillStyle(state ? 0x00e676 : 0x444444);
      btnLabel.setText(state ? 'ON' : 'OFF');
      onChange(state);
      AudioManager.getInstance().playSound('button_click');
    });

    row.add([title, btn, btnLabel]);
  }

  private createQualityModeRow(
    x: number,
    y: number,
    initialMode: 'auto' | 'high' | 'balanced' | 'performance',
    onChange: (mode: 'auto' | 'high' | 'balanced' | 'performance') => void
  ): void {
    const width = this.scale.width;
    const row = this.add.container(x, y);

    const title = this.add.text(-(width - 64) / 2 + 10, 0, 'GRAPHICS', {
      fontFamily: 'system-ui',
      fontSize: '15px',
      fontStyle: 'bold',
      color: '#ffffff',
    }).setOrigin(0, 0.5);

    const modes: ('auto' | 'high' | 'balanced' | 'performance')[] = ['auto', 'high', 'balanced', 'performance'];
    let idx = modes.indexOf(initialMode);
    if (idx < 0) idx = 0;

    const btn = this.add.rectangle((width - 64) / 2 - 65, 0, 130, 36, 0x1a2e44).setStrokeStyle(1, 0x00f0ff);
    btn.setInteractive(
      new Phaser.Geom.Rectangle(-65, -18, 130, 36),
      Phaser.Geom.Rectangle.Contains
    );

    const btnLabel = this.add.text((width - 64) / 2 - 65, 0, modes[idx].toUpperCase(), {
      fontFamily: 'system-ui',
      fontSize: '13px',
      fontStyle: 'bold',
      color: '#00f0ff',
    }).setOrigin(0.5);

    btn.on('pointerup', () => {
      idx = (idx + 1) % modes.length;
      btnLabel.setText(modes[idx].toUpperCase());
      onChange(modes[idx]);
      AudioManager.getInstance().playSound('button_click');
    });

    row.add([title, btn, btnLabel]);
  }
}
