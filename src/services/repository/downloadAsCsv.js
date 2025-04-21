const downloadAsCSV = ({filteredComplaints}) => {
  const headers = ["Complaint No.", "Date", "Type", "Status", "Description"];
  const csvContent = [
    headers.join(","),
    ...filteredComplaints.map((complaint) =>
      [
        complaint.complaintNumber,
        complaint.dateReported,
        complaint.complaintType,
        complaint.status,
        complaint.description
      ].join(",")
    ),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const navLink = document.createElement("a");
  const url = URL.createObjectURL(blob);
  navLink.setAttribute("href", url);
  navLink.setAttribute(
    "download",
    `complaints_${new Date().toISOString().slice(0, 10)}.csv`
  );
  navLink.style.visibility = "hidden";
  document.body.appendChild(navLink);
  navLink.click();
  document.body.removeChild(navLink);
};
export default downloadAsCSV;