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
        return jsonify({"msg": "Bad password"}), 401

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


@api.route("/user", methods=["GET"])
@jwt_required()
def get_user():
    email = get_jwt_identity()
    user = User.query.filter_by(email=email).first()

    if user:
        if user.name:
                message = user.name
        else:
                message = user.email

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
    
@api.route("/user", methods=["PUT"])
@jwt_required()
def update_user():
    email = get_jwt_identity()
    user = User.query.filter_by(email=email).first()
    password = request.json.get("password", None)

    if not user:
        return jsonify({"msg": "Incorrect user"}), 401
    
    password = request.json.get("password")
    new_email = request.json.get("email")
    new_name = request.json.get("name")

    if not password:
        return jsonify({"error": "Current password is required"}), 400

    if not check_password_hash(user.password, password):
        return jsonify({"error": "Incorrect current password"}), 401

    try:
        user.email = new_email
        user.name = new_name

        db.session.commit()
        return jsonify({'response': 'User updated successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400
      
# TODO: AQUI ESTAN LOS PUT DE SABRI
    
# @api.route("/user", methods=["PUT"])
# @jwt_required()
# def update_user():
#     email = get_jwt_identity()
#     user = User.query.filter_by(email=email).first()
#     if user:
#         data = request.get_json()
#         if 'name' in data:
#             user.name = data['name']
#         if 'email' in data:
#             user.email = data['email']

#         db.session.commit()

#         user_data = {
#             "message": "Profile updated successfully",
#             "name": user.name,
#             "id": user.id,
#             "email": user.email,
#             "img": user.img
#         }
#         return jsonify(user_data), 200
#     else:
#         return jsonify({"error": "User not found"}), 404
    

@api.route('/user/<int:user_id>', methods=['DELETE'])
@jwt_required()
def delete_user(user_id):
    email = get_jwt_identity()
    user = User.query.filter_by(email=email, id=user_id).first()

    if not user:
        return jsonify({"msg": "User not found"}), 404

    try:
        lists = List.query.filter_by(user_id=user.id).all()
        for list_item in lists:
            gifts = Gift.query.filter_by(list_id=list_item.id).all()
            for gift in gifts:
                db.session.delete(gift)
            db.session.delete(list_item)

        db.session.delete(user)
        db.session.commit()
        return 'User successfully deleted', 204
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
    
@api.route("/guest/<int:user_id>", methods=["GET"])
def get_user_public(user_id):
    requested_user = User.query.filter_by(id=user_id).first()

    if requested_user:
        message = "Welcome Guest"
        user_data = {
            "message": message,
            "name": requested_user.name,
            "id": requested_user.id,
            "email": requested_user.email,
            "img": requested_user.img
        }
        return jsonify(user_data), 200
    else:
        return jsonify({"error": "User not found"}), 404  
    
# RUTAS DE TABLA LIST   
@api.route('/alllist', methods=['GET'])
def get_all_list():

    all_list = List.query.all()
    all_list = list(map(lambda x: x.serialize(), all_list))

    return jsonify(all_list), 200
     
@api.route("/user/<int:user_id>/giftlist", methods=["GET"])
@jwt_required()
def get_all_list_user(user_id):
    email = get_jwt_identity()
    user = User.query.filter_by(email=email, id=user_id).first()

    if not user:
        return jsonify({"msg": "User not found"}), 401
    
    user_list = List.query.filter_by(user_id=user_id).all()

    if not user_list:
        return jsonify({"msg": "No lists found for this user"}), 404
    
    user_list = list(map(lambda x: x.serialize(), user_list))

    return jsonify(user_list), 200

@api.route("/guest/<int:user_id>/giftlist/<int:list_id>", methods=["GET"])
def get_all_list_user_public(user_id, list_id):
    requested_lists = List.query.filter_by(user_id=user_id, id=list_id).all()
    
    if not requested_lists:
        return jsonify({'error': 'List not found'}), 404
    
    user_list = list(map(lambda x: x.serialize(), requested_lists))

    return jsonify(user_list), 200

@api.route("/list", methods=["POST"])
def add_list():
    # ESTE ID LO TIENE QUE MANDAR EL FLUX POR QUE ES EL REGISTRO
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

@api.route("/user/<int:user_id>/giftlist/<int:list_id>/gifts", methods=["GET"])
@jwt_required()
def get_gifts(user_id,list_id):
     email = get_jwt_identity()
     user = User.query.filter_by(email=email, id=user_id).first()
     user_new = user.serialize()

     if not user:
         return jsonify({"msg": "User not found"}), 401
    
     list_obj = List.query.filter_by(user_id=user_new["id"],id=list_id).first()
     list_new = list_obj.serialize()

     if not list_obj:
         return jsonify({"msg": "No lists found for this user"}), 404
    
     user_gifts = Gift.query.filter_by(list_id=list_new["id"]).all()

     if not user_gifts:
        return jsonify({"msg": "No gifts found for this list"}), 200
    
     user_gift = list(map(lambda x: x.serialize(), user_gifts))
     return jsonify(user_gift), 200

@api.route("/user/<int:user_id>/giftlist/<int:list_id>/gifts/available", methods=["GET"])
@jwt_required()
def get_available_gifts(user_id,list_id):
     email = get_jwt_identity()
     user = User.query.filter_by(email=email, id=user_id).first()
     user_new = user.serialize()

     if not user:
         return jsonify({"msg": "User not found"}), 401
    
     list_obj = List.query.filter_by(user_id=user_new["id"],id=list_id).first()
     list_new = list_obj.serialize()

     if not list_obj:
         return jsonify({"msg": "No lists found for this user"}), 404
    
     user_gifts = Gift.query.filter_by(list_id=list_new["id"],status="Available").all()
    #  TODO: REVISAR SI ESTA COMO AVAILABLE O DISPONIBLE

     if not user_gifts:
        return jsonify({"msg": "No gifts found for this list"}), 200
    
     user_gift = list(map(lambda x: x.serialize(), user_gifts))
     return jsonify(user_gift), 200

@api.route("/user/<int:user_id>/giftlist/<int:list_id>/gifts/purchased", methods=["GET"])
@jwt_required()
def get_purchased_gifts(user_id,list_id):
     email = get_jwt_identity()
     user = User.query.filter_by(email=email, id=user_id).first()
     user_new = user.serialize()

     if not user:
         return jsonify({"msg": "User not found"}), 401
    
     list_obj = List.query.filter_by(user_id=user_new["id"],id=list_id).first()
     list_new = list_obj.serialize()

     if not list_obj:
         return jsonify({"msg": "No lists found for this user"}), 404
    
     user_gifts = Gift.query.filter_by(list_id=list_new["id"],status="Purchased").all()

     if not user_gifts:
        return jsonify({"msg": "No gifts found for this list"}), 200
    
     user_gift = list(map(lambda x: x.serialize(), user_gifts))
     return jsonify(user_gift), 200

@api.route("/user/<int:user_id>/giftlist/<int:list_id>/gifts/<int:gift_id>", methods=["GET"])
@jwt_required()
def get_one_gifts(user_id,list_id,gift_id):
     email = get_jwt_identity()
     user = User.query.filter_by(email=email, id=user_id).first()
     user_new = user.serialize()

     if not user:
         return jsonify({"msg": "User not found"}), 401
    
     list_obj = List.query.filter_by(user_id=user_new["id"],id=list_id).first()
     list_new = list_obj.serialize()

     if not list_obj:
         return jsonify({"msg": "No lists found for this user"}), 404
    
     user_gifts = Gift.query.filter_by(list_id=list_new["id"],id=gift_id).first()

     if not user_gifts:
        return jsonify({"msg": "No gifts found for this list"}), 404
    
     one_gift = user_gifts.serialize()
     return jsonify(one_gift), 200

# TODO: NO SE USA DE MOMENTO POR QUE ESTA EL PUBLICO
# @api.route("/user/<int:user_id>/giftlist/<int:list_id>/gifts/", methods=["POST"])
# @jwt_required()
# def add_gift(user_id, list_id):
#     email = get_jwt_identity()
#     user = User.query.filter_by(email=email, id=user_id).first()

#     if not user:
#          return jsonify({"msg": "Incorrect user"}), 401
    
#     title = request.json.get("title")
#     link = request.json.get("link")
#     status = request.json.get("status")
#     img = request.json.get("img")
#     list_id = list_id

#     required_fields = [title, link, status, img, list_id]

#     if any(field is None for field in required_fields):
#         return jsonify({'error': 'You must complete all the items'}), 400

#     list_obj = List.query.filter_by(user_id=user_id,id=list_id).first()

#     if not list_obj:
#          return jsonify({"msg": "No lists found for this user"}), 404

#     gift = Gift.query.filter_by(link=link,list_id=list_id).first()

#     if gift:
#         return jsonify({"msg": "This gift already exist"}), 401

#     try:
#         new_gift = Gift(title=title,link=link, status=status, img=img, list_id=list_id)
#         db.session.add(new_gift)
#         db.session.commit()
#         return jsonify({'response': 'Gift added successfully'}), 200
#     except Exception as e:
#         db.session.rollback()
#         return jsonify({'error': str(e)}), 400
    
@api.route("/gifts", methods=["POST"])
def add_gift_public():
# ESTE ID LO TIENE QUE MANDAR EL FLUX POR QUE ES EL REGISTRO
    title = request.json.get("title")
    link = request.json.get("link")
    status = request.json.get("status")
    img = request.json.get("img")
    list_id = request.json.get("list_id")
    user_id = request.json.get("user_id")

    required_fields = [link, status, list_id, user_id]

    if any(field is None for field in required_fields):
        return jsonify({'error': 'You must complete all the items'}), 400
    
    list_obj = List.query.filter_by(user_id=user_id,id=list_id).first()

    if not list_obj:
         return jsonify({"msg": "No lists found for this user"}), 404

    gift = Gift.query.filter_by(link=link,list_id=list_id).first()

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
    
@api.route('/user/<int:user_id>/giftlist/<int:list_id>/gifts/<int:gift_id>', methods=['PUT'])
@jwt_required()
def update_gift(user_id, list_id,gift_id):
    email = get_jwt_identity()
    user = User.query.filter_by(email=email, id=user_id).first()

    if not user:
         return jsonify({"msg": "Incorrect user"}), 401
    
    title = request.json.get("title")
    link = request.json.get("link")
    status = request.json.get("status")
    img = request.json.get("img")
    list_id = list_id

    required_fields = [title, link, status, list_id]
    if any(field is None for field in required_fields):
        return jsonify({'error': 'You must fill in all the items'}), 400

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
    
@api.route('/user/<int:user_id>/giftlist/<int:list_id>/gifts/<int:gift_id>', methods=['DELETE'])
@jwt_required()
def delete_gift(user_id,list_id,gift_id):
    email = get_jwt_identity()
    user = User.query.filter_by(email=email, id=user_id).first()

    if not user:
         return jsonify({"msg": "Incorrect user"}), 401

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

@api.route("/guest/<int:user_id>/giftlist/<int:list_id>/gifts", methods=["GET"])
def get_all_gifts_public(list_id,user_id):
    list_obj = List.query.filter_by(user_id=user_id,id=list_id).first()

    if not list_obj:
         return jsonify({"msg": "No lists found for this user"}), 404
    
    requested_gifts = Gift.query.filter_by(list_id=list_id).all()
    
    if not requested_gifts:
        return jsonify({'error': 'No gifts found for this list'}), 200
    
    user_gift = list(map(lambda x: x.serialize(), requested_gifts))
    return jsonify(user_gift), 200

@api.route("/guest/<int:user_id>/giftlist/<int:list_id>/gifts/available", methods=["GET"])
def get_all_available_gifts_public(list_id,user_id):
    list_obj = List.query.filter_by(user_id=user_id,id=list_id).first()

    if not list_obj:
         return jsonify({"msg": "No lists found for this user"}), 404
    requested_gifts = Gift.query.filter_by(list_id=list_id, status="Available").all()
    # TODO: REVISAR STATUS SI ESTA COMO DISPONIBLE O AVAILABLE
    
    if not requested_gifts:
        return jsonify({'error': 'No gifts found for this list'}), 200
    
    user_gift = list(map(lambda x: x.serialize(), requested_gifts))
    return jsonify(user_gift), 200

@api.route("/guest/<int:user_id>/giftlist/<int:list_id>/gifts/<int:gift_id>", methods=["GET"])
def get_one_gift_public(list_id,user_id,gift_id):
    list_obj = List.query.filter_by(user_id=user_id,id=list_id).first()

    if not list_obj:
         return jsonify({"msg": "No lists found for this user"}), 404
    requested_gifts = Gift.query.filter_by(list_id=list_id, id=gift_id).first()
    
    if not requested_gifts:
        return jsonify({'error': 'That gift is not found in this list'}), 404
    
    user_gift = requested_gifts.serialize()
    return jsonify(user_gift), 200     

@api.route('/guest/<int:user_id>/giftlist/<int:list_id>/gifts/<int:gift_id>', methods=['PUT'])
def update_gift_public(user_id,list_id,gift_id):
    list_obj = List.query.filter_by(user_id=user_id,id=list_id).first()

    if not list_obj:
         return jsonify({"msg": "No lists found for this user"}), 404
    
    title = request.json.get("title")
    link = request.json.get("link")
    status = request.json.get("status")
    img = request.json.get("img")
    list_id = list_id

    required_fields = [title, link, status, list_id]
    if any(field is None for field in required_fields):
        return jsonify({'error': 'You must fill in all the items'}), 400

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
