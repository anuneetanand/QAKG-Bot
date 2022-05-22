const Confirmation = (props) => {
  const options = [
    {
      name: "Yes",
      id: 1,
    },
    {
      name: "No",
      id: 2,
    },
  ];

  const optionsMarkup = options.map((option) => {
    return (
      <div
        className="option-item"
        key={option.id}
        onClick={() => {
            props.actionProvider.handleUserConfirmation(
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

export default Confirmation;
