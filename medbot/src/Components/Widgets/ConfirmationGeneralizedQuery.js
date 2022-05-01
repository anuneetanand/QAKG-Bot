const ConfirmationGeneralizedQuery = (props) => {
  const options = [
    {
      name: "Yes",
      id: 1,
    },
    {
      name: "No",
      id: 2,
    },
    {
      name: "Begin from start",
      id: 1000000,
    },
  ];

  const optionsMarkup = options.map((option) => {
    return (
      <div
        className="option-item"
        key={option.id}
        onClick={() => {
          if (option.name === "Begin from start")
            props.actionProvider.handleRestartFlow();
          else
            props.actionProvider.handleUserConfirmationGeneralizedQuery(
              option.name
            );
        }}
      >
        {option.name}
      </div>
    );
  });
  return <div>{optionsMarkup}</div>;
};

export default ConfirmationGeneralizedQuery;
