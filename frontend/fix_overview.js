const fs = require('fs');

const file = 'c:/Users/USER/Desktop/sub/frontend/components/dashboard/DashboardOverview.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Add lucide-react import
if (!content.includes('lucide-react')) {
  content = content.replace(/import \{ useOrganization \} from "@\/lib\/api\/contexts\/OrganizationContext";/, 
    'import { useOrganization } from "@/lib/api/contexts/OrganizationContext";\nimport { Activity, Users, CheckCircle } from "lucide-react";');
}

// 2. Replace TableSkeleton with OverviewSkeleton if needed
content = content.replace(/TableSkeleton/g, 'OverviewSkeleton');

// 3. Replace the single KPI grid with the split grid
const oldGridRegex = /<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">[\s\S]*?\{cards\.map\(\(card\) => \([\s\S]*?<div[\s\S]*?key=\{card\.label\}[\s\S]*?className="[^"]*"[\s\S]*?>[\s\S]*?<p className="[^"]*">\{card\.label\}<\/p>[\s\S]*?<p className="[^"]*">[\s\S]*?\{card\.value\}[\s\S]*?<\/p>[\s\S]*?<\/div>[\s\S]*?\)\)}[\s\S]*?<\/div>/m;

const newGrid = `{/* 3 Main KPIs */}
      <div className="grid gap-4 sm:grid-cols-3 mb-4">
        {cards.filter(c => ["Active subscriptions", "Total customers", "Active plans"].includes(c.label)).map((card, index) => {
          const isFirst = index === 0;
          return (
            <div
              key={card.label}
              className={\`relative overflow-hidden rounded-md border p-6 transition-all \${
                isFirst
                  ? "bg-[#c5f045] border-[#c5f045] shadow-sm"
                  : "bg-[#c5f045]/10 border-[#c5f045]/40"
              }\`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={\`flex h-10 w-10 shrink-0 items-center justify-center rounded-full \${isFirst ? "bg-slate-900/10 text-slate-900" : "bg-[#c5f045]/20 text-[#8ba830]"}\`}>
                  {card.label === "Active subscriptions" && <Activity size={20} />}
                  {card.label === "Total customers" && <Users size={20} />}
                  {card.label === "Active plans" && <CheckCircle size={20} />}
                </div>
                <p className={\`text-sm font-semibold \${isFirst ? "text-slate-900" : "text-slate-800"}\`}>
                  {card.label}
                </p>
              </div>
              <p className={\`text-4xl font-black tracking-tight \${isFirst ? "text-slate-900" : "text-slate-900"}\`}>
                {card.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* 4 Secondary KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.filter(c => !["Active subscriptions", "Total customers", "Active plans"].includes(c.label)).map((card) => (
          <div
            key={card.label}
            className="rounded-md border border-slate-200 bg-white p-5"
          >
            <p className="text-sm font-medium text-slate-500">{card.label}</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">
              {card.value}
            </p>
          </div>
        ))}
      </div>`;

content = content.replace(oldGridRegex, newGrid);

// 4. Update the bottom tables to use rounded-md without shadows
content = content.replace(/className="rounded-xl border border-slate-200 bg-white shadow-sm"/g, 'className="rounded-md border border-slate-200 bg-white"');

fs.writeFileSync(file, content);
console.log('Fixed DashboardOverview.tsx');
