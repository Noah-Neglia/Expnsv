
from flask_app import app
from flask import jsonify
from flask import render_template, redirect, session, request
from flask_app.config.mysqlconnection import connectToMySQL
from jinja2 import Environment
from datetime import datetime
from flask_app.models.expense_model import Expense




@app.route('/dashboard')
def dashboard():

# If we dont have a user stored in session protect this view from being seen
    if "email" not in session:
        return redirect('/')

# Store the current user in session
    data = {
        "id" : session["user_id"]
    }
    # all the expenses for the current user
    all_expenses = Expense.users_expenses(data)
    if Expense.this_weeks_cost(data) == None:
     weekly_cost_sum = 0
    else:
        # the sum of the users expenses by dollar amount
        weekly_cost_sum = Expense.this_weeks_cost(data) 
        # total amount of weekly purchases for the current user
    weekly_purchases = Expense.this_weeks_total_purchases(data)
    
    
    return render_template('dashboard.html', 
    # pass variables to the template
    all_expenses = all_expenses, 
    weekly_cost_sum = weekly_cost_sum,
    weekly_purchases = weekly_purchases,
    )

@app.route('/create/expense/form')
def create_expense_form():
    return render_template('create_expense.html')


@app.route('/reports')
def reports():
    # If we dont have a user stored in session protect this view from being seen
    if "email" not in session:
        return redirect('/')

    # display the reports page
    return render_template('reports.html')


@app.route('/create/expense/responsive', methods = ['POST'])
def create_expense_responsive():

# if the expense form does not pass validations, redirect to dashboard
    if not Expense.validate_expense(request.form):
        return redirect('/create/expense/form')
        

# All the data from the form used to create an expense
    data = {
        **request.form,
        "user_id" : session['user_id']
    }

    Expense.create(data)

    return redirect('/create/expense/form')

@app.route('/create/expense', methods = ['POST'])
def create_expense():

# if the expense form does not pass validations, redirect to dashboard
    if not Expense.validate_expense(request.form):
        return redirect('/dashboard')
        

# All the data from the form used to create an expense
    data = {
        **request.form,
        "user_id" : session['user_id']
    }

    Expense.create(data)

    return redirect('/dashboard')

@app.route('/expense/id', methods = ['POST'])
def expense_id():

# get the expense id from the form and put it into the data dictionary
    data = {
        "expense_id" : request.form.get("expense_id")
    }

# send the data as a json object to the client
    return jsonify(data)

# this route gathers one expense from the database
@app.route('/one/expense/<int:id>', methods = ['POST'])
def one_expense(id):
    
    data = { "id":id
    }
    
    # Retreive the expense from the database using the id from the route parameter
    one_expense = Expense.one_users_expense(data)


    jsonData = {
        'one_expense' : one_expense
    }
    # send the expense as json data to the client
    return jsonify(jsonData)


@app.route('/update/expense/<int:id>', methods=['POST'])
def update_expense(id):


    # pass the form data to the validation fucntion
    errors = Expense.validate_update_expense(request.form)
    # if the fucntion return the variable valid as false
    # send the errors as a json object to the client
    if not errors['valid']:
        return jsonify(errors)


    data = {
        **request.form,
        'id' : id
    }

        
    Expense.update(data)
    
    # otherwise send the form data and the id from the route paramter to the client
    return jsonify(data)

@app.route('/create/report', methods = ['POST'])
def create_report():

    # pass the form data to the validation fucntion
    errors = Expense.validate_date_range(request.form)
     # if the fucntion return the variable valid as false
     # send the errors as a json object to the client
    if not errors['valid']:
        return jsonify(errors)
   
    data = {
        **request.form,
        "user_id" : session['user_id']
    }

    #The start_date and end_date from the form
    date_range = Expense.date_range(data)
    # the sum of the cost from the date range in dollar amount
    date_range_cost = Expense.date_Range_cost(data)
    # the total amount of expenses from the date range 
    date_range_purchases = Expense.date_Range_purchase_count(data)

    data = {
        'dateRange' : date_range,
        'dateCost' : date_range_cost,
        'datePurchases' : date_range_purchases
    }
    
    #Send the data to the client as a json object
    return jsonify(data)

# This route deletes at the given id from the route parameter
@app.route('/delete/expense/<int:id>')
def delete(id):
    
    data = { 
        "id":id
    }

    Expense.delete(data)
    return jsonify(data)



