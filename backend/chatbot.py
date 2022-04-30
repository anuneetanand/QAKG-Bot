import datetime
from SPARQLWrapper import SPARQLWrapper, JSON

class ChatBot:
    def __init__(self, sparql_endpoint):
        self.user_inputs = []
        self.question = ""
        self.entities = {"subject": [], "predicate": [], "object": []}
        self.templates = []
        self.query = ""
        self.feedback = {"positive": 0, "negative": 0}
        self.sparql_endpoint = sparql_endpoint

    def storeQuery(self, query):
        self.user_inputs.append(query)
        self.question = query

    def findEntities(self):
        pass

    def storeEntityID(self, entity_id):
        self.entities['subject'][0]['id'] = entity_id

    def getPossibleQueries(self):
        pass

    def getPossibleFilters(self):
        pass

    def sendPossibleFilters(self):
        pass

    def sendSelectedQuery(self):
        pass

    def sendConfirmation(self, vote):
        if vote:
            self.feedback["positive"] += 1
        else:
            self.feedback["negative"] += 1
        return self.executeQuery()

    def executeQuery(self):
        sparql = SPARQLWrapper(self.sparql_endpoint)
        sparql.setQuery(self.query)
        sparql.setReturnFormat(JSON)
        results = sparql.query().convert()
        return results

    def stop(self):
        with open("logs.txt","a") as f:
            f.write(">>>", datetime.datetime.now())
            f.write("User inputs: " + str(self.user_inputs) + "\n")
            f.write("Question: " + self.question + "\n")
            f.write("Entities: " + str(self.entities) + "\n")
            f.write("Query: " + self.query + "\n")
            f.write("Feedback Statistics: " + str(self.feedback) + "\n")
            f.write("-"*50 + "\n")

        self.user_inputs, self.question, self.entities, self.templates, self.query = [], "", {"subject": [], "predicate": [], "object": []}, [], ""
