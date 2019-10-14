import * as trig from 'trig';

export class RegularPoly {
	// Instantiation
	constructor (data) {
		let that = this;
		that.origin     = {x: null, y: null};
		that.radius     = null;
		that.sideCount  = null;
		that.sideDegree = null;
		that.sideLength = null;
		that.apothem    = null;
		// that.rotation= 0;
		try {
			that.moveTo(data.origin);
			that.setRadius(data.radius);
			that.setSideCount(data.sideCount);
			that.calcSideDegree();
			that.calcSideLength();
			that.calcApothem();
		} catch(err) {
			alert(`ERROR: ${err}`);
		} finally {
			return true;
		}
	};
// Origin
	moveTo(xyObj) {
		let that = this;
		that.origin.x = xyObj.x;
		that.origin.y = xyObj.y;
	};
	getPosition() {
		let that = this;
		return that.origin;
	};
// Radius
	setRadius(rLen) {
		let that = this;
		that.radius = Math.abs(rLen);
	};
	getRadius() {
		let that = this;
		return that.radius;
	};
	getDiameter() {
		let that = this;
		return that.radius*2;
	};
	getRadiusAtDegree(deg) {
		let that = this;
		let arcDeg = deg-Math.floor( deg/that.sideDegree )*that.sideDegree;
		let arcLen = trig.d2r( that.sideDegree );
		let calc = (Math.cos( arcLen )/Math.cos( trig.d2r( deg )-arcLen ))*that.radius;
		return calc;
	};
// Side Count
	setSideCount(sNum) {
		let that = this;
		that.sideCount = Math.floor( Math.abs( sNum ) );
	};
	getSideCount() {
		let that = this;
		return that.sideCount;
	};
// Side Degree
	calcSideDegree() {
		let that = this;
		that.sideDegree = (360/that.sideCount);
	};
	getSideDegree() {
		let that = this;
		return that.sideDegree;
	};
// Side Length
	calcSideLength() {
		let that = this;
		that.sideLength = (2*Math.sin( that.d2r( that.sideDegree ) ))*that.radius;
	}
	getSideLength() {
		let that = this;
		return that.sideLength;
	};
// Apothem
	calcApothem() {
		let that = this;
		that.apothem = Math.cos( trig.d2r( that.sideDegree*0.5 ) )*that.radius;
	}
	getApothem() {
		let that = this;
		return that.apothem;
	};
// Points
	getPoints() {
		let that = this;
		let points = [];
		for (let t=0; t<360; t+=that.sideDgree) {
			points.push(
				{
					x: that.origin.x+(Math.cos( trig.d2r( t ) )*that.radius),
					y: that.origin.y-(Math.sin( trig.d2r( t ) )*that.radius)
				}
			);
		}
		return points;
	};
// Collision Detection
	collidesWithPoint(pt) {
		let that = this;
		let deltaX = (pt.x-that.origin.x);
		let deltaY = (pt.y-that.origin.y);
		let deltaD = trig.r2d( Math.atan2(deltaY, deltaX) );
		let dist1 = Math.sqrt( (deltaX*deltaX)+(deltaY*deltaY) );
		let dist2 = that.getRadiusAtDegree( deltaD );
		return (dist1 <= dist2);
	};
};