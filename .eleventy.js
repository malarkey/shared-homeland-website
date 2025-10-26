const { execSync } = require("child_process");
const rssPlugin = require("@11ty/eleventy-plugin-rss");
const Image = require("@11ty/eleventy-img");

// Filters
const dateFilter = require("./src/filters/date-filter.js");
const w3DateFilter = require("./src/filters/w3-date-filter.js");
const sortByDisplayOrder = require("./src/utils/sort-by-display-order.js");

// Async image shortcode
async function imageShortcode(src, alt, sizes = "(min-width: 1024px) 50vw, 100vw") {
  let metadata = await Image(src, {
    widths: [300, 600, 1200],
    formats: ["webp", "jpeg"],
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
  // 🧶 Compile Sass before build
  eleventyConfig.on("beforeBuild", () => {
    console.log("🧶 Compiling Sass to _includes/css...");
    execSync(
      "npx sass src/scss:src/_includes/css --no-source-map --style=compressed",
      { stdio: "inherit" }
    );
  });

  // ✅ Watch scss folder but ignore compiled CSS to avoid rebuild loops
  eleventyConfig.addWatchTarget("src/scss/");
  eleventyConfig.ignores.add("src/_includes/css/**");

  // Filters
  eleventyConfig.addFilter("dateFilter", dateFilter);
  eleventyConfig.addFilter("w3DateFilter", w3DateFilter);
  eleventyConfig.addFilter("sortByDisplayOrder", sortByDisplayOrder);

  // Plugins
  eleventyConfig.addPlugin(rssPlugin);

  // Shortcodes
  eleventyConfig.addNunjucksAsyncShortcode("image", imageShortcode);

  // Passthrough copy
  eleventyConfig.addPassthroughCopy("src/fonts");
  eleventyConfig.addPassthroughCopy("src/admin");
  eleventyConfig.addPassthroughCopy("._redirects");

  // Collections
  eleventyConfig.addCollection("blog", (collection) => {
    return [...collection.getFilteredByGlob("./src/posts/*.md")].reverse();
  });

  // Use .eleventyignore, not .gitignore
  eleventyConfig.setUseGitIgnore(false);

  // Directory structure
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
