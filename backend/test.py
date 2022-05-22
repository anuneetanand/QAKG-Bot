from chatbot import ChatBot

verbose = True
confidence = 0.5
sparqlEndpoint = "http://Anuneets-MacBook-Air.local:7200/repositories/IFHP"
MedBot = ChatBot(sparql_endpoint = sparqlEndpoint, threshold = confidence, verbose = verbose)
query = "details of patient with subject_id_1"
MedBot.setTopic('patient')
MedBot.setQuery(query)
MedBot.setAnswerType('JSON')
print(MedBot.getQueryData())
MedBot.findTemplates()
print(MedBot.getTemplates())
MedBot.prepareQuery(MedBot.getTemplates()[0])
MedBot.executeQuery()
print(MedBot.getResponse())
