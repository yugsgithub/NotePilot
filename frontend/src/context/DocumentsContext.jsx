import { createContext, useContext, useState } from "react";

const DocumentsContext = createContext();

export function DocumentsProvider({ children }) {

  const [documents, setDocuments] = useState([]);

  const [hasDocuments, setHasDocuments] = useState(false);

  return (

    <DocumentsContext.Provider
      value={{
        documents,
        setDocuments,
        hasDocuments,
        setHasDocuments
      }}
    >
      {children}
    </DocumentsContext.Provider>

  );

}

export const useDocuments = () =>
  useContext(DocumentsContext);