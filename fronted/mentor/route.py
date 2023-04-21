from flask import render_template, request, jsonify, flash, redirect, url_for, Blueprint, make_response
import requests
from flask_cors import CORS
import requests

mentors = Blueprint('mentors', __name__)

CORS(mentors)
@mentors.route('/mentors/login', methods=['GET', 'POST'])
def Login():
	return render_template('signIn_M.html')
	

@mentors.route('/mentors/register', methods=['GET', 'POST'])
def Register():
	return render_template('signUp_M.html')

@mentors.route('/process_M', methods=['POST'])
def process_data_M():
		data = dict(request.form)
		if 'cpassword' in data:
			del data['cpassword']
		response = requests.post('http://localhost:3001/api/mentors', json=data)
		status_code = response.status_code
		return response.text, status_code

@mentors.route('/process_M_1', methods=['POST'])
def process_data_M_1():
    data = dict(request.form)
    data['role'] = 'Mentor'
    response = requests.post('http://localhost:3001/api/auth', json=data)
    status_code = response.status_code
    resp = make_response(response.text, status_code)
    resp.set_cookie('session_id', response.text)
    return resp

@mentors.route('/mentor', methods=['GET', 'POST'])
def MentorHome():
	return render_template('M-home.html')

@mentors.route('/mentor/add-program', methods=['GET', 'POST'])
def addprogram():
	return render_template('addProgram.html')

def remove_zwsp(string):
    return string.replace('\u200b', '')

@mentors.route('/process_M_2', methods=['POST'])
def process_data_M_2():
    data = dict(request.form)
    api_url = 'http://localhost:3001/api/me'
    cookie_value = request.cookies.get('session_id')
    headers = {'x-auth-token': remove_zwsp(cookie_value)}
    response = requests.get(api_url, headers=headers)
    if response.status_code != 200:
        return {"Error": "Invalid"}, 400
    New = {
	    "title": data['title'],
	    "description": data['message'].strip(),
	    "duration": {
            "start": data['start'],
            "end": data['end']
        },
        "mentor": response.json()['_id']
    }
    response = requests.post('http://localhost:3001/api/programs',headers=headers, json=New)
    status_code = response.status_code
    return response.text, status_code
    
@mentors.route('/mentor/add-announce', methods=['GET', 'POST'])
def addAnnouncement():
    api_url = 'http://localhost:3001/api/programs'
    cookie_value = request.cookies.get('session_id')
    headers = {'x-auth-token': remove_zwsp(cookie_value)}
    response = requests.get(api_url, headers=headers)
    return render_template('addAnnoucment.html', options=response.json())

@mentors.route('/process_M_3', methods=['POST'])
def process_data_M_3():
    data = dict(request.form)
    api_url = 'http://localhost:3001/api/me'
    cookie_value = request.cookies.get('session_id')
    headers = {'x-auth-token': remove_zwsp(cookie_value)}
    response = requests.get(api_url, headers=headers)
    if response.status_code != 200:
        return {"Error": "Invalid"}, 400
    New = { "content": data['content'].strip() }
    url = "http://localhost:3001/api/programs/{}/announcements".format(data['option'])
    response = requests.post(url,headers=headers, json=New)
    status_code = response.status_code
    return response.text, status_code


@mentors.route('/mentor/add-session', methods=['GET', 'POST'])
def addSession():
    api_url = 'http://localhost:3001/api/programs'
    cookie_value = request.cookies.get('session_id')
    headers = {'x-auth-token': remove_zwsp(cookie_value)}
    response = requests.get(api_url, headers=headers)
    return render_template('addSession.html', options=response.json())

@mentors.route('/mentor/add-topic', methods=['GET', 'POST'])
def addTopic():
    api_url = 'http://localhost:3001/api/programs'
    cookie_value = request.cookies.get('session_id')
    headers = {'x-auth-token': remove_zwsp(cookie_value)}
    response = requests.get(api_url, headers=headers)
    return render_template('addTopic.html', options=response.json())

@mentors.route('/process_M_4', methods=['POST'])
def process_data_M_4():
    data = dict(request.form)
    api_url = 'http://localhost:3001/api/me'
    cookie_value = request.cookies.get('session_id')
    headers = {'x-auth-token': remove_zwsp(cookie_value)}
    response = requests.get(api_url, headers=headers)
    if response.status_code != 200:
        return {"Error": "Invalid"}, 400
    url = "http://localhost:3001/api/sessions"
    New = {
        "title": data['title'],
        "programId": data['option'],
        "link": data['link'] ,
        "duration": data['duration'],
        "status": "schedule"
    }
    response = requests.post(url,headers=headers, json=New)
    status_code = response.status_code
    return response.text, status_code

@mentors.route('/process_M_5', methods=['POST'])
def process_data_M_5():
    data = dict(request.form)
    api_url = 'http://localhost:3001/api/me'
    cookie_value = request.cookies.get('session_id')
    headers = {'x-auth-token': remove_zwsp(cookie_value)}
    response = requests.get(api_url, headers=headers)
    if response.status_code != 200:
        return {"Error": "Invalid"}, 400
    url = "http://localhost:3001/api/topics"
    """
    New = {
        "title": data['title'],
        "description": data['description'],
        "programId": data['option'],
        "resources": data['resources'],
        "duration": {
          "start": data['start'],
          "end": data['end']
        }
    }
    response = requests.post(url,headers=headers, json=New)
    status_code = response.status_code
    return response.text, status_code
    """
    print(data)
    return ""
      
