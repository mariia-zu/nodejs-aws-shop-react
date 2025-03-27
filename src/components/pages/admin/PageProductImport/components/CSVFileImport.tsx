import React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import axios from "axios";

type CSVFileImportProps = {
  url: string;
  title: string;
};

export default function CSVFileImport({ url, title }: CSVFileImportProps) {
  const [file, setFile] = React.useState<File>();

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setFile(file);
    }
  };

  const removeFile = () => {
    setFile(undefined);
  };

  const uploadFile = async () => {
    console.log("uploadFile to", url);

    const authorization_token = localStorage.getItem("authorization_token");
    if (!authorization_token) {
      alert("Authorization token isn't found!");
      return;
    }
    try {
      const response = await axios({
        method: "GET",
        url,
        params: {
          name: encodeURIComponent(file!.name),
        },
        headers: { Authorization: `Basic ${authorization_token}` },
      });

      if (response.status === 401) {
        alert("Unauthorized: Authorization header is not provided");
        return;
      }

      if (response.status === 403) {
        alert("Forbidden: Invalid token");
        return;
      }

      console.log("File to upload: ", file!.name);
      console.log("Uploading to: ", response.data.signedUrl);
      const result = await fetch(response.data.signedUrl, {
        method: "PUT",
        body: file,
      });
      console.log("Result: ", result);
      setFile(undefined);
    } catch (error) {
      alert("Unexpected error: " + error);
    }
  };
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      {!file ? (
        <input type="file" onChange={onFileChange} />
      ) : (
        <div>
          <button onClick={removeFile}>Remove file</button>
          <button onClick={uploadFile}>Upload file</button>
        </div>
      )}
    </Box>
  );
}
