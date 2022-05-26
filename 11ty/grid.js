module.exports.grid = ([w, h], f) => {
  return [...Array(h)].map((_, y) => {
    return [...Array(w)].map((_, x) => {
      if (f) {
        return f(x, y);
      }
      return [x, y];
    });
  });
};
