from tabnanny import verbose
from flask import Flask, jsonify, request, Response
from flask_cors import CORS
from chatbot import ChatBot
from datetime import datetime

sparqlEndpoint = "http://Anuneets-MacBook-Air.local:7200/repositories/IFHP"
confidence_threshold = 0.6
verbose = True
MedBot = ChatBot(sparql_endpoint = sparqlEndpoint, threshold = confidence_threshold, verbose=verbose)

with open("userFeedback.txt", "r") as f:
	userFeedback = eval(f.read())
app = Flask(__name__)
cors = CORS(app, headers=["Access-Control-Allow-Origin", "Content-Type", "Authorization"])

@app.route('/sendQueryType', methods=['POST'])
def sendQueryType():
	if (request.method == 'POST'):
		data = request.get_json()['params']
		MedBot.setQueryType(data['queryType'])
		return Response(status=200)

@app.route('/sendQueryTopic', methods = ['POST'])
def sendQueryTopic():
	if(request.method == 'POST'):
		data = request.get_json()['params']
		MedBot.setTopic(data['topic'].lower())
		return Response(status=200)

@app.route('/sendQuery', methods = ['POST'])
def sendQuery():
	if(request.method == 'POST'):
		data = request.get_json()['params']
		MedBot.setQuery(data['query'])
		return Response(status=200)

@app.route('/sendQueryAnswerType', methods = ['POST'])
def sendQueryAnswerType():
	if(request.method == 'POST'):
		data = request.get_json()['params']
		MedBot.setAnswerType(data['answerType'])
		return Response(status=200)

@app.route('/getGenericQueryEntities', methods = ['GET'])
def getGenericQueryEntities():
	if(request.method == 'GET'):
		identified_entities = MedBot.getIdentifiedEntities()
		other_entities = MedBot.getOtherEntities()
		return jsonify({"identified_entities": identified_entities, "other_entities": other_entities})

@app.route('/sendSelectedEntities', methods = ['POST'])
def sendSelectedEntities():
	if(request.method == 'POST'):
		data = request.get_json()['params']
		query_data = MedBot.getQueryData()
		updated_entities = data['selected_entities']
		for entity in updated_entities:
			query_data['Entity_Scores'][entity] = updated_entities[entity]
		MedBot.setQueryData(query_data)
		return Response(status=200)

@app.route('/getQueryRequests', methods = ['GET', 'POST'])
def getQueryRequests():
	if(request.method == 'GET'):
		data = request.args.to_dict()
		query_mode = data['queryMode']
		if query_mode == "generic":
			applied_filters = MedBot.findAppliedFilters()
			return jsonify({'flag': True, 'filters': applied_filters})
		else:
			checkID = MedBot.validateID()
			if checkID:
				return jsonify({'flag': True, 'id': ""})
			else:
				return jsonify({'flag': True, 'id': MedBot.getQueryData()['Topic']})

@app.route('/sendPrimaryEntityID', methods = ['POST'])
def sendPrimaryEntityID():
	if(request.method == 'POST'):
		data = request.get_json()['params']
		MedBot.setPrimaryEntityID(data['id'])
		return Response(status=200)

@app.route('/sendFilters', methods = ['POST'])
def sendFilters():
	if(request.method == 'POST'):
		data = request.get_json()['params']
		filters = data['filters']
		MedBot.updateFilters(filters)
		return Response(status=200)

@app.route('/getPossibleTemplates', methods = ['GET'])
def getPossibleTemplates():
	if(request.method == 'GET'):
		MedBot.findTemplates()
		templates = MedBot.getTemplates()
		template_desc = {i:templates[i][1] for i in range(len(templates))}
		return jsonify({'queries': template_desc})

@app.route('/sendTemplate', methods = ['POST'])
def sendTemplate():
	if(request.method == 'POST'):
		data = request.get_json()['params']
		template_id = int(data['id'])
		if template_id > len(MedBot.getTemplates()):
			userFeedback['negative'] += 1
		else:
			best_template = MedBot.getTemplates()[template_id][0]
			print(best_template)
			MedBot.prepareQuery(best_template)
		return Response(status=200)

@app.route('/sendConfirmation', methods = ['POST'])
def sendConfirmation():
	if(request.method == 'POST'):
		data = request.get_json()['params']
		if(data['confirmation'] == 'Yes'):
			MedBot.executeQuery()
			userFeedback['positive'] += 1
			if verbose: log()
		else:
			userFeedback['negative'] += 1
		return Response(status=200)

@app.route('/getQueryResults', methods = ['GET'])
def getQueryResults():
	if(request.method == 'GET'):
		query_results = MedBot.getResponse()
		return jsonify({'results': query_results })

@app.route('/restart', methods = ['POST'])
def restart():
	if(request.method == 'POST'):
		with open('userFeedback.txt','w') as file:
			file.write(str(userFeedback))
		MedBot.restart()
		return Response(status=200)

def log():
	print("Hello World")
	Data = MedBot.getQueryData()
	with open('logs.txt','a') as file:
		file.write("-"*100+"\n")
		file.write("Timestamp :"+str(datetime.now())+"\n")
		file.write("User Query :"+str(MedBot.user_query)+"\n")
		file.write("User Query Type :"+str(MedBot.query_type)+"\n")
		file.write("User Query Topic :"+str(Data['Topic'])+"\n")
		file.write("User Query Answer Type :"+str(Data['Answer_Type'])+"\n")
		file.write("User Query Entities :"+str(Data['Entity_Scores'])+"\n")
		file.write("User Query Filters :"+str(Data['Filters'])+"\n")
		file.write("SPARQL Query :"+str(MedBot.sparql_query)+"\n")
		file.write("-"*100+"\n")


if __name__ == '__main__':
	app.run(debug = True)

