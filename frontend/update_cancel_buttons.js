const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      processDir(filePath);
    } else if (file.endsWith('.tsx')) {
      let content = fs.readFileSync(filePath, 'utf8');
      let originalContent = content;
      
      // Look for button or Link tags that contain Cancel
      // We can use a regex to find className="..." before >Cancel< or >{cancelLabel}<
      content = content.replace(/(className="[^"]*rounded-[a-z]+[^"]*")([\s\S]*?>\s*Cancel\s*<\/(?:button|Link|a)>)/g, (match, classAttr, rest) => {
        return classAttr.replace(/rounded-[a-z]+/, 'rounded-full') + rest;
      });
      content = content.replace(/(className="[^"]*rounded-[a-z]+[^"]*")([\s\S]*?>\s*\{cancelLabel\}\s*<\/(?:button|Link|a)>)/g, (match, classAttr, rest) => {
        return classAttr.replace(/rounded-[a-z]+/, 'rounded-full') + rest;
      });

      if (content !== originalContent) {
        fs.writeFileSync(filePath, content);
        console.log('Updated Cancel button in', filePath);
      }
    }
  });
}

processDir('c:/Users/USER/Desktop/sub/frontend/app/dashboard');
processDir('c:/Users/USER/Desktop/sub/frontend/components/dashboard');
processDir('c:/Users/USER/Desktop/sub/frontend/components/app/layout');
