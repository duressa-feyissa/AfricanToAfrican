from flask import render_template, request, jsonify, flash, redirect, url_for, Blueprint, make_response
import requests
from flask_cors import CORS
import requests

students = Blueprint('students', __name__)

CORS(students)
@students.route('/students/login', methods=['GET', 'POST'])
def Login():
	return render_template('signIn_S.html')
	
@students.route('/students/register', methods=['GET', 'POST'])
def Register():
	return render_template('signUp_S.html')

@students.route('/', methods=['GET', 'POST'])
def home():
		return render_template('home.html')

@students.route('/process_S', methods=['POST'])
def process_data():
		data = dict(request.form)
		if 'cpassword' in data:
			del data['cpassword']
		response = requests.post('http://localhost:3001/api/students', json=data)
		status_code = response.status_code
		return response.text, status_code

@students.route('/process_S_1', methods=['POST'])
def process_data1():
		data = dict(request.form)
		data['role'] = 'Student'
		response = requests.post('http://localhost:3001/api/auth', json=data)
		status_code = response.status_code
		resp = make_response(response.text, status_code)
		resp.set_cookie('session_id', response.text)
		return resp


    