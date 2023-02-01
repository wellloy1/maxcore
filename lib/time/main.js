const locale = global.LOCALE ?? process.env.LOCALE ?? 'ru-RU';

function unix() {
	return Date.now();
}
function iso(unixTime = Date.now()) {
	return new Date(unixTime).toISOString();
}
function utc(unixTime = Date.now()) {
	return new Date(unixTime).toISOString();
}
function ls(unixTime = Date.now()) {
	return new Date(unixTime).toLocaleString(locale);
}
function lts(unixTime = Date.now()) {
	return new Date(unixTime).toLocaleTimeString(locale);
}
function lds(unixTime = Date.now()) {
	return new Date(unixTime).toLocaleDateString(locale);
}

export const time = {
	unix,
	iso,
	utc,
	ls,
	lts,
	lds,
};
