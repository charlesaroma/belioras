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

  const report = async (label) => {
    const len = await page.evaluate(() => document.body.innerText.length);
    const snippet = await page.evaluate(() =>
      document.body.innerText.slice(0, 260).replace(/\n+/g, " | ")
    );
    console.log(`--- ${label} ---`);
    console.log(`url: ${page.url()} | bodyLen: ${len}`);
    console.log(`text: ${snippet}`);
    console.log(`errors: ${errors.length ? errors.join("\n  ") : "(none)"}`);
    errors.length = 0;
  };

  await page.goto(BASE + "/", { waitUntil: "networkidle0" });

  const clickButtonByText = async (text) => {
    const handles = await page.$$("button", "a");
    for (const h of handles) {
      const t = await h.evaluate((el) => el.innerText.trim());
      if (t === text) {
        await h.click();
        return true;
      }
    }
    return false;
  };

  // Desktop: click the DRESSES mega-menu button
  const clicked = await clickButtonByText("DRESSES");
  console.log("clicked DRESSES button:", clicked);
  await new Promise((r) => setTimeout(r, 600));
  await report("after clicking DRESSES button");
  // click a subcategory inside the mega menu (e.g. MIDI)
  const sub = await page.evaluate(() => {
    const links = [...document.querySelectorAll("a")].filter((a) =>
      a.getAttribute("href")?.includes("/shop/dresses")
    );
    return links.map((a) => a.getAttribute("href"));
  });
  console.log("mega menu sub links:", sub);
  if (sub.length) {
    await page.click(`a[href="${sub[0]}"]`);
    await new Promise((r) => setTimeout(r, 700));
    await report(`navigated to ${sub[0]}`);
  }

  // Mobile viewport: hamburger -> accordion
  await page.setViewport({ width: 390, height: 844 });
  await page.goto(BASE + "/", { waitUntil: "networkidle0" });
  const menuBtn = await page.evaluate(() => {
    const btn = document.querySelector("button[aria-label*='Menu']");
    return btn ? btn.getAttribute("aria-label") : null;
  });
  console.log("mobile menu button aria:", menuBtn);
  const clickFirstMenuButton = await page.evaluate(() => {
    const btn = document.querySelector("button[aria-label*='Menu' i]");
    if (btn) {
      btn.click();
      return true;
    }
    return false;
  });
  console.log("opened mobile menu:", clickFirstMenuButton);
  await new Promise((r) => setTimeout(r, 600));
  await report("mobile menu open");

  const accordions = await page.evaluate(() => {
    return [...document.querySelectorAll("button")].slice(0, 25).map((b) => ({
      label: (b.getAttribute("aria-label") || "").slice(0, 40),
      text: b.innerText.trim().slice(0, 40),
    }));
  });
  console.log("mobile buttons:", JSON.stringify(accordions, null, 1));

  // Click the accordion for DRESSES category in mobile menu
  const accClicked = await page.evaluate(() => {
    const btns = [...document.querySelectorAll("button")];
    const hit = btns.find((b) => {
      const t = b.innerText.trim().toLowerCase();
      return t === "dresses" || t.startsWith("dresses");
    });
    if (hit) {
      hit.click();
      return true;
    }
    return false;
  });
  console.log("clicked mobile Dresses accordion:", accClicked);
  await new Promise((r) => setTimeout(r, 500));
  await report("after mobile Dresses accordion click");

  await browser.close();
})();