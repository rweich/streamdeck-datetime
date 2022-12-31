import Plugin from '@rweich/streamdeck-ts/dist/Plugin';
import dayjs from 'dayjs';

import { SettingsType } from './SettingsType';

type TextType = { font: string; line1: string; line2: string };

export default class Display {
  private readonly plugin: Plugin;
  private lastText: Record<string, TextType> = {};

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

    const newText = this.getNewText(settings);
    if (!this.isTextDifferent(pluginContext, newText)) {
      return;
    }
    this.lastText[pluginContext] = newText;

    context.fillStyle = 'white';
    context.font = `40px "${newText.font}"`;
    context.textAlign = 'center';
    context.fillText(newText.line1, 72, 60, 144);
    context.font = `28px "${newText.font}"`;
    context.fillText(newText.line2, 72, 110, 144);
    this.plugin.setImage(canvas.toDataURL('image/png'), pluginContext);
  }

  private getNewText(settings: SettingsType): TextType {
    const day = dayjs();
    const line1 = day.format(settings.format1stLine);
    const line2 = day.format(settings.format2ndLine);

    return {
      font: settings.font,
      line1,
      line2,
    };
  }

  private isTextDifferent(pluginContext: string, text: TextType): boolean {
    if (this.lastText[pluginContext] === undefined) {
      this.lastText[pluginContext] = { font: '', line1: '', line2: '' };
    }
    const last = this.lastText[pluginContext];

    return !(last.line1 === text.line1 && last.line2 === text.line2 && last.font === text.font);
  }
}
