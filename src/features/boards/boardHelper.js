export const randomHexColor = () => {
  var randomColor = Math.floor(Math.random() * 16777215).toString(16);

  // Exclude too bright colors
  while (randomColor.length < 6) {
    randomColor = "0" + randomColor;
  }

  return "#" + randomColor;
};
