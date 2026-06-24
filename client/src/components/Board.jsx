import { useState } from 'react';
import Column from './Column.jsx';
import { STAGES } from '../stages.js';

export default function Board({ applications, onStageChange, onCardClick }) {
  const [draggingId, setDraggingId] = useState(null);

  const handleDragStart = (e, application) => {
    setDraggingId(application.id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => setDraggingId(null);

  const handleDrop = (stageKey) => {
    if (draggingId) onStageChange(draggingId, stageKey);
    setDraggingId(null);
  };

  return (
    <div className="board">
      {STAGES.map((stage) => (
        <Column
          key={stage.key}
          stage={stage}
          applications={applications.filter((a) => a.stage === stage.key)}
          draggingId={draggingId}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDrop={handleDrop}
          onCardClick={onCardClick}
        />
      ))}
    </div>
  );
}
