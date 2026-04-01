import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { getReportById, reviewReport } from "../services/reviewService";

export default function ReportReview() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [report, setReport] = useState(null);
  const [status, setStatus] = useState("Pending");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);

  // ================= LOAD REPORT =================
  useEffect(() => {
    loadReport();
  }, []);

  const loadReport = async () => {
    try {
      const data = await getReportById(id);

      setReport(data);

      // normalize status
      const normalized =
        data.report_status === "accepted"
          ? "Accepted"
          : data.report_status === "rejected"
            ? "Rejected"
            : "Pending";

      setStatus(normalized);
    } catch (err) {
      alert(err.message);
      navigate(-1);
    } finally {
      setLoading(false);
    }
  };

  const badgeStyle =
    status === "Accepted"
      ? "bg-emerald-100 text-emerald-700"
      : status === "Rejected"
        ? "bg-rose-100 text-rose-700"
        : "bg-amber-100 text-amber-700";

  // ================= HANDLE REVIEW =================
  const handleSubmit = async (finalStatus) => {
    try {
      await reviewReport(id, finalStatus, notes);

      setStatus(finalStatus);

      alert("Review submitted successfully");

      navigate(-1);
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!report) return null;

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-20">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* BACK BUTTON */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition"
        >
          <ArrowLeft size={17} />
          Back
        </button>

        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-12 space-y-12">
          {/* HEADER */}
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-semibold text-slate-900 tracking-tight">
                Report Review
              </h1>

              <p className="text-sm text-slate-600 mt-3 font-medium">
                Report ID - {report.report_id}
              </p>

              <p className="text-sm text-slate-500">
                Submitted {new Date(report.report_date).toLocaleString()}
              </p>
            </div>

            <span
              className={`px-4 py-1.5 text-xs font-semibold rounded-full tracking-wide ${badgeStyle}`}
            >
              {status}
            </span>
          </div>

          {/* IMAGES */}
          <div className="grid md:grid-cols-2 gap-8">
            <img
              src={`${report.plate_image}`}
              alt="Plate"
              className="rounded-2xl h-72 w-full object-cover border border-slate-200"
            />

            <img
              src={`${report.support_image}`}
              alt="Support"
              className="rounded-2xl h-72 w-full object-cover border border-slate-200"
            />
          </div>

          {/* REPORTER */}
          <Table
            title="Reporter Information"
            data={{
              "Full Name": report.reporter_name,
              Username: report.reporter_username,
            }}
          />

          {/* VEHICLE */}
          <Table
            title="Vehicle Information"
            data={{
              "License Plate": report.vehicle_number,
              "Owner Name": report.owner_name,
              Email: report.owner_email,
              Phone: report.owner_phone,
              "Registered Date": report.registered_date,
              "Linked User": report.owner_username
                ? `${report.owner_full_name} (@${report.owner_username})`
                : "Not Linked",
            }}
          />

          {/* VIOLATION */}
          <Table
            title="Violation Details"
            data={{
              "Violation Type": report.violation_type,
              Location: `${report.latitude}, ${report.longitude}`,
              Description: report.description,
            }}
          />

          {/* ADMIN REVIEW */}
          <div className="border-t border-slate-200 pt-10">
            <div>
              <h3 className="text-xl font-semibold text-slate-900">
                Admin Review Notes
              </h3>

              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Write internal review notes..."
                className="w-full mt-4 h-32 rounded-xl border border-slate-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-200"
              />
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={() => handleSubmit("Accepted")}
                className="px-6 py-3 rounded-xl bg-[#2460B9] text-white text-base font-medium hover:bg-[#1f54a3] transition-colors"
              >
                Accept Report
              </button>

              <button
                onClick={() => handleSubmit("Rejected")}
                className="px-6 py-3 rounded-xl border border-gray-300 text-gray-700 text-base font-medium hover:bg-gray-100 transition-colors"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Table({ title, data }) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-slate-900 mb-5 tracking-tight">
        {title}
      </h3>

      <div className="border border-slate-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <tbody>
            {Object.entries(data).map(([label, value]) => (
              <tr
                key={label}
                className="border-t border-slate-200 first:border-0 hover:bg-slate-50 transition"
              >
                <td className="px-6 py-4 text-slate-500 font-medium w-1/3">
                  {label}
                </td>

                <td className="px-6 py-4 font-semibold text-slate-800">
                  {value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
