from flask import Flask
from flask_cors import CORS

def create_app():
    
    app = Flask(__name__, static_url_path='/static')


    #from fronted.mentor.route import mentors
    from fronted.student.route import students
    #from fronted.program.route import programs
    #from fronted.session.route import sessions
    #from fronted.topic.route import topics
	
    app.register_blueprint(students)
    return app

