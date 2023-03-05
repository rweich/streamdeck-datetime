import { Streamdeck } from '@rweich/streamdeck-ts';
import { clearInterval, setInterval } from '@rweich/webworker-timer';

import Display from './Display';
import { getDefaultSettings, isSettingsType, SettingsType } from './SettingsType';

const UPDATE_INTERVAL_MS = 1000;
const plugin = new Streamdeck().plugin();
const display = new Display(plugin);
const intervalCache: Record<string, number> = {};
const settingsCache: Record<string, SettingsType> = {};

const onTick = (context: string) => display.show(settingsCache[context], context);

plugin.on('willAppear', ({ context }) => {
  settingsCache[context] = getDefaultSettings();
  intervalCache[context] = setInterval(() => onTick(context), UPDATE_INTERVAL_MS);
  plugin.getSettings(context);
});
plugin.on('willDisappear', ({ context }) => clearInterval(intervalCache[context]));
plugin.on('didReceiveSettings', ({ context, settings }) => {
  if (isSettingsType(settings)) {
    settingsCache[context].font = settings.font;
    settingsCache[context].format1stLine = settings.format1stLine;
    settingsCache[context].format2ndLine = settings.format2ndLine;
    if (settings.fontSize1stLine !== undefined) {
      settingsCache[context].fontSize1stLine = settings.fontSize1stLine;
    }
    if (settings.fontSize2ndLine !== undefined) {
      settingsCache[context].fontSize2ndLine = settings.fontSize2ndLine;
    }
  }
  onTick(context);
});

export default plugin;
