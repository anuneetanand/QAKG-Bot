import Options from "./Options";

const Menu = (props) => {
  const options = [
    {
      name: "Show a Sample Query",
      handler: props.actionProvider.handleSample,
      id: 1
    },
    {
      name: "Stop",
      handler: props.actionProvider.handleStop,
      id: 2
    }
  ];
  return <Options options={options} title="Choose an Option" {...props} />;
};

export default Menu;