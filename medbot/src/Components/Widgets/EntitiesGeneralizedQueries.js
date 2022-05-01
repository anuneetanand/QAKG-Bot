import axios from "axios";

const backendURI = "http://localhost:8000";
const USING_BACKEND = false;
const EntitiesGeneralizedQueries = (props) => {
  let options = [
    {
      name: "Disease",
      id: 1,
    },
    {
      name: "Drug",
      id: 2,
    },
    {
      name: "Person",
      id: 3,
    },
  ];

  if (USING_BACKEND) {
    axios.get(`${backendURI}/getEntitiesGeneralizedQuery`).then((res) => {
      const entities = res["entities"];
      options = [];
      for (var entityID in entities) {
        options.push({ name: entities[entityID], id: entityID });
      }
    });
  }

  options.push({ name: "Stop", id: 0 });

  const optionsMarkup = options.map((option) => {
    return (
      <div
        className="option-item"
        key={option.id}
        onClick={() => {
          props.actionProvider.handleUserSelectedEntity(option);
        }}
      >
        {option.name}
      </div>
    );
  });
  return <div>{optionsMarkup}</div>;
};

export default EntitiesGeneralizedQueries;
