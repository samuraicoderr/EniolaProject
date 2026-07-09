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
      
      // Replace rounded-sm with rounded-md 
      content = content.replace(/\brounded-sm\b/g, 'rounded-md');

      if (content !== originalContent) {
        fs.writeFileSync(filePath, content);
        console.log('Updated', filePath);
      }
    }
  });
}

processDir('c:/Users/USER/Desktop/sub/frontend/app/dashboard');
processDir('c:/Users/USER/Desktop/sub/frontend/components/dashboard');
processDir('c:/Users/USER/Desktop/sub/frontend/components/app/layout');
