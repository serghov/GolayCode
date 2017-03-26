/**
 * Created by serg on 3/26/17.
 */
const decode = (vector) => {
	const mVec = new BinaryMatrix(1, vector.length, vector);
	const syndrome = mVec.mult(H.transpose());

	logToDocument(GolayCode.H.transpose().toString());
	logToDocument(mVec.toString());
	logToDocument(syndrome.toString());

	console.log(syndrome.getRow(0));
};

document.addEventListener("DOMContentLoaded", (event) => {

	document.getElementById('randomVector').addEventListener('click', () => {
		const randomInput = [];
		for (let i = 0; i < 12; i++) {
			randomInput.push(parseInt(Math.random() * 2));
		}
		document.getElementById('inputVector').value = randomInput.join(', ');
	});

	document.getElementById('encodeButton').addEventListener('click', () => {
		const inputVector = document.getElementById('inputVector').value.split(',').map(x => parseInt(x));
		if (inputVector.length !== 12) {
			alert('The current implementation only support 24/12 golay codes!');
			return;
		}
		const encodedRes = GolayCode.encode(inputVector);
		document.getElementById('encodedVector').value = encodedRes.join(', ');
	});


	document.getElementById('addNoiseButton').addEventListener('click', () => {
		const randomNoise = noiseVector(24, 4);
		const output = document.getElementById('encodedVector').value.split(',').map(x => parseInt(x));
		document.getElementById('transmittedVector').value = modTwo(addVectors(randomNoise.vec, output)).join(', ');
		document.getElementById('curruptedBits').innerText = randomNoise.noise;
		if (randomNoise.noise > 3) {
			document.getElementById('message').innerText = 'Golay code may not be able to fix this many errors';
		}
		else {
			document.getElementById('message').innerText = '';
		}

	});

	document.getElementById('decodeButton').addEventListener('click', () => {
		const input = document.getElementById('transmittedVector').value.split(',').map(x => parseInt(x));

		document.getElementById('decodedVector').value = GolayCode.decode(input).join(', ');
	});

	GolayCode.addLogHandler(logToDocument);
});

const logToDocument = (...args) => {
	const logDiv = document.getElementById('log');

	logDiv.innerHTML = '<tr><td>' + args.map(x => x.toString()).join(' ') + '</tr></td>' + logDiv.innerHTML;
};
