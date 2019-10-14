/* Trig Library */
export function d2r(deg) {
	return deg*(Math.PI/180);
};
export function r2d(rad) {
	let calc = rad*(180/Math.PI);
	calc = (calc < 0)		? (calc+360) : calc;
	calc = (calc > 360) ? (calc-360) : calc;
	return calc;
};