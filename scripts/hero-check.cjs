const puppeteer = require("puppeteer-core");
(async () => {
  const browser = await puppeteer.launch({ headless: "new", executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });
  const errs = [];
  page.on("pageerror", e => errs.push(e.message));
  await page.goto("http://localhost:5173/", { waitUntil: "networkidle2" });
  const hero = await page.evaluate(() => {
    const img = document.querySelector('section img[src*="imagekit"]');
    if (!img) return null;
    const rect = img.getBoundingClientRect();
    return { src: img.src.slice(0, 60), w: rect.width, h: rect.height, loaded: img.complete && img.naturalWidth > 0, naturalW: img.naturalWidth };
  });
  const logo = await page.evaluate(() => {
    const img = document.querySelector('header img[src*="belioras-logo"]');
    if (!img) return null;
    const rect = img.getBoundingClientRect();
    return { h: rect.height, w: rect.width, loaded: img.complete && img.naturalWidth > 0 };
  });
  const heroText = await page.evaluate(() => {
    const h = document.querySelector("section h1");
    return h ? h.textContent : null;
  });
  console.log(JSON.stringify({ hero, logo, heroText, errs }, null, 2));
  await browser.close();
})();
