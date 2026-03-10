import API from "./api"

export const uploadFile = async (file) => {

const formData = new FormData()
formData.append("file", file)

const res = await API.post("/files/upload", formData)

return res.data

}

export const getFiles = async () => {

const res = await API.get("/files")

return res.data

}