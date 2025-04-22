import React, { useState } from "react";
import { useData } from "../../context/DataContext";
import Loader from "../Loader";
import { useAuth } from "../../context/AuthContext";
import { postComplaint } from "../../services/api/complaint";
const ComplaintForm = () => {
  const { studentId } = useAuth();
  const { info } = useData();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    studentId: info?.studentId,
    studentName: info?.fullName,
    roomNumber: "",
    hostelNumber: "",
    complaintType: "",
    complaintSubType: "",
    description: "",
    dateReported: new Date().toISOString().split("T")[0],
    attachments: [],
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.studentId) newErrors.studentId = "Student ID is required";
    if (!formData.studentName)
      newErrors.studentName = "Student Name is required";
    if (!formData.roomNumber) newErrors.roomNumber = "Room Number is required";
    if (!formData.hostelNumber)
      newErrors.hostelNumber = "Hostel Number is required";
    if (!formData.complaintType)
      newErrors.complaintType = "Complaint Type is required";
    if (!formData.complaintSubType)
      newErrors.complaintSubType = "Complaint SubType is required";
    if (!formData.description)
      newErrors.description = "Description is required";
    if (!formData.dateReported)
      newErrors.dateReported = "Date Reported is required";
    return newErrors;
  };

  const complaintTypes = [
    "Academic",
    "Hostel",
    "Scholarship",
    "Medical",
    "Department",
    "Sports",
    "Ragging",
  ];

  const complaintSubTypes = {
    Academic: [
      "Course Registration",
      "Grading Issues",
      "Faculty Complaint",
      "Attendance",
      "Examination",
      "Others",
    ],
    Hostel: [
      "Maintenance",
      "Room Allocation",
      "Cleanliness",
      "Facility Issues",
      "Roommate Issues",
      "Others",
    ],
    Scholarship: [
      "Disbursement Delay",
      "Amount Discrepancy",
      "Eligibility Issues",
      "Documentation",
      "Others",
    ],
    Medical: [
      "Health Center Services",
      "Emergency Response",
      "Medical Leave",
      "Insurance Issues",
      "Others",
    ],
    Department: [
      "Lab Equipment",
      "Classroom Issues",
      "Department Staff",
      "Resources",
      "Others",
    ],
    Sports: [
      "Equipment",
      "Facility Access",
      "Team Selection",
      "Coaching Issues",
      "Events",
      "Others",
    ],
    Ragging: [
      "Physical Harassment",
      "Verbal Abuse",
      "Forced Activity",
      "Bullying",
      "Others",
    ],
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "complaintType") {
      setFormData({
        ...formData,
        [name]: value,
        complaintSubType: "",
      });
      if (errors.complaintSubType) {
        setErrors({
          ...errors,
          complaintSubType: null,
        });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length === 0) {
      postComplaint({
        studentId,
        formData,
        setIsLoading,
      });
    } else {
      setErrors(validationErrors);
    }
  };

  return (
    <div className="p-8 bg-transparent max-w-[1200px] mx-auto">
      {isLoading ? (
        <Loader />
      ) : (
        <div>
          <div className="gap-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 ">
            <div className="mb-4">
              <label htmlFor="studentId" className="block text-white">
                Student ID
              </label>
              <input
                type="text"
                id="studentId"
                name="studentId"
                value={formData.studentId}
                onChange={handleChange}
                disabled={true}
                className="w-full cursor-not-allowed px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.studentId && (
                <p className="text-red-300">{errors.studentId}</p>
              )}
            </div>

            <div className="mb-4">
              <label htmlFor="studentName" className="block text-white">
                Student Name
              </label>
              <input
                type="text"
                id="studentName"
                name="studentName"
                value={formData.studentName}
                onChange={handleChange}
                disabled={true}
                className="w-full cursor-not-allowed px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.studentName && (
                <p className="text-red-300">{errors.studentName}</p>
              )}
            </div>

            <div className="mb-4">
              <label htmlFor="hostelNumber" className="block text-white">
                Hostel Number
              </label>
              <select
                id="hostelNumber"
                name="hostelNumber"
                value={formData.hostelNumber}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Hostel</option>
                {[...Array(12)].map((_, index) => (
                  <option key={index} value={`H${index + 1}`}>
                    H{index + 1}
                  </option>
                ))}
              </select>
              {errors.hostelNumber && (
                <p className="text-red-300">{errors.hostelNumber}</p>
              )}
            </div>

            <div className="mb-4">
              <label htmlFor="roomNumber" className="block text-white">
                Room Number
              </label>
              <input
                type="text"
                id="roomNumber"
                name="roomNumber"
                value={formData.roomNumber}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.roomNumber && (
                <p className="text-red-300">{errors.roomNumber}</p>
              )}
            </div>

            <div className="mb-4">
              <label htmlFor="complaintType" className="block text-white">
                Complaint Type
              </label>
              <select
                id="complaintType"
                name="complaintType"
                value={formData.complaintType}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a type</option>
                {complaintTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              {errors.complaintType && (
                <p className="text-red-300">{errors.complaintType}</p>
              )}
            </div>

            <div className="mb-4">
              <label htmlFor="complaintSubType" className="block text-white">
                Complaint Sub-Type
              </label>
              <select
                id="complaintSubType"
                name="complaintSubType"
                value={formData.complaintSubType}
                onChange={handleChange}
                disabled={!formData.complaintType}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-200 disabled:cursor-not-allowed"
              >
                <option value="">
                  {formData.complaintType
                    ? "Select a sub-type"
                    : "Select complaint type first"}
                </option>
                {formData.complaintType &&
                  complaintSubTypes[formData.complaintType]?.map((subType) => (
                    <option key={subType} value={subType}>
                      {subType}
                    </option>
                  ))}
              </select>
              {errors.complaintSubType && (
                <p className="text-red-300">{errors.complaintSubType}</p>
              )}
            </div>

            <div className="mb-4">
              <label htmlFor="description" className="block text-white">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                rows={1}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.description && (
                <p className="text-red-300">{errors.description}</p>
              )}
            </div>

            <div className="mb-4">
              <label htmlFor="dateReported" className="block text-white">
                Date Reported
              </label>
              <input
                type="date"
                id="dateReported"
                name="dateReported"
                value={formData.dateReported}
                disabled={true}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.dateReported && (
                <p className="text-red-300">{errors.dateReported}</p>
              )}
            </div>

            <div className="mb-4">
              <label htmlFor="attachments" className="block text-white">
                Attachments
              </label>
              <input
                type="file"
                id="attachments"
                name="attachments"
                multiple
                onChange={(e) =>
                  setFormData({ ...formData, attachments: e.target.files })
                }
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
              />
            </div>
          </div>
          <div className="w-full flex justify-center items-center">
            <button
              onClick={handleSubmit}
              className="max-w-md w-full bg-blue-500 text-white py-2 mt-2 px-4 rounded-sm border-dotted border-white border-2 hover:bg-blue-600 transition"
            >
              Submit Complaint
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComplaintForm;
