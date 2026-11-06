const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/pages/DashboardPage.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add Capacitor import if not present
const capacitorImport = `import { Capacitor } from "@capacitor/core";\n`;
const authImport = `import { useAuth } from "../contexts/AuthContext";`;
if (!content.includes('from "@capacitor/core"')) {
  content = content.replace(authImport, capacitorImport + authImport);
  console.log('✓ Added Capacitor import');
} else {
  console.log('  Capacitor import already present');
}

// 2. Add Reload dropdown item in profile menu (web-only), after the Settings item
const settingsItem = `<DropdownItem icon={<Settings size={15} />} label={language === "bn" ? "সেটিংস" : "Settings"} onClick={() => { setActiveTab("settings"); setProfileOpen(false); }} />`;
const reloadItem = `{!Capacitor.isNativePlatform() && (
                      <DropdownItem icon={<RefreshCw size={15} />} label={language === "bn" ? "রিলোড" : "Reload"} onClick={() => { setProfileOpen(false); window.location.reload(); }} />
                    )}`;

if (!content.includes('window.location.reload()')) {
  content = content.replace(settingsItem, settingsItem + '\n                    ' + reloadItem);
  console.log('✓ Added Reload dropdown item');
} else {
  console.log('  Reload item already present');
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Done.');

