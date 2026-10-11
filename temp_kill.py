"""Temporary helper: stop whatever process is listening on TCP port 8000."""

import subprocess

PORT_SUFFIX = ":8000"


def listening_pids() -> set:
    output = subprocess.run(
        ["netstat", "-ano", "-p", "TCP"],
        capture_output=True,
        text=True,
    ).stdout

    pids = set()
    for line in output.splitlines():
        parts = line.split()
        if len(parts) >= 5 and parts[1].endswith(PORT_SUFFIX) and parts[3] == "LISTENING":
            pids.add(parts[4])
    return pids


def main() -> None:
    pids = listening_pids()
    if not pids:
        print("no listener on port 8000")
        return
    for pid in pids:
        result = subprocess.run(["taskkill", "/F", "/PID", pid], capture_output=True, text=True)
        print("pid {0}: {1}".format(pid, (result.stdout or result.stderr).strip()))


if __name__ == "__main__":
    main()
