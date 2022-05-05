from SPARQLWrapper import SPARQLWrapper, JSON, XML, CSV
from query_templates import *
from nlp_toolbox import *

class ChatBot:
    def __init__(self, sparql_endpoint, threshold = 0.5):
        self.NLPToolbox = NLP_Toolbox()
        self.user_query = ""
        self.query_data = {}
        self.templates = {}
        self.sparql_query = ""
        self.threshold = threshold
        self.sparql_endpoint = sparql_endpoint

    def setQuery(self, user_query):
        self.user_query = user_query
        self.query_data = self.NLPToolbox.parse(self.user_query)

    def setTopic(self, topic):
        self.query_data['Topic'] = topic

    def checkAttribute(self, attribute):
        if attribute in self.query_data['Attribute_Scores']:
            return self.query_data['Attribute_Scores'][attribute] > self.threshold

    def findTemplates(self):
        if self.query_data['Topic'] == "patient":

            if self.checkAttribute("drug"):
                template = get_drug_info(self.query_data['Patient_ID'][0], self.checkAttribute("dose"), self.checkAttribute("route"), self.checkAttribute("date"))
            elif self.checkAttribute("disease"):
                template = get_disease(self.query_data['Patient_ID'][0], self.checkAttribute("date"))
            else:
                template = get_patient_info(self.query_data['Patient_ID'][0], True, True)
        
        elif self.query_data['Topic'] == "drug":
            template = get_drug_info(self.query_data['Snomed_ID'][0], self.checkAttribute("route"))
        
        elif self.query_data['Topic'] == "condition":
            template = get_disease(self.query_data['Snomed_ID'][0])
        
        else:

            if self.checkAttribute("patient") and self.checkAttribute("drug"):
                template = get_patient_drug_list(self.query_data['Patient_ID'][0], self.filters['age'], self.filters['age']['comp'], self.filters['gender'])
            elif self.checkAttribute("patient") and self.checkAttribute("condition"):
                template = get_patient_disease_list(self.query_data['Patient_ID'][0], self.filters['age'], self.filters['age']['comp'], self.filters['gender'])
            elif self.checkAttribute("patient"):
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