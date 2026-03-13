import api from "./axios";

export const createFolder = async (name, parentFolder = null) => {
  const res = await api.post("/folders", {
    name,
    parentFolder,
  });

  return res.data;
};

export const getFolders = async (parentFolder = null) => {
  const res = await api.get("/folders", {
    params: { parentFolder }
  });

  return res.data;
};