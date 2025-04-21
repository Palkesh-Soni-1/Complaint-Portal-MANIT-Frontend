export function filterSuperadminAdmin({
  admins,
  searchTerm,
  filterStatus,
  filterDepartment,
  setFilteredAdmins,
}) {
  let results = admins;
  if (searchTerm) {
    const lowercasedSearch = searchTerm.toLowerCase();
    results = results.filter(
      (admin) =>
        admin.fullName.toLowerCase().includes(lowercasedSearch) ||
        admin.username.toLowerCase().includes(lowercasedSearch) ||
        admin.email.toLowerCase().includes(lowercasedSearch) ||
        admin.role.toLowerCase().includes(lowercasedSearch)
    );
  }

  if (filterStatus !== "all") {
    const isActive = filterStatus === "active";
    results = results.filter((admin) => admin.isActive === isActive);
  }

  if (filterDepartment !== "all") {
    results = results.filter((admin) => admin.department === filterDepartment);
  }

  setFilteredAdmins(results);
}
