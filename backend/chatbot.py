from SPARQLWrapper import SPARQLWrapper, JSON, XML, CSV
from query_templates import *
from nlp_toolbox import *

class ChatBot:
    def __init__(self, sparql_endpoint, threshold = 0.5, verbose = False):
        self.NLPToolbox = NLP_Toolbox(verbose = verbose)
        self.sparql_endpoint = sparql_endpoint
        self.threshold = threshold
        self.user_query = ""
        self.query_type = ""
        self.query_data = {}
        self.templates = []
        self.sparql_query = ""
        self.response = ""
        self.verbose = False

    def restart(self):
        self.user_query = ""
        self.query_type = ""
        self.query_data = {}
        self.templates = []
        self.sparql_query = ""
        self.response = ""

    def setQueryType(self, query_type):
        self.query_type = query_type

    def setQuery(self, user_query):
        self.user_query = user_query
        data = self.NLPToolbox.parse(self.user_query)
        for key in data:
            self.query_data[key] = data[key]

    def setTopic(self, topic):
        self.query_data['Topic'] = topic

    def setAnswerType(self, answer_type):
        self.query_data['Answer_Type'] = answer_type

    def getIdentifiedEntities(self):
        entity_scores = self.query_data['Entity_Scores']
        identified_entities = []
        for entity in entity_scores:
            if entity_scores[entity] > self.threshold:
                identified_entities.append(entity)
        identified_entities_json = {i: identified_entities[i] for i in identified_entities}
        return identified_entities_json

    def getOtherEntities(self):
        entity_scores = self.query_data['Entity_Scores']
        other_entities = []
        for entity in entity_scores:
            if entity_scores[entity] < self.threshold:
                other_entities.append(entity)
        other_entities_json = {i: other_entities[i] for i in other_entities}
        return other_entities_json

    def setPrimaryEntityID(self, entity_id):
        if self.query_data['Topic'] == "patient":
            self.query_data['Patient_ID'] = [entity_id]
        else:
            self.query_data['Snomed_ID'] = [entity_id]

    def validateID(self):
        if self.query_data['Topic'] == "patient":
            return len(self.query_data['Patient_ID']) == 1
        else:
            return len(self.query_data['Snomed_ID']) == 1

    def findAppliedFilters(self):
        # ToDo: Add Filter Desc
        applied_filters = []
        for filter_type in self.query_data["Filters"]:
            if self.query_data["Filters"][filter_type] != "":
                applied_filters.append(filter_type)
        applied_filters_json = {i: applied_filters[i] for i in applied_filters}
        return applied_filters_json

    def findPossibleFilters(self):
        # ToDo: Add Filter Desc
        possible_filters = []
        for filter_type in self.query_data["Filters"]:
            if self.query_data["Filters"][filter_type] == "":
                possible_filters.append(filter_type)
        possible_filters_json = {i: possible_filters[i] for i in possible_filters}
        return possible_filters_json

    def getQueryData(self):
        return self.query_data

    def setQueryData(self, new_query_data):
        self.query_data = new_query_data

    def findTemplates(self):
        if self.verbose: print("Finding Templates")

        Score = self.query_data["Entity_Scores"]
        Check = {entity: Score[entity] > self.threshold for entity in Score}
        Filters = self.query_data["Filters"]
        Templates = []

        if self.query_data['Topic'] == "patient" and len(self.query_data['Patient_ID']):

            if Check["drug"]:
                template = get_drug_info(self.query_data['Patient_ID'][0], Check["dose"], Check["administration"], Check["date"])
                description = f'Information about drugs {"dosage" if Check["dose"] else ""} {"route" if Check["administration"] else ""} {"duration" if Check["dose"] else ""} given to patient with ID {self.query_data["Patient_ID"][0]}'
                template_score = (Score["patient"]+Score["dose"]+Score["administration"]+Score["date"])/4
                Templates.append((template, description, template_score))

            if Check["condition"]:
                template = get_patient_disease_info(self.query_data['Patient_ID'][0], Check["date"])
                description = f'Information about diseases {"and their duration" if Check["date"] else ""} that affected patient with ID {self.query_data["Patient_ID"][0]}'
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

            if Check["patient"] or Check["drug"]:
                template = get_patient_drug_list(Filters['age']['val'], Filters['age']['comp'], Filters['gender'], Filters['administration'])
                description = f'Filtered Information about patients and drugs given to them'
                template_score = (Score["patient"]+Score["drug"])/2
                Templates.append((template, description, template_score))
            
            if Check["patient"] or Check["condition"]:
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
        self.templates = Templates             

    def getTemplates(self):
        return self.templates

    def prepareQuery(self, best_template):
        self.sparql_query = get_prefix() + best_template

    def executeQuery(self):
        if self.verbose: print("Executing Results")

        sparql = SPARQLWrapper(self.sparql_endpoint)
        sparql.setQuery(self.sparql_query)

        if self.query_data['Answer_Type'] == "CSV":
            sparql.setReturnFormat(CSV)
            response = sparql.query().convert()
            self.response = response

        elif self.query_data['Answer_Type'] == "JSON":
            sparql.setReturnFormat(JSON)
            response = sparql.query().convert()
            self.response = response

        elif self.query_data['Answer_Type'] == "XML":
            sparql.setReturnFormat(XML)
            response = sparql.query().convert()
            self.response = response

        elif self.query_data['Answer_Type'] == "Record":
            sparql.setReturnFormat(JSON)
            response = sparql.query().convert()
            record = {}
            record['headers'] = response['head']['vars']
            record['data'] = []
            for result in response["results"]['bindings']:
                res = []
                for attribute in result:
                    res.append(result[attribute]['value'].split('/')[-1])
                record["data"].append(" ".join(res))
            self.response = record

        elif self.query_data['Answer_Type'] == "Count":
            sparql.setReturnFormat(JSON)
            response = sparql.query().convert()
            count = len(sparql.query().convert()["results"]['bindings'])
            self.response = { 'headers' : [], 'data': {0:f'{count} Record(s) matched your query'}}

        elif self.query_data['Answer_Type'] == "Boolean":
            sparql.setReturnFormat(JSON)
            response = sparql.query().convert()
            flag = len(sparql.query().convert()["results"]['bindings']) > 0
            self.response = { 'headers' : [], 'data': {0:f'Yes' if flag else f'No'}}

        else:
            self.response = "null"

    def getResponse(self):
        return self.response