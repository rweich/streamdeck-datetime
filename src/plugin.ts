import { Streamdeck } from '@rweich/streamdeck-ts';
import dayjs from 'dayjs';
import { isSettingsType } from './SettingsType';

const UPDATE_INTERVAL_MS = 1000;
const plugin = new Streamdeck().plugin();
const intervalCache: Record<string, NodeJS.Timeout> = {};

// TODO: fix: the format is shared between the actions
let format1stLine = 'HH:mm';
let format2ndLine = 'D/M';

const onTick = (context: string) => {
  plugin.setTitle(dayjs().format(format1stLine + '\n' + format2ndLine), context);
};

plugin.on('willAppear', ({ context }) => {
  plugin.getSettings(context);
  intervalCache[context] = setInterval(() => onTick(context), UPDATE_INTERVAL_MS);
});
plugin.on('willDisappear', ({ context }) => {
  clearInterval(intervalCache[context]);
});
plugin.on('didReceiveSettings', ({ context, settings }) => {
  console.log('got settings', settings);
  if (isSettingsType(settings)) {
    format1stLine = settings.format1stLine || format1stLine;
    format2ndLine = settings.format2ndLine || format2ndLine;
  }
  onTick(context);
});

export default plugin;
