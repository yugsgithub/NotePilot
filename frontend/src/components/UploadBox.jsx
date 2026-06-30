import { useState } from "react";
import API from "../services/api";
import toast from "react-hot-toast";


function UploadBox() {
  const [files, setFiles] = useState([]);
  const [status, setStatus] = useState("");
  const [uploading, setUploading] = useState(false);


  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);


    setFiles(selectedFiles);
    setStatus("");
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      toast.error("Please select at least one PDF");
      return;
    }

    try {
      setUploading(true);
      setStatus("Uploading PDFs...");

      for (const file of files) {
        const formData = new FormData();

        formData.append("file", file);

        await API.post(
          "/upload",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      }

      setStatus(
        `${files.length} PDF${
          files.length > 1 ? "s" : ""
        } uploaded successfully`
      );

      toast.success("Upload completed");

      setFiles([]);

      // Refresh dashboard/documents once
      setTimeout(() => {
        window.location.reload();
      }, 1000);

    } catch (error) {
      console.error(error);

      setStatus("Upload failed.");
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
  <div
    className="
      bg-[#161b22]
      border
      border-white/10
      rounded-2xl
      p-8
      h-fit
      shadow-xl
    "
  >
    <div className="flex items-center justify-between mb-6">
      <div>
        <h2 className="text-2xl font-bold">
          Upload PDFs
        </h2>

        <p className="text-slate-400 text-sm mt-1">
          Drag & drop your notes or browse your computer.
        </p>
      </div>

      <div className="text-4xl">
        📄
      </div>
    </div>

    <label
      className="
        border-2
        border-dashed
        border-slate-700
        hover:border-blue-500
        rounded-2xl
        transition-all
        duration-300
        flex
        flex-col
        items-center
        justify-center
        py-16
        cursor-pointer
        bg-[#0d1117]
      "
    >
      <div className="text-6xl mb-4">
        ☁️
      </div>

      <h3 className="text-lg font-semibold">
        Drag & Drop PDFs
      </h3>

      <p className="text-slate-400 text-sm mt-2">
        or click to browse
      </p>

      <input
        type="file"
        multiple
        accept=".pdf"
        className="hidden"
        onChange={handleFileChange}
      />
    </label>

    {files.length > 0 && (
      <div className="mt-6">

        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold">
            Selected Files
          </h3>

          <span className="text-blue-400 text-sm">
            {files.length} PDF
            {files.length > 1 && "s"}
          </span>
        </div>

        <div className="space-y-3 max-h-56 overflow-y-auto">

          {files.map((file, index) => (
            <div
              key={index}
              className="
                flex
                items-center
                justify-between
                bg-[#0d1117]
                border
                border-slate-700
                rounded-xl
                px-4
                py-3
              "
            >
              <div>
                <p className="font-medium">
                  {file.name}
                </p>

                <p className="text-xs text-slate-400">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>

              </div>

              <span className="text-green-400">
                ✓
              </span>

            </div>
          ))}

        </div>

        <button
          disabled={uploading}
          onClick={handleUpload}
          className="
            mt-6
            w-full
            py-3
            rounded-xl
            bg-blue-600
            hover:bg-blue-500
            transition
            font-semibold
            disabled:opacity-50
            disabled:cursor-not-allowed
            cursor-pointer
          "
        >
          {uploading
            ? "Uploading..."
            : "Upload PDFs"}
        </button>

      </div>
    )}

    {status && (
      <div
        className="
          mt-5
          bg-blue-500/10
          border
          border-blue-500/20
          rounded-xl
          p-4
          text-blue-300
        "
      >
        {status}
      </div>
    )}

    <div className="mt-8 border-t border-slate-800 pt-5">

      <p className="text-sm text-slate-400">
        Supported format
      </p>

      <p className="mt-1 font-medium">
        PDF (.pdf)
      </p>

      <p className="mt-4 text-sm text-slate-500">
        Your documents are embedded into the vector database
        and become searchable immediately after upload.
      </p>

    </div>
  </div>
  );
}

export default UploadBox;