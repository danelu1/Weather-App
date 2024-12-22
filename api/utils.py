from pymongo import MongoClient
from datetime import datetime

database_client = MongoClient('mongodb://mongodb:27017/')

db_countries = database_client['countriesDB']
db_cities = database_client['citiesDB']
db_temperatures = database_client['temperaturesDB']

def next_id(collection, collection_name):
    entry = collection['id'].find_one_and_update(
        {'_id': collection_name},
        {'$inc': {'curr_id': 1}},
        upsert=True,
        return_document=True
    )

    return entry['curr_id']

def validate_country(country, countries_collection):
    data = {
        'nume': [str],
        'lat': [float, int],
        'lon': [float, int]
    }

    for field, types in data.items():
        if field not in country:
            return 400, f"Missing field '{field}' in request"
        if not country[field]:
            return 400, f"Missing value for '{field}' in request"
        if not type(country[field]) in types:
            return 400, f"Field '{field}' must be a number"

    if countries_collection.find_one({ 'nume': country['nume'] }):
        return 409, f"Country \'{country['nume']}\' already exists"

    return 200, 'Valid country in request'

def validate_city(city, cities_collection, countries_collections, method='POST'):
    data = {
        'idTara': [int],
        'nume': [str],
        'lat': [float, int],
        'lon': [float, int]
    }

    for field, types in data.items():
        if field not in city:
            return 400, f"Missing field '{field}' in request"
        if not city[field]:
            return 400, f"Missing value for '{field}' in request"
        if not type(city[field]) in types:
            return 400, f"Field '{field}' must be a number"

    if not countries_collections.find_one({ 'id': city['idTara'] }):
        return 404, f"Country with ID '{city['idTara']}' not found"

    res = cities_collection.find_one({ 'nume': city['nume'], 'idTara': city['idTara'] })
    if (res and method == 'POST') or (res and method == 'PUT' and res['id'] != city['id']):
        return 409, f"City \'{city['nume']}\' already exists"

    return 200, "Valid city in request"

def validate_temperature(temperature, temperatures_collection, cities_collection, method='POST'):
    data = {
        'idOras': [int],
        'valoare': [float, int]
    }

    for field, types in data.items():
        if field not in temperature:
            return 400, f"Missing field '{field}' in request"
        if not temperature[field]:
            return 400, f"Missing value for '{field}' in request"
        if not type(temperature[field]) in types:
            return 400, f"Field '{field}' must be a number'"

    if not cities_collection.find_one({ 'id': temperature['idOras'] }):
        return 404, f"City with ID '{temperature['idOras']}' not found"

    if method == 'POST':
        res = list(temperatures_collection.find({ 'idOras': temperature['idOras'] }))
        if res and datetime.now() == res[-1]['timestamp']:
            return 409, f"Temperature with timestamp {res[-1]['timestamp']} already exists for city with ID {res[-1]['idOras']}"

    if method == 'PUT':
        res = temperatures_collection.find_one({ 'timestamp': datetime.now(), 'idOras': temperature['idOras'] })
        if res and res['id'] != temperature['id']:
            return 409, f"Temperature with timestamp {res['timestamp']} already exists for city with ID {res['idOras']}"

    return 200, "Valid temperature in request"
