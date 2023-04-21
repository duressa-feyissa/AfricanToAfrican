from flask import Flask

def create_app():
    
    app = Flask(__name__, static_url_path='/static')

    from fronted.student.route import students
    from fronted.mentor.route import mentors
    #from fronted.program.route import programs
    #from fronted.session.route import sessions
    #from fronted.topic.route import topics
	
    app.register_blueprint(students)
    app.register_blueprint(mentors)
    return app

