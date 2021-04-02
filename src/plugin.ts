import { Streamdeck } from '@rweich/streamdeck-ts';
import dayjs from 'dayjs';
import { isSettingsType, SettingsType } from './SettingsType';

const UPDATE_INTERVAL_MS = 1000;
const plugin = new Streamdeck().plugin();
const intervalCache: Record<string, NodeJS.Timeout> = {};
const settingsCache: Record<string, SettingsType> = {};

const onTick = (context: string) => {
  const settings = settingsCache[context];
  plugin.setTitle(dayjs().format(settings.format1stLine + '\n' + settings.format2ndLine), context);
};

plugin.on('willAppear', ({ context }) => {
  settingsCache[context] = { format1stLine: 'HH:mm', format2ndLine: 'D/M' };
  intervalCache[context] = setInterval(() => onTick(context), UPDATE_INTERVAL_MS);
  plugin.getSettings(context);
});
plugin.on('willDisappear', ({ context }) => {
  clearInterval(intervalCache[context]);
});
plugin.on('didReceiveSettings', ({ context, settings }) => {
  console.log('got settings', settings);
  if (isSettingsType(settings)) {
    if (settings.format1stLine) {
      settingsCache[context].format1stLine = settings.format1stLine;
    }
    if (settings.format2ndLine) {
      settingsCache[context].format2ndLine = settings.format2ndLine;
    }
  }
  onTick(context);
});

export default plugin;
