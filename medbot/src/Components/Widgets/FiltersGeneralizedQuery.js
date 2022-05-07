import axios from "axios";

const backendURI = "http://127.0.0.1:5000";
const USING_BACKEND = true;
const FiltersGeneralizedQuery = (props) => {
  let options = [
    {
      name: "Age",
      id: 1,
    },
    {
      name: "Gender",
      id: 2,
    },
  ];

  if (USING_BACKEND) {
    axios.get(`${backendURI}/getPossibleFilters`).then((res) => {
      const filters = res.data["filters"];
      options = [];
      for (var filterID in filters) {
        options.push({ name: filters[filterID], id: filterID });
      }
    });
  }

  options.push({ name: "Stop", id: 0 });
  options.push({
    name: "Restart",
    id: 1000000,
  });

  const optionsMarkup = options.map((option) => {
    return (
      <div
        className="option-item"
        key={option.id}
        onClick={() => {
          if (option.name === "Restart")
            props.actionProvider.handleRestartFlow();
          else props.actionProvider.handleUserSelectedFilter(option);
        }}
      >
        {option.name}
      </div>
    );
  });
  return <div>{optionsMarkup}</div>;
};

export default FiltersGeneralizedQuery;
