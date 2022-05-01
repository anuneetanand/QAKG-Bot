const USING_BACKEND = false;
const SampleQueriesSpecific = (props) => {
  let options = [
    {
      name: "What is the age of patient 1?",
      handler: props.actionProvider.handleUserSelctedSpecificQuery,
      id: 1,
    },
    {
      name: "What drugs were given to patient 2?",
      handler: props.actionProvider.handleUserSelctedSpecificQuery,
      id: 2,
    },
    {
      name: "Stop",
      handler: props.actionProvider.handleStop,
      id: 3,
    },
  ];

  if (USING_BACKEND) {
    axios.get(`${backendURI}/getPossibleSpecificQueries`).then((res) => {
      queries = res["queries"];
      options = [];
    });
  }
};

export default SampleQueriesSpecific;
