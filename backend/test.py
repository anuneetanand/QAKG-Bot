from chatbot import ChatBot

userFeedback = {"positive": 0, "negative": 0}
sparqlEndpoint = "http://Anuneets-MacBook-Air.local:7200/repositories/IFHP"

sampleQueries = [
    ('Find information about the patient with subject_id_1', 'patient', 'JSON'),
    ('List male patients who are children', '', 'CSV'),
    ('List drugs and their dosage given to kids?', '', 'CSV'),
    ('How many drugs have an rectal route of administration?', '', 'Count'),
    ('Is there a condition with Snomed_id 132466', 'condition', 'Boolean')
]

MedBot = ChatBot(sparql_endpoint = sparqlEndpoint, threshold=0.6)
print("Starting Bot...")

for query in sampleQueries:
    MedBot.setQuery(query[0])
    MedBot.setTopic(query[1])
    MedBot.setAnswerType(query[2])

    print(MedBot.user_query)

    for key in MedBot.query_data:
        print(f'{key}: {MedBot.query_data[key]}')

    Templates = MedBot.findTemplates()
    print("Number of Templates :", len(Templates))
    if Templates:
        MedBot.prepareQuery(Templates[0][0])
        print(MedBot.sparql_query)
        print(MedBot.executeQuery())
    else:
        print("No Templates Found")

    print("-"*100)
