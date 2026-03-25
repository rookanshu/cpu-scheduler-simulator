n = int(input("Enter number of processes: "))
tq = int(input("Enter Time Quantum: "))
pr = int(input(f"Priority for {pid}: "))
processes.append([pid, at, bt, pr])

processes = []

for i in range(n):
    pid = f"P{i+1}"
    at = int(input(f"Arrival Time for {pid}: "))
    bt = int(input(f"Burst Time for {pid}: "))
    processes.append([pid, at, bt])

#FCFS
processes.sort(key=lambda x: x[1])

time = 0
result = []

for p in processes:
    pid, at, bt = p

    if time < at:
        time = at

    start = time
    completion = time + bt

    tat = completion - at
    wt = tat - bt

    result.append([pid, at, bt, start, completion, tat, wt])

    time = completion

print("\nPID AT BT ST CT TAT WT")
for r in result:
    print(*r)

avg_wt = sum(r[6] for r in result) / n
avg_tat = sum(r[5] for r in result) / n

print(f"\nAverage Waiting Time: {avg_wt:.3f}")
print(f"Average Turnaround Time: {avg_tat:.3f}")

#SJF
time = 0
completed = 0
n = len(processes)

visited = [False] * n
result = []

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


#Round Robin
from collections import deque

queue = deque()
time = 0
n = len(processes)

remaining_bt = [p[2] for p in processes]
arrival = [p[1] for p in processes]
pid_list = [p[0] for p in processes]

completed = 0
visited = [False] * n
result = []

while completed < n:
    for i in range(n):
        if arrival[i] <= time and not visited[i]:
            queue.append(i)
            visited[i] = True

    if not queue:
        time += 1
        continue

    idx = queue.popleft()

    if remaining_bt[idx] > tq:
        time += tq
        remaining_bt[idx] -= tq
    else:
        time += remaining_bt[idx]
        completion = time

        tat = completion - arrival[idx]
        wt = tat - processes[idx][2]

        result.append([pid_list[idx], arrival[idx], processes[idx][2], completion, tat, wt])

        remaining_bt[idx] = 0
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


#Proirity
time = 0
completed = 0
n = len(processes)

visited = [False] * n
result = []

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
