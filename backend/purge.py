import shutil
import sys
from crontab import CronTab
import json


cron = CronTab(user="panda")


def purge(path):
    shutil.rmtree("/home/panda/kodash/content/" + path)

    for job in cron:
        if job.command == f"python3 /home/panda/kodash/purge.py {path}":
            job.delete()
            cron.write()

    jData = None
    with open("/home/panda/kodash/names.json", "r") as f:
        jData = json.load(f)

    del jData[path]

    with open("/home/panda/kodash/names.json", "w") as f:
        json.dump(jData, f)


if __name__ == "__main__":
    path = sys.argv[1]
    purge(path)
