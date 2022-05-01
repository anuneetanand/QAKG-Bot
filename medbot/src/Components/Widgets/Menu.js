import Options from "./Options";

const Menu = (props) => {
  const options = [
    {
      name: "Specific query pertaining to a specific entity",
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
  return <Options options={options} title="Choose an Option" {...props} />;
};

export default Menu;
