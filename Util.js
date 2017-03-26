/**
 * Calculates the weight(number of non zero elements) in a vector or a matrix
 * @param {Array|Matrix} vec
 * @returns {number}
 */
const weight = (vec) => {
	// not sure about this
	let vector = vec;
	if (vector.isMatrx)
		vector = vector.elements;

	let res = 0;
	for (let i in vector) {
		if (vector[i] !== 0)
			res++;
	}
	return res;
};

/**
 * creates an array of a given length and fills its
 * with elements with given value
 * @param {Number} length
 * @param value
 * @return {Array}
 */
const makeArray = (length, value = 0) => {
	const res = [];
	for (let i = 0; i < length; i++) {
		res.push(value);
	}
	return res;
};

/**
 * adds two vectors together elementwise
 * @param {Array} a
 * @param {Array} b
 * @return {Array}
 */
const addVectors = (a, b) => {
	if (a.length !== b.length) {
		throw new Error('Vectors must have the same length');
	}

	const res = [];
	for (let i in a) {
		res[i] = a[i] + b[i];
	}
	return res;
};

/**
 * Calculates mod two of a vector
 * @param vec
 * @return {Array}
 */
const modTwo = (vec) => {
	return vec.map(x => x % 2);
};

/**
 * creates a new vector of 0s in all positions
 * except position n where it has a value of 1
 * @param {Number} size
 * @param {Number} n
 * @return {Array}
 */
const eyeVector = (size, n) => {
	const res = [];
	for (let i = 0; i < size; i++) {
		res[i] = (i == n) + 0;
	}
	return res;
};

/**
 * Creates a vector of given size filled with 0s
 * except random position of given count
 * @param {Number} size
 * @param {Number} noise
 * @return {{vec: Array, noise: Number}}
 */
const noiseVector = (size, noise) => {
	let res = [];
	let noiseAmount = 0;
	for (let i = 0; i < size; i++) {
		if (Math.random() * size < noise) {
			res.push(1);
			noiseAmount++;
		}
		else {
			res.push(0);
		}
	}
	return {vec: res, noise: noiseAmount};
};