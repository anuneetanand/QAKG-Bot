const QueryTemplates = (props) => {
  let options = [
    {
      name: "Restart",
      id: 1000000,
    }
  ]
  options = props.actionProvider.getQueryTemplates();
  const optionsMarkup = options.map((option) => {
    return (
      <div
        className="option-item"
        key={option.id}
        onClick={() => {
          if (option.name === "Restart")
            props.actionProvider.handleRestartFlow();
          else props.actionProvider.handleUserSelectedQuery(option);
        }}
      >
        {option.name}
      </div>
    );
  });
  console.log(options);
  return <div>{optionsMarkup}</div>;
};

export default QueryTemplates;
