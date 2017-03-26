function enforce() {
}
class Matrix {

	/**
	 * Constructor for Matrix class
	 * @param {Number} height
	 * @param {Number} width
	 * @param {Array} data
	 */
	constructor(height = 0, width = 0, data = null) {
		this._onChangeListeners = [];

		this.width = width;
		this.height = height;
		if (!data) {
			this.elements = [];
			for (let i = 0; i < width * height; i++) {
				this.elements.push(0);
			}
		}
		else {
			this.elements = data;
		}

	}

	get isMatrx() {
		return true;
	}

	/**
	 * Adds a row to the current Matrix
	 * @param {Array} row
	 */
	addRow(row) {
		if (row.length !== this.width) {
			throw new Error('In order to add a row to a Matrix, it must have the same length as Matrix width');
		}

		this.height++;
		this.elements = this.elements.concat(row);
		this._callOnChanged(enforce);
		return this;
	}

	/**
	 * Adds a column to the current Matrix
	 * @param {Array} col
	 */
	addCol(col) {
		if (col.length !== this.height) {
			throw new Error('In order to add a column to a Matrix, it must have the same length as Matrix height');
		}

		for (let i = 0; i < this.height; i++) {
			this.elements.splice(this.width * i, 0, col[i]);
		}
		this._callOnChanged(enforce);
		return this;
	}

	/**
	 * Creates a new Matrix that is identical to this one
	 * @returns {Matrix} this
	 */
	clone() {
		return new this.constructor(this.width, this.height, this.elements);
	}

	/**
	 * Gets element i,j of the matrix
	 * @param {Number} i
	 * @param {Number} j
	 * @returns {Number}
	 */
	get(i, j) {
		return this.elements[i * this.width + j];
	}


	/**
	 * Sets element i,j of the matrix to val
	 * @param {Number} i
	 * @param {Number} j
	 * @param {Number} val
	 * @returns {Matrix} this
	 */
	set(i, j, val) {
		this.elements[i * this.width + j] = val;
		this._callOnChanged(enforce);
		return this;
	}

	/**
	 * Gets a row of the current matrix as an array
	 * @param {Number} row
	 * @returns {Array} row
	 */
	getRow(row) {
		return this.elements.slice(this.width * row, this.width * (row + 1));
	}

	/**
	 * Gets a column of the current matrix as an array
	 * @param {Number} col
	 * @returns {Array} column
	 */
	getCol(col) {
		const res = [];
		for (let i = 0; i < this.height; i++) {
			res.push(this.get(i, col));
		}
		return res;
	}

	/**
	 * Gets all the rows of the given matrix in an array
	 * @return {Array}
	 */
	getRows() {
		const res = [];
		for (let i = 0; i < this.height; i++) {
			res.push(this.getRow(i));
		}
		return res;
	}

	/**
	 * adds a the given matrix to the current matrix
	 * and returns a new matrix that is the sum
	 * @param {Matrix} b
	 * @return {Matrix}
	 */
	add(b) {
		if (this.width !== b.width || this.height !== b.height) {
			throw new Error('In order to add two matrices their width and height must be the same');
		}
		const res = new this.constructor(this.height, this.width);
		for (let i in this.elements) {
			res.elements[i] = this.elements[i] + b.elements[i];
		}

		res._callOnChanged(enforce);
		return res;
	}

	/**
	 * Adds val to element i,j of the matrix
	 * @param {Number} i
	 * @param {Number} j
	 * @param {Number} val
	 * @returns {Matrix} this
	 */
	addTo(i, j, val) {
		this.set(i, j, this.get(i, j) + val);
		this._callOnChanged(enforce);
		return this;
	}

	/**
	 * Transposes the current matrix
	 * @return {Matrix} transposed matrix
	 */
	transpose() {
		const res = new this.constructor(this.width, this.height);
		for (let i = 0; i < this.height; i++) {
			for (let j = 0; j < this.width; j++) {
				res.set(j, i, this.get(i, j));
			}
		}
		return res;
	}

	/**
	 * Multiplies the current matrix with b, writes the
	 * result into a new matrix and returns it
	 * @param {Matrix} b
	 * @returns {Matrix}
	 */
	mult(b) {
		if (this.width !== b.height) {
			throw new Error('In order to multiply matrices the number of columns in the first one must be equal to the number of rows in the second one!');
		}
		const res = new this.constructor(this.height, b.width);
		for (let i = 0; i < res.height; i++) {
			for (let j = 0; j < res.width; j++) {
				res.set(i, j, 0);
				for (let g = 0; g < b.height; g++) {
					res.addTo(i, j, this.get(i, g) * b.get(g, j));
				}
			}
		}

		return res;
	}

	/**
	 * Writes the content of the matrix to a string
	 * uses linebreak as a line breaking character
	 * @param {String} lineBreak
	 * @returns {string}
	 */
	toString(lineBreak = '<br>') {
		let res = '';
		for (let i = 0; i < this.height; i++) {
			for (let j = 0; j < this.width; j++) {
				res += this.get(i, j) + ' ';
			}
			res += lineBreak;
		}
		return res;
	}

	/**
	 * Prints the current matrix to the console
	 * using console.table()
	 * @returns {Matrix} this
	 */
	printToTable() {
		const tmp = [];
		for (let i = 0; i < this.height; i++) {
			tmp.push(this.elements.slice(this.width * i, this.width * (i + 1)));
		}
		console.table(tmp);
		return this;
	}

	/**
	 * Calls the given function for every element
	 * of the matrix, passes (currentValue, i, j, this)
	 * @param {function} fcn
	 * @returns {Matrix} this
	 */
	forEach(fcn) {
		for (let i = 0; i < this.height; i++) {
			for (let j = 0; j < this.width; j++) {
				fcn.bind(this)(this.get(i, j), i, j, this);
			}
		}
		this._callOnChanged(enforce);
		return this;
	}

	/**
	 * Calles all onchange event listeners
	 * @param {function} e
	 * @private
	 */
	_callOnChanged(e) {
		if (e !== enforce) {
			throw new Error('_callOnChanged function is a private function, it cannot be called from the outside of class Matrix');
		}
		for (let i in this._onChangeListeners) {
			this._onChangeListeners[i].bind(this)(this);
		}
	}

	/**
	 * Adds fcn to the list of onchange Listeners
	 * Whenever the matrix is modified fcn will be called
	 * @param {function} fcn
	 * @returns {Matrix} this
	 */
	onChange(fcn) {
		this._onChangeListeners.push(fcn);
		return this;
	}

	/**
	 * Creates an identity matrix with width size and height size
	 * @param {Number} size
	 * @returns {Matrix}
	 */
	static Identity(size) {
		const res = new this.constructor(size, size);
		for (let i = 0; i < size; i++) {
			res.set(i, i, 1);
		}
		return res;
	}

}