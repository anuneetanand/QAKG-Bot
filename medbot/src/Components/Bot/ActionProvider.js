import axios from "axios";

const USING_BACKEND = true;
const backendURI = "http://127.0.0.1:5000";

var queryType = "";
var queryTemplates = [];
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
            "Select the entity you want to query about",
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
        const message = this.createChatBotMessage("Enter your generic query");
        this.addMessageToBotState(message);
      })
    }
  };

  handleSpecificQueryEntity = (entityName) => {
    if (USING_BACKEND) {
      axios.post(`${backendURI}/sendQueryTopic`, {
        params: { topic: entityName },
      }).then((res) => {
          const message = this.createChatBotMessage("Enter your specific query");
        this.addMessageToBotState(message);
    })
    }
  };

  handleGenericQueryFilters = () => {
    let filters = [];
    if (USING_BACKEND) {
      axios.get(`${backendURI}/getPossibleFilters`, {
        params: { 'lol':'lol' },
      }).then((res) => {
        filters = res.data['filters'];
        filters.forEach(filter => {
          const message = this.createChatBotMessage(filter);
          this.addMessageToBotState(message);
        });
      this.handleQueryTemplates();
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
              const message = this.createChatBotMessage("Enter the ID for " + needID);
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
                filters.forEach((filter) => {
                  const message = this.createChatBotMessage(filter);
                  this.addMessageToBotState(message);
                });
                this.handleGenericQueryFilters()
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
        "Select the option which best describes your query",
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
          const message = this.createChatBotMessage("Is your query confirmed?", {
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

  // handleGenericQueryEntities = () => {
  //   const message = this.createChatBotMessage(
  //     "Select all entities which are a part of your query",
  //     {
  //       widget: "EntitiesGenericQueries",
  //     }
  //   );
  //   this.addMessageToBotState(message);
  // };

  // handleUserSelectedEntity = (entity) => {
  //   if (entity.name === "Stop") {
  //     console.log("selected entities: " + selectedEntitiesGenericQuery);
  //     if (USING_BACKEND) {
  //       axios.post(`${backendURI}/sendSelectedEntities`, {
  //         params: { entities: selectedEntitiesGenericQuery },
  //       });
  //     }
  //     let filters = ["years"];
  //     let flag = true;
  //     if (USING_BACKEND) {
  //       axios
  //         .get(`${backendURI}/getQueryRequests`, {
  //           params: { queryMode: "Generic" },
  //         })
  //         .then((res) => {
  //           filters = res.data["filters"];
  //           flag = res.data["flag"];
  //         });
  //     }
  //     if (!flag) {
  //       const message = this.createChatBotMessage(
  //         "Not a valid query, start again"
  //       );
  //       this.addMessageToBotState(message);
  //       this.handleRestartFlow();
  //     } else {
  //       let filtersApplied = "";
  //       filters.forEach((filter) => {
  //         filtersApplied += filter + ", ";
  //       });
  //       if (filtersApplied !== "") {
  //         const messageFilterApplied = this.createChatBotMessage(
  //           `${filtersApplied} have already been applied`
  //         );
  //         this.addMessageToBotState(messageFilterApplied);
  //       }
  //       const message = this.createChatBotMessage(
  //         "Select filter(s) to apply to your query",
  //         {
  //           widget: "FiltersGenericQuery",
  //         }
  //       );
  //       this.addMessageToBotState(message);
  //     }
  //   } else {
  //     selectedEntitiesGenericQuery.push(entity);
  //     const message = this.createChatBotMessage(entity.name);
  //     this.addMessageToBotState(message);
  //   }
  // };

  // handleUserSelectedFilter = (filter) => {
  //   if (filter.name === "Stop") {
  //     console.log("correct filters?");
  //     console.log(selectedFiltersGenericQuery);
  //     if (USING_BACKEND) {
  //       axios.post(`${backendURI}/sendFilters`, {
  //         params: { filters: selectedFiltersGenericQuery },
  //       });
  //     }
  //     const message = this.createChatBotMessage(
  //       "Select one of the following queries",
  //       {
  //         widget: "SampleQueriesGeneric",
  //       }
  //     );
  //     this.addMessageToBotState(message);
  //   } else {
  //     const message = this.createChatBotMessage(`Enter ${filter.name} value:`);
  //     this.addMessageToBotState(message);
  //   }
  // };

  // saveUserEnteredFilterValue = (filterName, filterValue) => {
  //   selectedFiltersGenericQuery.push({
  //     filterName: filterName,
  //     filterValue: filterValue,
  //   });
  //   console.log("what????");
  //   console.log(selectedFiltersGenericQuery);
  // };

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
