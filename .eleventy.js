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

eleventyConfig.addFilter("filterByFeatured", function(collection) {
return collection.filter(term => term.data.featured === true);
});

// GROUP BY INITIAL FILTER
eleventyConfig.addFilter("groupByInitial", function(collection) {
const grouped = {};

collection.forEach(term => {
if (term.data.title) {
const firstLetter = term.data.title.charAt(0).toUpperCase();

if (!grouped[firstLetter]) {
grouped[firstLetter] = [];
}

grouped[firstLetter].push(term);
}
});

// Sort the letters alphabetically and sort terms within each letter
const sortedGroups = {};
Object.keys(grouped)
.sort()
.forEach(letter => {
// Sort terms within this letter group by title
sortedGroups[letter] = grouped[letter].sort((a, b) =>
a.data.title.localeCompare(b.data.title)
);
});

return sortedGroups;
});

// RELATED TERMS FILTERS
eleventyConfig.addFilter("filterLexiconByCategory", function(collection, category) {
return collection.filter(term =>
term.data.categories && term.data.categories.includes(category)
);
});

// FIXED: Compare URLs instead of titles for more reliable exclusion
eleventyConfig.addFilter("excludeCurrent", function(collection, currentUrl) {
return collection.filter(term => term.url !== currentUrl);
});

eleventyConfig.addFilter("limit", function(collection, limit) {
return collection.slice(0, limit);
});

eleventyConfig.addFilter("getUniqueCategories", function(collection) {
const allCategories = new Set();
collection.forEach(term => {
if (term.data.categories) {
term.data.categories.forEach(cat => allCategories.add(cat));
}
});
return Array.from(allCategories).sort();
});

// RESOURCES FILTERS
eleventyConfig.addFilter("filterByCategory", (resources, category) => {
return resources.filter(resource =>
resource.data["item-categories"] && resource.data["item-categories"].includes(category)
);
});

eleventyConfig.addFilter("filterByTag", (resources, tag) => {
return resources.filter(resource =>
resource.data["item-tags"] && resource.data["item-tags"].includes(tag)
);
});

// BLOG FILTERS
eleventyConfig.addFilter("filterBlogByCategory", (posts, category) => {
return posts.filter(post =>
post.data.postCategories && post.data.postCategories.includes(category)
);
});

// BLOG TAG FILTER
eleventyConfig.addFilter("filterBlogByTag", (posts, tag) => {
return posts.filter(post =>
post.data.postTags && post.data.postTags.includes(tag)
);
});

// FAQ FILTERS
eleventyConfig.addFilter("filterFaqsByCategory", (faqs, category) => {
return faqs.filter(faq =>
faq.data.categories && faq.data.categories.includes(category)
);
});

eleventyConfig.addFilter("filterFaqsWithoutCategories", (faqs) => {
return faqs.filter(faq =>
!faq.data.categories || faq.data.categories.length === 0
);
});

// Plugins
eleventyConfig.addPlugin(rssPlugin);

// Shortcodes
eleventyConfig.addNunjucksAsyncShortcode("image", imageShortcode);

// Passthrough copy
eleventyConfig.addPassthroughCopy("src/fonts");
eleventyConfig.addPassthroughCopy("src/admin");
eleventyConfig.addPassthroughCopy("._redirects");
eleventyConfig.addPassthroughCopy("src/css");
eleventyConfig.addPassthroughCopy("src/js");
eleventyConfig.addPassthroughCopy("src/images");

// COLLECTIONS

// PHOTOS COLLECTION
eleventyConfig.addCollection("photos", (collection) => {
return collection.getFilteredByGlob("./src/photos/*.md").reverse();
});

// FAQ COLLECTION
eleventyConfig.addCollection("faqs", (collection) => {
return collection.getFilteredByGlob("./src/faqs/*.md").sort((a, b) => {
return a.data.title.localeCompare(b.data.title);
});
});

// FAQ CATEGORIES COLLECTION
eleventyConfig.addCollection("faqCategories", (collection) => {
let categories = new Set();
collection.getFilteredByGlob("./src/faqs/*.md").forEach(faq => {
if (faq.data.categories) {
faq.data.categories.forEach(cat => categories.add(cat));
}
});
return Array.from(categories).sort();
});

// GENERATE FAQ CATEGORY PAGES
eleventyConfig.addCollection("faqCategoryPages", function(collectionApi) {
const categories = new Set();
const faqs = collectionApi.getFilteredByGlob("./src/faqs/*.md");

faqs.forEach(faq => {
if (faq.data.categories) {
faq.data.categories.forEach(cat => categories.add(cat));
}
});

return Array.from(categories).map(category => {
return {
title: `FAQs: ${category}`,
category: category,
permalink: `/faqs/category/${category.toLowerCase().replace(/\s+/g, '-')}/`,
layout: "layouts/base.html"
};
});
});

eleventyConfig.addCollection("lexicon", function(collection) {
const terms = collection.getFilteredByGlob("./src/lexicon/*.md").map(term => {
// Generate slug from title if no permalink is set
if (!term.data.permalink) {
const slug = term.data.title
.toLowerCase()
.replace(/[^\w\s-]/g, '') // Remove special characters
.replace(/\s+/g, '-')     // Replace spaces with hyphens
.replace(/-+/g, '-');     // Replace multiple hyphens with single hyphen

term.data.permalink = `/lexicon/${slug}/`;
}
return term;
});

console.log(`Lexicon collection found ${terms.length} terms:`);
terms.forEach(term => {
console.log(`- ${term.data.title} -> ${term.url}`);
});

return terms.sort((a, b) => {
return a.data.title.localeCompare(b.data.title);
});
});

eleventyConfig.addCollection("blog", (collection) => {
return [...collection.getFilteredByGlob("./src/posts/*.md")].reverse();
});

// BLOG TAXONOMY COLLECTIONS
eleventyConfig.addCollection("postCategories", (collection) => {
let categories = new Set();
collection.getFilteredByGlob("./src/posts/*.md").forEach(post => {
if (post.data.postCategories) {
post.data.postCategories.forEach(cat => categories.add(cat));
}
});
return Array.from(categories).sort();
});

eleventyConfig.addCollection("postTags", (collection) => {
let tags = new Set();
collection.getFilteredByGlob("./src/posts/*.md").forEach(post => {
if (post.data.postTags) {
post.data.postTags.forEach(tag => tags.add(tag));
}
});
return Array.from(tags).sort();
});

// GENERATE BLOG CATEGORY PAGES
eleventyConfig.addCollection("blogCategoryPages", function(collectionApi) {
const categories = new Set();
const posts = collectionApi.getFilteredByGlob("./src/posts/*.md");

posts.forEach(post => {
if (post.data.postCategories) {
post.data.postCategories.forEach(cat => categories.add(cat));
}
});

return Array.from(categories).map(category => {
return {
title: `${category}`,
category: category,
permalink: `/blog/category/${category.toLowerCase().replace(/\s+/g, '-')}/`,
layout: "layouts/base.html"
};
});
});

// ADD BLOG TAG PAGES COLLECTION
eleventyConfig.addCollection("blogTagPages", function(collectionApi) {
const tags = new Set();
const posts = collectionApi.getFilteredByGlob("./src/posts/*.md");

posts.forEach(post => {
if (post.data.postTags) {
post.data.postTags.forEach(tag => tags.add(tag));
}
});

return Array.from(tags).map(tag => {
return {
title: `${tag}`,
tag: tag,
permalink: `/blog/tag/${tag.toLowerCase().replace(/\s+/g, '-')}/`,
layout: "layouts/base.html"
};
});
});

eleventyConfig.addCollection("team", (collection) => {
return collection.getFilteredByGlob("./src/team/*.md");
});

eleventyConfig.addCollection("board", (collection) => {
return collection.getFilteredByGlob("./src/board/*.md");
});

// RESOURCES COLLECTION
eleventyConfig.addCollection("resources", (collection) => {
return collection.getFilteredByGlob("./src/resources/*.md").reverse();
});

// RESOURCES TAXONOMY COLLECTIONS
eleventyConfig.addCollection("resourcesCategory", (collection) => {
let categories = new Set();
collection.getFilteredByGlob("./src/resources/*.md").forEach(item => {
if (item.data["item-categories"]) {
item.data["item-categories"].forEach(cat => categories.add(cat));
}
});
return Array.from(categories).sort();
});

eleventyConfig.addCollection("resourcesTag", (collection) => {
let tags = new Set();
collection.getFilteredByGlob("./src/resources/*.md").forEach(item => {
if (item.data["item-tags"]) {
item.data["item-tags"].forEach(tag => tags.add(tag));
}
});
return Array.from(tags).sort();
});

// GENERATE RESOURCES CATEGORY PAGES
eleventyConfig.addCollection("categoryPages", function(collectionApi) {
const categories = new Set();
const resources = collectionApi.getFilteredByGlob("./src/resources/*.md");

resources.forEach(resource => {
if (resource.data["item-categories"]) {
resource.data["item-categories"].forEach(cat => categories.add(cat));
}
});

return Array.from(categories).map(category => {
return {
title: `${category}`,
category: category,
permalink: `/resources/category/${category.toLowerCase().replace(/\s+/g, '-')}/`,
layout: "layouts/base.html"
};
});
});

// GENERATE RESOURCES TAG PAGES
eleventyConfig.addCollection("tagPages", function(collectionApi) {
const tags = new Set();
const resources = collectionApi.getFilteredByGlob("./src/resources/*.md");

resources.forEach(resource => {
if (resource.data["item-tags"]) {
resource.data["item-tags"].forEach(tag => tags.add(tag));
}
});

return Array.from(tags).map(tag => {
return {
title: `${tag}`,
tag: tag,
permalink: `/resources/tag/${tag.toLowerCase().replace(/\s+/g, '-')}/`,
layout: "layouts/base.html"
};
});
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