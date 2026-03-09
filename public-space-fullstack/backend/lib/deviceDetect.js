const UAParser = require("ua-parser-js");

function parseUserAgent(userAgent) {
  const parser = new UAParser(userAgent);
  const result = parser.getResult();

  const browser = result.browser.name ?? "Unknown";
  const os = result.os.name ?? "Unknown";
  const deviceKind = result.device.type;

  let deviceType = "desktop";
  if (deviceKind === "mobile" || deviceKind === "tablet") {
    deviceType = "mobile";
  } else if (os === "Mac OS" || os === "Windows" || os === "Linux") {
    deviceType = "laptop";
  }

  const isChrome = browser.toLowerCase().includes("chrome");
  const isMobile = deviceType === "mobile";

  return { browser, os, deviceType, isChrome, isMobile };
}

function isWithinMobileLoginWindow() {
  const now = new Date();
  const totalMinutes = now.getHours() * 60 + now.getMinutes();
  return totalMinutes >= 600 && totalMinutes < 780; // 10:00 AM – 1:00 PM
}

module.exports = { parseUserAgent, isWithinMobileLoginWindow };
