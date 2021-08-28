import { SettingsType, isSettingsType } from './SettingsType';

import EventEmitter from 'eventemitter3';
import { FormBuilder } from '@rweich/streamdeck-formbuilder';
import { PropertyInspector } from '@rweich/streamdeck-ts';
import { is } from 'ts-type-guards';

type EventType = {
  'change-settings': () => void;
};

export default class SettingsForm {
  public static readonly default1stLineFormat = 'HH:mm';
  public static readonly default2ndLineFormat = 'D/M';
  private readonly pi: PropertyInspector;
  private readonly builder: FormBuilder<SettingsType>;
  private eventEmitter = new EventEmitter<EventType>();

  public constructor(pi: PropertyInspector, defaultSettings: unknown) {
    this.pi = pi;
    this.builder = new FormBuilder<SettingsType>(
      isSettingsType(defaultSettings)
        ? defaultSettings
        : {
            format1stLine: SettingsForm.default1stLineFormat,
            format2ndLine: SettingsForm.default2ndLineFormat,
          },
    );
    this.builder.addElement(
      'format1stLine',
      this.builder.createInput().setLabel('1st line').setPlaceholder('Enter datetime string (eg. HH:mm)'),
    );
    this.builder.addElement(
      'format2ndLine',
      this.builder.createInput().setLabel('2nd line').setPlaceholder('Enter datetime string (eg. DD.MM.)'),
    );
    const template = document.createElement('template');
    template.innerHTML = `
      <table>
        <thead><tr><td>format</td><td>output</td></tr></thead>
        <tbody>
          <tr><td>D</td><td>1-31</td></tr>
          <tr><td>M</td><td>1-12</td></tr>
          <tr><td>MMM</td><td>Jan-Dec</td></tr>
          <tr><td>H</td><td>0-23</td></tr>
          <tr><td>h</td><td>1-12</td></tr>
          <tr><td>m</td><td>0-59</td></tr>
        </tbody>
      </table>
    `;
    let table: HTMLElement | null = template.content.querySelector('table');
    if (!is(HTMLElement)(table)) {
      table = document.createElement('div'); // should-never-happen-fallback
    }
    this.builder.addHtml(
      this.builder
        .createDetails()
        .addSummary('Formatting help')
        .addParagraph('the formatting is done by day.js')
        .addParagraph('examples:')
        .addElement(table)
        .addParagraph('so "H:m D/M" would output "10:45 29/11"')
        .addParagraph('see the [day.js docs](https://day.js.org/docs/en/display/format) for more formatting options'),
    );
    this.builder.appendTo(document.querySelector('.sdpi-wrapper') ?? document.body);
    this.builder.on('change-settings', () => this.eventEmitter.emit('change-settings'));
    this.builder.on('click-link', (link) => this.pi.openUrl(link.href));
  }

  public onChangeSettings(callback: (settings: SettingsType) => void): void {
    this.eventEmitter.on('change-settings', () => callback(this.builder.getFormData()));
  }
}
