from collections import deque
import matplotlib.pyplot as plt

algo = input("Enter algorithm (fcfs/sjf/rr/priority): ").lower()

n = int(input("Enter number of processes: "))
processes = []

for i in range(n):
    pid = f"P{i+1}"
    at = int(input(f"Arrival Time for {pid}: "))
    bt = int(input(f"Burst Time for {pid}: "))
    
    if algo == "priority":
        pr = int(input(f"Priority for {pid}: "))
        processes.append([pid, at, bt, pr])
    else:
        processes.append([pid, at, bt])

if algo == "rr":
    tq = int(input("Enter Time Quantum: "))


def fcfs(processes):
    processes.sort(key=lambda x: x[1])
    time = 0
    result = []
    gantt = []

    for p in processes:
        pid, at, bt = p

        if time < at:
            time = at

        start = time
        completion = time + bt

        tat = completion - at
        wt = tat - bt

        result.append([pid, at, bt, start, completion, tat, wt])
        gantt.append((pid, start, completion))

        time = completion

    print("\nFCFS Scheduling")
    print("PID AT BT ST CT TAT WT")
    for r in result:
        print(*r)

    avg_wt = sum(r[6] for r in result) / len(processes)
    avg_tat = sum(r[5] for r in result) / len(processes)

    print(f"\nAverage Waiting Time: {avg_wt:.3f}")
    print(f"Average Turnaround Time: {avg_tat:.3f}")

    return gantt


def sjf(processes):
    time = 0
    completed = 0
    n = len(processes)

    visited = [False] * n
    result = []
    gantt = []

    while completed < n:
        idx = -1
        min_bt = float('inf')

        for i in range(n):
            if processes[i][1] <= time and not visited[i]:
                if processes[i][2] < min_bt:
                    min_bt = processes[i][2]
                    idx = i

        if idx == -1:
            time += 1
            continue

        pid, at, bt = processes[idx]

        start = time
        completion = time + bt

        tat = completion - at
        wt = tat - bt

        result.append([pid, at, bt, start, completion, tat, wt])
        gantt.append((pid, start, completion))

        time = completion
        visited[idx] = True
        completed += 1

    print("\nSJF Scheduling")
    print("PID AT BT ST CT TAT WT")
    for r in result:
        print(*r)

    avg_wt = sum(r[6] for r in result) / n
    avg_tat = sum(r[5] for r in result) / n

    print(f"\nAverage Waiting Time: {avg_wt:.3f}")
    print(f"Average Turnaround Time: {avg_tat:.3f}")

    return gantt


def round_robin(processes, tq):
    queue = deque()
    time = 0
    n = len(processes)

    remaining_bt = [p[2] for p in processes]
    arrival = [p[1] for p in processes]
    pid_list = [p[0] for p in processes]

    completed = 0
    visited = [False] * n
    result = []
    gantt = []

    while completed < n:
        for i in range(n):
            if arrival[i] <= time and not visited[i]:
                queue.append(i)
                visited[i] = True

        if not queue:
            time += 1
            continue

        idx = queue.popleft()

        start = time
        exec_time = min(tq, remaining_bt[idx])

        time += exec_time
        remaining_bt[idx] -= exec_time

        gantt.append((pid_list[idx], start, time))

        if remaining_bt[idx] == 0:
            completion = time
            tat = completion - arrival[idx]
            wt = tat - processes[idx][2]

            result.append([pid_list[idx], arrival[idx], processes[idx][2], completion, tat, wt])
            completed += 1

        for i in range(n):
            if arrival[i] <= time and not visited[i]:
                queue.append(i)
                visited[i] = True

        if remaining_bt[idx] > 0:
            queue.append(idx)

    print("\nRound Robin Scheduling")
    print("PID AT BT CT TAT WT")
    for r in result:
        print(*r)

    avg_wt = sum(r[5] for r in result) / n
    avg_tat = sum(r[4] for r in result) / n

    print(f"\nAverage Waiting Time: {avg_wt:.3f}")
    print(f"Average Turnaround Time: {avg_tat:.3f}")

    return gantt


def priority_sched(processes):
    time = 0
    completed = 0
    n = len(processes)

    visited = [False] * n
    result = []
    gantt = []

    while completed < n:
        idx = -1
        highest_priority = float('inf')

        for i in range(n):
            if processes[i][1] <= time and not visited[i]:
                if processes[i][3] < highest_priority:
                    highest_priority = processes[i][3]
                    idx = i

        if idx == -1:
            time += 1
            continue

        pid, at, bt, pr = processes[idx]

        start = time
        completion = time + bt

        tat = completion - at
        wt = tat - bt

        result.append([pid, at, bt, pr, start, completion, tat, wt])
        gantt.append((pid, start, completion))

        time = completion
        visited[idx] = True
        completed += 1

    print("\nPriority Scheduling")
    print("PID AT BT PR ST CT TAT WT")
    for r in result:
        print(*r)

    avg_wt = sum(r[7] for r in result) / n
    avg_tat = sum(r[6] for r in result) / n

    print(f"\nAverage Waiting Time: {avg_wt:.3f}")
    print(f"Average Turnaround Time: {avg_tat:.3f}")

    return gantt


def draw_gantt(gantt):
    fig, ax = plt.subplots()

    for pid, start, end in gantt:
        ax.barh(pid, end - start, left=start)
        ax.text(start + (end - start)/2, pid, pid, ha='center', va='center', color='white')

    ax.set_xlabel("Time")
    ax.set_ylabel("Processes")
    ax.set_title("Gantt Chart")

    plt.show()


if algo == "fcfs":
    gantt = fcfs(processes)

elif algo == "sjf":
    gantt = sjf(processes)

elif algo == "rr":
    gantt = round_robin(processes, tq)

elif algo == "priority":
    gantt = priority_sched(processes)

else:
    print("Invalid algorithm")
    gantt = []

if gantt:
    draw_gantt(gantt)



