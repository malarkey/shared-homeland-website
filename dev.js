(async () => {
  const eleventyModule = await import("@11ty/eleventy");
  const Eleventy = eleventyModule.default;
  const { execSync } = await import("node:child_process");
  const bs = (await import("browser-sync")).create();
  const chokidar = (await import("chokidar")).default;

  const elev = new Eleventy();

  // Initial build
  await elev.write();

  // Watch SCSS
  chokidar.watch("src/scss/**/*.scss").on("change", () => {
    console.log("🧶 SCSS changed, recompiling...");
    execSync("npx sass src/scss:src/_includes/css --no-source-map --style=compressed", { stdio: "inherit" });
    elev.write().then(() => bs.reload());
  });

  // Watch templates
  elev.watch().then(() => {
    bs.init({
      server: "dist",
      files: "dist/**/*",
      open: true,
      notify: false
    });
  });
})();
