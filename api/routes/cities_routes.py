from flask import Blueprint, json, Response, request
from utils import validate_city, db_cities, db_countries, db_temperatures, next_id

cities_routes = Blueprint('cities', __name__)

@cities_routes.route('/api/cities', methods=['POST'])
def post_city():
    city = request.json

    status, message = validate_city(city, db_cities['cities'], db_countries['countries'])

    if status != 200:
        return Response(
            response=json.dumps({
                'message': message
            }),
            status=status
        )

    try:
        city['id'] = next_id(db_cities, 'cities_id')
        city['lat'] = float(city['lat'])
        city['lon'] = float(city['lon'])
        db_cities['cities'].insert_one(city)

        return Response(
            response=json.dumps({
                'id': city['id']
            }),
            status=201
        )
    except Exception as e:
        return Response(
            response=json.dumps({
                'error': 'Internal server error',
                'details': str(e)
            }),
            status=500
        )

@cities_routes.route('/api/cities', methods=['GET'])
def get_cities():
    try:
        cities = []
        for city in list(db_cities['cities'].find()):
            del city['_id']
            cities.append(city)

        return Response(
            response=json.dumps(cities),
            status=200
        )
    except Exception as e:
        return Response(
            response=json.dumps({
                'error': 'Internal server error',
                'details': str(e)
            }),
            status=500
        )

@cities_routes.route('/api/cities/country/<idTara>', methods=['GET'])
def get_cities_from_country(idTara):
    try:
        cities = []
        for city in list(db_cities['cities'].find({'idTara': int(idTara)})):
            del city['_id']
            cities.append(city)

        return Response(
            response=json.dumps(cities),
            status=200
        )
    except Exception as e:
        return Response(
            response=json.dumps({
                'error': 'Internal server error',
                'details': str(e)
            }),
            status=500
        )

@cities_routes.route('/api/cities/<id>', methods=['PUT'])
def update_city(id):
    data = request.json

    status, message = validate_city(data, db_cities['cities'], db_countries['countries'], method='PUT')

    if status != 200:
        return Response(
            response=json.dumps({
                'message': message
            }),
            status=status
        )

    try:
        if int(id) != data['id']:
            return Response(
                response=json.dumps({
                    'message': f"Request body ID {data['id']} different from path ID {int(id)}"
                }),
                status=409
            )

        city = db_cities['cities'].find_one({'id': int(id)})

        if not city:
            return Response(status=404)

        city = db_cities['cities'].find_one_and_update(
            {'id': int(id)},
            {'$set': {
                'id': int(data['id']),
                'idTara': int(data['idTara']),
                'nume': data['nume'],
                'lat': data['lat'],
                'lon': data['lon']
            }}
        )

        return Response(status=200)
    except Exception as e:
        return Response(
            response=json.dumps({
                "error": f"Internal server error: {str(e)}"
            }),
            status=500
        )

@cities_routes.route('/api/cities/<id>', methods=['DELETE'])
def delete_city(id):
    try:
        city = db_cities['cities'].find_one({ 'id': int(id) })

        if not city:
            return Response(status=404)

        db_temperatures['temperatures'].delete_many({'idOras': int(id)})
        db_cities['cities'].delete_one({'id': int(id)})

        db_temperatures['id'].update_one(
            {"_id": "temperatures_id"},
            {"$set": {"curr_id": 0}},
            upsert=True
        )

        return Response(status=200)

    except Exception as e:
        return Response(
            response=json.dumps({
                "error": f"Internal server error: {str(e)}"
            }),
            status=500
        )

@cities_routes.route('/api/cities', methods=['DELETE'])
def delete_cities():
    try:
        db_cities['cities'].delete_many({})
        db_cities['id'].find_one_and_update(
            {"_id": "cities_id"},
            {"$set": {"curr_id": 0}},
            upsert=True,
            return_document=True
        )

        return Response(
            response=json.dumps({
                "message": "Everything deleted successfully"
            }),
            status=200
        )
    except Exception as e:
        return Response(
            response=json.dumps({
                "message": f"Internal server error {str(e)}"
            }),
            status=500
        )
