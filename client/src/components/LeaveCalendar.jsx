import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const isSameDay = (d1, d2) => {
  return (
    d1.getDate() === d2.getDate() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getFullYear() === d2.getFullYear()
  );
};

const calendarStyles = `
  .react-calendar {
    background: var(--bg-card);
    color: var(--text-primary);
    border: 1px solid var(--border-color);
    width: 100%;
    max-width: 500px;
    border-radius: 12px;
    padding: 10px;
  }

  .react-calendar button {
    color: var(--text-primary);
  }

  .react-calendar__navigation button {
    background: transparent;
  }

  .react-calendar__tile {
    border-radius: 9999px;
  }

  .approved {
    background: #22c55e !important;
    color: white !important;
    border-radius: 9999px;
  }

  .pending {
    background: #facc15 !important;
    color: black !important;
    border-radius: 9999px;
  }

  .rejected {
    background: #ef4444 !important;
    color: white !important;
    border-radius: 9999px;
  }
`;
const LeaveCalendar = ({ leaves }) => {
  return (
   <div
  className="mt-6 w-full rounded-2xl border p-4 shadow-sm"
  style={{
    backgroundColor: "var(--bg-card)",
    borderColor: "var(--border-color)",
    color: "var(--text-primary)",
  }}
>
      <style>{calendarStyles}</style>

      <h2 className="mb-4 text-lg font-semibold">
        Leave Calendar
      </h2>

      <div className="flex justify-center">
        <Calendar
          tileClassName={({ date, view }) => {
            if (view === "month") {
              for (let leave of leaves) {
                const from = new Date(leave.fromDate);
                const to = new Date(leave.toDate);

                let current = new Date(from);

                while (current <= to) {
                  if (isSameDay(current, date)) {
                    if (leave.status === "approved") {
                      return "approved";
                    }

                    if (leave.status === "pending") {
                      return "pending";
                    }

                    if (leave.status === "rejected") {
                      return "rejected";
                    }
                  }

                  current.setDate(current.getDate() + 1);
                }
              }
            }
          }}
        />
      </div>

      <div className="mt-4 flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-green-500"></span>
          Approved
        </div>

        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-yellow-400"></span>
          Pending
        </div>

        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-red-500"></span>
          Rejected
        </div>
      </div>
    </div>
  );
};

export default LeaveCalendar;