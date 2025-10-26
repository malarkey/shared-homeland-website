const rssPlugin = require('@11ty/eleventy-plugin-rss');
const Image = require("@11ty/eleventy-img");
// const { parseHTML } = require('linkedom');
//const localDir = 'http://localhost:8080/';
// Filters
const dateFilter = require('./src/filters/date-filter.js');
const w3DateFilter = require('./src/filters/w3-date-filter.js');
const sortByDisplayOrder = require('./src/utils/sort-by-display-order.js');

async function imageShortcode(src, alt, sizes, sitewhere) {
  let metadata = await Image(src, {
    widths: [300, 600],
    formats: ["avif", "jpeg"],
    outputDir: "./src/images/",
    outputDir: sitewhere + "/images/",
    urlPath: "/images/"

  });

  let imageAttributes = {
    alt,
    sizes,
    loading: "lazy",
    decoding: "async",
  };

  // You bet we throw an error on missing alt in `imageAttributes` (alt="" works okay)
  return Image.generateHTML(metadata, imageAttributes);
}



module.exports = config => {


  // Add filters
  config.addFilter('dateFilter', dateFilter);
  config.addFilter('w3DateFilter', w3DateFilter);

  // Set directories to pass through to the dist folder
  config.addPassthroughCopy('._redirects');
  config.addPassthroughCopy('./src/images/');
  config.addPassthroughCopy('./src/fonts/');
  config.addPassthroughCopy('src/admin/config.yml');
  config.addPassthroughCopy('src/admin/previews.js');
  config.addPassthroughCopy('node_modules/nunjucks/browser/nunjucks-slim.js');
  config.addNunjucksAsyncShortcode("image", imageShortcode);

  // Plugins
  config.addPlugin(rssPlugin);

  // Returns a collection of blog posts in reverse date order
  config.addCollection('blog', collection => {
    return [...collection.getFilteredByGlob('./src/posts/*.md')].reverse();
  });

  // Tell 11ty to use the .eleventyignore and ignore our .gitignore file
  config.setUseGitIgnore(false);

  return {
    markdownTemplateEngine: 'njk',
    dataTemplateEngine: 'njk',
    htmlTemplateEngine: 'njk',
    dir: {
      input: 'src',
      output: 'dist'
    }
  };
};
