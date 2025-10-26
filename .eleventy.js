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

// CSS inlining filter for Netlify CMS
function inlineFilter(path) {
  const fs = require("fs");
  const filepath = `dist${path}`;

  if (fs.existsSync(filepath)) {
    const buffer = fs.readFileSync(filepath);
    return buffer.toString('utf8').replace(/^\uFEFF/, '');
  }
  return `/* CSS file ${path} not found */`;
}

module.exports = function(eleventyConfig) {
  // Filters
  eleventyConfig.addFilter("dateFilter", dateFilter);
  eleventyConfig.addFilter("w3DateFilter", w3DateFilter);
  eleventyConfig.addFilter("sortByDisplayOrder", sortByDisplayOrder);
  eleventyConfig.addFilter("inline", inlineFilter);

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