const GenericQueryFilters = (props) => {
  const options = [
    {
      name: "Age",
      id: 1,
    },
    {
      name: "Gender",
      id: 2,
    },
    {
      name: "Skip",
      id: 3
    }
  ];

  const optionsMarkup = options.map((option) => {
    return (
      <div
        className="option-item"
        key={option.id}
        onClick={() => {
          props.actionProvider.handleUserSelectedFilter(option.name);
        }}
      >
        {option.name}
      </div>
    );
  });
  return <div>{optionsMarkup}</div>;
};

export default GenericQueryFilters;
