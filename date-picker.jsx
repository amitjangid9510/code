import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function Home () {
  const [singleDate, setSingleDate] = useState(null);
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [time, setTime] = useState(null);
  const [month, setMonth] = useState(null);
  const [year, setYear] = useState(null);
  const [status, setStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare data - convert to ISO string or null if empty
    const dataToSend = {
      singleDate: singleDate ? singleDate.toISOString() : null,
      startDate: startDate ? startDate.toISOString() : null,
      endDate: endDate ? endDate.toISOString() : null,
      time: time ? time.toISOString() : null,
      month: month ? month.toISOString() : null,
      year: year ? year.toISOString() : null,
    };

    try {
      const response = await fetch("https://your-backend-api.com/save-date", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        setStatus("Date(s) successfully submitted!");
      } else {
        setStatus("Failed to submit date(s).");
      }
    } catch (error) {
      setStatus("Error submitting date(s): " + error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Same date pickers as before */}
      <h2>Single Date Picker</h2>
      <DatePicker
        selected={singleDate}
        onChange={date => setSingleDate(date)}
        placeholderText="Select a date"
        dateFormat="yyyy/MM/dd"
        isClearable
      />

      <h2>Date Range Picker</h2>
      <DatePicker
        selectsRange
        startDate={startDate}
        endDate={endDate}
        onChange={update => setDateRange(update)}
        isClearable
        placeholderText="Select a date range"
        dateFormat="yyyy/MM/dd"
      />

      <h2>Time Picker</h2>
      <DatePicker
        selected={time}
        onChange={date => setTime(date)}
        showTimeSelect
        showTimeSelectOnly
        timeIntervals={15}
        timeCaption="Time"
        dateFormat="h:mm aa"
        placeholderText="Select time"
        isClearable
      />

      <h2>Month Picker</h2>
      <DatePicker
        selected={month}
        onChange={date => setMonth(date)}
        dateFormat="MM/yyyy"
        showMonthYearPicker
        placeholderText="Select month"
        isClearable
      />

      <h2>Year Picker</h2>
      <DatePicker
        selected={year}
        onChange={date => setYear(date)}
        showYearPicker
        dateFormat="yyyy"
        placeholderText="Select year"
        isClearable
      />

      <button type="submit" style={{ marginTop: "20px" }}>Submit Dates</button>

      {status && <p>{status}</p>}
    </form>
  );
}
