from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()
    

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), unique=False, nullable=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(80), unique=False, nullable=False)
    img = db.Column(db.String(200), unique=False, nullable=False)

    def __repr__(self):
        return f'<User {self.email}>'

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "img": self.img,
            # do not serialize the password, its a security breach
        }
    
class List(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), unique=False, nullable=False)
    user = db.relationship(User)
    name = db.Column(db.String(80), unique=False, nullable=True)

    def __repr__(self):
        return f'<List {self.id}>'

    def serialize(self):
        return {
            "id": self.id,
            "user_id":self.user_id,
            "name": self.name,
            # do not serialize the password, its a security breach
        }
    
class Gift(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(120), unique=False, nullable=True)
    link = db.Column(db.String(500), unique=True, nullable=False)
    status = db.Column(db.String(80), unique=False, nullable=False)
    img = db.Column(db.String(80), unique=False, nullable=False)
    list_id = db.Column(db.Integer,db.ForeignKey("list.id"), unique=False, nullable=False)
    list = db.relationship(List)
    
    def __repr__(self):
        return f'<Gift {self.title}>'

    def serialize(self):
        return {
            "id": self.id,
            "title": self.title,
            "link": self.link,
            "status": self.status,
            "list_id": self.list_id,
            "img": self.img
            # do not serialize the password, its a security breach
        }