import axios from "axios";

const USING_BACKEND = true;
const backendURI = "http://127.0.0.1:5000";

var queryType = "";
var queryTemplates = [];
var selectedFilters = [];
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
      withAvatar: true, widget: "RestartFlow"
    });
    this.addMessageToBotState(message);
  };

  handleSpecificQuery = () => {
    queryType = 'specific';
    if (USING_BACKEND) {
      axios.post(`${backendURI}/sendQueryType`, {
        params: { queryType: 'specific' },
      }).then((res) => {
          const message = this.createChatBotMessage(
            "What entity do you want to query about?",
            {
              widget: "SpecificQueryEntities",
            }
          );
          this.addMessageToBotState(message);
       })
    }
  };

  handleGenericQuery = () => {
    queryType = 'generic';
    if (USING_BACKEND) {
      axios.post(`${backendURI}/sendQueryType`, {
        params: { queryType: 'generic' },
      }).then((res) => {
        const message = this.createChatBotMessage("What is your generic query?");
        this.addMessageToBotState(message);
      })
    }
  };

  handleSpecificQueryEntity = (entityName) => {
    if (USING_BACKEND) {
      axios.post(`${backendURI}/sendQueryTopic`, {
        params: { topic: entityName },
      }).then((res) => {
          const message = this.createChatBotMessage("What is your specific query?");
        this.addMessageToBotState(message);
    })
    }
  };

  sendAnswerTypeMessage = () => {
    const message = this.createChatBotMessage(
      "Select the desired answer type",
      {
        widget: "AnswerType",
      }
    );
    this.addMessageToBotState(message);
  };

  handleAnswerTypeQuery = (answerType) => {
    if (USING_BACKEND) {
      axios.post(`${backendURI}/sendQueryAnswerType`, {
        params: { answerType: answerType },
      }).then((res) => {
          if (queryType === 'specific') {
          this.handleSpecificQueryRequests();
          } else if (queryType === 'generic') {
          this.handleGenericQueryRequests();
          }
      });
    }
  };

  handleSpecificQueryRequests = () => {
    let flag = true;
    let needID = "";
    if (USING_BACKEND) {
      axios
        .get(`${backendURI}/getQueryRequests`, {
          params: { queryMode: "specific" },
        })
        .then((res) => {
          flag = res.data["flag"];
          needID = res.data["id"];
          if (flag) {
            if (needID.length > 0) {
              const message = this.createChatBotMessage("Can you enter the ID for " + needID);
              this.addMessageToBotState(message);
            } else {
              this.handleQueryTemplates();
            }
          } else {
            const message = this.createChatBotMessage(
              "Not a valid query, please start again"
            );
            this.addMessageToBotState(message);
            this.handleRestartFlow();
          }
        });
      }
  }

  handleGenericQueryRequests = () => {
    let flag = true;
    let filters = [];
    if (USING_BACKEND) {
      axios
        .get(`${backendURI}/getQueryRequests`, {
          params: { queryMode: "generic" },
        })
        .then((res) => {
          flag = res.data["flag"];
          filters = res.data["filters"];
          if (flag) {
            const filter_info = this.createChatBotMessage(filters);
            this.addMessageToBotState(filter_info);
            const message = this.createChatBotMessage("Enter/Modify the filters for your query",{
              widget: "GenericQueryFilters",
            });
            this.addMessageToBotState(message);
          } else {
            const message = this.createChatBotMessage(
              "Not a valid query, please start again"
            );
            this.addMessageToBotState(message);
            this.handleRestartFlow();
          }
        });
      }
   }

  getQueryTemplates = () => {
    return queryTemplates;
  }

  handleQueryTemplates = () => {
    queryTemplates = [];
    
    if (USING_BACKEND) {
      axios.get(`${backendURI}/getPossibleTemplates`).then((res) => {
        const templates = res.data["queries"];
        for (var templateID in templates) {
          queryTemplates.push({ name: templates[templateID], id: parseInt(templateID) });
        }
        queryTemplates.push({ name: 'None', id:1000000});
      }).then(() => {
        const message = this.createChatBotMessage(
        "Which option which best describes your query?",
        {
          widget: "QueryTemplates",
        }
        );
        this.addMessageToBotState(message);
      });
   };
  }

  handleUserSelectedQuery = (query) => {
    if (USING_BACKEND) {
      axios.post(`${backendURI}/sendTemplate`, {
        params: { id: query.id },
      }).then(() => {
        if(query.name === 'None') {
          this.handleRestartFlow();
        }
        else {
          const message = this.createChatBotMessage("Shall I run your query?", {
            widget: "Confirmation",
          });
          this.addMessageToBotState(message);
        }
      });
    }
  };

  handleUserConfirmation = (confirmation) => {
    if (USING_BACKEND) {
      axios.post(`${backendURI}/sendConfirmation`, {
        params: { confirmation: confirmation },
      }).then(() => {
        if (confirmation === "Yes") {
          let queryResults = [];
          if (USING_BACKEND) {
            axios.get(`${backendURI}/getQueryResults`).then((res) => {
              queryResults = res.data["results"]["data"];
              queryResults.forEach((queryResult) => {
                const message = this.createChatBotMessage(queryResult);
                this.addMessageToBotState(message);
              });
              const message = this.createChatBotMessage(
              "Please Restart for new query", {widget: "RestartFlow",});
              this.addMessageToBotState(message);
            });
          }
        } else {
            const message1 = this.createChatBotMessage("Please try again later");
            this.addMessageToBotState(message1);
            const message = this.createChatBotMessage(
            "Please Restart for new query", {widget: "RestartFlow",});
            this.addMessageToBotState(message);
        }
      })
    }
  };

  handleUserEnteredFilter = (filter, filterName) => {
    selectedFilters.push({name: filterName, filter:filter})
  }

  handleUserSelectedFilter  = (filter) => {
    if (filter === "Age"){
      const message = this.createChatBotMessage("Enter Age Filter", {})
      this.addMessageToBotState(message);
    }
    else if (filter === "Gender"){
      const message = this.createChatBotMessage("Enter Gender Filter", {})
      this.addMessageToBotState(message);
    }
    else {
      this.sendUserSelectedFilters()
    }
  }

  sendUserSelectedFilters = () => {
    if (USING_BACKEND) {
      axios.post(`${backendURI}/sendFilters`, {
        params: { filters: selectedFilters },
      }).then(() => { this.handleQueryTemplates(); });
    }
  };

  handleStop = () => {
    this.resetGlobalVariables();
    const message = this.createChatBotMessage("Glad to help :)");
    this.addMessageToBotState(message);
  };

  handleRestartFlow = () => {
    this.resetGlobalVariables();
    const message1 = this.createChatBotMessage(
      "Hi! I'm MedBot. I can help you in querying data from the electronic health records"
    );
    const message2 = this.createChatBotMessage("Please choose the query type", {
      widget: "Menu",
    });
    this.addMessageToBotState(message1);
    this.addMessageToBotState(message2);
  };

  resetGlobalVariables = () => {
    if (USING_BACKEND) {
      axios.post(`${backendURI}/restart`);
    }
    queryType = "";
    selectedFilters = [];
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
