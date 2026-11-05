// Mock sample data for KDP GreenSource — all data is simulated

export const GREENS = [
  { id: 'Gd-09', name: 'Yirgacheffe', grade: 'AA', origin: 'Ethiopia', processing: 'Washed', minThreshold: 700, unitCost: 4.85, alternates: ['Gc-11'] },
  { id: 'Gb-04', name: 'Colombia Supremo', grade: 'Supremo', origin: 'Colombia', processing: 'Washed', minThreshold: 1200, unitCost: 3.90, alternates: ['Gc-14'] },
  { id: 'Gf-22', name: 'Guatemala Antigua', grade: 'SHB', origin: 'Guatemala', processing: 'Washed', minThreshold: 2000, unitCost: 4.10, alternates: [] },
  { id: 'Gc-11', name: 'Brazil Cerrado', grade: 'NY2', origin: 'Brazil', processing: 'Natural', minThreshold: 2000, unitCost: 3.40, alternates: ['Gd-09'] },
  { id: 'Ga-17', name: 'Kenya AA&rsquo;s 1', grade: 'AA', origin: 'Kenya', processing: 'Washed', minThreshold: 2500, unitCost: 5.20, alternates: [] },
  { id: 'Ge-31', name: 'Sumatra Mandheling', grade: 'G1', origin: 'Indonesia', processing: 'Wet-Hulled', minThreshold: 1500, unitCost: 4.60, alternates: [] },
  { id: 'Gh-08', name: 'Costa Rica Tarrazu', grade: 'SHB', origin: 'Costa Rica', processing: 'Honey', minThreshold: 1200, unitCost: 4.30, alternates: [] },
  { id: 'Gc-14', name: 'Brazil Cerrado Natural', grade: 'NY2', origin: 'Brazil', processing: 'Natural', minThreshold: 1000, unitCost: 3.60, alternates: ['Gb-04'] },
  { id: 'Gi-12', name: 'Huila Washed', grade: 'Excelso', origin: 'Colombia', processing: 'Washed', minThreshold: 1000, unitCost: 4.20, alternates: ['Gb-04'] },
];

export const LOCAL_INVENTORY = [
  { greenId: 'Gd-09', lot: 'L-0421', supplier: 'Haile Export', onHand: 250, reserved: 0, incoming: 500, incomingEta: '2026-11-07', unitCost: 4.85, status: 'critical' },
  { greenId: 'Gb-04', lot: 'L-1180', supplier: 'Verde Farms', onHand: 820, reserved: 320, incoming: 0, incomingEta: null, unitCost: 3.90, status: 'critical' },
  { greenId: 'Gf-22', lot: 'L-0899', supplier: 'Cafexport', onHand: 2200, reserved: 320, incoming: 800, incomingEta: '2026-11-04', unitCost: 4.10, status: 'low' },
  { greenId: 'Gc-11', lot: 'L-1171', supplier: 'Mogiana Co.', onHand: 3800, reserved: 600, incoming: 0, incomingEta: null, unitCost: 3.40, status: 'healthy' },
  { greenId: 'Ga-17', lot: 'L-1164', supplier: 'Nairobi Select', onHand: 4200, reserved: 800, incoming: 600, incomingEta: '2026-11-03', unitCost: 5.20, status: 'healthy' },
  { greenId: 'Ge-31', lot: 'L-1292', supplier: 'Archipelago Greens', onHand: 2900, reserved: 540, incoming: 0, incomingEta: null, unitCost: 4.60, status: 'healthy' },
  { greenId: 'Gh-08', lot: 'L-1301', supplier: 'Tico Exports', onHand: 1700, reserved: 80, incoming: 200, incomingEta: '2026-11-06', unitCost: 4.30, status: 'healthy' },
];

export const WAREHOUSE_INVENTORY = [
  {
    warehouse: 'WH-02 Dallas', shortId: 'WH-02',
    stock: [
      { greenId: 'Gb-04', available: 5200, reserved: 1000, transferLeadDays: 2 },
      { greenId: 'Gc-11', available: 8000, reserved: 1200, transferLeadDays: 2 },
      { greenId: 'Ga-17', available: 3100, reserved: 400, transferLeadDays: 2 },
      { greenId: 'Gc-14', available: 2400, reserved: 0, transferLeadDays: 2 },
    ]
  },
  {
    warehouse: 'WH-01 Chicago', shortId: 'WH-01',
    stock: [
      { greenId: 'Gi-12', available: 3100, reserved: 0, transferLeadDays: 3 },
      { greenId: 'Gh-08', available: 2200, reserved: 300, transferLeadDays: 3 },
      { greenId: 'Gf-22', available: 4500, reserved: 500, transferLeadDays: 3 },
      { greenId: 'Gc-14', available: 1600, reserved: 0, transferLeadDays: 3 },
    ]
  },
  {
    warehouse: 'WH-03 Portland', shortId: 'WH-03',
    stock: [
      { greenId: 'Gd-09', available: 1800, reserved: 200, transferLeadDays: 4 },
      { greenId: 'Ge-31', available: 3500, reserved: 600, transferLeadDays: 4 },
      { greenId: 'Gb-04', incoming: 4000, incomingEta: '2026-11-07', transferLeadDays: 4 },
    ]
  },
];

export const ORDERS = [
  {
    id: 'PO-2841', greenId: 'Gb-04', selectedGreenId: 'Gb-04', qty: 1200,
    source: 'WH-02 Dallas', total: 5412, requiredDate: '2026-11-05',
    expectedDate: '2026-11-02', status: 'In Transit', isAlternate: false, createdAt: '2026-10-28'
  },
  {
    id: 'PO-2840', greenId: 'Ga-17', selectedGreenId: 'Gc-19', qty: 800,
    source: 'Local Lot L-1164', total: 4960, requiredDate: '2026-10-30',
    expectedDate: '2026-10-30', status: 'Feasible', isAlternate: true, createdAt: '2026-10-27'
  },
  {
    id: 'PO-2839', greenId: 'Gd-09', selectedGreenId: null, qty: 900,
    source: null, total: null, requiredDate: '2026-11-08',
    expectedDate: null, status: 'Excluded', isAlternate: false, createdAt: '2026-10-26'
  },
  {
    id: 'PO-2838', greenId: 'Gc-11', selectedGreenId: 'Gc-11', qty: 2000,
    source: 'Local Lot L-1171', total: 7800, requiredDate: '2026-10-28',
    expectedDate: '2026-10-26', status: 'Recommended', isAlternate: false, createdAt: '2026-10-25'
  },
];

export const TRANSFERS = [
  {
    id: 'TR-501', warehouse: 'WH-02 Dallas', destination: 'Austin Local — Site 04',
    greenId: 'Gb-04', lot: 'L-2201', qty: 1200,
    dispatchDate: '2026-10-31', expectedArrival: '2026-11-02', status: 'In Transit',
    relatedOrder: 'PO-2841'
  },
  {
    id: 'TR-498', warehouse: 'WH-01 Chicago', destination: 'Austin Local — Site 04',
    greenId: 'Gi-12', lot: 'L-2188', qty: 600,
    dispatchDate: '2026-10-28', expectedArrival: '2026-10-31', status: 'Received',
    relatedOrder: 'PO-2835'
  },
  {
    id: 'TR-502', warehouse: 'WH-03 Portland', destination: 'Austin Local — Site 04',
    greenId: 'Gd-09', lot: 'L-2220', qty: 500,
    dispatchDate: '2026-11-03', expectedArrival: '2026-11-07', status: 'Planned',
    relatedOrder: 'PO-2839'
  },
];

export const ALERTS = [
  { id: 'ALT-001', severity: 'critical', type: 'below_threshold', greenId: 'Gd-09', message: 'Gd-09 below minimum — 250 / 700 kg', timestamp: '2026-11-01T12:00:00', action: 'Create order', actionLink: '/create-order' },
  { id: 'ALT-002', severity: 'critical', type: 'no_feasible', orderId: 'PO-2839', message: 'PO-2839 no feasible option — 4 scenarios attempted', timestamp: '2026-11-01T11:45:00', action: 'Review', actionLink: '/orders/PO-2839' },
  { id: 'ALT-003', severity: 'warning', type: 'transfer_delay', transferId: 'TR-501', message: 'TR-501 delayed 2 days — new ETA Nov 04', timestamp: '2026-11-01T10:30:00', action: 'Track', actionLink: '/transfers' },
  { id: 'ALT-004', severity: 'info', type: 'alternate_approved', greenId: 'Gc-19', message: 'Gc-19 approved as alt to Gc-17 — see Catalogue', timestamp: '2026-11-01T09:15:00', action: 'View', actionLink: '/catalogue' },
  { id: 'ALT-005', severity: 'critical', type: 'below_threshold', greenId: 'Gb-04', message: 'Gb-04 below minimum — 500 / 1200 kg', timestamp: '2026-10-31T17:00:00', action: 'Create order', actionLink: '/create-order' },
];

export const MONTHLY_SPEND = [
  { month: 'May', spend: 380, savings: 0 },
  { month: 'Jun', spend: 410, savings: 0 },
  { month: 'Jul', spend: 395, savings: 18 },
  { month: 'Aug', spend: 420, savings: 28 },
  { month: 'Sep', spend: 445, savings: 35 },
  { month: 'Oct', spend: 412, savings: 48 },
];

export const THRESHOLD_CHART_DATA = [
  { id: 'Gd-09', name: 'Yirgacheffe', available: 250, threshold: 700, status: 'critical' },
  { id: 'Gb-04', name: 'Colombia Supremo', available: 500, threshold: 1200, status: 'critical' },
  { id: 'Gf-22', name: 'Guatemala Antigua', available: 1880, threshold: 2000, status: 'low' },
  { id: 'Gc-11', name: 'Brazil Cerrado', available: 3200, threshold: 2000, status: 'healthy' },
  { id: 'Ga-17', name: 'Kenya AA\'s 1', available: 3400, threshold: 2500, status: 'healthy' },
  { id: 'Ge-31', name: 'Sumatra Mandheling', available: 2360, threshold: 1500, status: 'healthy' },
  { id: 'Gh-08', name: 'Costa Rica Tarrazu', available: 1620, threshold: 1200, status: 'healthy' },
];

export const ANALYTICS_DATA = {
  totalSpend: 412000,
  avgCostPerKg: 4.18,
  estimatedSavings: 14200,
  onTimeRate: 92,
  avgLeadTime: 4.6,
  altFulfillmentRate: 31,
  feasibleRate: 88,
  belowThreshold: 6,
  stockoutFrequency: 2,
};

// Fulfillment recommendation engine output (for order Gb-04, 1200 kg, due Nov 05)
export const FULFILLMENT_OPTIONS = [
  {
    rank: 1,
    scenario: 'SCENARIO 2 • LOCAL • ALTERNATE',
    greenId: 'Gc-14',
    greenName: 'Brazil Cerrado Natural',
    source: 'Austin Local',
    lot: 'L-1171',
    sourceSite: 'Local',
    isSameGreen: false,
    isAlternate: true,
    available: 2400,
    beanCost: 4680,
    transferCost: 132,
    handlingCost: 300,
    totalDelivered: 5112,
    perKg: 4.26,
    arrivalDate: '2026-10-30',
    feasible: true,
    badge: 'Recommended',
    savingsVsBaseline: 1188,
    reason: 'Lowest total delivered cost. In-hand stock, no transfer, arrives 6 days early. Approved alternate (one-way: Gb-04 → Gc-14).',
    costBreakdown: { bean: 4680, handling: 132, transfer: 0, expedite: 300 },
  },
  {
    rank: 2,
    scenario: 'SCENARIO 3 • CENTRAL • SAME GREEN',
    greenId: 'Gb-04',
    greenName: 'Colombia Supremo (exact)',
    source: 'WH-02 Dallas',
    sourceSite: 'Central',
    isSameGreen: true,
    isAlternate: false,
    available: 5200,
    beanCost: 4680,
    transferCost: 420,
    handlingCost: 110,
    totalDelivered: 5412,
    perKg: 4.51,
    arrivalDate: '2026-11-02',
    feasible: true,
    badge: null,
    savingsVsBaseline: 339,
    reason: 'Exact match, $300 more than Option 1 due to $420 freight + $110 handling. Still arrives 3 days before deadline.',
    costBreakdown: { bean: 4680, handling: 110, transfer: 420, expedite: 0 },
  },
  {
    rank: 3,
    scenario: 'SCENARIO 4 • CENTRAL • ALTERNATE',
    greenId: 'Gi-12',
    greenName: 'Huila Washed (approved alt)',
    source: 'WH-01 Chicago',
    sourceSite: 'Central',
    isSameGreen: false,
    isAlternate: true,
    available: 3100,
    beanCost: 5040,
    transferCost: 610,
    handlingCost: 240,
    totalDelivered: 5890,
    perKg: 4.91,
    arrivalDate: '2026-11-03',
    feasible: true,
    badge: null,
    savingsVsBaseline: 410,
    reason: 'Feasible alternate but higher freight ($610) from Chicago. Backup if local lot is held.',
    costBreakdown: { bean: 5040, handling: 240, transfer: 610, expedite: 0 },
  },
  {
    rank: 4,
    scenario: 'SCENARIO 1 • LOCAL • SAME GREEN',
    greenId: 'Gb-04',
    greenName: 'Colombia Supremo (exact)',
    source: 'Austin Local',
    lot: 'L-1180',
    sourceSite: 'Local',
    isSameGreen: true,
    isAlternate: false,
    available: 500,
    beanCost: null,
    transferCost: null,
    handlingCost: null,
    totalDelivered: null,
    perKg: null,
    arrivalDate: null,
    feasible: false,
    excludedReason: 'Only 500 kg available after 320 kg reserved. Cannot cover 1,200 kg. Suggested: combine is not allowed — single-source rule.',
    badge: 'Excluded',
    costBreakdown: null,
  },
  {
    rank: 5,
    scenario: 'SCENARIO 3 • CENTRAL • SAME GREEN',
    greenId: 'Gb-04',
    greenName: 'Gb-04 ex WH-03 Portland',
    source: 'WH-03 Portland',
    sourceSite: 'Central',
    isSameGreen: true,
    isAlternate: false,
    available: 0,
    incomingQty: 4000,
    incomingEta: '2026-11-07',
    beanCost: null,
    transferCost: null,
    handlingCost: null,
    totalDelivered: null,
    perKg: null,
    arrivalDate: '2026-11-09',
    feasible: false,
    excludedReason: 'Inbound arrives Nov 07, earliest Austin delivery Nov 09 — 4 days late. Incoming not counted as available. Excluded as infeasible.',
    badge: 'Excluded',
    costBreakdown: null,
  },
];

