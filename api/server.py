from flask import Flask
from routes.countries_routes import countries_routes
from routes.cities_routes import cities_routes
from routes.temperatures_routes import temperatures_routes
from flask_cors import CORS

server = Flask(__name__)
CORS(server, origins=["http://localhost:3000"])

server.register_blueprint(countries_routes)
server.register_blueprint(cities_routes)
server.register_blueprint(temperatures_routes)

if __name__ == '__main__':
    server.run('0.0.0.0', port=5000, debug=True)
