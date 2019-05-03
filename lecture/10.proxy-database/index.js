const puppeteer = require("puppeteer");
const dotenv = require("dotenv");

const db = require("./models");
dotenv.config();

const crawler = async () => {
  await db.sequelize.sync(); // sequelize를 이용해 db와 연결
  try {
    let browser = await puppeteer.launch({
      headless: false,
      args: ["--window-size=1920,1080", "--disable-notifications"]
    });
    let page = await browser.newPage();
    await page.setViewport({
      width: 1080,
      height: 1080
    });
    await page.goto("http://spys.one/free-proxy-list/KR/");
    const proxies = await page.evaluate(() => {
      const ips = Array.from(
        document.querySelectorAll("tr > td:first-of-type > .spy14")
      ).map(v => v.textContent.replace(/document\.write\(.+\)/, ""));
      const types = Array.from(
        document.querySelectorAll("tr > td:nth-of-type(2)")
      )
        .slice(5)
        .map(v => v.textContent);
      const latencies = Array.from(
        document.querySelectorAll("tr > td:nth-of-type(6) .spy1")
      ).map(v => v.textContent);
      return ips.map((v, i) => {
        return {
          ip: v,
          type: types[i],
          latency: latencies[i]
        };
      });
    });
    const filtered = proxies
      .filter(v => v.type.startsWith("HTTP"))
      .sort((p, c) => p.latency - c.latency);
    // latency가 가장 빠른 순으로 정렬
    await Promise.all(
      filtered.map(async v => {
        return db.Proxy.upsert({
          ip: v.ip,
          type: v.type,
          latency: v.latency
        });
      })
    );
    // 정렬한 proxy 리스트를 db에 넣는다.
    await page.close();
    await browser.close();
    const fastestProxies = await db.Proxy.findAll({
      order: [["latency", "ASC"]]
    });
    browser1 = await puppeteer.launch({
      headless: false,
      args: [
        "--window-size=1920,1080",
        "--disable-notifications",
        `--proxy-server=${fastestProxies[0].ip}`
      ]
    });
    const browser2 = await puppeteer.launch({
      headless: false,
      args: [
        "--window-size=1920,1080",
        "--disable-notifications",
        `--proxy-server=${fastestProxies[1].ip}`
      ]
    });
    const browser3 = await puppeteer.launch({
      headless: false,
      args: [
        "--window-size=1920,1080",
        "--disable-notifications",
        `--proxy-server=${fastestProxies[2].ip}`
      ]
    });
    // const context1 = await browser.createIncognitoBrowserContext();
    // const context2 = await browser.createIncognitoBrowserContext();
    // const context3 = await browser.createIncognitoBrowserContext();
    // console.log(await browser.browserContexts());
    const page1 = await browser1.newPage();
    const page2 = await browser2.newPage();
    const page3 = await browser3.newPage();
    const whatIsMyIp =
      "https://search.naver.com/search.naver?sm=top_hty&fbm=1&ie=utf8&query=%EB%82%B4+%EC%95%84%EC%9D%B4%ED%94%BC";
    await page1.goto(whatIsMyIp);
    await page2.goto(whatIsMyIp);
    await page3.goto(whatIsMyIp);
    // page = await browser.newPage();
    // await page.goto(whatIsMyIp);
    // await page.waitFor(10000);
    // await page.close();
    // await browser.close();
    await db.sequelize.close();
  } catch (e) {
    console.error(e);
  }
};

crawler();
