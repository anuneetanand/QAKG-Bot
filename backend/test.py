sampleQueries = [
    ('Find information about the patient with subject_id_1', 'patient', 'JSON'),
    ('List male patients who are children', '', 'CSV'),
    ('List drugs and their dosage given to kids?', '', 'CSV'),
    ('How many drugs have an rectal route of administration?', '', 'Count'),
    ('Is there a condition with Snomed_id 132466', 'condition', 'Boolean')
]

from chatbot import ChatBot

sparqlEndpoint = "http://Anuneets-MacBook-Air.local:7200/repositories/IFHP"
confidence_threshold = 0.6
MedBot = ChatBot(sparql_endpoint = sparqlEndpoint, threshold = confidence_threshold)
query = "details of patient with subject_id_1"

MedBot.setTopic('patient')
MedBot.setQuery(query)
MedBot.setAnswerType('JSON')
print(MedBot.getQueryData())
MedBot.findTemplates()
print(MedBot.getTemplates())
