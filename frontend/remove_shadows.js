const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      processDir(filePath);
    } else if (file.endsWith('.tsx')) {
      let content = fs.readFileSync(filePath, 'utf8');
      let originalContent = content;
      
      // Remove shadows
      content = content.replace(/\bshadow-(sm|md|lg|xl|2xl|inner|none)\b/g, '');
      content = content.replace(/\bshadow\b/g, '');
      
      // Replace rounded-xl and rounded-lg with rounded-sm
      content = content.replace(/\brounded-xl\b/g, 'rounded-sm');
      content = content.replace(/\brounded-lg\b/g, 'rounded-sm');
      
      // Cleanup double spaces that might be left over from removing classes
      content = content.replace(/className="([^"]+)"/g, (match, p1) => {
        return `className="${p1.replace(/\s+/g, ' ').trim()}"`;
      });
      content = content.replace(/className=\{`([^`]+)`\}/g, (match, p1) => {
        return `className={\`${p1.replace(/\s+/g, ' ').trim()}\`}`;
      });

      if (content !== originalContent) {
        fs.writeFileSync(filePath, content);
        console.log('Updated', filePath);
      }
    }
  });
}

processDir('c:/Users/USER/Desktop/sub/frontend/app/dashboard');
processDir('c:/Users/USER/Desktop/sub/frontend/components/dashboard');
// Also process layout sidebar which contains some overlays/modals
processDir('c:/Users/USER/Desktop/sub/frontend/components/app/layout');
