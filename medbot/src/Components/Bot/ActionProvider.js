import axios from "axios";

const backendURI = "http://localhost:8000";
const USING_BACKEND = false;
var selectedFiltersGenericQuery = [];
var selectedEntitiesGenericQuery = [];
class ActionProvider {
  constructor(
    createChatBotMessage,
    setStateFunc,
    createClientMessage,
    stateRef,
    createCustomMessage,
    ...rest
  ) {
    this.createChatBotMessage = createChatBotMessage;
    this.setState = setStateFunc;
    this.createClientMessage = createClientMessage;
    this.stateRef = stateRef;
    this.createCustomMessage = createCustomMessage;
  }

  handleDefault = () => {
    const message = this.createChatBotMessage("Sorry I didn't understand", {
      withAvatar: true,
    });
    this.addMessageToBotState(message);
  };

  handleSample = () => {
    const message = this.createChatBotMessage(
      '"What are routes of administration for drugs given to patients with Dyspnea?"',
      { withAvatar: true }
    );
    this.addMessageToBotState(message);
  };

  handleSpecificQuery = () => {
    const message = this.createChatBotMessage(
      "Select one of the following specific query entity",
      {
        widget: "SpecificQueryEntities",
      }
    );
    this.addMessageToBotState(message);
  };

  handleSpecificQueryEntity = (entityName) => {
    if (USING_BACKEND) {
      axios.post(`${backendURI}/sendQueryTopic`, {
        params: { topic: entityName },
      });
    }
    const message = this.createChatBotMessage("Enter specific query", {
      widget: "RestartFromBeginning",
    });
    this.addMessageToBotState(message);
  };

  sendAnswerTypeSpecificQueryMessage = () => {
    const message = this.createChatBotMessage(
      "Select one of the following answer type",
      {
        widget: "AnswerTypeSpecificQuery",
      }
    );
    this.addMessageToBotState(message);
  };

  handleAnswerTypeSpecificQuery = (answerType) => {
    if (USING_BACKEND) {
      axios.post(`${backendURI}/sendQueryAnswerType`, {
        params: { answerType: answerType },
      });
    }
    let flag = true;
    let needId = true;
    if (USING_BACKEND) {
      axios
        .get(`${backendURI}/getQueryRequests`, {
          params: { queryMode: "specific" },
        })
        .then((res) => {
          flag = res["flag"];
          needId = res["id"];
        });
    }
    if (flag) {
      if (needId) {
        this.handleSpecificEntityId("Enter id in format");
      } else {
        this.handleSampleQueriesSpecific();
      }
    } else {
      const message = this.createChatBotMessage(
        "Not a valid query, start again"
      );
      this.addMessageToBotState(message);
      this.handleRestartFlow();
    }
  };

  handleSpecificEntityId = (messageText) => {
    const message = this.createChatBotMessage(messageText, {
      widget: "RestartFromBeginning",
    });
    this.addMessageToBotState(message);
  };

  handleSampleQueriesSpecific = () => {
    const message = this.createChatBotMessage(
      "Select one of the following queries",
      {
        widget: "SampleQueriesSpecific",
      }
    );
    this.addMessageToBotState(message);
  };

  handleUserSelctedSpecificQuery = (specificQuery) => {
    console.log(specificQuery + " received yay");
    if (USING_BACKEND) {
      axios.post(`${backendURI}/sendTemplate`, {
        params: { query: specificQuery },
      });
    }
    const message = this.createChatBotMessage("Is your query confirmed?", {
      widget: "ConfirmationSpecificQuery",
    });
    this.addMessageToBotState(message);
  };

  handleUserConfirmationSpecificQuery = (confirmation) => {
    if (USING_BACKEND) {
      axios.post(`${backendURI}/sendConfirmation`, {
        params: { choice: confirmation },
      });
    }
    if (confirmation === "Yes") {
      let queryResults = ["2 people have disease B", "5 people took drug A"];
      if (USING_BACKEND) {
        axios.get(`${backendURI}/getQueryResults`).then((res) => {
          queryResults = res["results"];
        });
      }
      queryResults.forEach((queryResult) => {
        const message = this.createChatBotMessage(queryResult);
        this.addMessageToBotState(message);
      });
    } else {
      const message = this.createChatBotMessage(
        "We apologize for the inconvenience :("
      );
      this.addMessageToBotState(message);
    }
  };

  handleGeneralQuery = () => {
    const message = this.createChatBotMessage("Enter generic query", {
      widget: "RestartFromBeginning",
    });
    this.addMessageToBotState(message);
  };

  sendAnswerTypeGeneralizedQueryMessage = () => {
    const message = this.createChatBotMessage(
      "Select one of the following answer type",
      {
        widget: "AnswerTypeGeneralizedQuery",
      }
    );
    this.addMessageToBotState(message);
  };

  handleAnswerTypeGeneralizedQuery = (answerType) => {
    if (USING_BACKEND) {
      axios.post(`${backendURI}/sendQueryAnswerType`, {
        params: { answerType: answerType },
      });
    }
    this.handleGeneralizedQueryEntities();
  };

  handleGeneralizedQueryEntities = () => {
    const message = this.createChatBotMessage(
      "Select all entities which are a part of your query",
      {
        widget: "EntitiesGeneralizedQueries",
      }
    );
    this.addMessageToBotState(message);
  };

  handleUserSelectedEntity = (entity) => {
    if (entity.name === "Stop") {
      console.log("selected entities: " + selectedEntitiesGenericQuery);
      if (USING_BACKEND) {
        axios.post(`${backendURI}/sendSelectedEntities`, {
          params: { selectedEntities: selectedEntitiesGenericQuery },
        });
      }
      let filters = ["years"];
      if (USING_BACKEND) {
        axios
          .get(`${backendURI}/getQueryRequests`, {
            params: { queryMode: "generalized" },
          })
          .then((res) => {
            filters = res["filters"];
          });
      }
      if (filters === "none") {
        const message = this.createChatBotMessage(
          "Not a valid query, start again"
        );
        this.addMessageToBotState(message);
        this.handleRestartFlow();
      } else {
        let filtersApplied = "";
        filters.forEach((filter) => {
          filtersApplied += filter + ", ";
        });
        if (filtersApplied !== "") {
          const messageFilterApplied = this.createChatBotMessage(
            `${filtersApplied} have already been applied`
          );
          this.addMessageToBotState(messageFilterApplied);
        }
        const message = this.createChatBotMessage(
          "Select filter(s) to apply to your query",
          {
            widget: "FiltersGeneralizedQuery",
          }
        );
        this.addMessageToBotState(message);
      }
    } else {
      selectedEntitiesGenericQuery.push(entity);
      const message = this.createChatBotMessage(entity.name);
      this.addMessageToBotState(message);
    }
  };

  handleUserSelctedGeneralizedQuery = (generalizedQuery) => {
    console.log(generalizedQuery.name + " got it");
    if (USING_BACKEND) {
      axios.post(`${backendURI}/sendTemplate`, {
        params: { query: generalizedQuery },
      });
    }
    const message = this.createChatBotMessage(
      "Is the selected query confirmed?",
      {
        widget: "ConfirmationGeneralizedQuery",
      }
    );
    this.addMessageToBotState(message);
  };

  handleUserSelectedFilter = (filter) => {
    if (filter.name === "Stop") {
      console.log("correct filters?");
      console.log(selectedFiltersGenericQuery);
      if (USING_BACKEND) {
        axios.post(`${backendURI}/sendFilters`, {
          params: { selectedFilters: selectedFiltersGenericQuery },
        });
      }
      const message = this.createChatBotMessage(
        "Select one of the following queries",
        {
          widget: "SampleQueriesGeneralized",
        }
      );
      this.addMessageToBotState(message);
    } else {
      const message = this.createChatBotMessage(`Enter ${filter.name} value:`);
      this.addMessageToBotState(message);
    }
  };

  saveUserEnteredFilterValue = (filterName, filterValue) => {
    selectedFiltersGenericQuery.push({
      filterName: filterName,
      filterValue: filterValue,
    });
    console.log("what????");
    console.log(selectedFiltersGenericQuery);
  };

  handleUserConfirmationGeneralizedQuery = (confirmation) => {
    if (USING_BACKEND) {
      axios.post(`${backendURI}/sendConfirmation`, {
        params: { choice: confirmation },
      });
    }
    if (confirmation === "Yes") {
      let queryResults = ["2 people have disease B", "5 people took drug A"];
      if (USING_BACKEND) {
        axios.get(`${backendURI}/getQueryResults`).then((res) => {
          queryResults = res["results"];
        });
      }
      queryResults.forEach((queryResult) => {
        const message = this.createChatBotMessage(queryResult);
        this.addMessageToBotState(message);
      });
    } else {
      const message = this.createChatBotMessage(
        "We apologize for the inconvenience :("
      );
      this.addMessageToBotState(message);
    }
  };

  handleStop = () => {
    this.resetGlobalVariables();
    const message = this.createChatBotMessage("Glad to help!");
    this.addMessageToBotState(message);
  };

  handleRestartFlow = () => {
    this.resetGlobalVariables();
    const message1 = this.createChatBotMessage(
      "Hi! I'm MedBot. I can help you in querying data from Electronic Health Records."
    );
    const message2 = this.createChatBotMessage("Please enter your query", {
      widget: "Menu",
    });
    this.addMessageToBotState(message1);
    this.addMessageToBotState(message2);
  };

  resetGlobalVariables = () => {
    if (USING_BACKEND) {
      axios.post(`${backendURI}/restart`);
    }
    selectedEntitiesGenericQuery = [];
    selectedFiltersGenericQuery = [];
  };

  addMessageToBotState = (messages) => {
    if (Array.isArray(messages)) {
      this.setState((state) => ({
        ...state,
        messages: [...state.messages, ...messages],
      }));
    } else {
      this.setState((state) => ({
        ...state,
        messages: [...state.messages, messages],
      }));
    }
  };
}

export default ActionProvider;
