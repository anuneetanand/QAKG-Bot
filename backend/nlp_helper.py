import spacy
from spacy.matcher import Matcher

nlp = spacy.load("en_core_web_trf")
matcher = Matcher(nlp.vocab)

relation_pattern = [
    [{"POS":"VERB"}, {"POS": "PART", "OP": "*"}, {"POS": "ADV", "OP":"*"}], 
    [{"POS": "VERB"}, {"POS": "ADP", "OP": "*"}, {"POS": "DET", "OP":"*"}, {"POS": "AUX", "OP": "*"},  {"POS": "ADJ", "OP":"*"}, {"POS": "ADV", "OP": "*"}]
]

def findEntity(text):
    doc = nlp(text)
    entities = {'PROPN': [], 'NOUN': []}
    for token in doc:
        if token.pos_ == 'PROPN' or token.pos_ == 'NOUN':
            entities[token.pos_].append(token.text)
    return entities

def findRelation(text):    
    doc = nlp(text)
    matcher.add("RELATION", relation_pattern)
    matches = matcher(doc)
    
    spans = []
    for match_id, start, end in matches:
        span = doc[start:end]
        spans.append(span)

    relations = []
    for span in spacy.util.filter_spans(spans):
        relations.append(span.text)

    return relations
