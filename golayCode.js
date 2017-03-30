class GolayCode {
    constructor() {
        throw new Error('Golay code is not an instantiatable class, use static methods instead');
    }

    static encode(vec) {
        if (!vec.isBinaryMatrix) {
            vec = new BinaryMatrix(1, 12, vec);
        }
        const mRes = vec.mult(GolayCode.G);
        return mRes.getRow(0);
    }

    static decode(vec) {
        let u = null;

        if (!vec.isBinaryMatrix) {
            vec = new BinaryMatrix(1, 24, vec);
        }

        // step 1
        GolayCode.Log('Step 1');
        const syndrome = vec.mult(GolayCode.H.transpose()).getRow(0);
        GolayCode.Log('Calculated Syndrome', syndrome.join(', '));

        vec = vec.getRow(0);

        // step 2
        const syndromeWeight = weight(syndrome);
        GolayCode.Log('Step 2');
        GolayCode.Log('Syndrome weight is', syndromeWeight);

        if (syndromeWeight <= 3) {
            GolayCode.Log('Syndrome weight is less than or equal to 3, solution found!');
            u = syndrome.concat(makeArray(12));
            return modTwo(addVectors(u, vec));
            //return u;
        }

        // step 3
        GolayCode.Log('Step 3');

        const bRows = GolayCode.B.getRows();
        for (let i in bRows) {
            const cur = modTwo(addVectors(syndrome, bRows[i]));
            if (weight(cur) <= 2) {
                GolayCode.Log(`B_${i} is a good match, the weight of S+B_${i} is ${weight(cur)} <= 2`);
                u = cur.concat(eyeVector(12, i));
                return modTwo(addVectors(u, vec));
                //return u;
            }
        }

        // step 4
        GolayCode.Log('Step 4');

        const secondSyndrome = new BinaryMatrix(1, syndrome.length, syndrome).mult(GolayCode.B).getRow(0);
        GolayCode.Log('Calculated second syndrome, it is ', secondSyndrome);

        // step 5
        GolayCode.Log('Step 5');

        if (weight(secondSyndrome) <= 3) {
            GolayCode.Log(`Second syndrome weight is ${weight(secondSyndrome)} <= 3`);
            u = makeArray(12).concat(secondSyndrome);
            return modTwo(addVectors(u, vec));
            //return u;
        }

        // step 6
        GolayCode.Log('Step 6');

        for (let i in bRows) {
            const cur = modTwo(addVectors(secondSyndrome, bRows[i]));
            if (weight(cur) <= 2) {
                GolayCode.Log(`B_${i} is a good match, the weight of SS+B_${i} is ${weight(cur)} <= 2`);
                u = eyeVector(12, i).concat(cur);
                return modTwo(addVectors(u, vec));
                //return u;
            }
        }

        // step 7
        GolayCode.Log('Step 7');
        GolayCode.Log('Cant find solution, data is too corrupted');
        return [];

    }

    static Log(...args) {
        for (let i in GolayCode.logHandlers) {
            GolayCode.logHandlers[i](...args);
        }
    }

    static addLogHandler(fcn) {
        GolayCode.logHandlers.push(fcn);
    }

}

GolayCode.logHandlers = [];

GolayCode.H = new BinaryMatrix(0, 24);

GolayCode.H.addRow([1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 1, 0, 0, 0, 1, 0, 1]);
GolayCode.H.addRow([0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 0, 0, 0, 1, 0, 1, 1]);
GolayCode.H.addRow([0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 0, 1, 1, 1]);
GolayCode.H.addRow([0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 0, 1, 1, 0, 1]);
GolayCode.H.addRow([0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 1, 1, 0, 1, 1]);
GolayCode.H.addRow([0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 1, 0, 1, 1, 1]);
GolayCode.H.addRow([0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 1, 1, 1, 1]);
GolayCode.H.addRow([0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1]);
GolayCode.H.addRow([0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 1, 0, 1, 1, 1, 0, 0, 1]);
GolayCode.H.addRow([0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1, 1, 0, 0, 0, 1]);
GolayCode.H.addRow([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 0, 1, 1, 1, 0, 0, 0, 1, 1]);
GolayCode.H.addRow([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0]);

GolayCode.G = new BinaryMatrix(0, 24);

GolayCode.G.addRow([1, 1, 0, 1, 1, 1, 0, 0, 0, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
GolayCode.G.addRow([1, 0, 1, 1, 1, 0, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
GolayCode.G.addRow([0, 1, 1, 1, 0, 0, 0, 1, 0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
GolayCode.G.addRow([1, 1, 1, 0, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0]);
GolayCode.G.addRow([1, 1, 0, 0, 0, 1, 0, 1, 1, 0, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0]);
GolayCode.G.addRow([1, 0, 0, 0, 1, 0, 1, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0]);
GolayCode.G.addRow([0, 0, 0, 1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0]);
GolayCode.G.addRow([0, 0, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0]);
GolayCode.G.addRow([0, 1, 0, 1, 1, 0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0]);
GolayCode.G.addRow([1, 0, 1, 1, 0, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0]);
GolayCode.G.addRow([0, 1, 1, 0, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0]);
GolayCode.G.addRow([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1]);

GolayCode.B = new BinaryMatrix(0, 12);

GolayCode.B.addRow([1, 1, 0, 1, 1, 1, 0, 0, 0, 1, 0, 1]);
GolayCode.B.addRow([1, 0, 1, 1, 1, 0, 0, 0, 1, 0, 1, 1]);
GolayCode.B.addRow([0, 1, 1, 1, 0, 0, 0, 1, 0, 1, 1, 1]);
GolayCode.B.addRow([1, 1, 1, 0, 0, 0, 1, 0, 1, 1, 0, 1]);
GolayCode.B.addRow([1, 1, 0, 0, 0, 1, 0, 1, 1, 0, 1, 1]);
GolayCode.B.addRow([1, 0, 0, 0, 1, 0, 1, 1, 0, 1, 1, 1]);
GolayCode.B.addRow([0, 0, 0, 1, 0, 1, 1, 0, 1, 1, 1, 1]);
GolayCode.B.addRow([0, 0, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1]);
GolayCode.B.addRow([0, 1, 0, 1, 1, 0, 1, 1, 1, 0, 0, 1]);
GolayCode.B.addRow([1, 0, 1, 1, 0, 1, 1, 1, 0, 0, 0, 1]);
GolayCode.B.addRow([0, 1, 1, 0, 1, 1, 1, 0, 0, 0, 1, 1]);
GolayCode.B.addRow([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0]);

