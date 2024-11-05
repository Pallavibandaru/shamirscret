// Input JSON
const jsonInput = `{
    "keys": {
        "n": 9,
        "k": 6
    },
    "1": {
        "base": "10",
        "value": "28735619723837"
    },
    "2": {
        "base": "16",
        "value": "1A228867F0CA"
    },
    "3": {
        "base": "12",
        "value": "32811A4AA0B7B"
    },
    "4": {
        "base": "11",
        "value": "917978721331A"
    },
    "5": {
        "base": "16",
        "value": "1A22886782E1"
    },
    "6": {
        "base": "10",
        "value": "28735619654702"
    },
    "7": {
        "base": "14",
        "value": "71AB5070CC4B"
    },
    "8": {
        "base": "9",
        "value": "122662581541670"
    },
    "9": {
        "base": "8",
        "value": "642121030037605"
    }
}`;

// Step 1: Parse the JSON
const input = JSON.parse(jsonInput);

// Step 2: Decode the y values from the provided base
const points = [];

for (let key in input) {
  if (input.hasOwnProperty(key) && key !== "keys") {
    const base = parseInt(input[key].base);
    const value = input[key].value;

    // Decode the value from the given base
    const y = parseInt(value, base);

    // Convert the key to integer for x value and add to points array
    points.push({ x: parseInt(key), y });
  }
}

// Print the decoded points
console.log("Decoded points:", points);

// Step 3: Use only the first 3 points for simplicity and solve for ax^2 + bx + c
const x1 = points[0].x,
  y1 = points[0].y;
const x2 = points[1].x,
  y2 = points[1].y;
const x3 = points[2].x,
  y3 = points[2].y;

// Matrix representation of the system of equations
// [x1^2  x1  1] [a] = [y1]
// [x2^2  x2  1] [b]   [y2]
// [x3^2  x3  1] [c]   [y3]

function solveForCoefficients(x1, y1, x2, y2, x3, y3) {
  // Define the matrix
  const A = [
    [x1 * x1, x1, 1],
    [x2 * x2, x2, 1],
    [x3 * x3, x3, 1],
  ];

  const B = [y1, y2, y3];

  // Function to perform Gaussian elimination
  function gaussianElimination(A, B) {
    const n = B.length;

    for (let i = 0; i < n; i++) {
      // Make the diagonal contain all 1's
      let alpha = A[i][i];
      for (let j = 0; j < n; j++) {
        A[i][j] /= alpha;
      }
      B[i] /= alpha;

      // Make the elements below the diagonal 0's
      for (let k = i + 1; k < n; k++) {
        const beta = A[k][i];
        for (let j = 0; j < n; j++) {
          A[k][j] -= beta * A[i][j];
        }
        B[k] -= beta * B[i];
      }
    }

    // Back substitution
    const X = new Array(n).fill(0);
    for (let i = n - 1; i >= 0; i--) {
      X[i] = B[i];
      for (let j = i + 1; j < n; j++) {
        X[i] -= A[i][j] * X[j];
      }
    }

    return X;
  }

  // Solve for a, b, c
  const [a, b, c] = gaussianElimination(A, B);
  return { a, b, c };
}

// Step 4: Solve for a, b, c using the first 3 points
const { a, b, c } = solveForCoefficients(x1, y1, x2, y2, x3, y3);

// Step 5: Output the constant c
console.log(`c value is: ${c}`);
