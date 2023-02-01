declare function unix(): number;
declare function iso(unixTime: number): string;
declare function utc(unixTime: number): string;
declare function ls(unixTime: number): string;
declare function lts(unixTime: number): string;
declare function lds(unixTime: number): string;

export const time = {
	unix: typeof unix,
	iso: typeof iso,
	utc: typeof utc,
	ls: typeof ls,
	ults: typeof lts,
	lds: typeof lds,
};
