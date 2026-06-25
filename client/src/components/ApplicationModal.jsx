import { useEffect, useState } from 'react';
import { STAGES } from '../stages.js';

const emptyForm = {
  company: '',
  role: '',
  jobUrl: '',
  appliedDate: new Date().toISOString().slice(0, 10),
  notes: '',
  stage: 'applied',
  decisionNotes: '',
};

const emptyInterview = { date: '', time: '', type: 'Phone Screen', notes: '' };

export default function ApplicationModal({ application, onClose, onSave, onDelete, onAddInterview, onRemoveInterview }) {
  const isEdit = Boolean(application);
  const [form, setForm] = useState(
    application
      ? {
          company: application.company,
          role: application.role,
          jobUrl: application.jobUrl,
          appliedDate: application.appliedDate,
          notes: application.notes,
          stage: application.stage,
          decisionNotes: application.decisionNotes,
        }
      : emptyForm
  );
  const [interviewForm, setInterviewForm] = useState(emptyInterview);

  // Re-sync the form when the underlying application changes server-side
  // (e.g. adding an interview auto-advances the stage) so a later Save
  // doesn't send back stale values and stomp that change.
  useEffect(() => {
    if (application) {
      setForm({
        company: application.company,
        role: application.role,
        jobUrl: application.jobUrl,
        appliedDate: application.appliedDate,
        notes: application.notes,
        stage: application.stage,
        decisionNotes: application.decisionNotes,
      });
    }
  }, [application?.updatedAt]);

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.company.trim() || !form.role.trim()) return;
    onSave(form);
  };

  const handleAddInterview = () => {
    if (!interviewForm.date) return;
    onAddInterview(interviewForm);
    setInterviewForm(emptyInterview);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>{isEdit ? 'Edit Application' : 'New Application'}</h2>

        <form onSubmit={handleSubmit}>
          <div className="field-row">
            <div className="field">
              <label>Company</label>
              <input value={form.company} onChange={update('company')} required autoFocus />
            </div>
            <div className="field">
              <label>Role</label>
              <input value={form.role} onChange={update('role')} required />
            </div>
          </div>

          <div className="field">
            <label>Job Posting URL</label>
            <input value={form.jobUrl} onChange={update('jobUrl')} placeholder="https://..." />
            <div className="url-hint">Saved as a quick link back to the posting — status isn't auto-checked.</div>
          </div>

          <div className="field-row">
            <div className="field">
              <label>Applied Date</label>
              <input type="date" value={form.appliedDate} onChange={update('appliedDate')} />
            </div>
            <div className="field">
              <label>Stage</label>
              <select value={form.stage} onChange={update('stage')}>
                {STAGES.map((s) => (
                  <option key={s.key} value={s.key}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="field">
            <label>Notes</label>
            <textarea value={form.notes} onChange={update('notes')} placeholder="Recruiter contact, referral, salary range, etc." />
          </div>

          {(form.stage === 'accepted' || form.stage === 'rejected') && (
            <div className="field">
              <label>{form.stage === 'accepted' ? 'Offer details' : 'Rejection reason / feedback'}</label>
              <textarea value={form.decisionNotes} onChange={update('decisionNotes')} />
            </div>
          )}

          {isEdit && (
            <>
              <div className="section-title">Interviews</div>
              {application.interviews.length === 0 && (
                <p className="url-hint" style={{ marginBottom: 10 }}>No interviews scheduled yet.</p>
              )}
              {application.interviews.map((iv) => (
                <div className="interview-row" key={iv.id}>
                  <div className="interview-info">
                    <div className="interview-type">{iv.type}</div>
                    <div className="interview-when">
                      {iv.date} {iv.time}
                      {iv.notes ? ` — ${iv.notes}` : ''}
                    </div>
                  </div>
                  <button type="button" className="icon-btn" onClick={() => onRemoveInterview(iv.id)}>
                    ✕
                  </button>
                </div>
              ))}

              <div className="add-interview-form">
                <div className="field">
                  <label>Type</label>
                  <input
                    value={interviewForm.type}
                    onChange={(e) => setInterviewForm((f) => ({ ...f, type: e.target.value }))}
                  />
                </div>
                <div className="field">
                  <label>Date</label>
                  <input
                    type="date"
                    value={interviewForm.date}
                    onChange={(e) => setInterviewForm((f) => ({ ...f, date: e.target.value }))}
                  />
                </div>
                <div className="field">
                  <label>Time</label>
                  <input
                    type="time"
                    value={interviewForm.time}
                    onChange={(e) => setInterviewForm((f) => ({ ...f, time: e.target.value }))}
                  />
                </div>
                <button type="button" className="btn btn-secondary btn-small" onClick={handleAddInterview}>
                  Add
                </button>
              </div>
            </>
          )}

          <div className="modal-actions">
            <div>
              {isEdit && (
                <button type="button" className="btn btn-danger" onClick={() => onDelete(application.id)}>
                  Delete
                </button>
              )}
            </div>
            <div className="modal-actions-right">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                {isEdit ? 'Save Changes' : 'Add Application'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
