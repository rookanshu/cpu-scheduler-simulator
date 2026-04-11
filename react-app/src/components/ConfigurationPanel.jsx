import React from 'react';

function ConfigurationPanel({ algorithm, setAlgorithm, timeQuantum, setTimeQuantum }) {
  return (
    <div className="card glass-panel alg-panel">
      <h2>Configuration</h2>
      
      <div className="form-group">
        <label htmlFor="algorithm">Select Algorithm</label>
        <select 
          id="algorithm" 
          className="custom-select" 
          value={algorithm} 
          onChange={(e) => setAlgorithm(e.target.value)}
        >
          <option value="fcfs">First Come First Serve (FCFS)</option>
          <option value="sjf">Shortest Job First (SJF - Non Preemptive)</option>
          <option value="priority">Priority Scheduling (Non Preemptive)</option>
          <option value="rr">Round Robin</option>
        </select>
      </div>

      {algorithm === 'rr' && (
        <div className="form-group" id="tq-group">
          <label htmlFor="time-quantum">Time Quantum</label>
          <input 
            type="number" 
            id="time-quantum" 
            min="1" 
            value={timeQuantum} 
            onChange={(e) => setTimeQuantum(Number(e.target.value))}
            className="custom-input" 
          />
        </div>
      )}
    </div>
  );
}

export default ConfigurationPanel;
