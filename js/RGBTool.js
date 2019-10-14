import * as RegularPoly from 'regular-poly';

function isolateColor(radians, xOffset) {
  colorGraph = 1 - (0.5 + Math.cos(3 * radians) * 0.5)

  outerBound = 0.5 + Math.cos(radians + xOffset) * 0.5
  innerBound = outerBound - 1

  outerSquare = Math.sign( Math.max(outerBound, 0) )
  innerSquare = Math.sign( Math.max(innerBound, 0) )

  isolatedColor = innerSquare + ((outerSquare - innerSquare) * colorGraph)

  // Returns the isolated color in terms of the unit interval [0,1]
  return isolatedColor
}

function isolateRed( radians ) {
  return isolateColor( radians, 0 );
}

function isolateGreen( radians ) {
  return isolateColor( radians, (4 * Math.PI)/3 );
}

function isolateBlue( radians ) {
  return isolateColor( radians, (8 * Math.PI)/3 );
}

class RegularPoly {
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
// Dirty Trig (Just to make it work somehow for demo purposes)
  d2r( deg ) {
    return deg*(Math.PI/180);
  }

  r2d( rad ) {
    let calc = rad*(180/Math.PI);
    calc = (calc < 0)		? (calc+360) : calc;
    calc = (calc > 360) ? (calc-360) : calc;
    return calc;
  }
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
    
    let theta = that.d2r( deg )
    let sectorMeasure = (Math.PI / (that.sideCount * 0.5))
    let sectorNum = Math.floor(theta / sectorMeasure)
    let term_1 = (Math.cos(Math.PI / that.sideCount))
    let term_2 = (Math.cos(theta - sectorNum*sectorMeasure))-(Math.PI/that.sideCount)
    let calc = term_1 / term_2

		return calc * that.radius
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
		that.apothem = Math.cos( that.d2r( that.sideDegree*0.5 ) )*that.radius;
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
					x: that.origin.x+(Math.cos( that.d2r( t ) )*that.radius),
					y: that.origin.y-(Math.sin( that.d2r( t ) )*that.radius)
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
		let deltaD = that.r2d( Math.atan2(deltaY, deltaX) );
		let dist1 = Math.sqrt( (deltaX*deltaX)+(deltaY*deltaY) );
		let dist2 = that.getRadiusAtDegree( deltaD );
		return (dist1 <= dist2);
	};
};

// // // // // // // // // // // // // // // // // // // // // // // // //

class RGBTool {
	constructor(destElement, numSides, radiusLen, debugEnabled) {
		if (destElement && destElement.constructor.name.indexOf(`HTML`)!==(-1)) {
			let that = this;
			that.DEBUG = (debugEnabled===true) ? debugEnabled : false; //must be passed true to debug

			radiusLen += (radiusLen%2===0) ? 0.5 : 0; // we must force a pixel at the center

			/* UI data */
			that.ui = {
				state: 0,
				parentObj: destElement,
				containerObj: document.createElement(`div`),
				swatchObj: document.createElement(`canvas`),
				swatch_ctx: null,
				swatch: new RegularPoly(
					{
						origin: {x: radiusLen, y: radiusLen},
						radius: radiusLen,
						sideCount: numSides
					}
				),
				selectObj: document.createElement(`canvas`),
				select_ctx: null,
				select: new RegularPoly(
					{
						origin: {x: radiusLen, y: radiusLen},
						radius: (radiusLen/6),
						sideCount: numSides
					}
				),
				select_color: null,
				mouseOffset: null
			};
		/* inject the CSS needed for this class */
			that.appendCSS();
		/* Scale and style the canvas objects */
			that.initSwatch();
			that.initSelect();
		/* render the swatch */
			that.renderSwatch();
		/* conditionally render the select on mousemove or mousedown */
			//that.renderSelect();
		/* style the container */
			//that.initContainer();
		/* register all of the event listeners */
			that.startListening();
		/* append all of the elements */
			that.appendUI();
		/* Fade in */
			that.reveal();
		}
  };
  
  d2r( deg ) {
    return deg*(Math.PI/180);
  }
  r2d( rad ) {
    let calc = rad*(180/Math.PI);
    calc = (calc < 0)		? (calc+360) : calc;
    calc = (calc > 360) ? (calc-360) : calc;
    return calc;
  }

	appendCSS() {
		// stuff
	};

	initSwatch() {
		let that = this;
		that.ui.swatch_ctx = that.ui.swatchObj.getContext('2d');
		that.ui.swatchObj.setAttribute(`width`,		`${that.ui.swatch.getDiameter()}`);
		that.ui.swatchObj.setAttribute(`height`,	`${that.ui.swatch.getDiameter()}`);
		that.ui.swatchObj.classList.add('rgb_tool_canvas');
		that.ui.swatchObj.classList.add('rgb_tool_bg');
	};

	initSelect() {
		let that = this;
		that.ui.select_ctx = that.ui.selectObj.getContext('2d');
		that.ui.selectObj.setAttribute(`width`,		`${that.ui.swatch.getDiameter()}`);
		that.ui.selectObj.setAttribute(`height`,	`${that.ui.swatch.getDiameter()}`);
		that.ui.selectObj.classList.add('rgb_tool_canvas');
		that.ui.swatchObj.classList.add('rgb_tool_fg');
		that.ui.mouseOffset = that.ui.selectObj.getBoundingClientRect();
	};

	renderSwatch() {
		let that = this;
		try {
			if (!!that.ui.swatch_ctx) {
				let degMargin = 3;	// define the arc length of the sector being drawn
				for (let deg=0; deg<360; deg+=1) {	// draw one full rotation
					let swatchOrigin = that.ui.swatch.getPosition();
					let fstPt = {x: swatchOrigin.x, y: swatchOrigin.y};
					let lstPt = {x: swatchOrigin.x, y: swatchOrigin.y};
					/*	Center Point Logic:

							This interface requires white to be at the center.
							We must adjust the draw position based on drawing angle to "fill" white in the center.
					*/
					if (deg < 45 || deg >= 315) {
						fstPt.x -= 0.5;
						fstPt.y += 0.5;
						lstPt.x -= 0.5;
						lstPt.y -= 0.5;
					} else if (deg >= 45 && deg < 135) {
						fstPt.x += 0.5;
						fstPt.y += 0.5;
						lstPt.x -= 0.5;
						lstPt.y += 0.5;
					} else if (deg >= 135 && deg < 225) {
						fstPt.x += 0.5;
						fstPt.y -= 0.5;
						lstPt.x += 0.5;
						lstPt.y += 0.5;
					} else if (deg >= 225 && deg < 315) {
						fstPt.x -= 0.5;
						fstPt.y -= 0.5;
						lstPt.x += 0.5;
						lstPt.y -= 0.5;
					}

					// define the radial points of the sector
					let d1 = that.d2r( deg );
					let r1 = that.ui.swatch.getRadiusAtDegree( deg );
					let d1Pt = {
						x: swatchOrigin.x+Math.cos( d1 )*r1,
						y: swatchOrigin.y-Math.sin( d1 )*r1
					};
					let d2 = that.d2r( deg+degMargin );
					let r2 = that.ui.swatch.getRadiusAtDegree( deg+degMargin );
					let d2Pt = {
						x: swatchOrigin.x+Math.cos( d2 )*r2,
						y: swatchOrigin.y-Math.sin( d2 )*r2
					};
					// calculate the color at this angle
					let colorAtDeg = that.getColorAtDegree( deg );
					// define gradient
					let linGrad = that.ui.swatch_ctx.createLinearGradient(d1Pt.x, d1Pt.y, fstPt.x, fstPt.y);
					linGrad.addColorStop(0, colorAtDeg);
					linGrad.addColorStop(1, 'rgb(255, 255, 255)');
					// render the sector
					that.ui.swatch_ctx.fillStyle = linGrad;
					that.ui.swatch_ctx.beginPath();
						that.ui.swatch_ctx.moveTo(fstPt.x,	fstPt.y);
						that.ui.swatch_ctx.lineTo(d1Pt.x,		d1Pt.y);
						that.ui.swatch_ctx.lineTo(d2Pt.x,		d2Pt.y);
						that.ui.swatch_ctx.lineTo(lstPt.x,	lstPt.y);
          that.ui.swatch_ctx.fill();
          console.log(`x=${d1Pt.x}, y=${d1Pt.y}, r=${r1}`);
				}
			}
		} catch (err) {
			alert(`ERROR: ${err}`);
		} finally {
			return true;
		}
	};

	renderSelect() {
		let that = this;
		let localPoints = that.ui.select.getPoints();
		let mouseAngle = mA;
		let mouseRadius = mR;
		let selectedColor = that.getColorAtDegree(mouseAngle, mouseRadius)
		for (let p=0; p<localPoints.length; p++) {
			//that.ui.select_ctx.fillStyle = that.
		}
	};

	styleContainer() {
		// stuff
  };
  
	startListening() {
    // let that = this
    // that.mouseEvent = that.mouseEvent.bind(that);
		// that.ui.canvasObj.addEventListener('mousemove', that.mouseEvent);
	};

  mouseEvent(event) {
    if ( that.ui.swatch.collidesWithPoint({x: event.clientX, y: event.clientY}) ) {

      document.body.backgroundColor = that.getColorAtDegree( )
    }
  }
	appendUI() {
		let that = this;
		that.ui.containerObj.appendChild(that.ui.swatchObj);
		that.ui.containerObj.appendChild(that.ui.selectObj);
		that.ui.parentObj.appendChild(that.ui.containerObj);
	};

	reveal() {
		// do the fading in here
	};

	getColorAtDegree(degreeAngle, radius, pointRadius) {
		let output = null;
		try { // try to calculate

			if (degreeAngle>=0) {
				let d = degreeAngle;
				let colorSine = 0.5 - (Math.cos( 3*(d*(Math.PI/180)) )*0.5);
				/* Red */
				let r = [];
				r.push( (Math.cos( d*(Math.PI/180) )>=0.5) ? 1 : 0);
				r.push( (1+(Math.cos( d*(Math.PI/180) ))>=0.5) ? 1 : 0);
				r.push( ((r[1]-r[0])*colorSine) + r[0] );
				/* Green */
				let g = [];
				g.push( (Math.cos( (d*(Math.PI/180)) - (2*Math.PI/3) )>=0.5) ? 1 : 0 );
				g.push( (1+(Math.cos( (d*(Math.PI/180)) - (2*Math.PI/3) ))>=0.5) ? 1 : 0);
				g.push( ((g[1]-g[0])*colorSine) + g[0] );
				/* Blue */
				let b = [];
				b.push( (Math.cos( (d*(Math.PI/180)) - (4*Math.PI/3) )>=0.5) ? 1 : 0);
				b.push( (1+(Math.cos( (d*(Math.PI/180)) - (4*Math.PI/3) ))>=0.5) ? 1 : 0);
				b.push( ((b[1]-b[0])*colorSine) + b[0] );
				/* Account for distance from white */
				let minVal = 0;
				let scalar = 1;
				if (radius!==undefined && pointRadius!==undefined) {
					if (pointRadius < radius) {
						minVal = (radius-pointRadius)/radius;
						scalar = (1-minVal);
					}
				}
				/* Use array to quickly join rgb triplet for export */
				let colorValues = [
					(minVal*255)+(r[2]*scalar*255),
					(minVal*255)+(g[2]*scalar*255),
					(minVal*255)+(b[2]*scalar*255)
				];
				output = "rgb(" + colorValues.join(", ") + ")";
			}

		} catch(err) {
			alert(`ERROR: ${err}`); // report any errors
		} finally {
			return output; // always return the value
		}
	};
};

let myTestRGBTool1 = new RGBTool(document.body, 6, 100);

// The below code is super messy, but it works.

/*
class RGBTool {
	constructor(destElement, numSides, radiusLen) {
		// We must supply an HTML element to the destElement argument
		if (destElement && destElement.constructor.name.indexOf(`HTML`)!==(-1)) {
			let that = this; // preserve proper scope of "this"
			that.DEBUG = false; // boolean flag for debugging

			that.ui = { // ui object for organizing display elements
				containerObj: destElement, // element where the tool is appended
				wrapperObj: null, // wrapper containing the entire tool interface
				canvasObj: null, // canvas used to draw the swatch
				shape: { // regular polygon of the swatch
					ctx: null,
					origin: {x: null, y: null},
					sides: (numSides && numSides >= 3 && numSides <= 360) ? numSides : 6,
					radius: (radiusLen && radiusLen >= 4.5) ? radiusLen : 57,
					diameter: null
				}
			}
			that.init();
		}
	}

	init() {
		let that = this;
		that.ui.shape.diameter = 2*that.ui.shape.radius;
		that.ui.shape.diameter += !!(that.ui.shape.diameter % 2) ? 0 : 1;
		that.ui.shape.origin.x = that.ui.shape.diameter*0.5;
		that.ui.shape.origin.y = that.ui.shape.diameter*0.5;
		that.ui.wrapperObj = document.createElement(`div`);
		that.ui.wrapperObj.setAttribute(`id`, `rgb_tool_container`);
		that.ui.wrapperObj.setAttribute('style', 'display:inline-block; float:left;');
			that.ui.canvasObj = document.createElement('canvas');
			that.ui.canvasObj.setAttribute(`id`, `rgb_tool_canvas`);
			that.ui.canvasObj.setAttribute(`width`, `${that.ui.shape.diameter}`);
      that.ui.canvasObj.setAttribute(`height`, `${that.ui.shape.diameter}`);
      that.ui.canvasObj.setAttribute('style', 'filter: drop-shadow(2px 4px 3px rgba(0,0,0,1.0)) drop-shadow(-1px -1px 0px rgba(255,255,255,1.0))');
		that.ui.containerObj.appendChild(that.ui.wrapperObj).appendChild(that.ui.canvasObj);
		that.ui.shape.ctx = (that.ui.canvasObj.getContext) ? that.ui.canvasObj.getContext(`2d`) : false;
		that.listen();
		that.renderSwatch();
	}

	listen() {
		let that = this;
		// bind and add event listeners
		that.mouseEvent = that.mouseEvent.bind(that);
		that.ui.canvasObj.addEventListener('mousemove', that.mouseEvent);
	}

	mouseEvent(e) {
		let that = this;
		let rect = e.target.getBoundingClientRect();
		let mouse = {
			x: e.clientX - rect.left,
			y: e.clientY - rect.top
		};
		let delta = {
			x: mouse.x - that.ui.shape.origin.x,
			y: mouse.y - that.ui.shape.origin.y
		};
		let mouseRadius = Math.round( Math.sqrt( (delta.x*delta.x)+(delta.y*delta.y) ) );
		let mouseAngle = Math.atan2(-delta.y, delta.x)*(180/Math.PI);
		mouseAngle = (mouseAngle<0) ? mouseAngle + 360 : mouseAngle;
		let shapeRadius = that.calcPolyRadius( mouseAngle, that.ui.shape.sides, that.ui.shape.radius )
		if (mouseRadius >= 0 && shapeRadius >= 0 && mouseRadius <= shapeRadius) {
			document.body.style.backgroundColor = that.getColorAtDegree( mouseAngle, mouseRadius, shapeRadius );
		} else {
			//document.body.style.backgroundColor = 'rgb(128,128,128)';
		}
	}

	calcPolyRadius(degreeAngle, sideCount, radiusLength) {
		let that = this;
		let output = null;
		try { // try to calculate

			// We must supply a degree, at least 3 sides, and a radius of 4.5 or larger
			if (Math.abs( degreeAngle )>=0 && sideCount>=3 && radiusLength>=4.5) {
				// Step 1: calculate the arc length in degrees
				let arcDegrees = 360 / sideCount;
				// Step 2: calculate the degrees of the apothem
				let apothemDegrees = arcDegrees * 0.5;
				// Step 3: calculate the number of arcs we have already passed through, in degrees
				let offsetDegrees = Math.floor( degreeAngle / arcDegrees ) * arcDegrees;
				// Step 4: calculate the angle between the focal points of the two circles
				let circleCircleDegrees = apothemDegrees + offsetDegrees;
				// Step 5: calculate the starting angle of circle2
				let circle2AngleDegrees = offsetDegrees + arcDegrees + 180;
				// Step 6: constrain circle2AngleDegrees to the range [0, 359] as needed

				circle2AngleDegrees = (circle2AngleDegrees>=360)	? (circle2AngleDegrees-360)	: circle2AngleDegrees;
				circle2AngleDegrees = (circle2AngleDegrees<0)			? (circle2AngleDegrees+360)	: circle2AngleDegrees;
				
				// Step 7: calculate the reverse angle used to trace along circle2
				let circle2ReverseDegrees = circle2AngleDegrees-(degreeAngle-offsetDegrees);
				// Step 8: constrain circle2ReverseDegrees to the range [0, 359] as needed
				
				circle2ReverseDegrees = (circle2ReverseDegrees>=360)	? (circle2ReverseDegrees-360)	: circle2ReverseDegrees;
				circle2ReverseDegrees = (circle2ReverseDegrees<0)			? (circle2ReverseDegrees+360)	: circle2ReverseDegrees;
				
				// Step 9: calculate the apothem of the regular polygon
				let apothem = (radiusLength*Math.cos( apothemDegrees*(Math.PI/180) ));
				// Step 10: store an overshoot value for radius (allows all intersections to be calculated)
				let radiusOvershoot = 5;
				// Step 11: define point locations used in circle intersection
				let pt3 = {
					// circle 1 focal point
					x: that.ui.shape.origin.x,
					y: that.ui.shape.origin.y
				};
				let pt4 = {
					// point of rotation on circle 1
					x: pt3.x + ((radiusLength+radiusOvershoot)*Math.cos( degreeAngle*(Math.PI/180) )),
					y: pt3.y - ((radiusLength+radiusOvershoot)*Math.sin( degreeAngle*(Math.PI/180) ))
				};
				let pt2 = {
					// circle 2 focal point
					x: pt3.x + ((2*apothem)*Math.cos( circleCircleDegrees*(Math.PI/180) )),
					y: pt3.y - ((2*apothem)*Math.sin( circleCircleDegrees*(Math.PI/180) ))
				};
				let pt1 = {
					// point of rotation on circle 2
					x: pt2.x + ((radiusLength+radiusOvershoot)*Math.cos( circle2ReverseDegrees*(Math.PI/180) )),
					y: pt2.y - ((radiusLength+radiusOvershoot)*Math.sin( circle2ReverseDegrees*(Math.PI/180) ))
				};
				// Step 12: calculate for "t" and "u" to find intersection point
				let t =	 ((pt1.x-pt3.x)*(pt3.y-pt4.y)-(pt1.y-pt3.y)*(pt3.x-pt4.x)) / ((pt1.x-pt2.x)*(pt3.y-pt4.y)-(pt1.y-pt2.y)*(pt3.x-pt4.x));
				let u = -((pt1.x-pt2.x)*(pt1.y-pt3.y)-(pt1.y-pt2.y)*(pt1.x-pt3.x)) / ((pt1.x-pt2.x)*(pt3.y-pt4.y)-(pt1.y-pt2.y)*(pt3.x-pt4.x));
				// Step 13: calculate the point of intersection
				let calcPoint = {
					x: (isNaN(t)) ? pt3.x+(u*(pt4.x-pt3.x)) : pt1.x+(t*(pt2.x-pt1.x)),
					y: (isNaN(t)) ? pt3.y+(u*(pt4.y-pt3.y)) : pt1.y+(t*(pt2.y-pt1.y))
				};
				// Step 14: calculate hypotenuse (radius)
				let aSide = pt3.x - calcPoint.x;
				let bSide = pt3.y - calcPoint.y;
				output = Math.sqrt((aSide*aSide) + (bSide*bSide));

				if (degreeAngle===circleCircleDegrees) {
					if (output !== apothem) {
						// require the radius to equal the apothem at the exact angle between both circles
						output = apothem;
					}
					if (that.DEBUG) {
						console.log(`Debug:\n
							deg=${degreeAngle} ***\n
							pt1=(${pt1.x},${pt1.y})\n
							pt2=(${pt2.x},${pt2.y})\n
							pt3=(${pt3.x},${pt3.y})\n
							pt4=(${pt4.x},${pt4.y})\n
							t=${t}\n
							calcPoint=(${calcPoint.x},${calcPoint.y})\n
							a=${aSide}, b=${bSide}, output=${output}`
						);
					}
				}
			}

		} catch(e) {
			alert(`ERROR: ${e}`); // report any error we find
		} finally {
			return output; // always return the result
		}
	}

	getColorAtDegree(degreeAngle, radius1, radius2) {
		let output = 'rgb(0,0,0)';
		try { // try to calculate

			if (degreeAngle>=0) {
				let d = degreeAngle;
				let colorSine = 0.5 - (Math.cos( 3*(d*(Math.PI/180)) )*0.5);
				// Red
				let r = [];
				r.push( (Math.cos( d*(Math.PI/180) )>=0.5) ? 1 : 0);
				r.push( (1+(Math.cos( d*(Math.PI/180) ))>=0.5) ? 1 : 0);
				r.push( ((r[1]-r[0])*colorSine) + r[0] );
				// Green
				let g = [];
				g.push( (Math.cos( (d*(Math.PI/180)) - (2*Math.PI/3) )>=0.5) ? 1 : 0 );
				g.push( (1+(Math.cos( (d*(Math.PI/180)) - (2*Math.PI/3) ))>=0.5) ? 1 : 0);
				g.push( ((g[1]-g[0])*colorSine) + g[0] );
				// Blue
				let b = [];
				b.push( (Math.cos( (d*(Math.PI/180)) - (4*Math.PI/3) )>=0.5) ? 1 : 0);
				b.push( (1+(Math.cos( (d*(Math.PI/180)) - (4*Math.PI/3) ))>=0.5) ? 1 : 0);
				b.push( ((b[1]-b[0])*colorSine) + b[0] );
        // Create RGB array for joining
        let scalarFromEdge = (radius2 - radius1) / radius2
        let scalarFromCenter = (radius1 / radius2)

				let colorValues = [
          (scalarFromEdge * 255) + (r[2] * 255 * scalarFromCenter),
          (scalarFromEdge * 255) + (g[2] * 255 * scalarFromCenter),
          (scalarFromEdge * 255) + (b[2] * 255 * scalarFromCenter)
        ];
				output = "rgb(" + colorValues.join(", ") + ")";
			}

		} catch(e) {
			alert(`ERROR: ${e}`); // report any errors
		} finally {
			return output; // always return the value
		}
	}

	renderSwatch() {
		let that = this;
		try {
			if (!!that.ui.shape.ctx) {
				let degMargin = 3;	// define the arc length of the sector being drawn
				for (let deg=0; deg<360; deg+=1) {	// draw one full rotation
					let fstPt = {x: null, y:null};
					let lstPt = {x: null, y: null};
					//	Center Point Logic:

					//	This interface requires white to be at the center.
					//	We must adjust the draw position based on drawing angle to "fill" white in the center.
					if (deg < 45 || deg >= 315) {
						fstPt.x = that.ui.shape.origin.x-0.5;
						fstPt.y = that.ui.shape.origin.y+0.5;
						lstPt.x = that.ui.shape.origin.x-0.5;
						lstPt.y = that.ui.shape.origin.y-0.5;
					} else if (deg >= 45 && deg < 135) {
						fstPt.x = that.ui.shape.origin.x+0.5;
						fstPt.y = that.ui.shape.origin.y+0.5;
						lstPt.x = that.ui.shape.origin.x-0.5;
						lstPt.y = that.ui.shape.origin.y+0.5;
					} else if (deg >= 135 && deg < 225) {
						fstPt.x = that.ui.shape.origin.x+0.5;
						fstPt.y = that.ui.shape.origin.y-0.5;
						lstPt.x = that.ui.shape.origin.x+0.5;
						lstPt.y = that.ui.shape.origin.y+0.5;
					} else if (deg >= 225 && deg < 315) {
						fstPt.x = that.ui.shape.origin.x-0.5;
						fstPt.y = that.ui.shape.origin.y-0.5;
						lstPt.x = that.ui.shape.origin.x+0.5;
						lstPt.y = that.ui.shape.origin.y-0.5;
					}
					// calculate the ppint locations
					let degPt1 = {
						x: that.ui.shape.origin.x + ((Math.cos( deg*(Math.PI/180) ))*that.calcPolyRadius( deg, that.ui.shape.sides, that.ui.shape.radius )),
						y: that.ui.shape.origin.y - ((Math.sin( deg*(Math.PI/180) ))*that.calcPolyRadius( deg, that.ui.shape.sides, that.ui.shape.radius ))
					}
					let degPt2 = {
						x: that.ui.shape.origin.x + ((Math.cos( (deg+degMargin)*(Math.PI/180) ))*that.calcPolyRadius( (deg+degMargin), that.ui.shape.sides, that.ui.shape.radius )),
						y: that.ui.shape.origin.y - ((Math.sin( (deg+degMargin)*(Math.PI/180) ))*that.calcPolyRadius( (deg+degMargin), that.ui.shape.sides, that.ui.shape.radius ))
					}
          // calculate the color
          let shapeRad = that.calcPolyRadius( deg, that.ui.shape.sides, that.ui.shape.radius );
					let colorAtDeg = that.getColorAtDegree(deg, shapeRad, shapeRad);
					// define the gradient of each sector being drawn
          let linGrad = that.ui.shape.ctx.createLinearGradient(degPt1.x, degPt1.y, fstPt.x, fstPt.y);
					linGrad.addColorStop(0, colorAtDeg);
					linGrad.addColorStop(1, 'rgb(255, 255, 255)');
					// render each sector
					that.ui.shape.ctx.fillStyle = linGrad;
					that.ui.shape.ctx.beginPath();
						that.ui.shape.ctx.moveTo(fstPt.x,		fstPt.y);
						that.ui.shape.ctx.lineTo(degPt1.x,	degPt1.y);
						that.ui.shape.ctx.lineTo(degPt2.x,	degPt2.y);
						that.ui.shape.ctx.lineTo(lstPt.x,		lstPt.y);
					that.ui.shape.ctx.fill();
				}
			}
		} catch (e) {
			alert(`ERROR: ${e}`);
		} finally {
			return true;
		}
	}
};
document.body.style.display = "flex";
document.body.style.alignItems = "center";
document.body.style.justifyContent = "center";
let myTestRGBTool1 = new RGBTool(document.body, 6, 200);
*/