const AnswerTypeGeneralizedQuery = (props) => {
  const options = [
    {
      name: "Record",
      id: 1,
    },
    {
      name: "Count",
      id: 2,
    },
    {
      name: "Boolean",
      id: 3,
    },
    {
      name: "Restart",
      id: 1000000,
    },
  ];

  const optionsMarkup = options.map((option) => {
    return (
      <div
        className="option-item"
        key={option.id}
        onClick={() => {
          if (option.name === "Restart")
            props.actionProvider.handleRestartFlow();
          else
            props.actionProvider.handleAnswerTypeGeneralizedQuery(option.name);
        }}
      >
        {option.name}
      </div>
    );
  });
  return <div>{optionsMarkup}</div>;
};

export default AnswerTypeGeneralizedQuery;
