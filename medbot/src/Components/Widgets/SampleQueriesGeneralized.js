import axios from "axios";

const backendURI = "http://localhost:8000";
const USING_BACKEND = false;
const SampleQueriesGeneralized = (props) => {
  let options = [
    {
      name: "What is the age of patient 1?",
      id: 1,
    },
    {
      name: "What drugs were given to patient 2?",
      id: 2,
    },
  ];

  if (USING_BACKEND) {
    axios.get(`${backendURI}/getPossibleGeneralizedQueries`).then((res) => {
      const queries = res["queries"];
      options = [];
      for (var queryID in queries) {
        options.push({ name: queries[queryID], id: queryID });
      }
    });
  }
  options.push({
    name: "Restart",
    id: 1000000,
  });

  const optionsMarkup = options.map((option) => {
    return (
      <div
        className="option-item"
        key={option.id}
        onClick={() => {
          if (option.name === "Restart")
            props.actionProvider.handleRestartFlow();
          else props.actionProvider.handleUserSelctedGeneralizedQuery(option);
        }}
      >
        {option.name}
      </div>
    );
  });
  return <div>{optionsMarkup}</div>;
};

export default SampleQueriesGeneralized;
