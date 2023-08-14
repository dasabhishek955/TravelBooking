from flask import Flask, request, jsonify, session
from flask_mysqldb import MySQL
from flask_cors import CORS

import jwt
import datetime
import mysql.connector
import bcrypt


app = Flask(__name__)
cors = CORS(app)
app.config['SECRET_KEY'] = 'sexyabhi'

# MySQL Configuration
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = ''
app.config['MYSQL_DB'] = 'travel'

mysql = MySQL(app)


def generate_token(id):
    payload = {
        'user_id': id,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1)
    }
    return jwt.encode(payload, app.config['SECRET_KEY'], algorithm='HS256')


def get_user_id_from_token(token):
    try:
        payload = jwt.decode(
            token, app.config['SECRET_KEY'], algorithms=['HS256'])
        return payload['user_id']
    except jwt.ExpiredSignatureError:
        return None  # Token has expired
    except jwt.InvalidTokenError:
        return None  # Invalid token


@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    username = data['username']
    password = data['password']
    email = data['email']

    # Hash the password using bcrypt
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

    # Connect to MySQL database
    cur = mysql.connection.cursor()

    # Check if the username or email already exists
    cur.execute("SELECT * FROM user WHERE username=%s OR email=%s",
                (username, email))
    existing_user = cur.fetchone()

    if existing_user:
        cur.close()
        return jsonify({'message': 'Username or email already exists'}), 400

    # Insert new user into the database
    cur.execute("INSERT INTO user (username, password, email) VALUES (%s, %s, %s)",
                (username, hashed_password, email))
    mysql.connection.commit()
    cur.close()

    return jsonify({'message': 'Signup successful'}), 201


@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data['username']
    password = data['password']
    print(data)
    # Connect to MySQL database
    cur = mysql.connection.cursor()

    # Retrieve hashed password from the database based on the username
    cur.execute("SELECT id, password FROM user WHERE username=%s", (username,))
    user = cur.fetchone()
    print(user)
    cur.close()

    if not user:
        return jsonify({'message': 'Invalid username or password'}), 401

     # Check if the provided password matches the stored hashed password
    if bcrypt.checkpw(password.encode('utf-8'), user[1].encode('utf-8')):
        # Generate token for the authenticated user
        # Assuming user[0] is the user_id in the database
        token = generate_token(user[0])
        return jsonify({'token': token, 'user_id': user[0]}), 200

    return jsonify({'message': 'Invalid username or password'}), 401


@app.route('/like', methods=['POST'])
def like_card():
    data = request.json
    user_id = data['user_id']
    card_id = data['card_id']
    is_liked = data['is_liked']

    cur = mysql.connection.cursor()

    # Checking if the user has liked this card before
    cur.execute(
        "SELECT * FROM Likes WHERE user_id = %s AND card_id = %s", (user_id, card_id))
    result = cur.fetchone()

    if result:
        cur.execute("UPDATE Likes SET is_liked = %s WHERE user_id = %s AND card_id = %s",
                    (is_liked, user_id, card_id))
    else:
        cur.execute("INSERT INTO Likes (user_id, card_id, is_liked) VALUES (%s, %s, %s)",
                    (user_id, card_id, is_liked))

    mysql.connection.commit()
    cur.close()
    # conn.close()

    return jsonify(success=True), 200


@app.route('/submit', methods=['POST'])
def submit_data():
    data = request.json
    location = data.get('location')
    price = data.get('price')
    timeline = data.get('timeline')
    link = data.get('link')

    cursor = mysql.connection.cursor()
    cursor.execute("INSERT INTO data (location, link, price, timeline) VALUES (%s, %s, %s, %s)",
                   (location, link, price, timeline))
    mysql.connection.commit()
    cursor.close()

    return jsonify({'message': 'Data submitted successfully'})


@app.route('/traveldata', methods=['GET'])
def get_travel_data():
    cursor = mysql.connection.cursor()
    cursor.execute(
        "SELECT id, location, link ,price, timeline, likes.is_liked FROM data Left JOIN likes on data.id=likes.card_id")
    data = cursor.fetchall()
    cursor.close()

    travel_data = [{
        'id': row[0],
        'location': row[1],
        'link': row[2],
        'price': row[3],
        'timeline': row[4],
        'like': row[5]
    } for row in data]

    return jsonify(travel_data)


if __name__ == '__main__':
    app.run(debug=True)
