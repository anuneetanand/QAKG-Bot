"""
    Sample Queries

    What is the age of the patient with subject_id_1?
    What is the name of the drug with snomed_id 100?
    What drugs are given to patients having fever?
    What drugs are given for breast cancer?
    List all male patients with age less than 20
    List the drugs which have an oral route of administration?
    List drugs and their dosage given to kids?
    What is the average recovery time of Sepsis?
"""

from chatbot import ChatBot

userFeedback = {"positive": 0, "negative": 0}
sparqlEndpoint = "http://Anuneets-MacBook-Air.local:7200/repositories/IFHP"

MedBot = ChatBot(endpoint = sparqlEndpoint, threshold=0.5)
