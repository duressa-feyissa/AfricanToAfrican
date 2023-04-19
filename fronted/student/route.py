from flask import render_template, request, jsonify, flash, redirect, url_for, Blueprint
import requests
from flask_cors import CORS

students = Blueprint('students', __name__)

CORS(students)
@students.route('/students/login', methods=['GET', 'POST'])
def Login():
	return render_template('signIn.html')
	
@students.route('/students/register', methods=['GET', 'POST'])
def Register():
	return render_template('signUp.html')

@students.route('/', methods=['GET', 'POST'])
def home():
		return render_template('home.html')