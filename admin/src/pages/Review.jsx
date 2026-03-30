import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function ReportReview() {
  const navigate = useNavigate();

  const report = {
    id: "10",
    submitted: "Mar 3, 2026 • 09:42 PM",
    status: "Pending",

    plate: "BA-2-PA-1234",
    vehicleType: "Car",
    violation: "Speeding",
    latitude: 27.717245,
    longitude: 85.32396,

    reporterName: "Ahmed Khan",
    reporterUsername: "@ahmedk",

    linkedUser: "Fatima Ali (@fatima.ali)",

    ownerName: "Fatima Ali",
    ownerEmail: "fatima@gmail.com",
    ownerPhone: "+977-9800000000",
    registeredDate: "2024-11-18",

    description:
      "Vehicle was observed speeding near the main intersection. Plate clearly visible. Supporting image attached.",

    plateImage:
      "https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?auto=format&fit=crop&w=1600&q=80",
    supportImage:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=80",
  };

  const [status, setStatus] = useState(report.status);
  const [notes, setNotes] = useState("");

  const badgeStyle =
    status === "Accepted"
      ? "bg-emerald-100 text-emerald-700"
      : status === "Rejected"
        ? "bg-rose-100 text-rose-700"
        : "bg-amber-100 text-amber-700";

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
                Report ID - {report.id}
              </p>

              <p className="text-sm text-slate-500">
                Submitted {report.submitted}
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
              src={report.plateImage}
              alt="Plate"
              className="rounded-2xl h-72 w-full object-cover border border-slate-200"
            />

            <img
              src={report.supportImage}
              alt="Support"
              className="rounded-2xl h-72 w-full object-cover border border-slate-200"
            />
          </div>

          {/* REPORTER */}
          <Table
            title="Reporter Information"
            data={{
              "Full Name": report.reporterName,
              Username: report.reporterUsername,
            }}
          />

          {/* VEHICLE */}
          <Table
            title="Vehicle Information"
            data={{
              "License Plate": report.plate,
              "Vehicle Type": report.vehicleType,
              "Owner Name": report.ownerName,
              Email: report.ownerEmail,
              Phone: report.ownerPhone,
              "Registered Date": report.registeredDate,
              "Linked User": report.linkedUser,
            }}
          />

          {/* VIOLATION */}
          <Table
            title="Violation Details"
            data={{
              "Violation Type": report.violation,
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
                onClick={() => setStatus("Accepted")}
                className="px-6 py-3 rounded-xl bg-[#2460B9] text-white text-base font-medium hover:bg-[#1f54a3] transition-colors"
              >
                Accept Report
              </button>

              <button
                onClick={() => setStatus("Rejected")}
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
