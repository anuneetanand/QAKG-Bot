const SpecificQueryEntities = (props) => {
  const options = [
    {
      name: "Drug",
      id: 1,
    },
    {
      name: "Disease",
      id: 2,
    },
    {
      name: "Patient",
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
          else props.actionProvider.handleSpecificQueryEntity(option.name);
        }}
      >
        {option.name}
      </div>
    );
  });
  return <div>{optionsMarkup}</div>;
};

export default SpecificQueryEntities;
