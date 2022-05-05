import re
import json
import spacy
from spacy.matcher import Matcher
from nltk.corpus import wordnet, stopwords

class NLP_Toolbox:
    def __init__(self):
        self.nlp = spacy.load("en_core_web_trf")
        self.matcher = Matcher(self.nlp.vocab)
        self.custom_vocabulary = {'drugs': json.load(open("./data/drugs.json","r")), 'conditions': json.load(open("./data/conditions.json","r"))}
        self.text = ""
        self.tokens = []
        self.data = {}

    def parse(self, text):
        self.data = {}
        self.text = text
        self.findTokens()
        self.findEntityID()
        self.findFilters()
        self.findQuestionType()
        self.findAttributes()
        return self.data

    def findTokens(self):
        self.tokens = [i for i in self.nlp(self.text)]

    def findEntityID(self):
        self.data['Patient_ID'] = re.findall(r'subject_id_[0-9]+', self.text)
        self.data['Snomed_ID'] =  re.findall(r'snomed_id [0-9]+', self.text)

    def findFilters(self):
        # Add Regex for Age, Gender, Date, Dosage
        self.data['Filters'] = {}
        self.data['Filters']['age'] = {'val':"",'comp':""}
        self.data['Filters']['gender'] = ""
        self.data['Filters']['administration'] = ""

    def findQuestionType(self):
        # Add rule based classifier
        pass

    def findAttributes(self):
        keyword_list = [token.text for token in self.tokens if token not in set(stopwords.words('english'))]
        attribute_scores = {'patient': 0, 'drug': 0, 'condition': 0, 'gender': 0, 'age': 0, 'administration': 0, 'dose':0, 'date':0 }
        attribute_list = attribute_list = ['patient.n.01','drug.n.01','condition.n.06','gender.n.01','age.n.01','administration.n.03','dose.n.01','date.n.06']

        for attribute in attribute_list:
            for keyword in keyword_list:
                score = 0
                syn1 = wordnet.synset(attribute)
                for syn2 in wordnet.synsets(keyword, pos = 'n'):
                    score = max(score, syn1.wup_similarity(syn2))
                attribute_name = attribute.split('.')[0]
                attribute_scores[attribute_name] = max(attribute_scores[attribute_name], score)

        for term in self.custom_vocabulary['drugs']:
            if term in self.text:
                attribute_scores['drug'] = 1
                break
        
        for term in self.custom_vocabulary['conditions']:
            if term in self.text:
                attribute_scores['condition'] = 1
                break

        self.data['Attribute_Scores'] = attribute_scores