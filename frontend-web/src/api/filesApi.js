import api from "./axios";

export const getFiles = async (folder = null) => {
  const res = await api.get("/files", {
    params: { folder },
  });

  return res.data;
};

export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await api.post("/files/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};
