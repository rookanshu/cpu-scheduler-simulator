import React from 'react';
import GanttChart from './GanttChart';

function ResultsPanel({ result, gantt }) {
  if (!result || result.length === 0) return null;

  let sortedResult = [...result].sort((a,b) => {
      return parseInt(a.id.substring(1)) - parseInt(b.id.substring(1));
  });

  let totalWt = 0;
  let totalTat = 0;
  sortedResult.forEach(r => {
    totalWt += r.wt;
    totalTat += r.tat;
  });

  const avgWt = (totalWt / result.length).toFixed(2);
  const avgTat = (totalTat / result.length).toFixed(2);

  return (
    <div className="results-panel">
      <h2 className="glow-text section-title">Simulation Results</h2>
      
      <GanttChart gantt={gantt} />

      <div className="metrics-grid">
        <div className="metric-card glass-panel">
          <div className="metric-title">Average Waiting Time</div>
          <div className="metric-value">{avgWt}</div>
        </div>
        <div className="metric-card glass-panel">
          <div className="metric-title">Average Turnaround Time</div>
          <div className="metric-value">{avgTat}</div>
        </div>
      </div>

      <div className="card glass-panel table-card">
        <h3>Process Details</h3>
        <div className="table-container">
          <table className="data-table" id="output-table">
            <thead>
              <tr>
                <th>PID</th>
                <th>Arrival Time</th>
                <th>Burst Time</th>
                <th>Completion Time</th>
                <th>Turnaround Time</th>
                <th>Waiting Time</th>
              </tr>
            </thead>
            <tbody>
              {sortedResult.map((r, i) => (
                <tr key={i}>
                  <td>
                    <span className="color-dot" style={{ backgroundColor: r.color, marginRight: '8px' }}></span>
                    {r.id}
                  </td>
                  <td>{r.at}</td>
                  <td>{r.bt}</td>
                  <td>{r.completion}</td>
                  <td>{r.tat}</td>
                  <td>{r.wt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ResultsPanel;
