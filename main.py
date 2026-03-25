n = int(input("Enter number of processes: "))

processes = []

for i in range(n):
    pid = f"P{i+1}"
    at = int(input(f"Arrival Time for {pid}: "))
    bt = int(input(f"Burst Time for {pid}: "))
    processes.append([pid, at, bt])

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
