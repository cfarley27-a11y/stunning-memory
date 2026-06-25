const crypto = require('crypto');

function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

function daysFromNow(n) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}

function buildSeedData() {
  const now = new Date().toISOString();

  const make = (overrides) => ({
    id: crypto.randomUUID(),
    jobUrl: '',
    notes: '',
    interviews: [],
    decisionNotes: '',
    createdAt: now,
    updatedAt: now,
    ...overrides,
  });

  return [
    make({
      company: 'Northwind Labs',
      role: 'Frontend Engineer',
      jobUrl: 'https://example.com/jobs/northwind-frontend',
      appliedDate: daysAgo(3),
      stage: 'applied',
      notes: 'Applied through their careers page. Referral from a former coworker.',
    }),
    make({
      company: 'Contoso Cloud',
      role: 'Full Stack Developer',
      jobUrl: 'https://example.com/jobs/contoso-fullstack',
      appliedDate: daysAgo(9),
      stage: 'interview_scheduled',
      notes: 'Recruiter reached out directly on LinkedIn.',
      interviews: [
        { id: crypto.randomUUID(), date: daysFromNow(2), time: '14:00', type: 'Phone Screen', notes: 'With hiring manager' },
      ],
    }),
    make({
      company: 'Globex Systems',
      role: 'Backend Engineer',
      jobUrl: 'https://example.com/jobs/globex-backend',
      appliedDate: daysAgo(15),
      stage: 'interviewed',
      notes: 'Take-home assignment went well.',
      interviews: [
        { id: crypto.randomUUID(), date: daysAgo(8), time: '10:00', type: 'Phone Screen', notes: '' },
        { id: crypto.randomUUID(), date: daysAgo(2), time: '13:30', type: 'Technical Interview', notes: 'Pairing exercise + system design' },
      ],
    }),
    make({
      company: 'Initech',
      role: 'Software Engineer II',
      jobUrl: 'https://example.com/jobs/initech-swe2',
      appliedDate: daysAgo(28),
      stage: 'accepted',
      notes: '',
      decisionNotes: 'Offer received: verbal offer pending written details.',
      interviews: [
        { id: crypto.randomUUID(), date: daysAgo(20), time: '11:00', type: 'Phone Screen', notes: '' },
        { id: crypto.randomUUID(), date: daysAgo(12), time: '15:00', type: 'Onsite Loop', notes: '4 rounds' },
      ],
    }),
    make({
      company: 'Umbrella Analytics',
      role: 'Data Engineer',
      jobUrl: 'https://example.com/jobs/umbrella-data-eng',
      appliedDate: daysAgo(35),
      stage: 'rejected',
      notes: '',
      decisionNotes: 'Passed after final round — went with a candidate with more pipeline experience.',
      interviews: [
        { id: crypto.randomUUID(), date: daysAgo(25), time: '09:30', type: 'Phone Screen', notes: '' },
        { id: crypto.randomUUID(), date: daysAgo(18), time: '14:00', type: 'Technical Interview', notes: '' },
      ],
    }),
  ];
}

module.exports = { buildSeedData };
