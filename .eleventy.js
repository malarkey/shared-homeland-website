const { execSync } = require("child_process");
const rssPlugin = require("@11ty/eleventy-plugin-rss");
const Image = require("@11ty/eleventy-img");

// Filters
const dateFilter = require("./src/filters/date-filter.js");
const w3DateFilter = require("./src/filters/w3-date-filter.js");
const sortByDisplayOrder = require("./src/utils/sort-by-display-order.js");

// Image shortcode
async function imageShortcode(src, alt, sizes = "(min-width: 1024px) 50vw, 100vw") {
  let metadata = await Image(src, {
    widths: [300, 600, 1200],
    formats: ["avif", "jpeg"],
    outputDir: "./dist/images/",
    urlPath: "/images/"
  });

  let imageAttributes = {
    alt,
    sizes,
    loading: "lazy",
    decoding: "async"
  };

  return Image.generateHTML(metadata, imageAttributes);
}

module.exports = function(eleventyConfig) {
  // Compile Sass before build

const { execSync } = require("child_process");

eleventyConfig.addWatchTarget("src/scss/");

eleventyConfig.on("beforeBuild", () => {
  console.log("🧶 Compiling Sass to _includes/css...");
  execSync(
    "npx sass src/scss:src/_includes/css --no-source-map --style=compressed",
    { stdio: "inherit" }
  );
});




  // Add filters
  eleventyConfig.addFilter("dateFilter", dateFilter);
  eleventyConfig.addFilter("w3DateFilter", w3DateFilter);
  eleventyConfig.addFilter("sortByDisplayOrder", sortByDisplayOrder);

  // Add plugins
  eleventyConfig.addPlugin(rssPlugin);

  // Add image shortcode
  eleventyConfig.addNunjucksAsyncShortcode("image", imageShortcode);

  // Pass-through copy
  eleventyConfig.addPassthroughCopy("src/fonts");
  eleventyConfig.addPassthroughCopy("src/admin");
  eleventyConfig.addPassthroughCopy("._redirects");

  // Collections
  eleventyConfig.addCollection("blog", (collection) => {
    return [...collection.getFilteredByGlob("./src/posts/*.md")].reverse();
  });

  // Ignore .gitignore
  eleventyConfig.setUseGitIgnore(false);

  // Directory settings
  return {
    markdownTemplateEngine: "njk",
    dataTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dir: {
      input: "src",
      output: "dist"
    }
  };
};
