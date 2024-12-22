The homework contains the following files:
    - server.py, used to start the server;
    - utils.py, used to start the MongoDB connection and initiate
    the databases for each entity(country, city, temperature) + the
    collections;
    - routes directory, where all the endpoints are created for each
    entity in 3 separate python files;
    - .dockerignore, for the Docker container, containing all the files
    that need to be ignored on creation;
    - Dockerfile, for the creation of the container, with all the commands
    needed for initiation;
    - docker-compose.yml, to start the container with all the needed
    services(flask, mongodb, mongodb-express);
    - requirements.txt, to install each python module needed inside the
    Docker container.

Command to run the server:
    docker-compose up --build

My solution uses the given testing script and runs all the tests in Postman, where
74 tests run, all with corresponding status codes. The requests' fields have the
same names as the ones from the homework("id", "nume", "lat", "lon", "idTara",
"idOras", "timestamp", "valoare"). The "id" of each entry in each database is
generated starting from 1. The "utils.py" file contains methods used to validate
each entity in a request(validate its type and existence for 404 or 409 status
codes). The server runs on localhost:6000. I also created a separate frontend in
React.js(that's why I have CORS in the server.py file, to connect on localhost:3000,
but I will leave only the server for the homework, because the frontend also requires
some Docker work).