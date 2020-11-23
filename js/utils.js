function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; --i) {
    let j = Math.floor(Math.random() * (i + 1));
    let temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}

function isValidPos(x, y, plane) {
  return (x >= 0 && x < plane.length && y >= 0 && y < plane[x].length);
}
