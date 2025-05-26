# courier-saas-portal
Courier Management Saas System

# Backend JAR (from root of project)
cd backend
mvn clean package -DskipTests
cp target/*.jar target/courier-saas.jar

# Build Docker images
cd ../docker
docker-compose build

# Tag
docker tag courier-backend yourdockerhubid/courier-backend:latest
docker tag courier-frontend yourdockerhubid/courier-frontend:latest

# Push
docker push yourdockerhubid/courier-backend:latest
docker push yourdockerhubid/courier-frontend:latest

docker pull yourdockerhubid/courier-backend:latest
docker pull yourdockerhubid/courier-frontend:latest
