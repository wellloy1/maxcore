const locale = global.LOCALE ?? process.env.LOCALE ?? 'ru-RU';

export const Time = {
  unix() {
    return Date.now();
  },
  iso(unixTime = Date.now()) {
    return new Date(unixTime).toISOString();
  },
  utc(unixTime = Date.now()) {
    return new Date(unixTime).toUTCString();
  },
  ls(unixTime = Date.now()) {
    return new Date(unixTime).toLocaleString(locale);
  },
  lts(unixTime = Date.now()) {
    return new Date(unixTime).toLocaleTimeString(locale);
  },
  lds(unixTime = Date.now()) {
    return new Date(unixTime).toLocaleDateString(locale);
  },
};
