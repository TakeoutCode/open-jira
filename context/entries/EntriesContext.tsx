import { createContext } from 'react';
import { Entry } from '../../interfaces';

export interface ContextProps {
  entries: Entry[];
  addNewEntry: (description: string) => void;
  updateEntry: (entry: Entry, showSnackbar?: boolean) => void;
  deleteEntry: (entry: Entry) => void;
}
export const EntriesContext = createContext({} as ContextProps);
