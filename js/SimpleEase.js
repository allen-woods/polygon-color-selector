// Easing Functions
export function in(frame, numFrames, tightness) {
	let t1 = -(1/(Math.pow(numFrames, tightness)+1));
	let t2 =  (1/(Math.pow((numFrames-frame), tightness)+1));
	let t3 = (1/(1+t1));
	return ((t1+t2)*t3);
};
export function out(frame, numFrames, tightness) {
	let t1 = -(1/(Math.pow(numFrames, tightness)+1));
	let t2 =  (1/(Math.pow(frame, tightness)+1));
	let t3 = (1/(1+t1));
	return 1-((t1+t2)*t3);
};