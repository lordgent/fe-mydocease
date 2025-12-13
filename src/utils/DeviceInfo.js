import sha256 from "crypto-js/sha256";

export function getDeviceInfo() {
  const userAgent = navigator.userAgent;
  const language = navigator.language;
  const platform = navigator.platform;
  const screenRes = `${window.screen.width}x${window.screen.height}`;
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const rawString = `${userAgent}|${language}|${platform}|${screenRes}|${timezone}`;
  const deviceId = sha256(rawString).toString();

  return {
    deviceId,
    address: userAgent,
  };
}
