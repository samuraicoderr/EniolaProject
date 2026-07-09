const fs = require('fs');

const files = [
  'c:/Users/USER/Desktop/sub/frontend/components/dashboard/CustomersList.tsx',
  'c:/Users/USER/Desktop/sub/frontend/components/dashboard/PlanForm.tsx',
  'c:/Users/USER/Desktop/sub/frontend/components/dashboard/PlansList.tsx',
  'c:/Users/USER/Desktop/sub/frontend/components/dashboard/SubscriptionsList.tsx',
  'c:/Users/USER/Desktop/sub/frontend/components/dashboard/WebhooksManager.tsx'
];

files.forEach(filePath => {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // We look for className="..." containing bg-slate-900
  content = content.replace(/className="([^"]*bg-slate-900[^"]*)"/g, (match, classes) => {
    // Remove old classes
    let newClasses = classes.replace(/\bbg-slate-900\b/g, 'bg-[#c5f045]')
                            .replace(/\btext-white\b/g, 'text-slate-900 font-bold')
                            .replace(/\bhover:bg-slate-800\b/g, 'hover:bg-[#b0d938]')
                            .replace(/\brounded-(sm|md|lg|xl)\b/g, 'rounded-full')
                            .replace(/\btransition-colors\b/g, ''); // prevent duplicates

    // Ensure transition-colors is there
    newClasses += ' transition-colors';
    
    // Cleanup multiple spaces
    newClasses = newClasses.replace(/\s+/g, ' ').trim();
    
    return `className="${newClasses}"`;
  });

  if (content !== original) {
    fs.writeFileSync(filePath, content);
    console.log('Updated buttons in', filePath);
  }
});
