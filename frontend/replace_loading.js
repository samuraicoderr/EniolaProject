const fs = require('fs');
const path = require('path');
const dir = 'c:/Users/USER/Desktop/sub/frontend/components/dashboard';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx') && f !== 'TableSkeleton.tsx');

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  if (content.includes('<TableSkeleton />') && !content.includes('import { TableSkeleton }')) {
    content = content.replace(/^import\s+/m, 'import { TableSkeleton } from "./TableSkeleton";\nimport ');
    fs.writeFileSync(filePath, content);
    console.log('Added import to ' + file);
  }
});

//