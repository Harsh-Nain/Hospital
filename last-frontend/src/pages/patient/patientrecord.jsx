import axios from "axios";
import React, { useEffect, useState } from "react";
import { Upload, FileText, Eye, Download, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

export default function PatientRecord() {

  const [reports, setReports] = useState([]);
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  const API_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    fetchReports();
  }, []);

  // ================= FETCH REPORTS =================
  const fetchReports = async () => {
    try {

      const res = await axios.get(`${API_URL}/medical/reports`, {
        withCredentials: true,
      });

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

  // ================= ADD REPORT =================
  const addReport = async () => {

    if (!title.trim()) {
      return toast.error("Report title required");
    }

    if (!file) {
      return toast.error("Please select a file");
    }

    try {

      const formData = new FormData();
      formData.append("diseaseName", title);
      formData.append("file", file);

      setLoading(true);

      const res = await axios.post(
        `${API_URL}/medical/add-report`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      if (res.data.success) {

        const report = res.data.data;


        setReports((prev) => [
          ...prev,
          {
            id: report.id,
            title: report.diseaseName,
            fileUrl: report.fileUrl,
            date: new Date(report.uploadedAt).toLocaleDateString(),
          },
        ]);

        setTitle("");
        setFile(null);
            setPreviewUrl(null);


        toast.success("Report uploaded successfully");
      }

    } catch (err) {
      console.error(err);
      toast.error("Upload failed");
    } finally {
      setLoading(false);

    }
  };

  // ================= DELETE REPORT =================
  const deleteReport = async (id) => {
    try {

      const res = await axios.delete(
        `${API_URL}/medical/delete-report/${id}`,
        { withCredentials: true }
      );

      if (res.data.success) {

        setReports(reports.filter((r) => r.id !== id));

        toast.success("Report deleted");
      }

    } catch (error) {
      console.error(error);
      toast.error("Delete failed");
    }
  };

  const handleFileChange = (e) => {
  const selectedFile = e.target.files[0];
  setFile(selectedFile);

  if (selectedFile && selectedFile.type.startsWith("image/")) {
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(selectedFile);
  } else {
    setPreviewUrl(null);
  }
};

  return (

    <div className="min-h-screen bg-gray-100 p-6">

      <div className="max-w-5xl mx-auto space-y-6">


        {/* ================= UPLOAD CARD ================= */}

      <div className="bg-white rounded-xl shadow-xl p-8 space-y-6  mx-auto">
  <h3 className="font-semibold text-2xl text-gray-800 flex items-center gap-3">
    <Upload size={20} className="text-sky-500" />
    <span>Upload Medical Report</span>
  </h3>

  <div className="grid md:grid-cols-2 gap-6">
    <div>
      <label htmlFor="title" className="text-sm font-medium text-gray-600">Report Title</label>
      <input
        id="title"
        type="text"
        placeholder="Enter Report Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="mt-2 w-full border border-gray-300 rounded-lg p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
      />
    </div>

    <div>
      <label htmlFor="file-upload" className="text-sm font-medium text-gray-600">Upload File</label>
      <input
        id="file-upload"
        type="file"
  onChange={handleFileChange}
        className="mt-2 w-full border border-gray-300 rounded-lg p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
      />
    </div>
  </div>
  <div className="flex">
  {previewUrl && (
  <div className="mt-2">
    <p className="text-sm text-gray-600 mb-2">Preview</p>

    <div className="border rounded-xl p-3 bg-gray-50 w-fit">
      <img
        src={previewUrl}
        alt="preview"
        className="max-h-48 rounded-lg shadow"
      />
      <div></div>
    </div>
  </div>
)}

  <div className="flex justify-self-end w-full h-max self-end justify-end ">
    <button
      onClick={addReport}
      disabled={loading}
      className="bg-sky-500 text-white rounded-lg px-6 py-3 text-lg hover:bg-sky-600 transition duration-300 ease-in-out flex items-center gap-2 disabled:opacity-50"
    >
      {loading ? (
        <>
          <span>Uploading...</span>
          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v8m4-4l-4 4-4-4" />
          </svg>
        </>
      ) : (
        <>
          <Upload size={18} className="text-white" />
          Upload
        </>
      )}
    </button>
  </div>
</div>

</div>

        {/* ================= REPORTS TABLE ================= */}

        <div className="bg-white rounded-xl shadow-md p-6">

          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <FileText size={18} />
            Medical Reports
          </h3>

          {reports.length === 0 ? (

            <div className="text-center text-gray-500 py-10">
              No reports uploaded
            </div>

          ) : (

            <div className="overflow-x-auto   bg-white shadow-sm">
              <table className="w-full text-sm text-gray-700">

                <thead className="bg-gray-50">
                  <tr className="text-left border-b text-gray-600">
                    <th className="px-4 py-3 font-semibold">Report</th>
                    <th className="px-4 py-3 font-semibold">Date</th>
                    <th className="px-4 py-3 font-semibold text-center">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {reports.length === 0 ? (
                    <tr>
                      <td
                        colSpan="3"
                        className="py-8 text-center text-gray-500"
                      >
                        No reports available
                      </td>
                    </tr>
                  ) : (
                    reports.map((report) => (
                      <tr
                        key={report.id}
                        className="border-b hover:bg-gray-50 transition"
                      >
                        <td className="px-4 py-2 font-medium">
                          {report.title}
                        </td>

                        <td className="px-4 py-2 text-gray-600">
                          {report.date}
                        </td>

                        <td className="px-4 py-2">
                          <div className="flex items-center justify-center gap-2">

                            <a
                              href={report.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
                              title="View"
                            >
                              <Eye size={18} />
                            </a>

                            <a
                              href={report.fileUrl}
                              download
                              className="p-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition"
                              title="Download"
                            >
                              <Download size={18} />
                            </a>

                            <button
                              onClick={() => deleteReport(report.id)}
                              className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition"
                              title="Delete"
                            >
                              <Trash2 size={18} />
                            </button>

                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>

              </table>
            </div>

          )}

        </div>

      </div>

    </div>
  );
}