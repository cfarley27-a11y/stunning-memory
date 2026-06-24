import { useState } from 'react';
import Card from './Card.jsx';

export default function Column({ stage, applications, draggingId, onDragStart, onDragEnd, onDrop, onCardClick }) {
  const [dragOver, setDragOver] = useState(false);

  return (
    <div
      className={`column${dragOver ? ' drag-over' : ''}`}
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragOver(false);
        onDrop(stage.key);
      }}
    >
      <div className={`column-header stage-${stage.key}`}>
        <span className="stage-dot" />
        {stage.label}
        <span className="column-count">{applications.length}</span>
      </div>

      {applications.length === 0 && <div className="empty-column">No applications</div>}

      {applications.map((application) => (
        <Card
          key={application.id}
          application={application}
          isDragging={draggingId === application.id}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          onClick={onCardClick}
        />
      ))}
    </div>
  );
}
