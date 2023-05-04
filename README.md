# Expnsv
A responsive accounting application designed solely to keep track of outgoing expenses, built with Python/Flask.

## Screenshots
Login:
<br>
<br>
<img width="1329" alt="login" src="https://user-images.githubusercontent.com/104607714/228416655-5112067e-7d37-4fe9-8d59-1225b2761614.png">
<br>
<br>
Dashboard:
<br>
<br>
<img width="723" alt="dashboard" src="https://user-images.githubusercontent.com/104607714/228416709-c9625c4a-93ee-43f6-a565-4db67342e9be.png">
<br>
<br>
Reports:
<br>
<br>
<img width="723" alt="reports" src="https://user-images.githubusercontent.com/104607714/228416770-c7ea3833-0e1f-4944-b55d-fad7bf3591d3.png">
<br>
<br>
Dashboard Validations:
<br>
<br>
<img width="723" alt="dashvalidations" src="https://user-images.githubusercontent.com/104607714/228416824-c0f83788-42f2-4779-9ab4-fa69a6aa4f58.png">
<br>
<br>
Reports Validations:
<br>
<br>
<img width="723" alt="reportsValidations" src="https://user-images.githubusercontent.com/104607714/228416951-b813b0f6-f7bf-421d-811d-bb1339997160.png">
<br>
<br>

## Running the App Locally
To run the app locally, you'll need to have Python 3 and Flask installed on your machine.

1. Clone this repository to your local machine using the command `git clone https://github.com/username/repo.git`.

2. Navigate to the project directory with `cd expnsv`.

3. Create a virtual environment with `python3 -m venv venv`.

4. Activate the virtual environment with `source venv/bin/activate` on macOS/Linux or `venv\Scripts\activate` on Windows.

5. Install the dependencies with `pip install -r requirements.txt`.

6. Set the Flask app environment variable with `export FLASK_APP=app.py` on macOS/Linux or `set FLASK_APP=app.py` on Windows.

7. Start the app with `flask run`.

8. Open your web browser and navigate to `http://localhost:5000` to view the app.

## Reflection
My purpose for creating Expnsv was to combine my knowledge of Python/Flask with Ajax and Jquery to dynamically render data.

How I used these technologies:

- Used jinja2 templates to display data from the server to the client html.
- Enacted Ajax to dynamically load data onto the HTML without refreshing the page.
- Concealed and manifested validations and success messages from the page with Jquery.
- Protected page views from unregistered users by storing user information in session upon logging in and registering.
- Utilized SQL to construct effective queries to draw information from the database to the client.
