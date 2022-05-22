<p align="center">
  <img width="373" alt="logo" src="https://user-images.githubusercontent.com/42066451/169703366-d1fea0e4-11f0-471a-b7e8-d381343361e4.png">
</p>

## About
MedBot is a chatbot-like question-answering system that can take a question from the user in natural language, identify important keywords, understand user intent and convert it into an appropriate SPARQL query that can be executed to return the answer to the user.

## Architecture
The frontend stack is Reactjs and Javascript + Typescript. We are using a React library called React-Chatbot-Kit for creating our chatbot. The backend stack includes a Flask server for handling POST and GET requests and a GraphDB instance for running the SPARQL query over the RDF triples. Natural Language Processing libraries like Spacy (”en core web trf” model) and NLTK are also used at the backend.

<p align="center">
  <img width="600" alt="logo" src="https://user-images.githubusercontent.com/42066451/169705668-a75fd2d7-9d57-49b3-937f-03991b1ac779.png">
</p>

## Dataset
The RDF dataset comprises of three turtle files as follows:-
- **condition_occurence.ttl :** It contains details about the condition of the patients along with their duration. Each condition has a unique snomed id. The relationship between the patient, a condition experienced by him/her/them and the date of onset and date of offset of the condition has been modelled using blank nodes.
- **drug_exposure.ttl :** It contains details about drugs/medication taken by patients along with their dosage, duration and route of administration. Each drug also has a unique snomed id. The relationship between patient, drugs administered to him/her/them and duration of administration has been modelled using blank nodes.
- **person.ttl :** It contains details of the patients like their age and gender. The patients have a unique subject id.

## Setup

- Install requirements for backend.
```
pip install -r requirements.txt
```
- Install requirements for frontend.
```
cd medbot
npm install
```
- Upload RDF Dataset to a GraphDB Instance. (Access to the dataset can be provided on reasonable request)
- Start the Flask Server.
```
cd backend
python3 server.py
```
- Start the React App.
```
cd medbot
npm start
```
