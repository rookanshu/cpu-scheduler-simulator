import React from 'react';

function GanttChart({ gantt }) {
  if (!gantt || gantt.length === 0) return null;

  let totalTime = gantt[gantt.length - 1].completion;
  let lastEnd = 0;
  
  let fullGantt = [];
  gantt.forEach(g => {
      if (g.start > lastEnd) {
          fullGantt.push({id: 'IDLE', start: lastEnd, completion: g.start, color: 'rgba(255,255,255,0.05)'});
      }
      fullGantt.push(g);
      lastEnd = g.completion;
  });

  let points = new Set([0]);
  fullGantt.forEach(g => points.add(g.completion));
  let sortedPoints = Array.from(points).sort((a,b)=>a-b);

  return (
    <div className="card glass-panel gantt-card">
      <h3>Gantt Chart</h3>
      <div className="gantt-chart-container">
        {fullGantt.map((g, i) => {
          let duration = g.completion - g.start;
          let percentage = (duration / totalTime) * 100;
          return (
            <div 
              key={i} 
              className="gantt-block" 
              style={{ width: `${percentage}%`, backgroundColor: g.color }}
            >
              {g.id !== 'IDLE' ? g.id : ''}
            </div>
          );
        })}
      </div>
      <div className="gantt-axis">
        {sortedPoints.map((p, i) => {
          let percentage = (p / totalTime) * 100;
          return (
            <div key={i} className="time-marker" style={{ left: `${percentage}%` }}>
              {p}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default GanttChart;
