import { useEffect, useState } from "react";
import API from "../services/api";
import {
  FileText,
  Database,
  CheckCircle,
  Cpu,
} from "lucide-react";

function CurrentDocument() {
  const [documentInfo, setDocumentInfo] = useState(null);

  useEffect(() => {
    fetchDocumentInfo();
  }, []);

  const fetchDocumentInfo = async () => {
    try {
      const response = await API.get("/document-info");
      setDocumentInfo(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div
      className="
      bg-[#111827]
      border
      border-slate-800
      rounded-2xl
      p-6
      shadow-sm
      h-fit
    "
    >
      {/* Header */}

      <div className="flex items-center gap-3 mb-6">
        <div className="bg-blue-600/20 p-3 rounded-xl">
          <FileText className="text-blue-400" size={22} />
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white">
            Current Document
          </h2>

          <p className="text-sm text-slate-400">
            Active indexed notes
          </p>
        </div>
      </div>

      {!documentInfo?.filename ? (
        <div
          className="
            rounded-xl
            border
            border-dashed
            border-slate-700
            bg-slate-900
            py-12
            flex
            flex-col
            items-center
            justify-center
          "
        >
          <FileText
            size={40}
            className="text-slate-500 mb-3"
          />

          <p className="text-slate-300 font-medium">
            No document uploaded
          </p>

          <p className="text-slate-500 text-sm mt-1">
            Upload a PDF to start chatting.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* File */}

          <div className="bg-slate-900 rounded-xl border border-slate-800 p-4 flex justify-between items-center">
            <div>
              <p className="text-xs text-slate-500 uppercase">
                File
              </p>

              <p className="mt-1 text-white font-medium break-all">
                {documentInfo.filename}
              </p>
            </div>

            <FileText
              size={20}
              className="text-blue-400"
            />
          </div>

          {/* Chunks */}

          <div className="bg-slate-900 rounded-xl border border-slate-800 p-4 flex justify-between items-center">
            <div>
              <p className="text-xs text-slate-500 uppercase">
                Indexed Chunks
              </p>

              <p className="mt-1 text-white font-semibold">
                {documentInfo.chunks}
              </p>
            </div>

            <Database
              size={20}
              className="text-cyan-400"
            />
          </div>

          {/* Status */}

          <div className="bg-slate-900 rounded-xl border border-slate-800 p-4 flex justify-between items-center">
            <div>
              <p className="text-xs text-slate-500 uppercase">
                Status
              </p>

              <p className="mt-1 text-green-400 font-medium">
                Ready
              </p>
            </div>

            <CheckCircle
              size={20}
              className="text-green-400"
            />
          </div>

          {/* AI */}

          <div className="bg-slate-900 rounded-xl border border-slate-800 p-4 flex justify-between items-center">
            <div>
              <p className="text-xs text-slate-500 uppercase">
                AI Model
              </p>

              <p className="mt-1 text-white font-medium">
                Llama 3.3 70B
              </p>
            </div>

            <Cpu
              size={20}
              className="text-violet-400"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default CurrentDocument;