export const ENABLE_TESTING_TICKET = true; // Set to false to disable/remove the K1 test ticket

export const TICKET_TIERS = {
  STANDARD: {
    id: 'standard',
    name: 'Standard Delegate Pass',
    price: 500,
    currency: 'ZMW',
    description: 'Full Day Summit & Evening Networking Access'
  },
  TESTING: {
    id: 'testing',
    name: 'Testing Ticket (Live Deposit Verification)',
    price: 1,
    currency: 'ZMW',
    description: 'Temporary K1 test pass to verify merchant account deposits'
  }
} as const;

export type TicketTierId = keyof typeof TICKET_TIERS;

export const EVENT_DETAILS = {
  id: 'founders-connect-2026',
  name: 'LEAP NETWORKS – FOUNDERS CONNECT',
  tagline: 'Empowering African Entrepreneurs & High-Impact Builders',
  date: '10 October 2026',
  dateISO: '2026-10-10',
  time: '12:00 PM – 10:00 PM',
  venue: 'August Loft Water Falls',
  city: 'Lusaka, Zambia',
  ticketPriceZMW: 500,
  testingPriceZMW: 1,
  currency: 'ZMW',
  contactPhone: '0979333751',
  contactEmail: 'connect@leapnetworks.org',
  speakers: [
    {
      name: 'Dr David Nama',
      title: 'Chairman, Dana Group',
      role: 'Keynote Speaker',
      color: 'bg-amber-600'
    },
    {
      name: 'Kenneth Obiajulu',
      title: 'Co-Founder, Agricop',
      role: 'AgriTech Pioneer',
      color: 'bg-amber-500'
    },
    {
      name: 'Peter Nyumbu',
      title: 'Business Strategist',
      role: 'Strategy & Growth',
      color: 'bg-orange-600'
    },
    {
      name: 'Zindaba Hanzala',
      title: 'Founder, Mulimi',
      role: 'Ecosystem Builder',
      color: 'bg-orange-500'
    },
    {
      name: 'Mr Njekwa Anamela',
      title: 'LEAP Chairman',
      role: 'Host & Leadership',
      color: 'bg-amber-600'
    }
  ]
} as const;

export const PAYMENT_STATUSES = {
  PENDING: 'PENDING',
  SUCCESSFUL: 'SUCCESSFUL',
  FAILED: 'FAILED',
  CANCELLED: 'CANCELLED'
} as const;

export type PaymentStatus = typeof PAYMENT_STATUSES[keyof typeof PAYMENT_STATUSES];

export const PAYMENT_METHODS = {
  MOBILE_MONEY: 'MOBILE_MONEY',
  CARD: 'CARD'
} as const;

export type PaymentMethod = typeof PAYMENT_METHODS[keyof typeof PAYMENT_METHODS];
