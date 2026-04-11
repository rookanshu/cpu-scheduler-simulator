import { useState, useEffect } from 'react'
import './App.css'
import ConfigurationPanel from './components/ConfigurationPanel'
import ProcessManager from './components/ProcessManager'
import ResultsPanel from './components/ResultsPanel'
import { fcfs, sjf, round_robin, priority_sched } from './utils/algorithms'

const COLORS = [
  '#6366f1', '#ec4899', '#10b981', '#f59e0b', 
  '#3b82f6', '#8b5cf6', '#ef4444', '#14b8a6',
  '#f97316', '#06b6d4', '#eab308', '#d946ef'
];

function App() {
  const [algorithm, setAlgorithm] = useState('fcfs');
  const [timeQuantum, setTimeQuantum] = useState(2);
  const [processes, setProcesses] = useState([]);
  const [processCounter, setProcessCounter] = useState(1);
  const [theme, setTheme] = useState('dark');
  const [simulationResult, setSimulationResult] = useState(null);

  useEffect(() => {
    document.body.className = theme === 'light' ? 'theme-light' : '';
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const handleAddProcess = (at, bt, prio) => {
    const newProcess = {
      id: `P${processCounter}`,
      at: Number(at),
      bt: Number(bt),
      prio: Number(prio),
      color: COLORS[(processCounter - 1) % COLORS.length]
    };
    setProcesses([...processes, newProcess]);
    setProcessCounter(prev => prev + 1);
  };

  const handleRemoveProcess = (id) => {
    setProcesses(processes.filter(p => p.id !== id));
  };

  const handleClear = () => {
    setProcesses([]);
    setProcessCounter(1);
    setSimulationResult(null);
  };

  const handleRandomize = () => {
    const count = Math.floor(Math.random() * 4) + 4; // 4 to 7
    const newProcs = [];
    let counter = processCounter;
    for (let i = 0; i < count; i++) {
       newProcs.push({
          id: `P${counter}`,
          at: Math.floor(Math.random() * 10),
          bt: Math.floor(Math.random() * 10) + 1,
          prio: Math.floor(Math.random() * 10) + 1,
          color: COLORS[(counter - 1) % COLORS.length]
       });
       counter++;
    }
    setProcesses(newProcs);
    setProcessCounter(counter);
    setSimulationResult(null);
  };

  const handleSimulate = () => {
    if (processes.length === 0) {
      alert("Please add at least one process.");
      return;
    }
    let res;
    if (algorithm === 'fcfs') {
      res = fcfs(processes);
    } else if (algorithm === 'sjf') {
      res = sjf(processes);
    } else if (algorithm === 'priority') {
      res = priority_sched(processes);
    } else if (algorithm === 'rr') {
      res = round_robin(processes, timeQuantum);
    }
    setSimulationResult(res);
  };

  return (
    <>
      <div className="background-stars"></div>
      <div className="container" style={{ position: 'relative' }}>
        <header style={{ position: 'relative' }}>
          <h1 className="glow-text">SCHEDULING ALGORITHM SIMULATOR</h1>
          <button 
            onClick={toggleTheme} 
            className="btn btn-icon" 
            style={{ position: 'absolute', right: 0, top: 0 }}
            title="Toggle Theme"
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </header>

        <div className="top-panels">
          <ConfigurationPanel 
            algorithm={algorithm}
            setAlgorithm={setAlgorithm}
            timeQuantum={timeQuantum}
            setTimeQuantum={setTimeQuantum}
          />
          <ProcessManager
            algorithm={algorithm}
            processes={processes}
            onAddProcess={handleAddProcess}
            onRemoveProcess={handleRemoveProcess}
            onClear={handleClear}
            onRandomize={handleRandomize}
            onSimulate={handleSimulate}
          />
        </div>

        {simulationResult && (
          <ResultsPanel result={simulationResult.result} gantt={simulationResult.gantt} />
        )}
      </div>
    </>
  )
}

export default App
