from flask import Flask, jsonify, request
from chatbot import ChatBot

confidence_threshold = 0.6
sparqlEndpoint = "http://Anuneets-MacBook-Air.local:7200/repositories/IFHP"
MedBot = ChatBot(sparql_endpoint = sparqlEndpoint, threshold = confidence_threshold)
userFeedback = {"positive": 0, "negative": 0}
query_mode = ""
app = Flask(__name__)

@app.route('/', methods = ['GET', 'POST'])
def home():
	if(request.method == 'GET'):
		data = "Hello!"
	if(request.method == 'POST'):
		data = request.get_json()
		return jsonify({'data': data})

@app.route('/sendQueryTopic', methods = ['POST'])
def sendQueryTopic():
	if(request.method == 'POST'):
		data = request.get_json()
		MedBot.setTopic(data['topic'])

@app.route('/sendQuery', methods = ['POST'])
def sendQuery():
	if(request.method == 'POST'):
		data = request.get_json()
		MedBot.setQuery(data['query'])

@app.route('/sendQueryAnswerType', methods = ['POST'])
def sendQueryAnswerType():
	if(request.method == 'POST'):
		data = request.get_json()
		MedBot.setAnswerType(data['answer_type'])

@app.route('/getEntitiesGeneralizedQuery', methods = ['GET'])
def getEntitiesGeneralizedQuery():
	if(request.method == 'GET'):
		entity_data = MedBot.query_data['Entity_Scores']
		return jsonify({'data': entity_data})

@app.route('/sendSelectedEntities', methods = ['POST'])
def sendSelectedEntities():
	if(request.method == 'POST'):
		data = request.get_json()
		query_data = MedBot.query_data
		updated_entities = data['entities']
		for entity in updated_entities:
			query_data[entity['name']] = entity['score']
		MedBot.updateQueryData(query_data)

@app.route('/getQueryRequests', methods = ['GET'])
def getQueryRequests():
	if(request.method == 'GET'):
		if query_mode == "generalized":
			applied_filters = MedBot.findAppliedFilters()
			return jsonify({'data': {'flag': True, 'filters': applied_filters}})
		else:
			checkID = MedBot.validateID()
			return jsonify({'data': {'flag': True, 'id': checkID}})

@app.route('/sendPrimaryEntityID', methods = ['POST'])
def sendPrimaryEntityID():
	if(request.method == 'POST'):
		data = request.get_json()
		MedBot.setPrimaryEntityID(data['id'])

@app.route('/getPossibleFilters', methods = ['GET'])
def getPossibleFilters():
	if(request.method == 'GET'):
		possible_filters = MedBot.getPossibleFilters()
		return jsonify({'data': {'flag': True, 'filters': possible_filters}})

@app.route('/sendFilters', methods = ['POST'])
def sendFilters():
	if(request.method == 'POST'):
		data = request.get_json()
		filters = data['filters']
		MedBot.query_data['filters'] = filters

@app.route('/getPossibleTemplates', methods = ['GET'])
def getPossibleTemplates():
	if(request.method == 'GET'):
		MedBot.findTemplates()
		template_desc = [template[1] for template in MedBot.templates]
		return jsonify({'data': template_desc})

@app.route('/sendTemplate', methods = ['POST'])
def sendTemplate():
	if(request.method == 'POST'):
		data = request.get_json()
		template_id = data['id']
		best_template = MedBot.templates[template_id]
		MedBot.setTemplate(best_template)

@app.route('/sendConfirmation', methods = ['POST'])
def sendConfirmation():
	if(request.method == 'POST'):
		data = request.get_json()
		if(data['confirmation'] == 'yes'):
			userFeedback['positive'] += 1
			MedBot.executeQuery()
		else:
			userFeedback['negative'] += 1
			MedBot.setQuery(None)

@app.route('/getQueryResults', methods = ['GET'])
def getQueryResults():
	if(request.method == 'GET'):
		return jsonify({'data': MedBot.response})

if __name__ == '__main__':
	app.run(debug = True)

