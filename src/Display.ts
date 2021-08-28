import Plugin from '@rweich/streamdeck-ts/dist/Plugin';
import { SettingsType } from './SettingsType';
import dayjs from 'dayjs';

export default class Display {
  private readonly plugin: Plugin;
  private lastText = { line1: '', line2: '' };

  constructor(plugin: Plugin) {
    this.plugin = plugin;
  }

  private static createCanvas(width: number, height: number): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    return canvas;
  }

  public show(settings: SettingsType, pluginContext: string): void {
    const canvas = Display.createCanvas(144, 144);
    const context = canvas.getContext('2d');
    if (context === null) {
      throw new Error('could not create 2d context in canvas');
    }
    const day = dayjs();
    const line1 = day.format(settings.format1stLine);
    const line2 = day.format(settings.format2ndLine);
    if (this.lastText.line1 === line1 && this.lastText.line2 === line2) {
      return;
    }
    this.lastText.line1 = line1;
    this.lastText.line2 = line2;
    context.fillStyle = 'white';
    context.font = `40px "${settings.font}"`;
    context.textAlign = 'center';
    context.fillText(line1, 72, 60, 144);
    context.font = `28px "${settings.font}"`;
    context.fillText(line2, 72, 110, 144);
    this.plugin.setImage(canvas.toDataURL('image/png'), pluginContext);
  }
}
