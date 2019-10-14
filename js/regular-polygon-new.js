/*
The important thing to understand is that this is just data.
We don't need to actually design the class to "physically" model the polygon
*/

// Weak maps must be applied to individual arguments not an entire object reference
let _regpoly = new WeakMap();

class RegularPolygon {
  _radius;
  _sides;
  constructor(radiusLength, numberOfSides) {
    this._radius = radiusLength;
    this._sides = numberOfSides;
  }
  
  // We must set before we can get
  // Use get and set to define roles of functions

  set radius(radiusLength) {
    // the properties and get/set method names must be different
    // the properties are internal to the class instance
    // the methods are public to outside code
    this._radius = radiusLength;
  }
  get radius() {
    return this._radius;
  }

  set sides(numberOfSides) {
    this._sides = numberOfSides;
  }
  get sides() {
    return this._sides;
  }
}

test = new RegularPolygon(100, 6);