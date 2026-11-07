/** Remove large APKs from Capacitor web assets so they are not packed into the APK. */
const fs = require("fs");
const path = require("path");

const dir = path.join(__dirname, "../android/app/src/main/assets/public");
if (!fs.existsSync(dir)) process.exit(0);

for (const name of fs.readdirSync(dir)) {
  if (/^digitalsomity.*\.apk$/i.test(name)) {
    fs.unlinkSync(path.join(dir, name));
    console.log(`✓ Removed bundled ${name}`);
  }
}
