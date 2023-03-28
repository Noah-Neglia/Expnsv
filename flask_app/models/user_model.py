
from flask_app import DATABASE

from flask_app.config.mysqlconnection import connectToMySQL

from flask_app import EMAIL_REGEX

from flask import flash



class User:

    def __init__( self , data):
        self.id = data['id']
        self.first_name = data['first_name']
        self.last_name = data['last_name']
        self.email = data['email']
        self.password = data['password']
        self.created_at = data['created_at']
        self.updated_at = data['updated_at']


    @classmethod
    def create(cls, data):
        query = "INSERT INTO users"
        query += "( first_name, last_name, email, password )"
        query += "VALUES ( %(first_name)s, %(last_name)s, %(email)s, %(password)s );"

        return connectToMySQL(DATABASE).query_db( query, data)

    @staticmethod
    def validate_registration(user):
        
        valid = True

        query = "SELECT * FROM users WHERE email = %(email)s;"
        result_email = connectToMySQL(DATABASE).query_db(query, user)
        #Validates the first name field, it must be greater than 1
        if len(user['first_name']) < 2:
            flash("First name cannot be empty.", "invalid_first_name")
            valid = False
        #Validates the last name field, it must be greater than 1
        if len(user['last_name']) < 2:
            flash("Last name cannot be empty.", "invalid_last_name")
            valid = False
        #Validates the email field, it must comply with the email regex
        if not EMAIL_REGEX.match(user['email']):
            flash("Invalid email.", "invalid_email")
            valid = False
         #Validates the first email field, multiple account cannot be created with the same email
        if len(result_email) >= 1:
            flash("Login information already in use.", "invalid_login")
            valid = False
        #Validates the password, it must be atleast 8 characters
        if len(user['password']) < 8:
            flash("Password must be atleast 8 characters.", "invalid_password")
            valid = False
        #Validates the confirm password, it must be identical to the password field
        if user['password'] != user['confirm_password']:
            flash("Passwords do not match!", "passwords_no_match")
            valid = False

        return valid 

    @staticmethod
    def validate_login(user):

        valid = True
         #Validates the email field, it must comply with the email regex
        if not EMAIL_REGEX.match(user['email']):
            flash("Invalid login", "no_email")
            valid = False
        #Validates the password, it must be atleast 8 characters
        if len(user['password']) < 8:
            flash("invalid login", "no_password")
            valid = False

        return valid
  

    @classmethod 
    #Finds a single user based on the entered email
    def get_one( cls, data ) :
        query = "SELECT * FROM users WHERE email = %(email)s;"
        result = connectToMySQL(DATABASE).query_db(query, data)

        if len(result) < 1:
            return False
        else:
             current_user = cls( result[0] )
             return current_user

  
    