export function fcfs(procs) {
    // procs is array of {id, at, bt, prio, color}
    let sortedProcs = [...procs].sort((a, b) => a.at - b.at);
    let time = 0;
    let result = [];
    let gantt = [];

    for (let p of sortedProcs) {
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

export function sjf(procs) {
    let time = 0;
    let n = procs.length;
    let visited = Array(n).fill(false);
    let result = [];
    let gantt = [];
    let completed = 0;
    // deep copy
    let processList = [...procs];

    while (completed < n) {
        let idx = -1;
        let min_bt = Infinity;

        for (let i = 0; i < n; i++) {
            if (processList[i].at <= time && !visited[i]) {
                if (processList[i].bt < min_bt) {
                    min_bt = processList[i].bt;
                    idx = i;
                }
            }
        }

        if (idx === -1) {
            time += 1;
            continue;
        }

        let p = processList[idx];
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

export function round_robin(procs, tq) {
    let queue = [];
    let time = 0;
    let n = procs.length;
    
    let processList = [...procs];
    let remaining_bt = [...processList.map(p => p.bt)];
    let visited = Array(n).fill(false);
    let completed = 0;
    let result = [];
    let gantt = [];

    while (completed < n) {
        // Enqueue newly arrived
        for (let i = 0; i < n; i++) {
            if (processList[i].at <= time && !visited[i]) {
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

        gantt.push({id: processList[idx].id, start, completion: time, color: processList[idx].color});

        if (remaining_bt[idx] === 0) {
            let completion = time;
            let tat = completion - processList[idx].at;
            let wt = tat - processList[idx].bt;
            result.push({...processList[idx], start, completion, tat, wt});
            completed += 1;
        }

        // Enqueue arriving processes during execution
        for (let i = 0; i < n; i++) {
            if (processList[i].at <= time && !visited[i]) {
                queue.push(i);
                visited[i] = true;
            }
        }

        if (remaining_bt[idx] > 0) {
            queue.push(idx);
        }
    }
    return { result, gantt };
}

export function priority_sched(procs) {
    let time = 0;
    let n = procs.length;
    let processList = [...procs];
    let visited = Array(n).fill(false);
    let result = [];
    let gantt = [];
    let completed = 0;

    while (completed < n) {
        let idx = -1;
        let highest_priority = Infinity; // Lower number = higher priority

        for (let i = 0; i < n; i++) {
            if (processList[i].at <= time && !visited[i]) {
                if (processList[i].prio < highest_priority) {
                    highest_priority = processList[i].prio;
                    idx = i;
                }
            }
        }

        if (idx === -1) {
            time += 1;
            continue;
        }

        let p = processList[idx];
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
