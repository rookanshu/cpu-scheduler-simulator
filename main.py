n = int(input("Enter number of processes: "))
processes = []

for i in range(n):
	pid = f"P{i+1}"
	at = int(input(f"Arrival Time for {pid}: "))
	bt = int(input(f"Burst Time for {pid}: "))
	
	processes.append([pid, at, bt])

print("\nProcesses entered:")
for p in processes:
	print(p)
