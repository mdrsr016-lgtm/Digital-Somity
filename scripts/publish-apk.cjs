/**
 * Copy the built debug APK into public/ as digitalsomity-v{version}.apk
 * and also as digitalsomity.apk (latest alias).
 */
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const pkg = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
const version = pkg.version;
const versionedName = `digitalsomity-v${version}.apk`;
const latestName = "digitalsomity.apk";

const src = path.join(root, "android/app/build/outputs/apk/debug/app-debug.apk");
const publicDir = path.join(root, "public");

if (!fs.existsSync(src)) {
  console.error("publish-apk: built APK not found at", src);
  process.exit(1);
}

fs.mkdirSync(publicDir, { recursive: true });

// Remove older versioned APKs so public/ only keeps the current release + latest alias.
for (const name of fs.readdirSync(publicDir)) {
  if (/^digitalsomity-v.+\.apk$/i.test(name) && name !== versionedName) {
    fs.unlinkSync(path.join(publicDir, name));
    console.log(`✓ Removed old ${name}`);
  }
}

const versionedPath = path.join(publicDir, versionedName);
const latestPath = path.join(publicDir, latestName);
fs.copyFileSync(src, versionedPath);
fs.copyFileSync(src, latestPath);

const mb = (fs.statSync(versionedPath).size / (1024 * 1024)).toFixed(2);
console.log(`✓ Published ${versionedName} (${mb} MB)`);
console.log(`✓ Published ${latestName} (latest alias)`);
