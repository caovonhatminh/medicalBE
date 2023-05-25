docker run -d -p 5432:5432 --name pg -e POSTGRES_PASSWORD=kltn -e POSTGRES_DB=medical postgres:12.12

docker build -t medical-be . --no-cache
docker run -d -p 5050:5050 --name be medical-be:latest

docker build -t medical-fe . --no-cache
docker run -d -p 3000:3000 --name fe medical-fe:latest