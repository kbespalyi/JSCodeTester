// Transformation matrices
// https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Matrix_math_for_the_web

const initMatrix = [
  1, 0, 0, 0,
  0, 1, 0, 0,
  0, 0, 1, 0,
  0, 0, 0, 1
]

const sin = Math.sin
const cos = Math.cos

/**
 * What does multiplying by the identity matrix look like?
 * The easiest example is to multiply a single point by the identity matrix.
 * Since a 3D point only needs three values (x, y, and z), and the transformation matrix is a 4x4 value matrix,
 * we need to add a fourth dimension to the point. By convention, this dimension is called the perspective,
 * and is represented by the letter w. For a typical position, setting w to 1 will make the math work out.
 * After adding the w component to the point, notice how neatly the matrix and the point line up:
 * [4, 3, 2, 1]  // Point at [x, y, z, w]
 * Check out the WebGL model view projection article (https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_model_view_projection)
 * for a look into how it comes in handy.
 */

 class MatrixTransform {
 
  static identityMatrix() {
    return initMatrix
  }

  // Multiplying a matrix and a point

  // point • matrix
  static multiplyMatrixAndPoint(matrix, point) {
    // Give a simple variable name to each part of the matrix, a column and row number
    const c0r0 = matrix[ 0], c1r0 = matrix[ 1], c2r0 = matrix[ 2], c3r0 = matrix[ 3]
    const c0r1 = matrix[ 4], c1r1 = matrix[ 5], c2r1 = matrix[ 6], c3r1 = matrix[ 7]
    const c0r2 = matrix[ 8], c1r2 = matrix[ 9], c2r2 = matrix[10], c3r2 = matrix[11]
    const c0r3 = matrix[12], c1r3 = matrix[13], c2r3 = matrix[14], c3r3 = matrix[15]
    
    // Now set some simple names for the point
    const x = point[0]
    const y = point[1]
    const z = point[2]
    const w = point[3]
    
    // Multiply the point against each part of the 1st column, then add together
    const resultX = (x * c0r0) + (y * c0r1) + (z * c0r2) + (w * c0r3)
    
    // Multiply the point against each part of the 2nd column, then add together
    const resultY = (x * c1r0) + (y * c1r1) + (z * c1r2) + (w * c1r3)
    
    // Multiply the point against each part of the 3rd column, then add together
    const resultZ = (x * c2r0) + (y * c2r1) + (z * c2r2) + (w * c2r3)
    
    // Multiply the point against each part of the 4th column, then add together
    const resultW = (x * c3r0) + (y * c3r1) + (z * c3r2) + (w * c3r3)
    
    return [resultX, resultY, resultZ, resultW]
  }

  // Multiplying two matrices

  //matrixB • matrixA
  static multiplyMatrices(matrixA, matrixB) {
    // Slice the second matrix up into rows
    const row0 = [matrixB[ 0], matrixB[ 1], matrixB[ 2], matrixB[ 3]]
    const row1 = [matrixB[ 4], matrixB[ 5], matrixB[ 6], matrixB[ 7]]
    const row2 = [matrixB[ 8], matrixB[ 9], matrixB[10], matrixB[11]]
    const row3 = [matrixB[12], matrixB[13], matrixB[14], matrixB[15]]

    // Multiply each row by matrixA
    const result0 = MatrixTransform.multiplyMatrixAndPoint(matrixA, row0)
    const result1 = MatrixTransform.multiplyMatrixAndPoint(matrixA, row1)
    const result2 = MatrixTransform.multiplyMatrixAndPoint(matrixA, row2)
    const result3 = MatrixTransform.multiplyMatrixAndPoint(matrixA, row3)

    // Turn the result rows back into a single matrix
    return [
      result0[0], result0[1], result0[2], result0[3],
      result1[0], result1[1], result1[2], result1[3],
      result2[0], result2[1], result2[2], result2[3],
      result3[0], result3[1], result3[2], result3[3]
    ]
  }

  /**
   * In real production code it would be best to use optimized functions.
   * glMatrix (http://glmatrix.net/) is an example of a library that has a focus on speed and performance.
   * The focus in the glMatrix library is to have target arrays that are allocated before the update loop.
   */

  // Translation matrix

  /**
    * A translation matrix is based upon the identity matrix, and is used in 3D graphics to move a point
    * or object in one or more of the three directions (x, y, and/or z). The easiest way to think of a translation
    * is like picking up a coffee cup. The coffee cup must be kept upright and oriented the same way so that no coffee is spilled.
    * It can move up in the air off the table and around the air in space.
    * Place the distances along the three axes in the corresponding positions in the translation matrix,
    * then multiply it by the point or matrix you need to move through 3D space.
    */

  static translateMatrix(x, y, z) {
    return [
        1,    0,    0,   0,
        0,    1,    0,   0,
        0,    0,    1,   0,
        x,    y,    z,   1
    ]
  }  

  // Scale matrix

  /**
   * A scale matrix makes something larger or smaller in one or more of the three dimensions: width, height, and depth.
   * In typical (cartesian) coordinates. this causes stretching or contracting of the object in the corresponding directions.
   * The amount of change to apply to each of the width, height, and depth is placed diagonally starting at the top-left corner
   * and making their way down toward the bottom-right.
   */
  static scaleMatrix(w, h, d) {
    return [
        w,    0,    0,   0,
        0,    h,    0,   0,
        0,    0,    d,   0,
        0,    0,    0,   1
    ]
  }

  // Rotation matrix

  /**
   * A rotation matrix is used to rotate a point or object.
   * Rotation matrices look a little bit more complicated than scaling and transform matrices.
   * They use trigonometric functions to perform the rotation.
   * While this section won't break the steps down into exhaustive detail (check out this article on Wolfram MathWorld for that),
   * take this example for illustration.
   */

  static distance(point) {
    // Calculate the distance from the origin
    return Math.sqrt(point[0] * point[0] + point[1] * point[1])
  }

  static angleToRadians(angle) {
    return Math.PI / 180 * angle
  }

  static transformedPoint(radians, distance) {
    return [
      cos(radians) * distance,
      sin(radians) * distance
    ]
  }

  /**
   * It is possible to encode these type of steps into a matrix, and do it for each of the x, y, and z dimensions.
   * Below is the representation of a rotation about the X axis:
   */
  // NOTE: There is no perspective in these transformations, so a rotation
  //       at this point will only appear to only shrink the div

  static rotateAroundXAxis(radians) {
    return [
        1,       0,        0,     0,
        0,  cos(radians),  -sin(radians),     0,
        0,  sin(radians),   cos(radians),     0,
        0,       0,        0,     1
    ]
  }

  static rotateAroundYAxis(radians) {
    return [
      cos(radians),   0, sin(radians),   0,
            0,   1,      0,   0,
      -sin(radians),   0, cos(radians),   0,
            0,   0,      0,   1
    ]
  }

  static rotateAroundZAxis(radians) {
    return [
      cos(radians), -sin(radians),    0,    0,
      sin(radians),  cos(radians),    0,    0,
          0,       0,    1,    0,
          0,       0,    0,    1
    ]
  }

  // Matrix composition

  /**
   * The real power of matrices comes from matrix composition.
   * When matrices of a certain class are multiplied together they preserve the history of the transformations
   * and are reversible. This means that if a translation, rotation, and scale matrix are all combined together,
   * when the order of the matrices is reversed and re-applied then the original points are returned.
   * 
   * The order that matrices are multiplied in matters. When multiplying numbers, a * b = c, and b * a = c are both true.
   * For example 3 * 4 = 12, and 4 * 3 = 12. In math these numbers would be described as commutative.
   * Matrices are not guaranteed to be the same if the order is switched, so matrices are non-commutative.
   * 
   * Another mind-bender is that matrix multiplication in WebGL and CSS needs to happen in the reverse order
   * that the operations intuitively happen. For instance, to scale something down by 80%, move it down 200 pixels,
   * and then rotate about the origin 90 degrees would look something like the following in pseudo-code.
   * 
   * transformation = rotate * translate * scale
   * 
   */

  static multiplyArrayOfMatrices(matrices) {
    let inputMatrix = matrices[0]
  
    for(let i=1; i < matrices.length; i++) {
      inputMatrix = MatrixTransform.multiplyMatrices(inputMatrix, matrices[i])
    }
    
    return inputMatrix
  }

  static perspectiveMatrix(fieldOfViewInRadians, aspectRatio, near, far) {
  
    // Construct a perspective matrix
    
    /*
       Field of view - the angle in radians of what's in view along the Y axis
       Aspect Ratio - the ratio of the canvas, typically canvas.width / canvas.height
       Near - Anything before this point in the Z direction gets clipped (resultside of the clip space)
       Far - Anything after this point in the Z direction gets clipped (outside of the clip space)
    */
    
    const f = 1.0 / Math.tan(fieldOfViewInRadians / 2)
    const rangeInv = 1 / (near - far)
   
    return [
      f / aspectRatio, 0,                          0,   0,
      0,               f,                          0,   0,
      0,               0,    (near + far) * rangeInv,  -1,
      0,               0,  near * far * rangeInv * 2,   0
    ]
  }

  static orthographicMatrix(left, right, bottom, top, near, far) {
  
    // Each of the parameters represents the plane of the bounding box
    
    const lr = 1 / (left - right)
    const bt = 1 / (bottom - top)
    const nf = 1 / (near - far)
    
    const row4col1 = (left + right) * lr
    const row4col2 = (top + bottom) * bt
    const row4col3 = (far + near) * nf
    
    return [
       -2 * lr,        0,        0, 0,
             0,  -2 * bt,        0, 0,
             0,        0,   2 * nf, 0,
      row4col1, row4col2, row4col3, 1
    ];
  }

  static normalizeVector(vector) {
    // A utility function to make a vector have a length of 1    
    const length = Math.sqrt(
      vector[0] * vector[0] +
      vector[1] * vector[1] +
      vector[2] * vector[2]
    )
    
    return [
      vector[0] / length,
      vector[1] / length,
      vector[2] / length
    ]
  }

  static normalozeMatrix(matrix) {

    /*
      This function takes the inverse and then transpose of the provided
      4x4 matrix. The result is a 3x3 matrix. Essentially the translation
      part of the matrix gets removed.
    
      https://github.com/toji/gl-matrix
    */
    
    const a00 = matrix[0], a01 = matrix[1], a02 = matrix[2], a03 = matrix[3],
        a10 = matrix[4], a11 = matrix[5], a12 = matrix[6], a13 = matrix[7],
        a20 = matrix[8], a21 = matrix[9], a22 = matrix[10], a23 = matrix[11],
        a30 = matrix[12], a31 = matrix[13], a32 = matrix[14], a33 = matrix[15],
  
        b00 = a00 * a11 - a01 * a10,
        b01 = a00 * a12 - a02 * a10,
        b02 = a00 * a13 - a03 * a10,
        b03 = a01 * a12 - a02 * a11,
        b04 = a01 * a13 - a03 * a11,
        b05 = a02 * a13 - a03 * a12,
        b06 = a20 * a31 - a21 * a30,
        b07 = a20 * a32 - a22 * a30,
        b08 = a20 * a33 - a23 * a30,
        b09 = a21 * a32 - a22 * a31,
        b10 = a21 * a33 - a23 * a31,
        b11 = a22 * a33 - a23 * a32
  
    // Calculate the determinant
    let det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06
  
    if (!det) { 
      return null
    }
    
    det = 1.0 / det
    
    const result = []
  
    result[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det
    result[1] = (a12 * b08 - a10 * b11 - a13 * b07) * det
    result[2] = (a10 * b10 - a11 * b08 + a13 * b06) * det
  
    result[3] = (a02 * b10 - a01 * b11 - a03 * b09) * det
    result[4] = (a00 * b11 - a02 * b08 + a03 * b07) * det
    result[5] = (a01 * b08 - a00 * b10 - a03 * b06) * det
  
    result[6] = (a31 * b05 - a32 * b04 + a33 * b03) * det
    result[7] = (a32 * b02 - a30 * b05 - a33 * b01) * det
    result[8] = (a30 * b04 - a31 * b02 + a33 * b00) * det
  
    return result
  }  

  static invertMatrix(matrix) {
	
    // Adapted from: https://github.com/mrdoob/three.js/blob/master/src/math/Matrix4.js
    
    // Performance note: Try not to allocate memory during a loop. This is done here
    // for the ease of understanding the code samples.
    const result = []
  
    const n11 = matrix[0], n12 = matrix[4], n13 = matrix[ 8], n14 = matrix[12]
    const n21 = matrix[1], n22 = matrix[5], n23 = matrix[ 9], n24 = matrix[13]
    const n31 = matrix[2], n32 = matrix[6], n33 = matrix[10], n34 = matrix[14]
    const n41 = matrix[3], n42 = matrix[7], n43 = matrix[11], n44 = matrix[15]
  
    result[ 0] = n23 * n34 * n42 - n24 * n33 * n42 + n24 * n32 * n43 - n22 * n34 * n43 - n23 * n32 * n44 + n22 * n33 * n44
    result[ 4] = n14 * n33 * n42 - n13 * n34 * n42 - n14 * n32 * n43 + n12 * n34 * n43 + n13 * n32 * n44 - n12 * n33 * n44
    result[ 8] = n13 * n24 * n42 - n14 * n23 * n42 + n14 * n22 * n43 - n12 * n24 * n43 - n13 * n22 * n44 + n12 * n23 * n44
    result[12] = n14 * n23 * n32 - n13 * n24 * n32 - n14 * n22 * n33 + n12 * n24 * n33 + n13 * n22 * n34 - n12 * n23 * n34
    result[ 1] = n24 * n33 * n41 - n23 * n34 * n41 - n24 * n31 * n43 + n21 * n34 * n43 + n23 * n31 * n44 - n21 * n33 * n44
    result[ 5] = n13 * n34 * n41 - n14 * n33 * n41 + n14 * n31 * n43 - n11 * n34 * n43 - n13 * n31 * n44 + n11 * n33 * n44
    result[ 9] = n14 * n23 * n41 - n13 * n24 * n41 - n14 * n21 * n43 + n11 * n24 * n43 + n13 * n21 * n44 - n11 * n23 * n44
    result[13] = n13 * n24 * n31 - n14 * n23 * n31 + n14 * n21 * n33 - n11 * n24 * n33 - n13 * n21 * n34 + n11 * n23 * n34
    result[ 2] = n22 * n34 * n41 - n24 * n32 * n41 + n24 * n31 * n42 - n21 * n34 * n42 - n22 * n31 * n44 + n21 * n32 * n44
    result[ 6] = n14 * n32 * n41 - n12 * n34 * n41 - n14 * n31 * n42 + n11 * n34 * n42 + n12 * n31 * n44 - n11 * n32 * n44
    result[10] = n12 * n24 * n41 - n14 * n22 * n41 + n14 * n21 * n42 - n11 * n24 * n42 - n12 * n21 * n44 + n11 * n22 * n44
    result[14] = n14 * n22 * n31 - n12 * n24 * n31 - n14 * n21 * n32 + n11 * n24 * n32 + n12 * n21 * n34 - n11 * n22 * n34
    result[ 3] = n23 * n32 * n41 - n22 * n33 * n41 - n23 * n31 * n42 + n21 * n33 * n42 + n22 * n31 * n43 - n21 * n32 * n43
    result[ 7] = n12 * n33 * n41 - n13 * n32 * n41 + n13 * n31 * n42 - n11 * n33 * n42 - n12 * n31 * n43 + n11 * n32 * n43
    result[11] = n13 * n22 * n41 - n12 * n23 * n41 - n13 * n21 * n42 + n11 * n23 * n42 + n12 * n21 * n43 - n11 * n22 * n43
    result[15] = n12 * n23 * n31 - n13 * n22 * n31 + n13 * n21 * n32 - n11 * n23 * n32 - n12 * n21 * n33 + n11 * n22 * n33
  
    const determinant = n11 * result[0] + n21 * result[4] + n31 * result[8] + n41 * result[12]
  
    if ( determinant === 0 ) {
      throw new Error(`Can't invert matrix, determinant is 0`)
    }
    
    for( let i=0; i < result.length; i++ ) {
      result[i] /= determinant
    }
  
    return result
  }

  static testMatrix() {
    /**
     * Now using the function above we can multiply a point by the matrix.
     * Using the identity matrix it should return a matrix identical to the original,
     * since a matrix multiplied by the identity matrix is always equal to itself:
     */
    const identityResult = MatrixTransform.multiplyMatrixAndPoint(MatrixTransform.identityMatrix(), [4, 3, 2, 1])
    const someMatrix = [
      4, 0, 0, 0,
      0, 3, 0, 0,
      0, 0, 5, 0,
      4, 8, 4, 1
    ]
    // Returns a new array equivalent to someMatrix
    const someMatrixResult = MatrixTransform.multiplyMatrices(MatrixTransform.identityMatrix(), someMatrix)

    const x = 50
    const y = 100
    const z = 0
    
    const translationMatrix = MatrixTransform.translateMatrix(x, y, z)
     
    const w = 1.5; // width  (x)
    const h = 0.7; // height (y)
    const d = 1;   // depth  (z)
  
    const scaleMatrix = MatrixTransform.scaleMatrix(w, h, d)

    // Manually rotating a point about the origin without matrices
    const point = [10, 2]
    // Calculate the distance from the origin
    const distance = MatrixTransform.distance(point)
    const angle = 60;
    // The equivalent of 60 degrees, in radians
    const radians = MatrixTransform.angleToRadians(angle)
    const transformedPoint = MatrixTransform.transformedPoint(radians, distance)
    
    // Rotate around X axis
    const rotateXMatrix = MatrixTransform.rotateAroundXAxis(radians)
    // Rotate around Y axis
    const rotateYMatrix = MatrixTransform.rotateAroundYAxis(radians)
    // Rotate around Z axis
    const rotateZMatrix = MatrixTransform.rotateAroundZAxis(radians)

    // Composing multiple transformations
    const transformMatrix3 = MatrixTransform.multiplyArrayOfMatrices([
      MatrixTransform.rotateAroundZAxis(Math.PI * 0.5),    // Step 3: rotate around 90 degrees
      MatrixTransform.translateMatrix(0, 200, 0),          // Step 2: move down 100 pixels
      MatrixTransform.scaleMatrix(0.8, 0.8, 0.8)           // Step 1: scale down
    ])

    const transformMatrix6 = MatrixTransform.multiplyArrayOfMatrices([
      MatrixTransform.scaleMatrix(1.25, 1.25, 1.25),       // Step 6: scale back up
      MatrixTransform.translateMatrix(0, -200, 0),         // Step 5: move back up
      MatrixTransform.rotateAroundZAxis(-Math.PI * 0.5),   // Step 4: rotate back
      MatrixTransform.rotateAroundZAxis(Math.PI * 0.5),    // Step 3: rotate around 90 degrees
      MatrixTransform.translateMatrix(0, 200, 0),          // Step 2: move down 100 pixels
      MatrixTransform.scaleMatrix(0.8, 0.8, 0.8)           // Step 1: scale down
    ])

    return {
      identityResult,
      someMatrix,
      someMatrixResult,
      axes: {
        x,
        y,
        z
      },
      scales: {
        w,
        h,
        d
      },
      translationMatrix,
      scaleMatrix,
      point,
      distance,
      angle,
      radians,
      transformedPoint,
      rotateXMatrix,
      rotateYMatrix,
      rotateZMatrix,
      transformMatrix3,
      transformMatrix6
    }
  }
}

module.exports = MatrixTransform