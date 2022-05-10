import re
import json
import spacy
from spacy.matcher import Matcher
from nltk.corpus import wordnet, stopwords
from nltk.stem import WordNetLemmatizer

class NLP_Toolbox:
    def __init__(self, verbose = False):
        self.nlp = spacy.load("en_core_web_trf")
        self.matcher = Matcher(self.nlp.vocab)
        self.lemmatizer = WordNetLemmatizer()
        self.custom_vocabulary = {}
        self.custom_vocabulary['drugs'] = json.load(open("./data/drugs.json","r"))
        self.custom_vocabulary['conditions'] = json.load(open("./data/conditions.json","r"))
        self.custom_vocabulary['routes'] = json.load(open("./data/routes.json","r"))
        self.text = ""
        self.data = {}
        self.tokens = []
        self.verbose = verbose

    def parse(self, text):
        if self.verbose: print("Parsing Text:", text)

        self.data = {}
        self.text = text
        self.findTokens()
        self.findEntities()
        self.findEntityID()
        self.findFilters()

        return self.data

    def cleanText(self):
        cleaned_tokens = [token.text.lower() for token in self.tokens]
        cleaned_tokens = [word for word in cleaned_tokens if word not in set(stopwords.words('english'))]
        cleaned_tokens = [self.lemmatizer.lemmatize(word) for word in cleaned_tokens]
        return cleaned_tokens

    def findTokens(self):
        self.tokens = [i for i in self.nlp(self.text)]

    def findEntityID(self):
        if self.verbose: print("Searching IDs")

        self.data['Patient_ID'] = re.findall(r'subject_id_[0-9]+', self.text.lower())
        self.data['Snomed_ID'] =  re.findall(r'snomed_id [0-9]+', self.text.lower())
        self.data['Snomed_ID'] = [x.split(' ')[-1] for x in self.data['Snomed_ID']]
        
    def findFilters(self):
        if self.verbose: print("Finding Filters")

        self.data['Filters'] = {}
        self.data['Filters']['age'] = {'val':"",'comp':""}
        self.data['Filters']['gender'] = ""
        self.data['Filters']['administration'] = ""

        keyword_list = self.cleanText()

        for keyword in keyword_list:
            if keyword == 'male' or keyword == 'man':
                self.data['Filters']['gender'] = "M"
            if keyword == 'female' or keyword == 'woman':
                self.data['Filters']['gender'] = "F"
            if keyword == 'child' or keyword == 'kid':
                self.data['Filters']['age'] = {'val':"18",'comp':"<"}
            if keyword == 'adult' or keyword == 'mature':
                self.data['Filters']['age'] = {'val':"18",'comp':">"}
            if keyword == 'old' or keyword == 'senior':
                self.data['Filters']['age'] = {'val':"60",'comp':">"}

        for term in self.custom_vocabulary['routes']:
            if term.lower() in self.text.lower().split():
                self.data['Filters']['administration'] = term
                break
        
    def findEntities(self):
        if self.verbose: print("Finding Entities")

        keyword_list = self.cleanText()
        Entity_Scores = {'patient': 0, 'drug': 0, 'condition': 0, 'gender': 0, 'age': 0, 'administration': 0, 'dose':0, 'date':0 }
        entity_list = ['patient.n.01','drug.n.01','condition.n.06','gender.n.01','age.n.01','administration.n.03','dose.n.01','date.n.06']

        for entity in entity_list:
            for keyword in keyword_list:
                score = 0
                syn1 = wordnet.synset(entity)
                for syn2 in wordnet.synsets(keyword, pos = 'n'):
                    score = max(score, syn1.wup_similarity(syn2))
                entity_name = entity.split('.')[0]
                Entity_Scores[entity_name] = max(Entity_Scores[entity_name], score)

        for term in self.custom_vocabulary['drugs']:
            if term.lower() in self.text.lower():
                Entity_Scores['drug'] = 1
                self.data['Snomed_ID'] = self.custom_vocabulary['drugs'][term]
                break
        
        for term in self.custom_vocabulary['conditions']:
            if term.lower() in self.text.lower():
                Entity_Scores['condition'] = 1
                self.data['Snomed_ID'] = self.custom_vocabulary['conditions'][term]
                break

        self.data['Entity_Scores'] = Entity_Scores