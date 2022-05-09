const RestartFlow = (props) => {
  const options = [
    {
      name: "Restart",
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

export default RestartFlow;
