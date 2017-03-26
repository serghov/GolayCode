function enforce() {
}
class BinaryMatrix extends Matrix {
	constructor(...args) {
		super(...args);
		this.onChange(binarize);
	}

	get isBinaryMatrix() {
		return true;
	}
}

/**
 * Converts a matrix into a binary matrix
 * @param {Matrix} matrix
 */
function binarize(matrix) {
	for (let i in matrix.elements) {
		matrix.elements[i] %= 2;
	}
}