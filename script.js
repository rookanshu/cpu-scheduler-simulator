// Process Array Structure: 
// [pid, arrival_time, burst_time, priority, color]
let processes = [];
let processCount = 0;

const colors = [
    '#6366f1', '#ec4899', '#10b981', '#f59e0b', 
    '#3b82f6', '#8b5cf6', '#ef4444', '#14b8a6',
    '#f97316', '#06b6d4', '#eab308', '#d946ef'
];

// DOM Elements
const algorithmSelect = document.getElementById('algorithm');
const tqGroup = document.getElementById('tq-group');
const priorityGroup = document.getElementById('priority-group');
const configPanel = document.querySelector('.alg-panel');
const prioCols = document.querySelectorAll('.prio-col');

const form = document.getElementById('process-form');
const arrivalInput = document.getElementById('arrival-time');
const burstInput = document.getElementById('burst-time');
const priorityInput = document.getElementById('priority');

const processListTbody = document.getElementById('process-list');
const btnClear = document.getElementById('btn-clear');
const btnRandom = document.getElementById('btn-random');
const btnSimulate = document.getElementById('btn-simulate');

const resultsPanel = document.getElementById('results-panel');
const ganttChart = document.getElementById('gantt-chart');
const ganttAxis = document.getElementById('gantt-axis');
const outputTableTbody = document.getElementById('result-list');
const avgWtElem = document.getElementById('avg-wt');
const avgTatElem = document.getElementById('avg-tat');

// Navigation Elements
const navSimulator = document.getElementById('nav-simulator');
const navComparison = document.getElementById('nav-comparison');
const comparisonView = document.getElementById('comparison-view');
const simulatorTopPanels = document.querySelector('.top-panels');
const headerTitle = document.querySelector('header h1');
const themeToggle = document.getElementById('theme-toggle');

// Comparison Table Elements
const comparisonTableBody = document.getElementById('comparison-table-body');
const recommendationContainer = document.getElementById('best-recommendation');

// Handlers for algorithm switch
algorithmSelect.addEventListener('change', (e) => {
    const alg = e.target.value;
    
    // Toggle Time Quantum
    if (alg === 'rr') {
        tqGroup.classList.remove('hidden');
    } else {
        tqGroup.classList.add('hidden');
    }

    // Toggle Priority
    if (alg === 'priority') {
        priorityGroup.classList.remove('hidden');
        prioCols.forEach(col => col.classList.remove('hidden'));
    } else {
        priorityGroup.classList.add('hidden');
        prioCols.forEach(col => col.classList.add('hidden'));
    }
    
    renderInputTable(); // Re-render to show/hide priority column
});

// Add Process
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const at = parseInt(arrivalInput.value);
    const bt = parseInt(burstInput.value);
    const prio = parseInt(priorityInput.value) || 1;
    
    processCount++;
    const pid = `P${processCount}`;
    const color = colors[(processCount - 1) % colors.length];
    
    processes.push({ id: pid, at, bt, prio, color });
    
    // Reset Form
    arrivalInput.value = at + 1; // Default to next arrival
    burstInput.value = Math.floor(Math.random() * 5) + 1;
    priorityInput.value = Math.floor(Math.random() * 5) + 1;
    
    renderInputTable();
});

// Remove Process
function removeProcess(id) {
    processes = processes.filter(p => p.id !== id);
    renderInputTable();
}

// Clear all
btnClear.addEventListener('click', () => {
    processes = [];
    processCount = 0;
    renderInputTable();
    resultsPanel.classList.add('hidden');
});

// Randomize
btnRandom.addEventListener('click', () => {
    processes = [];
    processCount = 0;
    const num = Math.floor(Math.random() * 4) + 4; // 4 to 7 processes
    
    for (let i = 0; i < num; i++) {
        processCount++;
        processes.push({
            id: `P${processCount}`,
            at: Math.floor(Math.random() * 10),
            bt: Math.floor(Math.random() * 10) + 1,
            prio: Math.floor(Math.random() * 10) + 1,
            color: colors[(processCount - 1) % colors.length]
        });
    }
    renderInputTable();
});

function renderInputTable() {
    processListTbody.innerHTML = '';
    const showPrio = algorithmSelect.value === 'priority';
    
    processes.forEach(p => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><span class="color-dot" style="background-color: ${p.color}"></span></td>
            <td>${p.id}</td>
            <td>${p.at}</td>
            <td>${p.bt}</td>
            ${showPrio ? `<td>${p.prio}</td>` : '<td class="hidden"></td>'}
            <td><button class="action-btn" onclick="removeProcess('${p.id}')">✖</button></td>
        `;
        processListTbody.appendChild(tr);
    });
}

// Navigation Handling
navSimulator.addEventListener('click', () => {
    setActiveNav('simulator');
});

navComparison.addEventListener('click', () => {
    if (processes.length === 0) {
        alert("Please add processes in the simulator first!");
        return;
    }
    setActiveNav('comparison');
    runComparison();
});

function setActiveNav(view) {
    if (view === 'simulator') {
        navSimulator.classList.add('active');
        navComparison.classList.remove('active');
        
        simulatorTopPanels.classList.remove('hidden');
        // Results panel remains as it is (it has its own hidden logic)
        comparisonView.classList.add('hidden');
    } else {
        navSimulator.classList.remove('active');
        navComparison.classList.add('active');
        
        simulatorTopPanels.classList.add('hidden');
        resultsPanel.classList.add('hidden');
        comparisonView.classList.remove('hidden');
    }
}

// Theme Toggle Handling
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-theme');
    const isLight = document.body.classList.contains('light-theme');
    themeToggle.innerText = isLight ? '☀️' : '🌙';
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
});

// Load saved theme
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') {
    document.body.classList.add('light-theme');
    themeToggle.innerText = '☀️';
}

// Simulation Core ----------------------------------------------------
btnSimulate.addEventListener('click', () => {
    if (processes.length === 0) return alert("Please add at least one process.");
    
    let result;
    const alg = algorithmSelect.value;
    
    // Deep copy for algorithms
    const procs = processes.map(p => ({...p}));
    
    if (alg === 'fcfs') {
        result = fcfs(procs);
    } else if (alg === 'sjf') {
        result = sjf(procs);
    } else if (alg === 'priority') {
        result = priority_sched(procs);
    } else if (alg === 'rr') {
        const tq = parseInt(document.getElementById('time-quantum').value) || 2;
        result = round_robin(procs, tq);
    }
    
    renderResults(result);
});

// Algorithms (Ported from main.py)
function fcfs(procs) {
    procs.sort((a, b) => a.at - b.at);
    let time = 0;
    let result = [];
    let gantt = [];

    for (let p of procs) {
        if (time < p.at) time = p.at;
        
        let start = time;
        let completion = time + p.bt;
        let tat = completion - p.at;
        let wt = tat - p.bt;
        
        result.push({...p, start, completion, tat, wt});
        gantt.push({id: p.id, start, completion, color: p.color});
        
        time = completion;
    }
    return { result, gantt };
}

function sjf(procs) {
    let time = 0;
    let n = procs.length;
    let visited = Array(n).fill(false);
    let result = [];
    let gantt = [];
    let completed = 0;

    while (completed < n) {
        let idx = -1;
        let min_bt = Infinity;

        for (let i = 0; i < n; i++) {
            if (procs[i].at <= time && !visited[i]) {
                if (procs[i].bt < min_bt) {
                    min_bt = procs[i].bt;
                    idx = i;
                }
            }
        }

        if (idx === -1) {
            time += 1;
            continue;
        }

        let p = procs[idx];
        let start = time;
        let completion = time + p.bt;
        let tat = completion - p.at;
        let wt = tat - p.bt;

        result.push({...p, start, completion, tat, wt});
        gantt.push({id: p.id, start, completion, color: p.color});

        time = completion;
        visited[idx] = true;
        completed += 1;
    }
    return { result, gantt };
}

function round_robin(procs, tq) {
    let queue = [];
    let time = 0;
    let n = procs.length;
    
    let remaining_bt = [...procs.map(p => p.bt)];
    let visited = Array(n).fill(false);
    let completed = 0;
    let result = [];
    let gantt = [];

    while (completed < n) {
        // Enqueue newly arrived
        for (let i = 0; i < n; i++) {
            if (procs[i].at <= time && !visited[i]) {
                queue.push(i);
                visited[i] = true;
            }
        }

        if (queue.length === 0) {
            time += 1;
            continue;
        }

        let idx = queue.shift();
        let start = time;
        let exec_time = Math.min(tq, remaining_bt[idx]);

        time += exec_time;
        remaining_bt[idx] -= exec_time;

        // Merge contiguous gantt blocks of same process if possible?
        // Standard RR shows each slice, so we append:
        gantt.push({id: procs[idx].id, start, completion: time, color: procs[idx].color});

        // Current process is done
        if (remaining_bt[idx] === 0) {
            let completion = time;
            let tat = completion - procs[idx].at;
            let wt = tat - procs[idx].bt;
            result.push({...procs[idx], start, completion, tat, wt});
            completed += 1;
        }

        // Enqueue any processes that arrived DURING this execution
        for (let i = 0; i < n; i++) {
            // we use < time here so if it arrives exactly at time, it goes to queue before the current process is re-added
            if (procs[i].at <= time && !visited[i]) {
                queue.push(i);
                visited[i] = true;
            }
        }

        // Re-enqueue current process if not done
        if (remaining_bt[idx] > 0) {
            queue.push(idx);
        }
    }
    return { result, gantt };
}

function priority_sched(procs) {
    let time = 0;
    let n = procs.length;
    let visited = Array(n).fill(false);
    let result = [];
    let gantt = [];
    let completed = 0;

    while (completed < n) {
        let idx = -1;
        let highest_priority = Infinity; // Lower number = higher priority

        for (let i = 0; i < n; i++) {
            if (procs[i].at <= time && !visited[i]) {
                if (procs[i].prio < highest_priority) {
                    highest_priority = procs[i].prio;
                    idx = i;
                }
            }
        }

        if (idx === -1) {
            time += 1;
            continue;
        }

        let p = procs[idx];
        let start = time;
        let completion = time + p.bt;
        let tat = completion - p.at;
        let wt = tat - p.bt;

        result.push({...p, start, completion, tat, wt});
        gantt.push({id: p.id, start, completion, color: p.color});

        time = completion;
        visited[idx] = true;
        completed += 1;
    }
    return { result, gantt };
}

// Rendering Results
function renderResults({ result, gantt }) {
    resultsPanel.classList.remove('hidden');
    
    // Sort output table by PID for nicer read
    let sortedResult = [...result].sort((a,b) => {
        return parseInt(a.id.substring(1)) - parseInt(b.id.substring(1));
    });
    
    outputTableTbody.innerHTML = '';
    let totalWt = 0;
    let totalTat = 0;

    sortedResult.forEach(r => {
        totalWt += r.wt;
        totalTat += r.tat;
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><span class="color-dot" style="background-color: ${r.color}; margin-right: 8px;"></span>${r.id}</td>
            <td>${r.at}</td>
            <td>${r.bt}</td>
            <td>${r.completion}</td>
            <td>${r.tat}</td>
            <td>${r.wt}</td>
        `;
        outputTableTbody.appendChild(tr);
    });

    avgWtElem.innerText = (totalWt / result.length).toFixed(2);
    avgTatElem.innerText = (totalTat / result.length).toFixed(2);

    renderGantt(gantt);
    resultsPanel.scrollIntoView({ behavior: 'smooth' });
}

function renderGantt(gantt) {
    ganttChart.innerHTML = '';
    ganttAxis.innerHTML = '';

    if (gantt.length === 0) return;

    let totalTime = gantt[gantt.length - 1].completion;
    let currentHtml = '';
    let axisHtml = '';

    // Fix for idle time gaps in gantt
    let lastEnd = 0;
    
    // We recreate gantt array to inject "Idle" blocks
    let fullGantt = [];
    gantt.forEach(g => {
        if (g.start > lastEnd) {
            fullGantt.push({id: 'IDLE', start: lastEnd, completion: g.start, color: 'rgba(255,255,255,0.05)'});
        }
        fullGantt.push(g);
        lastEnd = g.completion;
    });

    fullGantt.forEach((g, idx) => {
        let duration = g.completion - g.start;
        let percentage = (duration / totalTime) * 100;
        
        currentHtml += `
            <div class="gantt-block" style="width: ${percentage}%; background-color: ${g.color};">
                ${g.id !== 'IDLE' ? g.id : ''}
            </div>
        `;
    });

    // Generate Axis (Time markers)
    // Always add 0
    let points = new Set([0]);
    fullGantt.forEach(g => points.add(g.completion));
    let sortedPoints = Array.from(points).sort((a,b)=>a-b);
    
    sortedPoints.forEach(p => {
        let percentage = (p / totalTime) * 100;
        axisHtml += `<div class="time-marker" style="left: ${percentage}%">${p}</div>`;
    });

    ganttChart.innerHTML = currentHtml;
    ganttAxis.innerHTML = axisHtml;
}

// Comparison Benchmarking --------------------------------------------
function runComparison() {
    const algs = [
        { name: 'FCFS', id: 'fcfs' },
        { name: 'SJF', id: 'sjf' },
        { name: 'Priority', id: 'priority' },
        { name: 'Round Robin (TQ=2)', id: 'rr', tq: 2 },
        { name: 'Round Robin (TQ=5)', id: 'rr', tq: 5 }
    ];

    const results = algs.map(alg => {
        const procs = processes.map(p => ({...p}));
        let res;
        if (alg.id === 'rr') {
            res = round_robin(procs, alg.tq);
        } else if (alg.id === 'fcfs') {
            res = fcfs(procs);
        } else if (alg.id === 'sjf') {
            res = sjf(procs);
        } else if (alg.id === 'priority') {
            res = priority_sched(procs);
        }

        const totalWt = res.result.reduce((sum, r) => sum + r.wt, 0);
        const totalTat = res.result.reduce((sum, r) => sum + r.tat, 0);
        const avgWt = totalWt / processes.length;
        const avgTat = totalTat / processes.length;
        
        return { 
            name: alg.name, 
            avgWt, 
            avgTat, 
            efficiency: (100 / (avgWt + 1)).toFixed(2) // Mock efficiency metric
        };
    });

    renderComparisonTable(results);
    renderRecommendation(results);
}

function renderComparisonTable(results) {
    comparisonTableBody.innerHTML = '';
    
    // Find best avg waiting time
    const minWt = Math.min(...results.map(r => r.avgWt));

    results.forEach(res => {
        const isBest = res.avgWt === minWt;
        const tr = document.createElement('tr');
        if (isBest) tr.className = 'best-algo-row';
        
        tr.innerHTML = `
            <td>${res.name}</td>
            <td>${res.avgWt.toFixed(2)} ms</td>
            <td>${res.avgTat.toFixed(2)} ms</td>
            <td>${res.efficiency}%</td>
        `;
        comparisonTableBody.appendChild(tr);
    });
}

function renderRecommendation(results) {
    // Logic for "Best for Modern CPU"
    // Modern CPUs prioritize responsiveness and multitasking.
    // RR is generally the winner for interactive systems.
    
    const rrResult = results.find(r => r.name.startsWith('Round Robin'));
    const sjfResult = results.find(r => r.name === 'SJF');
    
    let best = rrResult;
    let reason = "Modern CPUs power interactive operating systems where responsiveness is key. <span class='modern-cpu-tag'>Round Robin</span> ensures fair distribution of CPU time, preventing any single process from hogging the system, which is crucial for modern multi-threaded environments.";
    
    if (sjfResult.avgWt < rrResult.avgWt * 0.7) {
        // If SJF is significantly better in waiting time, we mention it as an alternative for throughput
        reason += `<br><br><strong>Note:</strong> While SJF shows significantly lower waiting times in this simulation, it is often impractical in real CPUs because the next burst time is usually unknown.`;
    }

    recommendationContainer.innerHTML = `
        <div class="card glass-panel recommendation-card">
            <div class="recommendation-header">
                <span class="win-badge">WINNER</span>
                <h3>Recommended for Modern CPUs: ${best.name}</h3>
            </div>
            <div class="recommendation-content">
                <p>${reason}</p>
            </div>
        </div>
    `;
}

// Initial state
algorithmSelect.dispatchEvent(new Event('change'));
