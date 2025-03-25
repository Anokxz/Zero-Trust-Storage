import { useState, useEffect } from "react";
import axios from "axios";

export default function FileList() {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/files`)
      .then((res) => setFiles(res.data))
      .catch((err) => console.error(err));
  }, []);

  const getMimeType = (fileName) => {
    const extension = fileName.split(".").pop().toLowerCase();
    const mimeTypes = {
      txt: "text/plain",
      pdf: "application/pdf",
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      png: "image/png",
      gif: "image/gif",
      json: "application/json",
      csv: "text/csv",
      zip: "application/zip",
      mp4: "video/mp4",
      mp3: "audio/mpeg",
      doc: "application/msword",
      docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      xls: "application/vnd.ms-excel",
      xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    };
    return mimeTypes[extension] || "application/octet-stream"; // Default binary file type
  };

  const downloadFile = async (fileId, fileName) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/files/download/${fileId}`,
        { responseType: "blob" } 
      );

      const blob = new Blob([response.data], { type: "text/plain" }); 
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = fileName; // Use actual file name
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Your Files</h2>
      <ul>
        {files.map((file) => (
          <li key={file.id} className="border p-2 rounded">
            {file.name}
            <button
              onClick={() => downloadFile(file.id, file.name)}
              className="text-blue-500 ml-2"
            >
              Download
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
