export function filterAdminData({
  admins,
  adminSearchTerm,
  adminFilterDepartment,
  setFilteredAdmins,
}) {
  let results = admins;

  if (adminSearchTerm) {
    const lowercasedSearch = adminSearchTerm.toLowerCase();
    results = results.filter(
      (admin) =>
        admin.fullName.toLowerCase().includes(lowercasedSearch) ||
        admin.username.toLowerCase().includes(lowercasedSearch) ||
        admin.email?.toLowerCase().includes(lowercasedSearch) ||
        admin.role?.toLowerCase().includes(lowercasedSearch)
    );
  }

  if (adminFilterDepartment !== "all") {
    results = results.filter(
      (admin) => admin.department === adminFilterDepartment
    );
  }

  // Only include active admins
  results = results.filter((admin) => admin.isActive);

  setFilteredAdmins(results);
}

export function filterIntermediateComplaints({
  complaints,
  statusFilter,
  typeFilter,
  dateFilter,
  searchTerm
}) {
  const filtered = Array.isArray(complaints)
    ? complaints.filter((complaint) => {
        const matchesStatusFilter =
          statusFilter === "all" || complaint.status === statusFilter;
        const matchesTypeFilter =
          typeFilter === "all" || complaint.complaintType === typeFilter;
        const matchesSearch =
          complaint.complaintNumber
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          complaint.description
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          complaint.studentName
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          complaint.studentId?.toLowerCase().includes(searchTerm.toLowerCase());

        let matchesDateFilter = true;
        if (dateFilter.startDate && dateFilter.endDate) {
          const startDate = new Date(dateFilter.startDate);
          const endDate = new Date(dateFilter.endDate);
          const complaintDate = new Date(complaint.dateReported);
          matchesDateFilter =
            complaintDate >= startDate && complaintDate <= endDate;
        }

        return (
          matchesStatusFilter &&
          matchesTypeFilter &&
          matchesSearch &&
          matchesDateFilter
        );
      })
    : [];
  return filtered;
}
