# Paired App Template (Docker + Docker Swarm)

This is a template for using Docker and Docker Swarm to run an Angular frontend and an Express backend with optional
worker services. The services are containerized and can be deployed locally using Docker Compose or scaled using Docker
Swarm.

## File Structure

- `/back/`: Contains the backend (Express) service
    - `index.ts`: Main TypeScript file for the backend service.
    - `package.json`: Dependencies and scripts for the backend.
    - `package-lock.json`: Lock file for backend dependencies.
    - `tsconfig.json`: TypeScript configuration for the backend.

- `/front/`: Contains the frontend (Angular) service
    - `src/`: Source folder for the Angular application.
    - `angular.json`: Configuration file for Angular CLI.
    - `package.json`: Dependencies and scripts for the frontend.
    - `package-lock.json`: Lock file for frontend dependencies.
    - `tsconfig.json`: TypeScript configuration for the frontend.

- `Dockerfile`: Docker build instructions for the combined frontend and backend services.
- `docker-compose.yml`: Docker Compose configuration for running the services in containers, with the ability to scale
  using Docker Swarm.
- `supervisord.conf`: Configuration for managing multiple processes in a single container (backend and frontend).

## Setup and Usage

1. **Build the Docker image**  
   Before running the containers, build the Docker image using the following command:

   ```bash
   docker build -t paired_app_image .
   ```

2. **Run the application using Docker Compose**  
   Start the containers using Docker Compose:

   ```bash
   docker-compose up --build
   ```
   This will run the Angular frontend on port 4200 and the Express backend on port 3000.

## Scaling with Docker Swarm

If you want to scale the application using Docker Swarm, you can initialize Swarm and deploy the stack using the same
Docker Compose configuration.

1. **Initialize Docker Swarm:**

```bash
docker swarm init
````

2. **Deploy the stack using the Docker Compose file:**

```bash
docker stack deploy -c docker-compose.yml paired_app_stack
```

This will run the services in Docker Swarm, allowing you to scale the web and worker services.

## Notes

- The frontend is running via ng serve and is available on port 4200.
- The backend (Express) is running on port 3000.
- The services are configured to use supervisord to manage multiple processes in the same container.
- Docker Swarm allows for automatic scaling and load balancing across multiple worker replicas.

## Note for resolving build issues

If the Docker image fails to build due to dependency problems, you can manually install the packages in the back and
front directories. Here are the steps:

```bash
# Go to the backend folder and install dependencies
cd back
npm install

# Go to the frontend folder and install dependencies
cd ../front
npm install
```
After installing the dependencies, try building the Docker image again:
```bash
docker build -t paired_app_image .
```