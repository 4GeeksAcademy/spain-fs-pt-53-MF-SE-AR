"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import os
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, List, Gift
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import create_access_token , get_jwt_identity , jwt_required
from flask_bcrypt import generate_password_hash, check_password_hash


api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)
#CORS(api, resources={"*": {"origins": "*"}})

# RUTAS DE TOKEN 
@api.route("/token", methods=["POST"])
def create_token():
    email = request.json.get("email", None)
    password = request.json.get("password", None)

    user = User.query.filter_by(email=email).first()

    if not user:
        return jsonify({"msg": "User not found"}), 401

    if not check_password_hash(user.password, password):
        return jsonify({"msg": "Bad email or password"}), 401

    access_token = create_access_token(identity=email)
    return jsonify(access_token=access_token)

# RUTAS DE MENSAJES (hello es ejemplo)
@api.route("/hello", methods=["GET"])
@jwt_required()
def get_hello():
    email = get_jwt_identity()
    dictionary = {"message": "hello User " + email}
    return jsonify(dictionary)

# RUTAS DE TABLA USER 
@api.route('/alluser', methods=['GET'])
def get_all_users():

    all_users = User.query.all()
    all_users = list(map(lambda x: x.serialize(), all_users))

    return jsonify(all_users), 200

@api.route("/user", methods=["GET"])
@jwt_required()
def get_user():
    email = get_jwt_identity()
    user = User.query.filter_by(email=email).first()

    if user:
        if user.name:
                message = "Welcome " + user.name
        else:
                message = "Welcome " + user.email

        user_data = {
                "message": message,
                "name": user.name,
                "id": user.id,
                "email": user.email,
                "img": user.img
            }
        return jsonify(user_data), 200
    else:
        return jsonify({"error": "User not found"}), 404


@api.route("/update-profile", methods=["PUT"])
@jwt_required()
def update_profile():
    email = get_jwt_identity()
    user = User.query.filter_by(email=email).first()
    if user:
        data = request.get_json()
        if 'name' in data:
            user.name = data['name']
        if 'email' in data:
            user.email = data['email']
        if 'password' in data:
            user.password = generate_password_hash(data['password'])

        db.session.commit()

        user_data = {
            "message": "Profile updated successfully",
            "name": user.name,
            "id": user.id,
            "email": user.email,
            "img": user.img
        }
        return jsonify(user_data), 200
    else:
        return jsonify({"error": "User not found"}), 404

@api.route("/user", methods=["POST"])
def add_user():
    email = request.json.get("email")
    password = request.json.get("password")
    img = request.json.get("img")

    required_fields = [email, password, img]

    if any(field is None for field in required_fields):
        return jsonify({'error': 'You must provide an email, password, and img'}), 400

    hashed_password = generate_password_hash(password).decode('utf-8')

    user = User.query.filter_by(email=email).first()

    if user:
        return jsonify({"msg": "This user already has an account"}), 401

    try:
        new_user = User(email=email, password=hashed_password, img=img, name="")
        db.session.add(new_user)
        db.session.commit()
        return jsonify({'response': 'User added successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400
    
# RUTAS DE TABLA LIST   
@api.route('/alllist', methods=['GET'])
def get_all_list():

    all_list = List.query.all()
    all_list = list(map(lambda x: x.serialize(), all_list))

    return jsonify(all_list), 200
     
@api.route("/list", methods=["GET"])
def get_all_list_user():
    id = request.args.get("id")
    
    if id is None:
         return jsonify({"message": "ID parameter missing"}), 400
    
    user = User.query.get(id)

    if not user:
        return jsonify({"msg": "User not found"}), 401
    
    user_list = List.query.filter_by(user=user).all()

    if not user_list:
        return jsonify({"msg": "No lists found for this user"}), 404
    
    user_list = list(map(lambda x: x.serialize(), user_list))

    return jsonify(user_list), 200

@api.route("/list", methods=["POST"])
def add_list():
    # ESTE ID LO TIENE QUE MANDAR EL FLUX
    user_id = request.json.get("id") 
    # EL PRIMER NAME SI ESTA VACIO EJ AL CREAR EL USUARIO Y SE RELLENARA CON "LISTA GENERAL"
    name = request.json.get("name")  

    required_fields = [user_id]

    if any(field is None for field in required_fields):
        return jsonify({'error': 'You must provide a name for the list and a user'}), 400
    
    user = User.query.filter_by(id=user_id).first()

    if not user:
        return jsonify({"msg": "This user need an account"}), 401
    
    try:
        new_list = List(user_id=user_id,name=name)
        db.session.add(new_list)
        db.session.commit()
        return jsonify({'response': 'List added successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400
    
    # RUTAS TABLA GIFT
@api.route('/allgifts', methods=['GET'])
def get_all_gifts():

    all_gift = Gift.query.all()
    all_gift = list(map(lambda x: x.serialize(), all_gift))

    return jsonify(all_gift), 200

@api.route("/gift", methods=["GET"])
def get_gift():
# TODO: comentar con Sabri -> ID de la lista como una cadena de texto esto debe pasarlo el flux o como params?
    lid = 1   
    
    if lid is None:
        return jsonify({"message": "List ID parameter missing"}), 400
    
    list_obj = List.query.filter_by(id=lid).first()

    if not list_obj:
        return jsonify({"msg": "List not found"}), 404
    
    user_gifts = Gift.query.filter_by(list_id=list_obj.id).all()

    if not user_gifts:
        return jsonify({"msg": "No gifts found for this list"}), 404
    
    user_gift = list(map(lambda x: x.serialize(), user_gifts))
    return jsonify(user_gift), 200

@api.route("/gift", methods=["POST"])
def add_gift():
    title = request.json.get("title")
    link = request.json.get("link")
    status = request.json.get("status")
    img = request.json.get("img")
    list_id = request.json.get("list_id")

    required_fields = [title, link, status, img, list_id]

    if any(field is None for field in required_fields):
        return jsonify({'error': 'You must complete all the items'}), 400

    gift = Gift.query.filter_by(link=link).first()

    if gift:
        return jsonify({"msg": "This gift already exist"}), 401

    try:
        new_gift = Gift(title=title,link=link, status=status, img=img, list_id=list_id)
        db.session.add(new_gift)
        db.session.commit()
        return jsonify({'response': 'Gift added successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400
    
@api.route('/gift/<int:gift_id>', methods=['DELETE'])
# TODO: comentar con Sabri -> ID de la gift y la list_id como una cadena de texto esto debe pasarlo el flux ?
def delete_gift(gift_id):
    list_id = 1
    requested_gift = Gift.query.filter_by(list_id=list_id, id=gift_id).first()
    
    if requested_gift is None:
        return jsonify({'error': 'You must provide a gift_id'}), 400
    
    try:
        db.session.delete(requested_gift)
        db.session.commit()
        return jsonify({'response': 'Gift deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400 

@api.route('/gift/<int:gift_id>', methods=['PUT'])
# TODO: comentar con Sabri -> ID de la gift y la list_id como una cadena de texto esto debe pasarlo el flux ?
def update_gift(gift_id):
    title = request.json.get("title")
    link = request.json.get("link")
    status = request.json.get("status")
    img = request.json.get("img")
    list_id = request.json.get("list_id")

    required_fields = [title, link, status, img, list_id]
    if any(field is None for field in required_fields):
        return jsonify({'error': 'You must provide all the items'}), 400

    gift = Gift.query.filter_by(list_id=list_id, id=gift_id).first()
    if not gift:
        return jsonify({'error': 'Gift not found'}), 404

    try:
        gift.title = title
        gift.link = link
        gift.status = status
        gift.img = img
        gift.list_id = list_id

        db.session.commit()
        return jsonify({'response': 'Gift updated successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400
