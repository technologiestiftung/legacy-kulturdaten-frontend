import { Autocomplete } from '@material-ui/lab';
import { TextField } from '@material-ui/core';

import { useState } from 'react';

// enum LinksActions {
//   add = 'add',
//   update = 'update',
//   delete = 'delete',
//   init = 'init',
// }

// type LinksState = string[];

// type LinksAction = {
//   type: LinksActions;
//   payload: {
//     link?: {
//       index?: number;
//       value?: string;
//     };
//     links?: string[];
//   };
// };

// const linksReducer: Reducer<LinksState, LinksAction> = (state, action) => {
//   switch (action.type) {
//     case LinksActions.add: {
//       return [...state, action.payload.link.value];
//     }

//     case LinksActions.update: {
//       const updatedState = [...state];
//       updatedState[action.payload.link.index] = action.payload.link.value;
//       return updatedState;
//     }

//     case LinksActions.delete: {
//       return state
//         .slice(0, action.payload.link.index)
//         .concat(state.slice(action.payload.link.index + 1));
//     }

//     case LinksActions.init: {
//       return action.payload.links;
//     }

//     default: {
//       break;
//     }
//   }
// };

export const Tags: React.FC = () => {
  const [tags, setTags] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const [autocompleteValue, setAutocompleteValue] = useState<string>('');

  return (
    <div>
      <ul>
        {tags.map((tag, index) => (
          <li key={index}>{tag}</li>
        ))}
      </ul>
      <div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setTags([...tags, inputValue]);
            setAutocompleteValue('');
            setInputValue('');
          }}
        >
          <Autocomplete
            id="tags-f"
            freeSolo
            options={[...Array(10)].map((val, index) => `Tag-${index}`)}
            value={autocompleteValue}
            onChange={(e, newValue) => {
              setAutocompleteValue(newValue);
              setInputValue(newValue);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
            )}
          />
        </form>
      </div>
    </div>
  );
};
