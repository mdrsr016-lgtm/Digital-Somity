/**
 * Apply local fixes so Android BiometricPrompt actually appears:
 * - AuthActivity theme is not floating
 * - Prompt starts in onResume after window focus
 */
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const pluginAndroid = path.join(
  root,
  "node_modules",
  "@aparajita",
  "capacitor-biometric-auth",
  "android",
  "src",
  "main"
);
const patchesDir = path.join(__dirname, "patches", "biometric-auth");

const copies = [
  {
    from: path.join(patchesDir, "styles.xml"),
    to: path.join(pluginAndroid, "res", "values", "styles.xml"),
  },
  {
    from: path.join(patchesDir, "AuthActivity.java"),
    to: path.join(
      pluginAndroid,
      "java",
      "com",
      "aparajita",
      "capacitor",
      "biometricauth",
      "AuthActivity.java"
    ),
  },
];

if (!fs.existsSync(pluginAndroid)) {
  console.warn("patch-biometric-auth: plugin not installed, skip");
  process.exit(0);
}

for (const { from, to } of copies) {
  if (!fs.existsSync(from)) {
    console.warn(`patch-biometric-auth: missing ${from}`);
    continue;
  }
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(from, to);
  console.log(`patch-biometric-auth: applied ${path.basename(from)}`);
}
