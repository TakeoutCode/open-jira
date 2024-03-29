import { FC, ReactNode, useEffect, useReducer } from 'react';
import { useSnackbar } from 'notistack';

import { entriesApi } from '../../utilsapis';
import { Entry } from '../../interfaces';
import { EntriesContext, entriesReducer } from './index';
export interface EntriesState {
  entries: Entry[] | [];
}

const Entries_INITIAL_STATE: EntriesState = {
  entries: [],
};

interface Props {
  children: ReactNode;
}

export const EntriesProvider: FC<Props> = ({ children }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [state, dispatch] = useReducer(entriesReducer, Entries_INITIAL_STATE);

  const addNewEntry = async (description: string) => {
    const { data } = await entriesApi.post<Entry>('/entries', {
      description,
    });
    dispatch({ type: '[Entry] Add-Entry', payload: data });
  };

  const updateEntry = async (
    { _id, description, status }: Entry,
    showSnackbar: boolean = false
  ) => {
    try {
      const { data } = await entriesApi.put<Entry>(`/entries/${_id}`, {
        description,
        status,
      });
      dispatch({ type: '[Entry] Entry-Updated', payload: data });
      if (showSnackbar) {
        enqueueSnackbar('Update entry', {
          variant: 'success',
          autoHideDuration: 1500,
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
        });
      }
    } catch (error) {
      console.error({ error });
    }
  };

  const deleteEntry = async ({ _id }: Entry) => {
    try {
      const { data } = await entriesApi.delete<Entry>(`/entries/${_id}`);
      dispatch({ type: '[Entry] Entry-Deleted', payload: data });
    } catch (error) {
      console.error({ error });
    }
  };

  const refreshEntries = async () => {
    const { data } = await entriesApi.get<Entry[]>('/entries');
    dispatch({ type: '[Entry] Refresh-Data', payload: data });
  };

  useEffect(() => {
    refreshEntries();
  }, []);

  return (
    <EntriesContext.Provider
      value={{
        ...state,

        //Methods
        addNewEntry,
        updateEntry,
        deleteEntry,
      }}
    >
      {children}
    </EntriesContext.Provider>
  );
};
