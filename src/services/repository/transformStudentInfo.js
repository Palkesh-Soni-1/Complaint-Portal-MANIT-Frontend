export default function infoConverter(studentData) {
  let newStudentData = {};
  newStudentData.name = studentData?.basicInfo?.userInfo?.cn;
  newStudentData.fullName = studentData?.basicInfo?.userInfo?.cn;
  newStudentData.department =
    studentData?.basicInfo?.userInfo?.departmentNumber;
  newStudentData.studentId = studentData?.advancedInfo?.roll_no;
  newStudentData.semester = `Semester ${
    studentData?.resultData?.data?.FINAL_CGPA?.length + 1
  }`;
  newStudentData.profileImage =
    studentData?.profileImage?.image || "/public//logo/user.png";
  newStudentData.dateOfBirth =
    studentData?.basicInfo?.userInfo?.studentInfo[0]?.dob;
  newStudentData.maritalStatus =
    studentData?.advancedInfo?.marital_status || "N/A";
  newStudentData.nationality = studentData?.advancedInfo?.perm_country || "N/A";
  newStudentData.bloodGroup = studentData?.advancedInfo?.blood_group || "N/A";
  newStudentData.motherTongue =
    studentData?.advancedInfo?.mother_tongue || "N/A";
  newStudentData.caste = studentData?.advancedInfo?.category || "N/A";
  newStudentData.gender = studentData?.advancedInfo?.gender || "N/A";
  newStudentData.aadharNumber = studentData?.advancedInfo?.aadhar_no || "N/A";
  newStudentData.passportNumber =
    studentData?.advancedInfo?.passport_no || "N/A";
  newStudentData.panNumber = "N/A";
  newStudentData.abcId = studentData?.advancedInfo?.abc_id || "N/A";
  newStudentData.voterCard = studentData?.advancedInfo?.voter_card_no || "N/A";
  newStudentData.fatherName = studentData?.advancedInfo?.father_name || "N/A";
  newStudentData.fatherProfession =
    studentData?.advancedInfo?.father_profession || "N/A";
  newStudentData.motherName = studentData?.advancedInfo?.mother_name || "N/A";
  newStudentData.motherProfession =
    studentData?.advancedInfo?.mother_profession || "N/A";
  newStudentData.parentsAddress =
    studentData?.advancedInfo?.guardian_address || "N/A";
  newStudentData.parentsPhone =
    studentData?.advancedInfo?.guardian_phone_no || "N/A";
  newStudentData.parentsEmail =
    studentData?.advancedInfo?.guardian_email || "N/A";
  newStudentData.guardianName =
    studentData?.advancedInfo?.guardian_name || "N/A";
  newStudentData.relationshipWithGuardian = "N/A";
  newStudentData.guardianAddress =
    studentData?.advancedInfo?.guardian_address || "N/A";
  newStudentData.guardianPhone =
    studentData?.advancedInfo?.guardian_phone_no || "N/A";
  newStudentData.guardianEmail =
    studentData?.advancedInfo?.guardian_email || "N/A";
  newStudentData.phoneNumber = studentData?.advancedInfo?.phone_number || "N/A";
  newStudentData.alternatePhoneNumber =
    studentData?.advancedInfo?.alternate_phone_no || "N/A";
  newStudentData.emailId = studentData?.advancedInfo?.email || "N/A";
  newStudentData.alternateEmailId =
    studentData?.advancedInfo?.alternate_email || "N/A";
  newStudentData.permanentAddress =
    studentData?.advancedInfo?.permanent_address || "N/A";
  newStudentData.presentAddress =
    studentData?.advancedInfo?.present_address || "N/A";
  newStudentData.hostel =
    studentData?.basicInfo?.userInfo?.studentInfo[0]?.hostel || "N/A";
  newStudentData.roomNo =
    studentData?.basicInfo?.userInfo?.studentInfo[0]?.hostel || "N/A";
  return newStudentData;
}
