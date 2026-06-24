export default function Card({ application, onClick, onDragStart, onDragEnd, isDragging }) {
  const upcoming = application.interviews[application.interviews.length - 1];

  return (
    <div
      className={`card${isDragging ? ' dragging' : ''}`}
      draggable
      onDragStart={(e) => onDragStart(e, application)}
      onDragEnd={onDragEnd}
      onClick={() => onClick(application)}
    >
      <div className="card-role">{application.role}</div>
      <div className="card-company">{application.company}</div>
      <div className="card-meta">
        <span>Applied {application.appliedDate}</span>
      </div>
      {application.jobUrl && (
        <div>
          <a
            className="card-link"
            href={application.jobUrl}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
          >
            View posting ↗
          </a>
        </div>
      )}
      {upcoming && (
        <div className="interview-badge">
          {upcoming.type}: {upcoming.date}
          {upcoming.time ? ` ${upcoming.time}` : ''}
        </div>
      )}
    </div>
  );
}
