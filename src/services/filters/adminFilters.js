// Filteration ---------------------------------------------
export function filterComplaintList({
    statusFilter,
    complaints,
    typeFilter,
    dateFilter,
    searchTerm
}){
    const filteredComplaints = complaints.filter((complaint) => {
        const matchesStatusFilter =
          statusFilter === "all" || complaint.status === statusFilter;
        const matchesTypeFilter =
          typeFilter === "all" || complaint.complaintType === typeFilter;
        const matchesSearch =
          complaint.complaintNumber
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          complaint.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          complaint.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
      });
      return filteredComplaints;
}