import puppeteer from "puppeteer-extra";
import stealthPlugin from "puppeteer-extra-plugin-stealth";
import adblockerPlugin from "puppeteer-extra-plugin-adblocker";

puppeteer.use(stealthPlugin());
puppeteer.use(adblockerPlugin());

export default puppeteer;
