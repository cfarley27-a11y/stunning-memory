const path = require('path');
const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const { readAll, writeAll } = require('./db');
const { buildSeedData } = require('./seed');

const DEMO_MODE = process.env.DEMO_MODE === 'true';

if (DEMO_MODE) {
  writeAll(buildSeedData());
}

const app = express();
app.use(cors());
app.use(express.json());

const STAGES = ['applied', 'interview_scheduled', 'interviewed', 'accepted', 'rejected'];

app.get('/api/meta', (req, res) => {
  res.json({ resetEnabled: DEMO_MODE });
});

app.post('/api/reset', async (req, res) => {
  if (!DEMO_MODE) return res.status(403).json({ error: 'reset is disabled' });
  const seeded = buildSeedData();
  await writeAll(seeded);
  res.json(seeded);
});

app.get('/api/applications', async (req, res) => {
  res.json(await readAll());
});

app.post('/api/applications', async (req, res) => {
  const { company, role, jobUrl, appliedDate, notes, stage } = req.body;
  if (!company || !role) {
    return res.status(400).json({ error: 'company and role are required' });
  }
  if (stage && !STAGES.includes(stage)) {
    return res.status(400).json({ error: `stage must be one of ${STAGES.join(', ')}` });
  }
  const applications = await readAll();
  const now = new Date().toISOString();
  const application = {
    id: crypto.randomUUID(),
    company,
    role,
    jobUrl: jobUrl || '',
    appliedDate: appliedDate || now.slice(0, 10),
    notes: notes || '',
    stage: stage || 'applied',
    interviews: [],
    decisionNotes: '',
    createdAt: now,
    updatedAt: now,
  };
  applications.push(application);
  await writeAll(applications);
  res.status(201).json(application);
});

app.patch('/api/applications/:id', async (req, res) => {
  const applications = await readAll();
  const application = applications.find((a) => a.id === req.params.id);
  if (!application) return res.status(404).json({ error: 'not found' });

  const { company, role, jobUrl, appliedDate, notes, stage, decisionNotes } = req.body;
  if (stage && !STAGES.includes(stage)) {
    return res.status(400).json({ error: `stage must be one of ${STAGES.join(', ')}` });
  }
  if (company !== undefined) application.company = company;
  if (role !== undefined) application.role = role;
  if (jobUrl !== undefined) application.jobUrl = jobUrl;
  if (appliedDate !== undefined) application.appliedDate = appliedDate;
  if (notes !== undefined) application.notes = notes;
  if (stage !== undefined) application.stage = stage;
  if (decisionNotes !== undefined) application.decisionNotes = decisionNotes;
  application.updatedAt = new Date().toISOString();

  await writeAll(applications);
  res.json(application);
});

app.delete('/api/applications/:id', async (req, res) => {
  const applications = await readAll();
  const next = applications.filter((a) => a.id !== req.params.id);
  if (next.length === applications.length) return res.status(404).json({ error: 'not found' });
  await writeAll(next);
  res.status(204).end();
});

app.post('/api/applications/:id/interviews', async (req, res) => {
  const { date, time, type, notes } = req.body;
  if (!date) return res.status(400).json({ error: 'date is required' });

  const applications = await readAll();
  const application = applications.find((a) => a.id === req.params.id);
  if (!application) return res.status(404).json({ error: 'not found' });

  const interview = {
    id: crypto.randomUUID(),
    date,
    time: time || '',
    type: type || 'Interview',
    notes: notes || '',
  };
  application.interviews.push(interview);
  if (application.stage === 'applied') application.stage = 'interview_scheduled';
  application.updatedAt = new Date().toISOString();

  await writeAll(applications);
  res.status(201).json(application);
});

app.delete('/api/applications/:id/interviews/:interviewId', async (req, res) => {
  const applications = await readAll();
  const application = applications.find((a) => a.id === req.params.id);
  if (!application) return res.status(404).json({ error: 'not found' });

  application.interviews = application.interviews.filter((i) => i.id !== req.params.interviewId);
  application.updatedAt = new Date().toISOString();

  await writeAll(applications);
  res.json(application);
});

const clientDist = path.join(__dirname, '..', 'client', 'dist');
app.use(express.static(clientDist));
app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.join(clientDist, 'index.html'));
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`ATS server listening on http://localhost:${PORT}`);
});
