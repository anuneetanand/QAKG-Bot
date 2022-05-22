const QueryTemplates = (props) => {
  const options = props.actionProvider.getQueryTemplates();
  const optionsMarkup = options.map((option) => {
    return (
      <div
        className="option-item"
        key={option.id}
        onClick={() => {
          props.actionProvider.handleUserSelectedQuery(option);
        }}
      >
        {option.name}
      </div>
    );
  });
  return <div>{optionsMarkup}</div>;
};

export default QueryTemplates;
