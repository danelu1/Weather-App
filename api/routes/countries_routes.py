from flask import Blueprint, json, Response, request
from utils import validate_country, db_countries, db_cities, db_temperatures, next_id

countries_routes = Blueprint('countries', __name__)

@countries_routes.route('/api/countries', methods=['POST'])
def post_country():
    country = request.json

    status, message = validate_country(country, db_countries['countries'])

    if status != 200:
        return Response(
            response=json.dumps({
                'message': message
            }),
            status=status
        )

    try:
        country['id'] = next_id(db_countries, 'countries_id')
        country['lat'] = float(country['lat'])
        country['lon'] = float(country['lon'])
        db_countries['countries'].insert_one(country)

        return Response(
            response=json.dumps({
                'id': country['id']
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

@countries_routes.route('/api/countries', methods=['GET'])
def get_countries():
    try:
        countries = []
        for country in list(db_countries['countries'].find()):
            del country['_id']
            countries.append(country)

        return Response(
            response=json.dumps(countries),
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

@countries_routes.route('/api/countries/<id>', methods=['PUT'])
def update_country(id):
    data = request.json

    status, message = validate_country(data, db_countries['countries'])

    if status != 200:
        if status == 409:
            pass
        else:
            return Response(
                response=json.dumps({
                    'message': message
                }),
                status=status
            )

    try:
        country = db_countries['countries'].find_one_and_update(
            {'id': int(id)},
            {'$set': {
                'id': int(data['id']),
                'nume': data['nume'],
                'lat': float(data['lat']),
                'lon': float(data['lon'])
            }},
            return_document=True
        )

        if not country:
            return Response(status=404)

        return Response(status=200)
    except Exception as e:
        return Response(
            response=json.dumps({
                "error": f"Internal server error: {str(e)}"
            }),
            status=500
        )

@countries_routes.route('/api/countries/<id>', methods=['DELETE'])
def delete_country(id):
    try:
        country = db_countries['countries'].find_one({ 'id': int(id) })

        if not country:
            return Response(status=404)

        db_temperatures['temperatures'].delete_many({'idOras': {'$in': [city['id'] for city in list(db_cities['cities'].find({'idTara': int(id)}))]}})
        db_cities['cities'].delete_many({'idTara': int(id)})
        db_countries['countries'].delete_one({'id': int(id)})

        db_cities['id'].update_one(
            {"_id": "cities_id"},
            {"$set": {"curr_id": 0}},
            upsert=True
        )

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

@countries_routes.route('/api/countries', methods=['DELETE'])
def delete_countries():
    try:
        db_countries['countries'].delete_many({})
        db_countries['id'].update_one(
            {"_id": "countries_id"},
            {"$set": {"curr_id": 0}},
            upsert=True
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
