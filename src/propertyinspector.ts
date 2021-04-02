import { Streamdeck } from '@rweich/streamdeck-ts';
import { is } from 'ts-type-guards';
import { isSettingsType } from './SettingsType';

const pi = new Streamdeck().propertyinspector();

const default1stLineFormat = 'HH:mm';
const default2ndLineFormat = 'D/M';

const getInput = (name: string): HTMLInputElement | null => {
  const input = document.querySelector("input[name='" + name + "']");
  if (is(HTMLInputElement)(input)) {
    return input;
  }
  return null;
};

const getInputVal = (name: string): string | null => {
  const input = getInput(name);
  return input ? input.value : null;
};

const setInputVal = (name: string, value: string): void => {
  const input = getInput(name);
  if (input) {
    input.value = value;
  }
};

const onInput = (event: Event): void => {
  console.log('item changed', event.target, 'event:', event);
  if (pi.pluginUUID === null) {
    console.error('pi has no uuid! is it registered already?', pi.pluginUUID);
    return;
  }
  if (!is(HTMLInputElement)(event.target)) {
    return;
  }
  pi.setSettings(pi.pluginUUID, {
    format1stLine: getInputVal('format1stline') || default1stLineFormat,
    format2ndLine: getInputVal('format2ndline') || default2ndLineFormat,
  });
};

pi.on('websocketOpen', ({ uuid }) => {
  // were there any settings saved?
  pi.getSettings(uuid);

  // register input event listeners
  Array.from(document.querySelectorAll('.sdpi-item-value')).forEach((input) => {
    if (is(HTMLInputElement)(input)) {
      input.addEventListener('input', onInput);
    }
  });
});

pi.on('didReceiveSettings', ({ settings }) => {
  if (isSettingsType(settings)) {
    setInputVal('format1stline', settings.format1stLine || default1stLineFormat);
    setInputVal('format2ndline', settings.format2ndLine || default2ndLineFormat);
  } else {
    setInputVal('format1stline', default1stLineFormat);
    setInputVal('format2ndline', default2ndLineFormat);
  }
});

// this makes sure the streamdeck finds our init function (do not remove!)
export default pi.createStreamdeckConnector();
