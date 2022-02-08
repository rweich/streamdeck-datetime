import { Streamdeck } from '@rweich/streamdeck-ts';

import SettingsForm from './SettingsForm';

const pi = new Streamdeck().propertyinspector();

pi.on('websocketOpen', ({ uuid }) => pi.getSettings(uuid));

pi.on('didReceiveSettings', ({ settings }) => {
  console.log('got settings', settings);
  new SettingsForm(pi, settings).onChangeSettings((newSettings) => {
    if (pi.pluginUUID === undefined) {
      console.error('pi has no uuid! is it registered already?', pi.pluginUUID);
      return;
    }
    pi.setSettings(pi.pluginUUID, newSettings);
  });
});

export default pi;
