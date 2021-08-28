import { SettingsType, defaultSettings, isSettingsType } from './SettingsType';

import Display from './Display';
import { Streamdeck } from '@rweich/streamdeck-ts';

const UPDATE_INTERVAL_MS = 1000;
const plugin = new Streamdeck().plugin();
const display = new Display(plugin);
const intervalCache: Record<string, NodeJS.Timeout> = {};
const settingsCache: Record<string, SettingsType> = {};

const onTick = (context: string) => display.show(settingsCache[context], context);

plugin.on('willAppear', ({ context }) => {
  settingsCache[context] = defaultSettings;
  intervalCache[context] = setInterval(() => onTick(context), UPDATE_INTERVAL_MS);
  plugin.getSettings(context);
});
plugin.on('willDisappear', ({ context }) => clearInterval(intervalCache[context]));
plugin.on('didReceiveSettings', ({ context, settings }) => {
  console.log('got settings', settings);
  if (isSettingsType(settings)) {
    settingsCache[context].font = settings.font;
    settingsCache[context].format1stLine = settings.format1stLine;
    settingsCache[context].format2ndLine = settings.format2ndLine;
  }
  onTick(context);
});

export default plugin;
