module.exports.vec2 = x => y => n => {
  return [...Array(n)].map((_, i) => [x(i / n), y(i / n)]);
};
