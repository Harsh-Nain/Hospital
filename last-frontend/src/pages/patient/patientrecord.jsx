import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { Upload, FileText, Eye, Download, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { RxCross2 } from "react-icons/rx";

export default function PatientRecord() {
  const API_URL = import.meta.env.VITE_BACKEND_URL;

  const [reports, setReports] = useState([]);
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const res = await axios.get(`${API_URL}/medical/reports`, { withCredentials: true });

      if (res.data.success) {


        const formatted = res.data.reports.map((report) => ({
          id: report.id,
          title: report.diseaseName,
          fileUrl: report.fileUrl,
          date: new Date(report.uploadedAt).toLocaleDateString()
        }));

        setReports(formatted);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch reports");
    }
  };

  const addReport = async () => {

    if (!title.trim()) {
      return toast.error("Report title required");
    }

    if (!file) {
      return toast.error("Please select a file");
    }

    if (
      !file.type.startsWith("image/") &&
      file.type !== "application/pdf"
    ) {
      return toast.error("Only image or PDF allowed");
    }

    if (file.size > 5 * 1024 * 1024) {
      return toast.error("File size must be less than 5MB");
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("diseaseName", title.trim());
      formData.append("file", file);

      const res = await axios.post(`${API_URL}/medical/add-report`,
        formData, {
        withCredentials: true, headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res?.data?.success) {
        const report = res.data.data;

        setReports((prev) => [...prev, { id: report.id, title: report.diseaseName, fileUrl: report.fileUrl, date: new Date(report.uploadedAt).toLocaleDateString() }]);
        setTitle("");
        setFile(null);
        setPreviewUrl(null);
        toast.success("Report uploaded successfully");
      }

    } catch (err) {
      console.error(err);

      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Upload failed";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const deleteReport = async (id) => {
    try {
      const res = await axios.delete(`${API_URL}/medical/delete-report/${id}`, { withCredentials: true });

      if (res.data.success) {
        setReports((prev) => prev.filter((r) => r.id !== id));
        toast.success("Report deleted");
      }
    } catch (error) {
      console.error(error);
      toast.error("Delete failed");
    }
  };

  const handleFileChange = (e) => {

    const selected = e.target.files?.[0];
    if (!selected) return;

    if (!selected.type.startsWith("image/") &&
      selected.type !== "application/pdf") {
      toast.error("Only image or PDF files allowed");
      return;
    }

    setFile(selected);

    const reader = new FileReader();

    reader.onloadend = () => {
      setPreviewUrl(reader.result);
    };

    reader.readAsDataURL(selected);
  };

  const handleDrop = (e) => {
    e.preventDefault();

    const droppedFile = e.dataTransfer.files?.[0];
    if (!droppedFile) return;

    handleFileChange({ target: { files: [droppedFile] } });
  };

  return (

    <div className="min-h-screen bg-gray-50 sm:p-6">

      <div className="max-w-5xl mx-auto space-y-8">
        <div className="bg-white/80 backdrop-blur-xl border border-sky-100 rounded-2xl shadow-md p-4 sm:p-8 space-y-6">

          <div className="flex justify-between">

            <h2 className="text-xl font-semibold flex items-center gap-3 text-gray-800">
              <Upload className="text-sky-500" />
              Upload Medical Report
            </h2>

            <button onClick={addReport} disabled={loading} className="bg-linear-to-r from-sky-400 to-blue-500 text-white p-1.5 sm:px-3 sm:py-2 rounded-lg flex items-center justify-center gap-2 hover:shadow-lg transition disabled:opacity-50"           >
              <Upload className="w-4 h-4" />

              <span className="hidden sm:inline text-sm">
                {loading ? "Uploading..." : "Upload Report"}
              </span>
            </button>

          </div>

          <div className="space-y-5">
            <div>
              <label className="text-sm text-gray-600">
                Report Title
              </label>

              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Blood Test / X-Ray / MRI" className="mt-2 w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-sky-500 outline-none" />

            </div>

            <div>
              <label className="text-sm text-gray-600">
                Upload Image / PDF
              </label>

              <div
                className="mt-2 bg-gray-50 relative flex items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-sky-500 transition overflow-hidden"
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current.click()}
              >
                {previewUrl ? (
                  <>
                    {file?.type === "application/pdf" ? (
                      <div className="text-center">
                        <p className="text-red-500 text-sm">PDF Selected</p>
                        <p className="text-xs text-gray-400 mt-1">{file.name}</p>
                      </div>
                    ) : (
                      <img
                        src={previewUrl}
                        alt="preview"
                        className="absolute inset-0 w-full h-full object-contain py-1"
                      />
                    )}

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFile(null);
                        setPreviewUrl(null);
                        fileInputRef.current.value = "";
                      }}
                      className="absolute top-2 right-2 bg-white rounded-full p-1 shadow"
                    >
                      ✕
                    </button>
                  </>
                ) : (
                  <div className="text-center">
                    <p className="text-gray-500 text-sm">
                      Drag & Drop Image or PDF
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      or Click to Browse
                    </p>
                  </div>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,application/pdf"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-xl border border-sky-100 rounded-2xl shadow-md p-4 sm:p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FileText size={18} />
            Medical Reports
          </h2>

          {reports.length === 0 ? (<div className="text-center py-12 text-gray-500">No reports uploaded</div>) : (

            <div className="overflow-x-auto">
              <table className="w-full text-sm">

                <thead className="border-b bg-gray-50 text-gray-600">
                  <tr>
                    <th className="px-4 py-3 text-left">Report</th>
                    <th className="px-4 py-3 text-left">Date</th>
                    <th className="px-4 py-3 text-center">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {reports.map((report) => (

                    <tr key={report.id} className="border-b hover:bg-gray-50 transition" >
                      <td className="px-4 py-3 font-medium">{report.title}</td>
                      <td className="px-4 py-3 text-gray-600">{report.date}</td>
                      <td className="px-4 py-3">

                        <div className="flex justify-center gap-2">


                          <button
                            onClick={() => setSelectedReport(report)}
                            className="text-sky-600 text-xs underline"
                          >
                            <Eye size={18} />
                          </button>



                          <a
                            href={report.fileUrl}
                            download
                            className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100"
                          >
                            <Download size={18} />
                          </a>

                          <button onClick={() => deleteReport(report.id)} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100">
                            <Trash2 size={18} />
                          </button>

                        </div>

                      </td>

                    </tr>


                  ))}
                </tbody>
              </table>
              
            </div>

          )}
        </div>
              {selectedReport && (
                <div className="fixed h-100% inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
                  <button
                    onClick={() => setSelectedReport(null)}
                    className="absolute top-4 right-4 text-white text-2xl font-bold"
                  >
                    ✖
                  </button>

                  {selectedReport.fileUrl.includes(".pdf") || selectedReport.fileUrl.includes("/raw/") ? (
                    <iframe
                      src={selectedReport.fileUrl}
                      title="Report"
                      className="w-[90%] h-[90%] bg-white rounded"
                    />
                  ) : (
                    <img
                      src={selectedReport.fileUrl}
                      alt="Report"
                      className="max-w-[90%] max-h-[90%] rounded"
                    />
                  )}
                </div>
              )}
      </div>
    </div>
  );
}