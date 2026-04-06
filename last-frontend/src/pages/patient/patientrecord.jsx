import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { Upload, FileText, Eye, Download, Trash2, Sparkles, ShieldCheck, FileBadge, ImageIcon, } from "lucide-react";
import { RxCross2 } from "react-icons/rx";
import toast from "react-hot-toast";

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
      const res = await axios.get(`${API_URL}/medical/reports`, { withCredentials: true, });

      if (res.data.success) {
        const formatted = res.data.reports.map((report) => ({
          id: report.id,
          title: report.diseaseName,
          fileUrl: report.fileUrl,
          date: new Date(report.uploadedAt).toLocaleDateString(),
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

      const res = await axios.post(`${API_URL}/medical/add-report`, formData, { withCredentials: true });

      if (res?.data?.success) {
        const report = res.data.data;

        setReports((prev) => [{ id: report.id, title: report.diseaseName, fileUrl: report.fileUrl, date: new Date(report.uploadedAt).toLocaleDateString(), }, ...prev,]);
        setTitle("");
        setFile(null);
        setPreviewUrl(null);

        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }

        toast.success("Report uploaded successfully");
      }
    } catch (err) {
      console.error(err);
      const message = err?.response?.data?.message || err?.message || "Upload failed";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const deleteReport = async (id) => {
    try {
      const res = await axios.delete(`${API_URL}/medical/delete-report/${id}`, { withCredentials: true, });

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

    if (!selected.type.startsWith("image/") && selected.type !== "application/pdf") {
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
    <div className="min-h-screen py-8 sm:px-4">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="relative overflow-hidden rounded-4xl border border-slate-200 bg-white/80 p-6 shadow-[0_20px_80px_rgba(14,165,233,0.12)] backdrop-blur-2xl sm:p-8">
          <div className="absolute inset-0 bg-linear-to-r from-sky-100/40 via-cyan-100/20 to-indigo-100/30" />

          <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-700">
                <Sparkles className="h-4 w-4" />
                Smart Medical Dashboard
              </div>

              <h1 className="flex items-center gap-3 text-3xl font-bold text-slate-800 sm:text-4xl">
                <FileText className="text-sky-500" />
                Patient Medical Records
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
                Upload, manage, preview, and organize your medical reports in a
                secure premium dashboard.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="mb-2 flex items-center justify-between">
                  <FileBadge className="text-cyan-500" />
                  <span className="text-xs text-slate-400">Reports</span>
                </div>
                <h3 className="text-2xl font-bold text-slate-800">{reports.length}</h3>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="mb-2 flex items-center justify-between">
                  <ShieldCheck className="text-emerald-500" />
                  <span className="text-xs text-slate-400">Secure</span>
                </div>
                <h3 className="text-lg font-bold text-slate-800">Encrypted</h3>
              </div>

            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-4xl border border-slate-200 bg-white/80 p-5 shadow-xl backdrop-blur-2xl sm:p-7">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="flex items-center gap-3 text-xl font-semibold text-slate-800">
                  <Upload className="text-sky-500" />
                  Upload Report
                </h2>
                <p className="mt-1 text-sm text-slate-500">Add your image or PDF report securely.</p>
              </div>

              <button onClick={addReport} disabled={loading} className="rounded-xl bg-linear-to-r from-sky-500 via-cyan-500 to-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition-all duration-300 hover:scale-105 disabled:opacity-50">
                {loading ? "Uploading..." : "Upload Now"}
              </button>
            </div>

            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-600">Report Title</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Blood Test / MRI / Prescription" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20" />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-600">Upload File</label>

                <div onDragOver={(e) => e.preventDefault()} onDrop={handleDrop} onClick={() => fileInputRef.current.click()} className="group relative flex h-72 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-4xl border border-dashed border-slate-300 bg-linear-to-br from-slate-50 to-white transition-all duration-300 hover:border-cyan-400 hover:shadow-[0_0_40px_rgba(34,211,238,0.12)]">
                  {previewUrl ? (
                    <>
                      {file?.type === "application/pdf" ? (
                        <div className="text-center">
                          <FileText className="mx-auto mb-3 h-12 w-12 text-red-500" />
                          <p className="text-lg font-semibold text-slate-700">PDF Selected</p>
                          <p className="mt-2 text-sm text-slate-400">{file.name}</p>
                        </div>
                      ) : (
                        <img src={previewUrl} alt="preview" className="absolute inset-0 h-full w-full object-contain p-4" />
                      )}

                      <button type="button" onClick={(e) => { e.stopPropagation(); setFile(null); setPreviewUrl(null); fileInputRef.current.value = ""; }} className="absolute right-4 top-4 rounded-full bg-white p-2 shadow-md transition hover:bg-red-500 hover:text-white">
                        <RxCross2 size={18} />
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="mb-4 rounded-full border border-cyan-200 bg-cyan-50 p-5 text-cyan-500 transition group-hover:scale-110">
                        <Upload className="h-10 w-10" />
                      </div>

                      <h3 className="text-lg font-semibold text-slate-700">Drag & Drop File Here</h3>
                      <p className="mt-2 text-sm text-slate-400">Supports JPG, PNG and PDF up to 5MB</p>
                    </>
                  )}
                </div>

                <input ref={fileInputRef} type="file" accept="image/*,application/pdf" onChange={handleFileChange} className="hidden" />
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <div className="rounded-4xl border border-slate-200 bg-white/80 p-5 shadow-xl">
              <h3 className="mb-5 text-lg font-semibold text-slate-800">Quick Overview</h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">
                  <div className="flex items-center gap-3">
                    <ImageIcon className="text-pink-500" />
                    <span className="text-sm text-slate-600">Supported</span>
                  </div>
                  <span className="text-sm font-semibold text-slate-800">PDF & Images</span>
                </div>

                <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">
                  <div className="flex items-center gap-3">
                    <FileText className="text-sky-500" />
                    <span className="text-sm text-slate-600">Total Reports</span>
                  </div>
                  <span className="text-sm font-semibold text-slate-800">{reports.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-4xl border border-slate-200 bg-white/80 p-5 shadow-xl backdrop-blur-2xl sm:p-7">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="flex items-center gap-3 text-xl font-semibold text-slate-800">
              <FileText className="text-sky-500" />
              Uploaded Reports
            </h2>

            <div className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-500">
              {reports.length} Total Reports
            </div>
          </div>

          {reports.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 py-16 text-center">
              <FileText className="mx-auto mb-4 h-10 w-10 text-slate-400" />
              <p className="text-lg font-medium text-slate-600">No reports uploaded yet</p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-3xl border border-slate-200">
              <table className="w-full overflow-hidden text-sm">
                <thead className="bg-slate-100 text-slate-600">
                  <tr>
                    <th className="px-6 py-4 text-left">Report</th>
                    <th className="px-6 py-4 text-left">Date</th>
                    <th className="px-6 py-4 text-center">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {reports.map((report) => (
                    <tr key={report.id} className="border-t border-slate-100 bg-white transition hover:bg-sky-50">
                      <td className="px-3 py-4 sm:px-6 sm:py-5">
                        <div className="flex items-center gap-3">
                          <div className="rounded-xl bg-sky-100 p-2.5 text-sky-500 sm:p-3">
                            <FileText size={16} className="sm:h-4.5 sm:w-4.5" />
                          </div>

                          <div className="min-w-0">
                            <h4 className="truncate text-sm font-semibold text-slate-800 sm:text-base">{report.title}</h4>
                            <p className="text-xs text-slate-400">Medical File</p>
                          </div>
                        </div>
                      </td>

                      <td className="px-2 py-4 text-xs text-slate-600 sm:px-6 sm:py-5 sm:text-sm">
                        <span className="whitespace-nowrap">{report.date}</span>
                      </td>

                      <td className="px-2 py-4 sm:px-6 sm:py-5">
                        <div className="flex items-center justify-center gap-1.5 sm:gap-3">
                          <button onClick={() => setSelectedReport(report)} className="rounded-lg bg-sky-100 p-2 text-sky-500 transition hover:bg-sky-500 hover:text-white sm:rounded-xl sm:p-3">
                            <Eye size={16} className="sm:h-4.5 sm:w-4.5" />
                          </button>

                          <a href={report.fileUrl} download className="rounded-lg bg-emerald-100 p-2 text-emerald-500 transition hover:bg-emerald-500 hover:text-white sm:rounded-xl sm:p-3">
                            <Download size={16} className="sm:h-4.5 sm:w-4.5" />
                          </a>

                          <button onClick={() => deleteReport(report.id)} className="rounded-lg bg-red-100 p-2 text-red-500 transition hover:bg-red-500 hover:text-white sm:rounded-xl sm:p-3">
                            <Trash2 size={16} className="sm:h-4.5 sm:w-4.5" />
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
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <div className="relative w-full mb-10 lg:mb-0 max-w-5xl overflow-hidden rounded-4xl border border-slate-200 bg-white shadow-2xl">
              <button onClick={() => setSelectedReport(null)} className="absolute right-5 top-5 z-10 rounded-full bg-white p-3 text-slate-700 shadow-lg transition hover:bg-red-500 hover:text-white">
                <RxCross2 size={22} />
              </button>

              <div className="border-b border-slate-200 px-6 py-5">
                <h3 className="text-xl font-semibold text-slate-800">{selectedReport.title}</h3>
                <p className="mt-1 text-sm text-slate-500">Uploaded on {selectedReport.date}</p>
              </div>

              <div className="flex h-[70vh] lg:h-[80vh] items-center justify-center bg-slate-100 p-5">
                {selectedReport.fileUrl?.includes(".pdf") ||
                  selectedReport.fileUrl?.includes("/raw/") ? (
                  <iframe src={selectedReport.fileUrl} title={selectedReport.title} className="h-full w-full rounded-2xl border border-slate-200 bg-white" />
                ) : (
                  <img src={selectedReport.fileUrl} alt={selectedReport.title} className="max-h-full max-w-full rounded-2xl object-contain shadow-lg" />
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}