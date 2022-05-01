const RestartFromBeginning = (props) => {
  const options = [
    {
      name: "Begin from start",
      id: 1000000,
      handler: props.actionProvider.handleRestartFlow,
    },
  ];

  const optionsMarkup = options.map((option) => {
    return (
      <div className="option-item" key={option.id} onClick={option.handler}>
        {option.name}
      </div>
    );
  });
  return <div>{optionsMarkup}</div>;
};

export default RestartFromBeginning;
