import React, { useState } from 'react';

function ProcessManager({ algorithm, processes, onAddProcess, onRemoveProcess, onClear, onRandomize, onSimulate }) {
  const [at, setAt] = useState(0);
  const [bt, setBt] = useState(1);
  const [prio, setPrio] = useState(1);
  
  const showPrio = algorithm === 'priority';

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddProcess(at, bt, prio);
    setAt(at + 1);
    setBt(Math.floor(Math.random() * 5) + 1);
    setPrio(Math.floor(Math.random() * 5) + 1);
  };

  return (
    <div className="card glass-panel process-panel">
      <div className="panel-header">
        <h2>Manage Processes</h2>
        <div className="actions">
          <button onClick={onRandomize} className="btn btn-icon" title="Generate Random Processes">🎲</button>
          <button onClick={onClear} className="btn btn-icon" title="Clear All">🗑️</button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="process-form">
        <div className="input-row">
          <div className="form-group">
            <label htmlFor="arrival-time">Arrival Time</label>
            <input type="number" id="arrival-time" min="0" value={at} onChange={e => setAt(Number(e.target.value))} required className="custom-input" />
          </div>
          <div className="form-group">
            <label htmlFor="burst-time">Burst Time</label>
            <input type="number" id="burst-time" min="1" value={bt} onChange={e => setBt(Number(e.target.value))} required className="custom-input" />
          </div>
          {showPrio && (
            <div className="form-group" id="priority-group">
              <label htmlFor="priority">Priority (Low # = High Pri)</label>
              <input type="number" id="priority" min="1" value={prio} onChange={e => setPrio(Number(e.target.value))} className="custom-input" />
            </div>
          )}
          <button type="submit" className="btn btn-primary add-btn">Add</button>
        </div>
      </form>

      <div className="table-container">
        <table className="data-table" id="input-table">
          <thead>
            <tr>
              <th>Color</th>
              <th>PID</th>
              <th>Arrival Time</th>
              <th>Burst Time</th>
              {showPrio && <th>Priority</th>}
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {processes.map((p) => (
              <tr key={p.id}>
                <td><span className="color-dot" style={{ backgroundColor: p.color }}></span></td>
                <td>{p.id}</td>
                <td>{p.at}</td>
                <td>{p.bt}</td>
                {showPrio && <td>{p.prio}</td>}
                <td><button className="action-btn" onClick={() => onRemoveProcess(p.id)}>✖</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button onClick={onSimulate} className="btn btn-simulate glow-btn">SIMULATE</button>
    </div>
  );
}

export default ProcessManager;
