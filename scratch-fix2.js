const fs = require('fs');

function replace(file, search, replacement) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.split(search).join(replacement);
  fs.writeFileSync(file, content);
}

// 1. facilities/route.ts
replace('src/app/api/cluster/facilities/route.ts', 'equipmentIds: body.equipmentIds', 'equipment: body.equipmentIds');

// 2. forum/route.ts
replace('src/app/api/cluster/forum/route.ts', 'const { user } = await requireUser();', 'const user = await requireUser();');

// 3. funding/[id]/apply/route.ts
replace('src/app/api/cluster/funding/[id]/apply/route.ts', 'export const POST = route(async (req, { params }) => {', 'export const POST = route(async (req, { params }: any) => {');
replace('src/app/api/cluster/funding/[id]/apply/route.ts', "status: 'PENDING',", ''); // Just use default

// 4. funding/route.ts
replace('src/app/api/cluster/funding/route.ts', 'export const POST = route(async (req, { params }) => {', 'export const POST = route(async (req, { params }: any) => {');

// 5. observatory/route.ts
replace('src/app/api/cluster/observatory/route.ts', 'isApproved: true', "status: 'APPROVED'");
replace('src/app/api/cluster/observatory/route.ts', '_sum: { value: true }', '_sum: { totalAmount: true }');
replace('src/app/api/cluster/observatory/route.ts', 'c.value._sum.value?.toNumber()', 'Number(c.value._sum.totalAmount)');
replace('src/app/api/cluster/observatory/route.ts', 'p.value._sum.quantity?.toNumber()', 'Number(p.value._sum.quantity)');
replace('src/app/api/cluster/observatory/route.ts', 'const period = record.period;', 'const period = record.period.toISOString();');
replace('src/app/api/cluster/observatory/route.ts', 'co2eTrend[record.period]', 'co2eTrend[record.period.toISOString()]');

// 6. procurement/[id]/commit/route.ts
replace('src/app/api/cluster/procurement/[id]/commit/route.ts', 'const { user } = await requireUser();', 'const user = await requireUser();');

// 7. procurement/route.ts
let proc = fs.readFileSync('src/app/api/cluster/procurement/route.ts', 'utf8');
if (!proc.includes('requireUser')) {
  proc = proc.replace("import { requireRole } from '@/server/auth';", "import { requireRole, requireUser } from '@/server/auth';");
}
proc = proc.replace('uom: body.uom,', 'unit: body.uom,');
fs.writeFileSync('src/app/api/cluster/procurement/route.ts', proc);

// 8. sustainability/route.ts
replace('src/app/api/cluster/sustainability/route.ts', 'renewableSharePct: body.renewableSharePct,', '');

// 9. emissions.ts (Force all to Number to fix arithmetic ops)
let em = fs.readFileSync('src/server/modernization/emissions.ts', 'utf8');
em = em.replace(/record\.electricityKwh/g, 'Number(record.electricityKwh)');
em = em.replace(/record\.naturalGasM3/g, 'Number(record.naturalGasM3)');
em = em.replace(/record\.dieselLiters/g, 'Number(record.dieselLiters)');
em = em.replace(/record\.waterM3/g, 'Number(record.waterM3)');
em = em.replace(/record\.productionKg/g, 'Number(record.productionKg)');
em = em.replace(/record\.wasteKg/g, 'Number(record.wasteKg)');
em = em.replace(/record\.recycledWasteKg/g, 'Number(record.recycledWasteKg)');
fs.writeFileSync('src/server/modernization/emissions.ts', em);

console.log('Fixed TS issues');
