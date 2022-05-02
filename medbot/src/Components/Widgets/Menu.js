import "../../styles.css";

const Menu = (props) => {
  const options = [
    {
      name: "Query pertaining to a specific entity",
      handler: props.actionProvider.handleSpecificQuery,
      id: 1,
    },
    {
      name: "Generalized query over the knowledge base",
      handler: props.actionProvider.handleGeneralQuery,
      id: 2,
    },
    {
      name: "Stop",
      handler: props.actionProvider.handleStop,
      id: 3,
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

export default Menu;
