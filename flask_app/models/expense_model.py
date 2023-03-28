
from flask_app import DATABASE

import time

from flask_app.config.mysqlconnection import connectToMySQL

from flask_app.models.user_model import User

from flask import flash

from datetime import datetime

class Expense:

    def __init__( self , data):
        self.id = data['id']
        self.name = data['name']
        self.cost = data['cost']
        self.date = data['date']
        self.description = data['description']
        self.created_at = data['created_at']
        self.updated_at = data['updated_at']

    @classmethod
    def create(cls, data):
        query = "INSERT INTO expenses"
        query += " ( name, cost, date, description, user_id )"
        query += " VALUES ( %(name)s, %(cost)s, %(date)s, %(description)s, %(user_id)s );"

        return connectToMySQL(DATABASE).query_db( query, data)

    @classmethod
    def update(cls, data):
       
      query = "UPDATE expenses"
      query += " SET name = %(name)s, cost = %(cost)s, date = %(date)s,"
      query += " description = %(description)s"
      query += " WHERE id = %(id)s;"
      return connectToMySQL(DATABASE).query_db(query, data)


    @classmethod
    def one_users_expense( cls, data ):
        #gathers a single users expense
        query = "SELECT * FROM expenses"
        query += " JOIN users ON expenses.user_id = users.id"
        query += " WHERE expenses.id = %(id)s;"
    

        return connectToMySQL(DATABASE).query_db(query, data)

    @staticmethod
    def validate_expense(expense):
            
            valid = True

            #Validates the expense name 
            if len(expense['name']) < 3:
                flash("Expense name must be greater than 3 characters.", "invalid_name")
                valid = False
            #Validates the cost field, making sure it is not empty
            if expense['cost'] == "" or float(expense['cost']) < 0.01:
                flash("Cost field cannot be empty.", "invalid_cost")
                valid = False
            #validates the format of the cost field so that it resembles money
            if '.' not in expense['cost'] or len(expense['cost']) < 4:
                flash("Cost field must be entered as 0.00", "invalid_cost_format")
                valid = False
            #Validates the date field, making sure the user is not selecting dates in the future.
            if(expense['date'] != ""):
                form_date = datetime.strptime(expense['date'], '%Y-%m-%d' )
                current_date = datetime.now()
                if form_date > current_date:
                    flash("You cannot select future dates.", "future_date")
                    valid = False
            # Date field cannot be empty
            if expense['date'] =="":
                flash("Date field cannot be empty.", "invalid_date")
                valid = False
            # Description field cannot be empty 
            if expense['description'] =="":
                flash("Description field cannot be empty.", "invalid_description")
                valid = False
            #Descritpion field is capped at a length of 255
            if len(expense['description']) > 255:
                flash("Description field is limited to 255 characters", "invalid_description_length")
                valid = False

            if valid == True:
                flash("Expense Created ✔", "expense_success")
            
            return valid
                
            

    
    @staticmethod
    # The same as the previous method validtae_expense, returned to be Sent as JSON
    def validate_update_expense(expense):
        
        errors = {}
        valid = True

        if len(expense['name']) < 3:
            errors['name'] = "Expense name must be greater than 3 characters."
            valid = False
        if expense['cost'] == "" or float(expense['cost']) < 0.01:
            errors['cost'] = "Cost field cannot be empty."
            valid = False
        if '.' not in expense['cost'] or len(expense['cost']) < 4:
            errors['cost'] = "Cost field must be entered as 0.00"
            valid = False
        if(expense['date'] != ""):
            form_date = datetime.strptime(expense['date'], '%Y-%m-%d' )
            current_date = datetime.now()
            if form_date > current_date:
                errors['date'] = "You cannot select future dates."
                valid = False
        if expense['date'] =="":
            errors['date'] = "Date field cannot be empty."
            valid = False
        if expense['description'] =="":
            errors['description'] = "Description field cannot be empty."
            valid = False
        if len(expense['description']) > 255:
            errors['description'] = "Description field is limited to 255 characters"
            valid = False
        
        response = {'valid': valid, 'errors': errors}

        return response
    
    @staticmethod
    def validate_date_range(date):
        
        errors = {}
        valid = True
        # Validates the start date, it cannot be emoty
        if date['start_date'] =="":
            errors['start_date'] = "Start date cannot be empty."
            valid = False
        #End date cannot be empty also.
        if date['end_date'] =="":
            errors['end_date'] = "End date cannot be empty."
            valid = False
        #validates the start date, making sure it is not greater than the end date
        if(date['start_date'] != "" and date['end_date'] !=""):
            # start_date = datetime.strptime(date['stardate'], '%Y-%m-%d' )
            if date['start_date'] > date['end_date']:
                errors['start_date'] = "Start date cannot be greater than End date."
                valid = False
       
       #send to the controller as a dictionary, so we can validate it, and potentially send the errors as JSON
        response = {'valid': valid, 'errors': errors}
        return response


    @classmethod
    def users_expenses(cls, data):
        #Gathers all of the expens for the current user stored in session
        query = "SELECT * FROM expenses JOIN users on expenses.user_id = users.id WHERE users.id =%(id)s ORDER BY date DESC;"

        results = connectToMySQL(DATABASE).query_db(query, data)
        expense_list = []
        for row in results:
            expense = cls(row)
            #User data contains every row of expense from the query, in addition to the data of the user it belongs to
            user_data = {
                **row,
                "id" : row['users.id'],
                "created_at" : row['users.created_at'],
                "updated_at" : row['users.updated_at'],
            }
            current_user = User(user_data)
            expense.user = current_user
            expense_list.append(expense)
        return expense_list



    @classmethod
    def this_weeks_cost ( cls, data):

        #Rounds all of the current users expense prices from the current week into a single float

        query = "SELECT ROUND(SUM(cost), 2) FROM expenses "
        query += 'JOIN users ON expenses.user_id = users.id'
        query += " WHERE users.id = %(id)s "
        query += "AND YEARWEEK(expenses.date) = YEARWEEK(CURDATE());"

        result = connectToMySQL(DATABASE).query_db(query, data)
   
        return result[0]['ROUND(SUM(cost), 2)']

    @classmethod
    def this_weeks_total_purchases ( cls, data ):

        #Counts the number of the current users expenses for the current week

        query = "SELECT COUNT(cost) FROM expenses "
        query += 'JOIN users ON expenses.user_id = users.id'
        query += " WHERE users.id = %(id)s "
        query += "AND YEARWEEK(expenses.date) = YEARWEEK(CURDATE());"

        result =  connectToMySQL(DATABASE).query_db(query, data)
        return result[0]['COUNT(cost)']

   

    @classmethod
    def date_range( cls, data):
        #gathers all of the current users expenses from the selected date range
         query = 'SELECT * FROM expenses '
         query += 'JOIN users ON expenses.user_id = users.id'
         query += " WHERE users.id = %(user_id)s "
         query += 'AND expenses.date BETWEEN %(start_date)s AND %(end_date)s '
         query += "ORDER BY expenses.date DESC;"

         return connectToMySQL(DATABASE).query_db( query, data)

    @classmethod
    def date_Range_cost( cls, data):
        #gathers the summed total cost of all the current users expenses from the selected date range
         query = "SELECT ROUND(SUM(cost), 2) FROM expenses "
         query += 'JOIN users ON expenses.user_id = users.id'
         query += " WHERE users.id = %(user_id)s "
         query += 'AND expenses.date BETWEEN %(start_date)s AND %(end_date)s '
         query += "ORDER BY expenses.date DESC;"

         return connectToMySQL(DATABASE).query_db( query, data)
    
    @classmethod
    def date_Range_purchase_count( cls, data):
        #gathers the summed amount of the current users expenses from the slected date range
         query = "SELECT COUNT(cost) FROM expenses "
         query += 'JOIN users ON expenses.user_id = users.id'
         query += " WHERE users.id = %(user_id)s "
         query += 'AND expenses.date BETWEEN %(start_date)s AND %(end_date)s '
         query += "ORDER BY expenses.date DESC;"

         return connectToMySQL(DATABASE).query_db( query, data)

    @classmethod
    #deletes an expense from the database.
    def delete(cls, data):
        query = "DELETE FROM expenses"
        query += " WHERE id = %(id)s"

        return connectToMySQL(DATABASE).query_db(query, data)


    

   