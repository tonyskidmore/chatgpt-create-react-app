# chatgpt-create-react-app

## docker-compose

Run containers:

````bash

docker compose up --pull always

````

or in detached mode:

````bash

docker compose up --pull always --detach

````
Stop containers:

````bash

docker compose down (or Ctl + C if not running in detached mode)

````

or down and remove volumes (clears Redis data), even after Ctrl + C has been pressed in non-detached mode.

````bash

docker compose down --volumes

````

Remove stopped containers

````bash

docker compose rm --force

````