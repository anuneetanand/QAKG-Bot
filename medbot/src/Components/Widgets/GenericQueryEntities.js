// import axios from "axios";

// const backendURI = "http://127.0.0.1:5000";
// const USING_BACKEND = true;
// const GenericQueryEntities = (props) => {
//   let options = [
//     {
//       name: "Condition",
//       id: 1,
//     },
//     {
//       name: "Drug",
//       id: 2,
//     },
//     {
//       name: "Person",
//       id: 3,
//     },
//   ];

//   if (USING_BACKEND) {
//     axios.get(`${backendURI}/getGenericQueryEntities`).then((res) => {
//       const entities = res.data["entities"];
//       options = [];
//       for (var entityID in entities) {
//         options.push({ name: entities[entityID], id: entityID });
//       }
//     });
//   }

//   options.push({ name: "Stop", id: 0 });
//   options.push({
//     name: "Restart",
//     id: 1000000,
//   });

//   const optionsMarkup = options.map((option) => {
//     return (
//       <div
//         className="option-item"
//         key={option.id}
//         onClick={() => {
//           if (option.name === "Restart")
//             props.actionProvider.handleRestartFlow();
//           else props.actionProvider.handleUserSelectedEntity(option);
//         }}
//       >
//         {option.name}
//       </div>
//     );
//   });
//   return <div>{optionsMarkup}</div>;
// };

// export default GenericQueryEntities;
