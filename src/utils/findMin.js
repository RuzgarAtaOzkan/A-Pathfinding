// MODULES

function findMin(numArr) {
  if (!numArr) {
    throw new Error('Number Array is not specified in findMin function');
  }

  let lowestInt = 0;
  let highestInt = Number.MAX_SAFE_INTEGER;

  for (let i = 0; i < numArr.length; i++) {
    if (numArr[i]) {
      let previousNum = numArr[i];

      while (highestInt > previousNum) {
        highestInt = previousNum;
        lowestInt = highestInt;
      }
    }
  }

  return lowestInt;
}

export default findMin;
