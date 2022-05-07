from wsgiref import headers
from flask import Flask, jsonify, request
from flask_cors import CORS
from requests import head
from chatbot import ChatBot

confidence_threshold = 0.6
sparqlEndpoint = "http://Anuneets-MacBook-Air.local:7200/repositories/IFHP"
MedBot = ChatBot(sparql_endpoint = sparqlEndpoint, threshold = confidence_threshold)
userFeedback = {"positive": 0, "negative": 0}
app = Flask(__name__)
cors = CORS(app, headers=["Access-Control-Allow-Origin", "Content-Type", "Authorization"])

@app.route('/home', methods = ['GET', 'POST'])
def home():
	if(request.method == 'GET'):
		data = "Hello!"
	if(request.method == 'POST'):
		data = request.get_json()['params']
		print(data)
		return jsonify({'data': data, "xyz": ["1"], "abcd": {1:2}})

@app.route('/sendQueryTopic', methods = ['POST'])
def sendQueryTopic():
	if(request.method == 'POST'):
		data = request.get_json()['params']
		MedBot.setTopic(data['topic'])
		print(MedBot.query_data)
		return jsonify('Success')

@app.route('/sendQuery', methods = ['POST'])
def sendQuery():
	if(request.method == 'POST'):
		data = request.get_json()['params']
		MedBot.setQuery(data['query'])
		print(MedBot.query_data)
		return jsonify('Success')

@app.route('/sendQueryAnswerType', methods = ['POST'])
def sendQueryAnswerType():
	if(request.method == 'POST'):
		data = request.get_json()['params']
		MedBot.setAnswerType(data['answerType'])
		return jsonify('Success')

@app.route('/getEntitiesGeneralizedQuery', methods = ['GET'])
def getEntitiesGeneralizedQuery():
	if(request.method == 'GET'):
		entity_data =list(MedBot.query_data['Entity_Scores'].keys())
		entities = {i:entity_data[i] for i in range(len(entity_data))}
		return jsonify({'entities': entities})

@app.route('/sendSelectedEntities', methods = ['POST'])
def sendSelectedEntities():
	if(request.method == 'POST'):
		data = request.get_json()['params']
		query_data = MedBot.query_data
		updated_entities = data['entities']
		for entity in updated_entities:
			query_data[entity['name']] = entity['score']
		MedBot.updateQueryData(query_data)
		return jsonify('Success')

@app.route('/getQueryRequests', methods = ['GET', 'POST'])
def getQueryRequests():
	print("lol", request.method)
	if(request.method == 'GET'):
		print("lolololol", request.args.to_dict())
		data = request.args.to_dict()
		print(request, data)
		query_mode = data['queryMode']
		if query_mode == "generalized":
			applied_filters = MedBot.findAppliedFilters()
			return jsonify({'flag': True, 'filters': applied_filters})
		else:
			checkID = MedBot.validateID()
			return jsonify({'flag': True, 'id': checkID})

@app.route('/sendPrimaryEntityID', methods = ['POST'])
def sendPrimaryEntityID():
	if(request.method == 'POST'):
		data = request.get_json()['params']
		MedBot.setPrimaryEntityID(data['id'])
		return jsonify('Success')

@app.route('/getPossibleFilters', methods = ['GET'])
def getPossibleFilters():
	if(request.method == 'GET'):
		possible_filters = MedBot.findPossibleFilters()
		return jsonify({'filters': possible_filters})

@app.route('/sendFilters', methods = ['POST'])
def sendFilters():
	if(request.method == 'POST'):
		data = request.get_json()['params']
		filters = data['filters']
		MedBot.query_data['filters'] = filters
		return jsonify('Success')

@app.route('/getPossibleTemplates', methods = ['GET'])
def getPossibleTemplates():
	if(request.method == 'GET'):
		MedBot.findTemplates()
		templates = MedBot.templates
		template_desc = {i:MedBot.templates[i][1] for i in range(len(templates))}
		return jsonify({'queries': template_desc})

@app.route('/sendTemplate', methods = ['POST'])
def sendTemplate():
	if(request.method == 'POST'):
		data = request.get_json()['params']
		template_id = data['id']
		best_template = MedBot.templates[template_id]
		MedBot.setTemplate(best_template)
		return jsonify('Success')

@app.route('/sendConfirmation', methods = ['POST'])
def sendConfirmation():
	if(request.method == 'POST'):
		data = request.get_json()['params']
		if(data['confirmation'] == 'Yes'):
			userFeedback['positive'] += 1
			MedBot.executeQuery()
		else:
			userFeedback['negative'] += 1
			MedBot.setQuery(None)
		return jsonify('Success')

@app.route('/getQueryResults', methods = ['GET'])
def getQueryResults():
	if(request.method == 'GET'):
		return jsonify({'results': MedBot.response})

@app.route('/restart', methods = ['POST'])
def restart():
	if(request.method == 'POST'):
		MedBot.restart()
		return jsonify('Success')

if __name__ == '__main__':
	app.run(debug = True)

