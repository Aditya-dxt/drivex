import { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import FileGrid from "../components/files/FileGrid";
import { getFiles } from "../services/fileService";

function Files() {
  const [files, setFiles] = useState([]);

  const fetchFiles = async () => {
    try {
      const data = await getFiles();
      setFiles(data);
    } catch (error) {
      console.error("Error fetching files:", error);
    }
  };

  useEffect(() => {
    const loadFiles = async () => {
      await fetchFiles();
    };

    loadFiles();
  }, []);

  return (
    <Layout refresh={fetchFiles}>
      <h1>My Files</h1>

      <FileGrid files={files} />
    </Layout>
  );
}

export default Files;
