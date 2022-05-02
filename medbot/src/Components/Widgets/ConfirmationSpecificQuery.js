const ConfirmationSpecificQuery = (props) => {
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
            props.actionProvider.handleUserConfirmationSpecificQuery(
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

export default ConfirmationSpecificQuery;
