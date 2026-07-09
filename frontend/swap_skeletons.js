const fs = require('fs');

const detailFiles = [
  'c:/Users/USER/Desktop/sub/frontend/components/dashboard/CustomerDetail.tsx',
  'c:/Users/USER/Desktop/sub/frontend/components/dashboard/SubscriptionDetail.tsx',
  'c:/Users/USER/Desktop/sub/frontend/components/dashboard/PlanEdit.tsx'
];

detailFiles.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  content = content.replace(/TableSkeleton/g, 'DetailSkeleton');
  fs.writeFileSync(f, content);
  console.log('Updated ' + f);
});

const overviewFile = 'c:/Users/USER/Desktop/sub/frontend/components/dashboard/DashboardOverview.tsx';
let overviewContent = fs.readFileSync(overviewFile, 'utf8');
overviewContent = overviewContent.replace(/TableSkeleton/g, 'OverviewSkeleton');
fs.writeFileSync(overviewFile, overviewContent);
console.log('Updated ' + overviewFile);
