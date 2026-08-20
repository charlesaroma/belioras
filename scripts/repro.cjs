const puppeteer = require("puppeteer-core");

const BASE = "http://localhost:5173";

(async () => {
  const browser = await puppeteer.launch({
    executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    headless: "new",
    args: ["--no-sandbox"],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  const errors = [];
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(`[console] ${m.text()}`);
  });
  page.on("pageerror", (e) => errors.push(`[pageerror] ${e.message}`));

  const nav = async (url, label) => {
    errors.length = 0;
    await page.goto(url, { waitUntil: "networkidle0" });
    const bodyText = await page.evaluate(() => document.body.innerText.slice(0, 150).replace(/\n+/g, " | "));
    const bodyLen = await page.evaluate(() => document.body.innerText.length);
    console.log(`--- ${label} (${url}) ---`);
    console.log(`body text len: ${bodyLen}`);
    console.log(`body text: ${bodyText}`);
    console.log(`errors: ${errors.length ? errors.join("\n  ") : "(none)"}`);
  };

  await nav(BASE + "/", "home");
  await nav(BASE + "/shop", "shop");
  await nav(BASE + "/shop/dresses", "dresses");
  await nav(BASE + "/shop/hair", "hair");
  await nav(BASE + "/shop/accessories", "accessories");
  await nav(BASE + "/shop/dresses?categories=midi", "dresses?categories=midi");
  await nav(BASE + "/whats-new", "whats-new");

  await browser.close();
})();