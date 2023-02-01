import { sleep } from '../lib/sleep.js';
import Time from '../lib/time/Time.js';
import { SEC, MIN, HOUR, DAY, WEEK, MONTH, YEAR, KB, MB, GB, TB } from '../lib/constants.js';
import {
	BadRequest,
	Unauthorized,
	PaymentRequired,
	Forbidden,
	NotFound,
	Conflict,
	InternalError,
	NotImplemented,
	Unavailable,
} from '../lib/errors.js';

export function mixinGlobal() {
	global.sleep = sleep;
	global.Time = Time;
	global.BadRequest = BadRequest;
	global.Unauthorized = Unauthorized;
	global.PaymentRequired = PaymentRequired;
	global.Forbidden = Forbidden;
	global.NotFound = NotFound;
	global.Conflict = Conflict;
	global.InternalError = InternalError;
	global.NotImplemented = NotImplemented;
	global.Unavailable = Unavailable;

	Object.assign(global, { SEC, MIN, HOUR, DAY, WEEK, MONTH, YEAR, KB, MB, GB, TB });

	// Add application constants if exists
	try {
		import('../../app/cs.js');
	} catch (err) {}
	try {
		import('../../app/debug.js');
	} catch (err) {}
}
