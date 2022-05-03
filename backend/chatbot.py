from query_templates import *
from SPARQLWrapper import SPARQLWrapper, JSON, XML, CSV
from nlp_helper import findEntity, findRelation, entitySearch

class ChatBot:
    def __init__(self, sparql_endpoint):
        self.user_query = ""
        self.entities = {}
        self.primaryEntity = {}
        self.filters = {}
        self.sparql_query = ""
        self.sparql_endpoint = sparql_endpoint

    def setQuery(self, user_query):
        self.user_query = user_query
        self.entities = findEntity(self.user_query)

    def setEntityId(self, entity_id):
        self.entity_id = entity_id

    def setFilters(self, filters):
        self.filters = filters

    def findTemplates(self):
        
        if self.primaryEntity["type"] == "patient":

            if entitySearch("drug", self.entities):
                template = get_drug_info(self.primaryEntity["id"], entitySearch("dose", self.entities), entitySearch("route", self.entities), entitySearch("date", self.entities))
            elif entitySearch("disease", self.entities):
                template = get_disease(self.primaryEntity["id"], entitySearch("date", self.entities))
            else:
                template = get_patient_info(self.primaryEntity["id"], True, True)
        
        elif self.primaryEntity["type"] == "drug":
            template = get_drug_info(self.primaryEntity["id"], entitySearch("route", self.entities))
        
        elif self.primaryEntity["type"] == "condition":
            template = get_disease(self.primaryEntity["id"])
        
        else:

            if entitySearch("patient", self.entities) and entitySearch("drug", self.entities):
                template = get_patient_drug_list(self.primaryEntity["id"], self.filters['age'], self.filters['age']['comp'], self.filters['gender'])
            elif entitySearch("patient", self.entities) and entitySearch("condition", self.entities):
                template = get_patient_disease_list(self.primaryEntity["id"], self.filters['age'], self.filters['age']['comp'], self.filters['gender'])
            elif entitySearch("patient", self.entities):
                template = get_patient_list(self.filters['age'], self.filters['age']['comp'], self.filters['gender'])
            else:
                template = None

        return template              

    def prepareQuery(self, best_template):
        self.sparql_query = best_template

    def executeQuery(self, data_format = 'JSON'):
        sparql_format = {'JSON': JSON, 'XML': XML, 'CSV': CSV}
        sparql = SPARQLWrapper(self.sparql_endpoint)
        sparql.setQuery(self.sparql_query)
        sparql.setReturnFormat(sparql_format['data_format'])
        results = sparql.query().convert()
        return results