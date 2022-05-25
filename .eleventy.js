const { minify } = require("html-minifier-terser");


// filters - -
const { irand, frand, angleToV } = require("./11ty/filters.js");

/** @param {import('@11ty/eleventy/src/UserConfig')} config */
module.exports = config => {
  // if production
  if (process.env.NODE_ENV === "development") {
    // minify html,svg and inline css and js
    config.addTransform("htmlmin", async (content, outputPath) => {
      if (outputPath && outputPath.endsWith(".html")) {
        let minified = await minify(content, {
          useShortDoctype: true,
          removeComments: true,
          collapseWhitespace: true,
          minifyJS: true,
          minifyCSS: true,
          customAttrCollapse: /d/,
          ignoreCustomFragments: [],
        });
        return minified;
      }

      return content;
    });
  } else {
    // else copy over the assets
    config.addPassthroughCopy("src/css");
    config.addPassthroughCopy("src/js");
  }

  config.addNunjucksFilter("irand", irand);
  config.addNunjucksFilter("frand", frand);
  config.addNunjucksFilter("angleToV", angleToV);
  config.addNunjucksFilter("min", ([a, b]) => Math.min(a, b));
  config.addNunjucksFilter("max", ([a, b]) => Math.max(a, b));

  return {
    dir: {
      input: "src",
    },
  };
};
