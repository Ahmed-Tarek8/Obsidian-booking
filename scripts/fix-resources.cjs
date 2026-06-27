const fs = require('fs');

const p = 'src/components/dashboard/ResourcesPage.tsx';
let s = fs.readFileSync(p, 'utf8');

const bad = `        </div>
        <AnimatePresence>
          {selectedId && selected && <ResourceDetailPanel resource={selected} onClose={() => setSelectedId(null)} />}
        </AnimatePresence>
      </div>`;

const good = `        <AnimatePresence>
          {selectedId && selected && <ResourceDetailPanel resource={selected} onClose={() => setSelectedId(null)} />}
        </AnimatePresence>
      </div>`;

if (s.includes(bad)) {
  fs.writeFileSync(p, s.replace(bad, good));
  console.log('Fixed ResourcesPage.tsx');
} else {
  console.log('ResourcesPage.tsx already fixed or target not found');
}
