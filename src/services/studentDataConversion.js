

export default function converter(studentData){
    let newStudentData={};
    newStudentData.name=studentData["Name:"];
    newStudentData.fullName=studentData["Full Name:"];
    newStudentData.department=studentData["Department:"];
    newStudentData.studentId = studentData["StudentId:"];
    newStudentData.semester = studentData["Semester:"];
    newStudentData.profileImage = studentData["ProfileImage:"] || "/public//logo/user.png";
    newStudentData.dateOfBirth = studentData["Date of Birth:"];
    newStudentData.maritalStatus = studentData["Marital Status:"];
    newStudentData.nationality = studentData["Nationality:"];
    newStudentData.bloodGroup = studentData["Blood Group:"];
    newStudentData.motherTongue = studentData["Mother Tongue:"];
    newStudentData.caste=studentData["Caste:"];
    newStudentData.gender=studentData["Gender:"];
    newStudentData.hostel = studentData["Hostel:"];
    newStudentData.roomNo = studentData["Room No:"];
    newStudentData.aadharNumber = studentData["Aadhar Number:"];
    newStudentData.passportNumber = studentData["Passport Number:"];
    newStudentData.panNumber = studentData["Pan Number:"];
    newStudentData.abcId = studentData["ABC ID:"];
    newStudentData.voterCard = studentData["Voter Card:"];
    newStudentData.fatherName = studentData["Father's Name:"];
    newStudentData.fatherProfession = studentData["Father's Profession:"];
    newStudentData.motherName = studentData["Mother's Name:"];
    newStudentData.motherProfession = studentData["Mother's Profession:"];
    newStudentData.parentsAddress = studentData["Parent's Address:"];
    newStudentData.parentsPhone = studentData["Parent's Phone:"];
    newStudentData.parentsEmail = studentData["Parent's Email:"];
    newStudentData.guardianName = studentData["Guardian's Name:"];
    newStudentData.relationshipWithGuardian = studentData["Relationship with Guardian:"];
    newStudentData.guardianAddress = studentData["Guardian's Address:"];
    newStudentData.guardianPhone = studentData["Guardian's Phone:"];
    newStudentData.guardianEmail = studentData["Guardian's Email:"];
    newStudentData.phoneNumber = studentData["Phone Number:"];
    newStudentData.alternatePhoneNumber = studentData["Alternate Phone Number:"];
    newStudentData.emailId = studentData["Email ID:"];
    newStudentData.alternateEmailId = studentData["Alternate Email ID:"];
    newStudentData.permanentAddress = studentData["Permanent Address:"];
    newStudentData.presentAddress = studentData["Present Address:"];
    return newStudentData;
}
