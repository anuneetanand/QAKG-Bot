import datetime
from SPARQLWrapper import SPARQLWrapper, JSON, XML, CSV
from nlp_helper import findEntity, findRelation
class ChatBot:
    def __init__(self, sparql_endpoint):
        self.user_inputs = []
        self.question = ""
        self.entities = {}
        self.relations = {}
        self.templates = []
        self.query = ""
        self.sparql_endpoint = sparql_endpoint

    def storeQuestion(self, user_query):
        self.user_inputs.append(user_query)
        self.question = user_query

    def parseQuestion(self):
        self.entities = findEntity(self.question)
        self.relations = findRelation(self.question)

    def storeEntityID(self, entity_id):
        self.entities['id'] = entity_id

    def getPossibleQueries(self):
        pass

    def getPossibleFilters(self):
        pass

    def sendPossibleFilters(self):
        pass

    def sendSelectedQuery(self):
        pass

    def executeQuery(self, data_format = JSON):
        sparql = SPARQLWrapper(self.sparql_endpoint)
        sparql.setQuery(self.query)
        sparql.setReturnFormat(data_format)
        results = sparql.query().convert()
        return results

    def stop(self):
        with open("logs.txt","a") as f:
            f.write(">>>", datetime.datetime.now())
            f.write("User inputs: " + str(self.user_inputs) + "\n")
            f.write("Question: " + self.question + "\n")
            f.write("Entities: " + str(self.entities) + "\n")
            f.write("Query: " + self.query + "\n")
            f.write("-"*50 + "\n")