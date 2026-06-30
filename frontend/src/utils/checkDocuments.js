import API from "../services/api";

export const checkDocuments = async () => {

  try {

    const response =
      await API.get("/documents");

    return (
      Array.isArray(response.data) &&
      response.data.length > 0
    );

  } catch {

    return false;

  }

};