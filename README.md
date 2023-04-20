# OSRS Grand Exchange Prices

A simple react app to display real-time grand exchange item prices using the osrs wiki API.

<img width="1501" alt="image" src="https://user-images.githubusercontent.com/43048325/210265471-813939ae-a182-4b6a-9891-844ce1a806b1.png">

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
