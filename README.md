# OSRS Grand Exchange Prices

A simple react app to display and forecast real-time grand exchange item prices using the osrs wiki API.

![](./assets/demo.gif)

## Setup

#### Front-end

```shell
cd <project-directory>
npm init
npm start
```

#### Back-end

```shell
cd forecaster
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --host 127.0.0.1 --port 8000
```
