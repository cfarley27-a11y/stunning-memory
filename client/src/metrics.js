export function computeMetrics(applications) {
  const total = applications.length;
  const byStage = {
    applied: 0,
    interview_scheduled: 0,
    interviewed: 0,
    accepted: 0,
    rejected: 0,
  };
  applications.forEach((a) => {
    byStage[a.stage] = (byStage[a.stage] || 0) + 1;
  });

  const advanced = total - byStage.applied;
  const reachedInterviewStage = byStage.interviewed + byStage.accepted + byStage.rejected;
  const decided = byStage.accepted + byStage.rejected;

  const pct = (numerator, denominator) =>
    denominator === 0 ? null : Math.round((numerator / denominator) * 100);

  return {
    total,
    byStage,
    responseRate: pct(advanced, total),
    interviewRate: pct(reachedInterviewStage, total),
    offerRate: pct(byStage.accepted, total),
    winRate: pct(byStage.accepted, decided),
  };
}
