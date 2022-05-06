import re
import json
import spacy
from spacy.matcher import Matcher
from nltk.corpus import wordnet, stopwords
from nltk.stem import WordNetLemmatizer

class NLP_Toolbox:
    def __init__(self):
        self.nlp = spacy.load("en_core_web_trf")
        self.matcher = Matcher(self.nlp.vocab)
        self.lemmatizer = WordNetLemmatizer()
        self.custom_vocabulary['drugs'] = json.load(open("./data/drugs.json","r"))
        self.custom_vocabulary['conditions'] = json.load(open("./data/drugs.json","r"))
        self.custom_vocabulary['routes'] = json.load(open("./data/drugs.json","r"))
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

    def cleanText(self):
        cleaned_tokens = [token.text.lower() for token in self.tokens]
        cleaned_tokens = [word for word in cleaned_tokens if word in set(stopwords.words('english'))]
        cleaned_tokens = [self.lemmatizer.lemmatize(word) for word in cleaned_tokens]
        return cleaned_tokens

    def findTokens(self):
        self.tokens = [i for i in self.nlp(self.text)]

    def findEntityID(self):
        self.data['Patient_ID'] = re.findall(r'subject_id_[0-9]+', self.text)
        self.data['Snomed_ID'] =  re.findall(r'snomed_id [0-9]+', self.text)

    def findFilters(self):
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
                self.data['Filters']['gender'] = {'val':"18",'comp':">"}
            if keyword == 'old' or keyword == 'senior':
                self.data['Filters']['gender'] = {'val':"60",'comp':">"}

        for term in self.custom_vocabulary['routes']:
            if term.lower() in self.text.lower():
                self.data['Filters']['administration'] = term
                break

    def findQuestionType(self):
        # Add rule based classifier
        pass

    def findAttributes(self):
        keyword_list = self.cleanText()
        attribute_scores = {'patient': 0, 'drug': 0, 'condition': 0, 'gender': 0, 'age': 0, 'administration': 0, 'dose':0, 'date':0 }
        attribute_list = ['patient.n.01','drug.n.01','condition.n.06','gender.n.01','age.n.01','administration.n.03','dose.n.01','date.n.06']

        for attribute in attribute_list:
            for keyword in keyword_list:
                score = 0
                syn1 = wordnet.synset(attribute)
                for syn2 in wordnet.synsets(keyword, pos = 'n'):
                    score = max(score, syn1.wup_similarity(syn2))
                attribute_name = attribute.split('.')[0]
                attribute_scores[attribute_name] = max(attribute_scores[attribute_name], score)

        for term in self.custom_vocabulary['drugs']:
            if term.lower() in self.text.lower():
                attribute_scores['drug'] = 1
                self.data['Snomed_ID'] = self.custom_vocabulary['drugs'][term]
                break
        
        for term in self.custom_vocabulary['conditions']:
            if term.lower() in self.text.lower():
                attribute_scores['condition'] = 1
                self.data['Snomed_ID'] = self.custom_vocabulary['conditions'][term]
                break

        self.data['Attribute_Scores'] = attribute_scores