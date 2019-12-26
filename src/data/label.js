/**
 * Garbled circuit label data structure.
 * @module src/data/label
 */

const crypto = require('../utils/crypto.js');
const random = require('../utils/random.js');

const bytes = 8;
const labels = [];

/**
 * Create label object; prototype is used for methods to save memory.
 * @param {number} init - Initial value.
 * @returns {Uint8Array} The label object.
 */
var Label = function (init) {
  if (init == null) {
    init = bytes + 1;
  } else if (typeof(init) === 'string') {
    init = JSON.parse(init);
  } else if (init instanceof Uint8Array) {
    init = JSON.parse('['+init+']');
  }
  if (init.length === bytes) {
    init.concat(0);
  }

  return Reflect.construct(Uint8Array, [init], Label);
};

// Add Uint8Array features to label objects.
Reflect.setPrototypeOf(Label.prototype, Uint8Array.prototype);

/**
 * Generate a new random unused label.
 * @param {number} length - Length of the label
 * @param {number} bits - Number of bits in individual values
 * @returns {Object} The random label as a Label object.
 */
function randomLabel(length, bits) {
  if (length == null) {
    length = random.bytes;
  }
  if (bits == null) {
    bits = 8;
  }

  var l = new Label();
  for (var i = 0; i < length; i++) {
    l[i] = random.random_with_replacement(bits);
  }
  labels.unshift(l.toString());
  return (labels.lastIndexOf(l.toString()) === 0)? l : randomLabel(length);
}

/**
 * Create JSON string representation of label object.
 * @param {Object} l - The label object to turn into a JSON string
 * @returns {string} JSON representation of label in string format
 */
Label.prototype.stringify = function (l = this) {
  var json = '[';
  for (var i = 0; i < l.length - 1; i++) {
    json += l[i] + ',';
  }
  json += l[i] + ']';
  return json;
};

/**
 * Create JSON representation of label object (an array of numbers).
 * @param {Object} l - Label object to turn into a JSON array of numbers
 * @returns {number[]} JSON representation of label as array of numbers
 */
Label.prototype.toJSON = function (label = this) {
  var array = [];
  for (var i = 0; i < label.length; i++) {
    array[i] = label[i];
  }
  return array;
};

/**
 * Build a label from a string representation.
 * @param {string} raw - String representing a label
 * @returns {Object} Label represented by the string
 */
Label.prototype.fromString = function (raw) {
  return JSON.parse(raw);
};

/**
 * ???
 * @param {Object} point - ???
 * @returns {???} ???
 */
Label.prototype.pointer = function (point) {
  return this[bytes] = (point == null) ? this[bytes] : point;
};

/**
 * ???
 * @param {Object} point - ???
 * @returns {Object} Updated label object.
 */
Label.prototype.point = function (point) {
  this.pointer(point);
  return this;
};

/**
 * Compute XOR of this label object and another object.
 * @param {Object} b - The other label object.
 * @returns {Array} Result of XOR operation.
 */
Label.prototype.xor = function (b) {
  return crypto.xor_array(this, b, this.length);
};

module.exports = {
  Label: Label,
  randomLabel: randomLabel
};