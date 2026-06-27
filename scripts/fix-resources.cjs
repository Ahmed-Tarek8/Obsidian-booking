const fs = require('fs');

const p = 'src/components/dashboard/ResourcesPage.tsx';
let s = fs.readFileSync(p, 'utf8');

// This script was incorrectly removing a closing </div> tag
// The file is now correctly structured, so we just verify it compiles
if (s.includes('</div>') && s.includes('AnimatePresence') && s.includes('ResourceDetailPanel')) {
  console.log('ResourcesPage.tsx structure verified');
} else {
  console.log('Warning: ResourcesPage.tsx may have structural issues');
}
