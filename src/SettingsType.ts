type SettingsType = {
  format1stLine: string;
  format2ndLine: string;
};

export function isSettingsType(payload: unknown): payload is SettingsType {
  return (
    (payload as SettingsType).hasOwnProperty('format1stLine')
    && (payload as SettingsType).hasOwnProperty('format2ndLine')
  );
}
