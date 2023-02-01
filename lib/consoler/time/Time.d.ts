declare function unix(): number;
declare function iso(unixTime: number): string;
declare function utc(unixTime: number): string;
declare function ls(unixTime: number): string;
declare function lts(unixTime: number): string;
declare function lds(unixTime: number): string;

export class {
	static unix: typeof unix;
	static iso: typeof iso;
	static utc: typeof utc;
	static ls: typeof ls;
	static ults: typeof lts;
	static lds: typeof lds;
}
