from typing import List
from urllib import response
from fastapi import FastAPI, UploadFile, Query, Response, status
from fastapi.middleware.cors import CORSMiddleware
import aiofiles
from crontab import CronTab
import uvicorn
from pathlib import Path
import json
import datetime
import subprocess


# FastAPI instance
app = FastAPI()

# Allow all origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def copy_repo(git_url, name):
    subprocess.run(["git", "clone", git_url, name], cwd="content")


def update_repo(path):
    subprocess.run(["git", "pull"], cwd=path)


# Host Endpoint
@app.post("/host")
async def host(
    file: List[UploadFile],
    duration: str = Query(min_length=2, max_length=10, regex="^[\d]+[h | d | m]$"),
    path: str = Query(min_length=3, max_length=30, regex="^[\w]+$"),
):
    for f in file:
        Path(f"content/{path}").mkdir(parents=True, exist_ok=True)
        async with aiofiles.open(f"content/{path}/{f.filename}", "wb") as out:
            content = await f.read()
            await out.write(content)

    # Current time
    now = datetime.datetime.now()

    with CronTab(user="panda") as cron:
        job = cron.new(command=f"python3 /home/panda/kodash/purge.py {path}")

        if duration.endswith("h"):
            duration = int(duration[:-1])
            delay = now + datetime.timedelta(hours=duration)
            job.setall(delay.minute, delay.hour, delay.day, delay.month, None)
        elif duration.endswith("m"):
            duration = int(duration[:-1])
            delay = now + datetime.timedelta(minutes=duration + 1)
            job.setall(delay.minute, delay.hour, delay.day, delay.month, None)
        else:
            duration = int(duration[:-1])
            delay = now + datetime.timedelta(days=duration)
            job.setall(delay.minute, delay.hour, delay.day, delay.month, None)

    jData = None

    # Open JSON file and store data to jData
    with open("names.json", "r") as f:
        jData = json.load(f)

    # Add new key to jData
    jData[path] = 1

    # Write jData to JSON file
    with open("names.json", "w") as f:
        json.dump(jData, f)

    return {
        "status": "success",
    }


@app.get("/isvalid")
async def isvalid(
    response: Response, path: str = Query(min_length=3, max_length=30, regex="^[\w]+$")
):
    jData = None

    # Open JSON file and store data to jData
    with open("names.json", "r") as f:
        jData = json.load(f)

    # Check if path is in jData
    try:
        jData[path]
        response.status_code = status.HTTP_404_NOT_FOUND
        return {
            "status": "path not available",
        }
    except KeyError:
        return {
            "status": "path available",
        }


@app.get("/github/host")
async def github_host(
    response: Response,
    git_url: str,
    duration: str = Query(min_length=2, max_length=10, regex="^[\d]+[h | d | m]$"),
    path: str = Query(min_length=3, max_length=30, regex="^[\w]+$"),
):
    try:
        if not git_url.endswith(".git"):
            git_url = git_url + ".git"

        copy_repo(git_url, path)

        # Current time
        now = datetime.datetime.now()

        with CronTab(user="panda") as cron:
            job = cron.new(command=f"python3 /home/panda/kodash/purge.py {path}")

            if duration.endswith("h"):
                duration = int(duration[:-1])
                delay = now + datetime.timedelta(hours=duration)
                job.setall(delay.minute, delay.hour, delay.day, delay.month, None)
            elif duration.endswith("m"):
                duration = int(duration[:-1])
                delay = now + datetime.timedelta(minutes=duration + 1)
                job.setall(delay.minute, delay.hour, delay.day, delay.month, None)
            else:
                duration = int(duration[:-1])
                delay = now + datetime.timedelta(days=duration)
                job.setall(delay.minute, delay.hour, delay.day, delay.month, None)

        jData = None

        # Open JSON file and store data to jData
        with open("names.json", "r") as f:
            jData = json.load(f)

        # Add new key to jData
        jData[path] = 1

        # Write jData to JSON file
        with open("names.json", "w") as f:
            json.dump(jData, f)

        return {
            "status": "success",
        }

    except:
        response.status_code = status.HTTP_400_BAD_REQUEST
        return {
            "status": "invalid url",
        }


@app.get("/github/update")
async def github_update(
    response: Response,
    path: str = Query(min_length=3, max_length=30, regex="^[\w]+$"),
):
    try:
        update_repo(f"content/{path}")

        return {
            "status": "success",
        }
    except:
        response.status_code = status.HTTP_400_BAD_REQUEST
        return {
            "status": "invalid path",
        }


@app.delete("/delete")
async def delete(
    path: str = Query(min_length=3, max_length=30, regex="^[\w]+$"),
):
    subprocess.run(["python3", "purge.py", path])
    return {
        "status": "success",
    }


@app.get("/")
async def root():
    return {
        "status": "Welcome to Kodash",
    }


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
