
from flask_app import app

from flask import render_template, redirect, session, request, flash

from flask_app.models.user_model import User

from flask_app import app

from flask_bcrypt import Bcrypt

bcrypt = Bcrypt(app)

@app.route('/')
def register():
    return render_template('register.html')

@app.route('/login')
def login():
    return render_template('login.html')


@app.route('/user/register', methods = ['POST'])
def create_user():

# if the user does not pass form validations redirect back
# to the registration route
    if not User.validate_registration(request.form):
        return redirect('/')

# hash the password using bcrypt to securely store it in the database
    hash = bcrypt.generate_password_hash(request.form['password'])


    data = {
        **request.form,
        "password": hash
    }
    # Save the user in the database
    user_id = User.create(data)

# store user data in session to verify the user, and display some of their info on the page
    session['first_name'] = data['first_name']
    session['last_name'] = data['last_name']
    session['email'] = data['email']
    session['user_id'] = user_id

    return redirect('/dashboard')


@app.route('/user/login', methods = ['POST'])
def login_user():
    

# if the user does not pass form validations redirect back
# to the login route
    valid = User.validate_login(request.form)

    if not valid:
        return redirect('/login')
    else:

        data = {
            "email": request.form['email']
        }
        
        # searches for the user by email in the database
        current_user = User.get_one(data)

        # no user? redirect to login
        if not current_user:
           flash("Invalid Login", "no_match")
           return redirect('/login')

        # user exists but the password from the form doesen't match? redirect to login
        if not bcrypt.check_password_hash(current_user.password, request.form['password']):
            flash("Invalid Login", "no_match")
            return redirect('/login')
    
    # store user data in session to verify the user, and display some of their info on the page
        if current_user:
            session['first_name'] = current_user.first_name
            session['email'] = current_user.email
            session['user_id'] = current_user.id
            session['last_name'] = current_user.last_name
            return redirect('/dashboard')



# Deletes the user from session and redirects to the login page
@app.route('/login')
def logout():
    session.clear()
    return redirect('/')
