import axios from "axios";

const backendURI = "http://localhost:8000";
const USING_BACKEND = false;
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
      const filters = res["filters"];
      options = [];
      for (var filterID in filters) {
        options.push({ name: filters[filterID], id: filterID });
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
          props.actionProvider.handleUserSelectedFilter(option);
        }}
      >
        {option.name}
      </div>
    );
  });
  return <div>{optionsMarkup}</div>;
};

export default FiltersGeneralizedQuery;