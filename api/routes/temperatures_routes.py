from flask import Blueprint, json, Response, request
from utils import validate_temperature, db_temperatures, db_cities, db_countries, next_id
from datetime import datetime

temperatures_routes = Blueprint('temperatures', __name__)

@temperatures_routes.route('/api/temperatures', methods=['POST'])
def post_temperature():
    temperature = request.json

    status, message = validate_temperature(temperature, db_temperatures['temperatures'], db_cities['cities'])

    if status != 200:
        return Response(
            response=json.dumps({
                'message': message
            }),
            status=status
        )

    try:
        temperature['id'] = next_id(db_temperatures, 'temperatures_id')
        temperature['valoare'] = float(temperature['valoare'])
        temperature['timestamp'] = datetime.now()
        db_temperatures['temperatures'].insert_one(temperature)

        return Response(
            response=json.dumps({
                'id': temperature['id']
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

@temperatures_routes.route('/api/temperatures', methods=['GET'])
def get_temperatures():
    lat = request.args.get('lat', type=float)
    lon = request.args.get('lon', type=float)
    from_date = request.args.get('from', type=str)
    until_date = request.args.get('until', type=str)

    if from_date:
        from_date = datetime.strptime(from_date, '%Y-%m-%d')

    if until_date:
        until_date = datetime.strptime(until_date, '%Y-%m-%d')

    temperatures = []
    for temperature in list(db_temperatures['temperatures'].find()):
        del temperature['_id']
        temperatures.append(temperature)

    query = {}
    if lat:
        query['lat'] = lat
    if lon:
        query['lon'] = lon

    if query:
        cities = db_cities['cities'].find(query)
        ids = [city['id'] for city in cities]
        if not ids:
            return Response(response=json.dumps([]), status=200)

        temperatures = [
            temperature for temperature in temperatures
            if temperature['idOras'] in ids
        ]

    if from_date:
        temperatures = [
            temperature for temperature in temperatures
            if temperature['timestamp'] >= from_date
        ]

    if until_date:
        temperatures = [
            temperature for temperature in temperatures
            if temperature['timestamp'] <= until_date
        ]

    return Response(
        response=json.dumps([
            {
                'id': temperature['id'],
                'valoare': temperature['valoare'],
                'timestamp': temperature['timestamp'].strftime('%Y-%m-%dT%H:%M:%S')
            }
            for temperature in temperatures
        ]),
        status=200
    )

@temperatures_routes.route('/api/temperatures/cities/<idOras>', methods=['GET'])
def get_temperatures_by_city_id(idOras):
    from_date = request.args.get('from', type=str)
    until_date = request.args.get('until', type=str)

    if from_date:
        from_date = datetime.strptime(from_date, '%Y-%m-%d')

    if until_date:
        until_date = datetime.strptime(until_date, '%Y-%m-%d')

    temperatures = []
    for temperature in list(db_temperatures['temperatures'].find()):
        del temperature['_id']
        if temperature['idOras'] == int(idOras):
            temperatures.append(temperature)

    if from_date:
        temperatures = [
            temperature for temperature in temperatures
            if temperature['timestamp'] >= from_date
        ]

    if until_date:
        temperatures = [
            temperature for temperature in temperatures
            if temperature['timestamp'] <= until_date
        ]

    return Response(
        response=json.dumps([
            {
                'id': temperature['id'],
                'valoare': temperature['valoare'],
                'timestamp': temperature['timestamp'].strftime('%Y-%m-%dT%H:%M:%S')
            }
            for temperature in temperatures
        ]),
        status=200
    )

@temperatures_routes.route('/api/temperatures/countries/<idTara>', methods=['GET'])
def get_temperatures_by_country_id(idTara):
    from_date = request.args.get('from', type=str)
    until_date = request.args.get('until', type=str)

    if from_date:
        from_date = datetime.strptime(from_date, '%Y-%m-%d')

    if until_date:
        until_date = datetime.strptime(until_date, '%Y-%m-%d')

    temperatures = []
    country = db_countries['countries'].find_one({'id': int(idTara)})
    cities = list(db_cities['cities'].find({'idTara': country['id']}))
    for temperature in list(db_temperatures['temperatures'].find()):
        del temperature['_id']
        for city in cities:
            if temperature['idOras'] == city['id']:
                temperatures.append(temperature)

    if from_date:
        temperatures = [
            temperature for temperature in temperatures
            if temperature['timestamp'] >= from_date
        ]

    if until_date:
        temperatures = [
            temperature for temperature in temperatures
            if temperature['timestamp'] <= until_date
        ]

    return Response(
        response=json.dumps([
            {
                'id': temperature['id'],
                'valoare': temperature['valoare'],
                'timestamp': temperature['timestamp'].strftime('%Y-%m-%dT%H:%M:%S')
            }
            for temperature in temperatures
        ]),
        status=200
    )

@temperatures_routes.route('/api/temperatures/<id>', methods=['PUT'])
def update_temperature(id):
    data = request.json

    status, message = validate_temperature(data, db_temperatures['temperatures'], db_cities['cities'], method='PUT')

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

        temperature = db_temperatures['temperatures'].find_one({ 'id': int(id) })

        if not temperature:
            return Response(status=404)

        temperature = db_temperatures['temperatures'].find_one_and_update(
            {'id': int(id)},
            {'$set': {
                'id': int(data['id']),
                'idOras': int(data['idOras']),
                'valoare': float(data['valoare']),
                'timestamp': datetime.now()
            }},
            return_document=True
        )

        return Response(status=200)
    except Exception as e:
        return Response(
            response=json.dumps({
                "error": f"Internal server error: {str(e)}"
            }),
            status=500
        )

@temperatures_routes.route('/api/temperatures/<id>', methods=['DELETE'])
def delete_temperature(id):
    try:
        temperature = db_temperatures['temperatures'].find_one(
            {'id': int(id)},
        )

        if not temperature:
            return Response(
                    response=json.dumps({
                        'message': 'Temperature not found to delete'
                    }),
                    status=404
                )

        status, message = validate_temperature(temperature, db_temperatures['temperatures'], db_cities['cities'])

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

        db_temperatures['temperatures'].delete_one({'id': int(id)})

        return Response(status=200)

    except Exception as e:
        return Response(
            response=json.dumps({
                "error": f"Internal server error: {str(e)}"
            }),
            status=500
        )

@temperatures_routes.route('/api/temperatures', methods=['DELETE'])
def delete_temperatures():
    try:
        db_temperatures['temperatures'].delete_many({})
        db_temperatures['id'].find_one_and_update(
            {"_id": "temperatures_id"},
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