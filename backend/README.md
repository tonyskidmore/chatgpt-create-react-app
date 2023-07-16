Configure python environment:

````bash

conda create -n chatgpt-backend python=3.9
conda activate chatgpt-backend
pip install -r requirements.txt

````

Run the app:

````bash

python app.py

````

To test

````bash

curl \
  --request POST \
  --header  'accept: application/json' \
  --header  'Content-Type: application/json' \
  --data '{"text": "Hello, world","sender": "User"}' \
  'http://localhost:8000/message/'

````

## Docker

docker build -t chatgpt-backend .


````bash

# docker network create chatnet
docker network ls

docker run --rm -d -p 8000:8000 --net=bridge -e OPENAI_API_KEY="$OPENAI_API_KEY" --name chatgpt-backend chatgpt-backend

# 172.17.0.2
# docker run -d -p 8000:8000 --net=bridge -e REDIS_URL="redis://172.17.0.2:6379" -e OPENAI_API_KEY="$OPENAI_API_KEY" --name chatgpt-backend chatgpt-backend

docker run --rm -d -p 3000:80 --net=bridge -e REACT_APP_API_URL='http://localhost:8000' --name react-chatgpt react-chatgpt

docker run --rm -p 6379:6379 -d --net=bridge --name redis redis:7

docker exec -it react-chatgpt sh

npm install -g redis-commander
redis-commander
# Using scan instead of keys
# No Save: false
# listening on 0.0.0.0:8081
# access with browser at http://127.0.0.1:8081
# Redis Connection localhost:6379 using Redis DB #1
# Redis Connection localhost:6379 using Redis DB #0

docker pull rediscommander/redis-commander
docker run --rm -d -p 8081:8081 --net=bridge --name redis-commander rediscommander/redis-commander

curl \
  --request POST \
  --header  'accept: application/json' \
  --header  'Content-Type: application/json' \
  --data '{"text": "Hello, world","sender": "User"}' \
  http://chatgpt-backend:8000/message/

{"text":"dlrow ,olleH","sender":"chatGpt"}

````

In react app (F12 tools):
REACT_APP_API_URL: http://chatgpt-backend:8000
POST http://chatgpt-backend:8000/message/ net::ERR_NAME_NOT_RESOLVED
