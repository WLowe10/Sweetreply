import puppeteer from "puppeteer-extra";
import stealthPlugin from "puppeteer-extra-plugin-stealth";
import adblockerPlugin from "puppeteer-extra-plugin-adblocker";
import blockResourcesPlugin from "puppeteer-extra-plugin-block-resources";
import { DEFAULT_INTERCEPT_RESOLUTION_PRIORITY } from "puppeteer";

puppeteer.use(stealthPlugin());
puppeteer.use(adblockerPlugin());
puppeteer.use(
	blockResourcesPlugin({
		blockedTypes: new Set<any>(["image", "stylesheet"]),
		interceptResolutionPriority: DEFAULT_INTERCEPT_RESOLUTION_PRIORITY,
	})
);

export default puppeteer;
