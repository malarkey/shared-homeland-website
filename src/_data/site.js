const PRODUCTION_URL = "https://sharedhomeland.com";

function normalizeUrl(value) {
  return String(value || "").trim().replace(/\/+$/, "");
}

module.exports = function() {
  const deployUrl = normalizeUrl(
    process.env.URL || process.env.DEPLOY_PRIME_URL
  );

  return {
    name: "The Shared Homeland Paradigm",
    url: deployUrl || PRODUCTION_URL,
    authorName: "Andy Clarke, Stuff &#38; Nonsense",
    authorEmail: "andy.clarke@stuffandnonsense.co.uk",
    telephone: "07515 895903",
    email: "andy.clarke@stuffandnonsense.co.uk",
    siteID: "shared-homeland-paradigm"
  };
};
