import { useEffect, useState } from 'react';
import Board from './components/Board.jsx';
import ApplicationModal from './components/ApplicationModal.jsx';
import { api } from './api.js';

function App() {
  const [applications, setApplications] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .list()
      .then(setApplications)
      .catch((e) => setError(e.message));
  }, []);

  const openNew = () => {
    setSelected(null);
    setShowModal(true);
  };

  const openExisting = (application) => {
    setSelected(application);
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  const handleStageChange = async (id, stage) => {
    try {
      const updated = await api.update(id, { stage });
      setApplications((apps) => apps.map((a) => (a.id === id ? updated : a)));
    } catch (e) {
      setError(e.message);
    }
  };

  const handleSave = async (form) => {
    try {
      if (selected) {
        const updated = await api.update(selected.id, form);
        setApplications((apps) => apps.map((a) => (a.id === selected.id ? updated : a)));
        setSelected(updated);
      } else {
        const created = await api.create(form);
        setApplications((apps) => [...apps, created]);
        setShowModal(false);
      }
    } catch (e) {
      setError(e.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.remove(id);
      setApplications((apps) => apps.filter((a) => a.id !== id));
      setShowModal(false);
    } catch (e) {
      setError(e.message);
    }
  };

  const handleAddInterview = async (data) => {
    try {
      const updated = await api.addInterview(selected.id, data);
      setApplications((apps) => apps.map((a) => (a.id === selected.id ? updated : a)));
      setSelected(updated);
    } catch (e) {
      setError(e.message);
    }
  };

  const handleRemoveInterview = async (interviewId) => {
    try {
      const updated = await api.removeInterview(selected.id, interviewId);
      setApplications((apps) => apps.map((a) => (a.id === selected.id ? updated : a)));
      setSelected(updated);
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div className="app">
      <div className="app-header">
        <div>
          <h1>Application Tracker</h1>
          <p>Drag a card to move it through the pipeline, or click it to edit.</p>
        </div>
        <button className="btn btn-primary" onClick={openNew}>
          + Add Application
        </button>
      </div>

      {error && <p style={{ color: '#b8463f' }}>{error}</p>}

      <Board applications={applications} onStageChange={handleStageChange} onCardClick={openExisting} />

      {showModal && (
        <ApplicationModal
          application={selected}
          onClose={closeModal}
          onSave={handleSave}
          onDelete={handleDelete}
          onAddInterview={handleAddInterview}
          onRemoveInterview={handleRemoveInterview}
        />
      )}
    </div>
  );
}

export default App;
