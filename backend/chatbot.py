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

    def findTemplates(self):
        Score = self.query_data["Attribute_Scores"]
        Check = {attribute: Score[attribute] > self.threshold for attribute in Score}
        Filters = self.query_data["Filters"]
        Templates = []

        if self.query_data['Topic'] == "patient" and len(self.query_data['Patient_ID']):

            if Check["drug"]:
                template = get_drug_info(self.query_data['Patient_ID'][0], Check["dose"], Check["administration"], Check["date"])
                description = f'Information about drugs {"dosage" if Check["dose"] else ""} {"route" if Check["administration"] else ""} {"duration" if Check["dose"] else ""} given to patient with ID : {self.query_data["Patient_ID"][0]}'
                template_score = (Score["patient"]+Score["dose"]+Score["administration"]+Score["date"])/4
                Templates.append((template, description, template_score))

            if Check["condition"]:
                template = get_patient_disease_info(self.query_data['Patient_ID'][0], Check["date"])
                description = f'Information about diseases {"and their duration" if Check["date"] else ""} that affected patient with ID : {self.query_data["Patient_ID"][0]}'
                template_score = (Score["patient"]+Score["date"])/2
                Templates.append((template, description, template_score))

            if Check["age"] or Check["gender"]:
                template = get_patient_info(self.query_data['Patient_ID'][0], True, True)
                description = f'Information about age and gender of patient with ID : {self.query_data["Patient_ID"][0]}'
                template_score = (Score["patient"]+Score["age"]+Score["gender"])/3
                Templates.append((template, description, template_score))

        elif self.query_data["Topic"] == "drug" and len(self.query_data['Snomed_ID']):

            template = get_drug_info(self.query_data['Snomed_ID'][0], Check["administration"])
            description = f'Information about drug {"and its route" if Check["administration"] else ""}  with Snomed_ID : {self.query_data["Snomed_ID"][0]}'
            template_score = (Score["drug"]+Score["administration"])/2
            Templates.append((template, description, template_score))

        elif self.query_data["Topic"] == "condition" and len(self.query_data['Snomed_ID']):

            template = get_disease(self.query_data['Snomed_ID'][0])
            description = f'Information about disease with Snomed_ID : {self.query_data["Snomed_ID"][0]}'
            template_score = Score["condition"]
            Templates.append((template, description, template_score))

        else:

            if Check["patient"] and Check["drug"]:
                template = get_patient_drug_list(Filters['age']['val'], Filters['age']['comp'], Filters['gender'], Filters['administration'])
                description = f'Filtered Information about patients and drugs given to them'
                template_score = (Score["patient"]+Score["drug"])/2
                Templates.append((template, description, template_score))
            
            if Check["patient"] and Check["condition"]:
                template = get_patient_disease_list(Filters['age']['val'], Filters['age']['comp'], Filters['gender'])
                description = f'Filtered Information about patients and diseases had by them'
                template_score = (Score["patient"]+Score["condition"])/2
                Templates.append((template, description, template_score))

            if Check["patient"]:
                template = get_patient_list(Filters['age']['val'], Filters['age']['comp'], Filters['gender'])
                description = f'Filtered Information about patients'
                template_score = Score["patient"]
                Templates.append((template, description, template_score))

        Templates.sort(key=lambda x: x[2], reverse=True)
        return Templates             

    def prepareQuery(self, best_template):
        self.sparql_query = get_prefix() + best_template

    def executeQuery(self, data_format = 'JSON'):
        sparql_format = {'JSON': JSON, 'XML': XML, 'CSV': CSV}
        sparql = SPARQLWrapper(self.sparql_endpoint)
        sparql.setQuery(self.sparql_query)
        sparql.setReturnFormat(sparql_format[data_format])
        results = sparql.query().convert()
        return results