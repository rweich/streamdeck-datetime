import { isSomething } from 'ts-type-guards';

export type SettingsType = {
  font: string;
  format1stLine: string;
  format2ndLine: string;
  fontSize1stLine?: string;
  fontSize2ndLine?: string;
};

export function isSettingsType(payload: unknown): payload is SettingsType {
  return (
    (payload as SettingsType).hasOwnProperty('font')
    && isSomething((payload as SettingsType).font)
    && (payload as SettingsType).hasOwnProperty('format1stLine')
    && isSomething((payload as SettingsType).format1stLine)
    && (payload as SettingsType).hasOwnProperty('format2ndLine')
    && isSomething((payload as SettingsType).format2ndLine)
  );
}

export function getDefaultSettings(): SettingsType {
  return {
    font: 'Verdana',
    fontSize1stLine: '40',
    fontSize2ndLine: '28',
    format1stLine: 'HH:mm',
    format2ndLine: 'D/M',
  };
}
