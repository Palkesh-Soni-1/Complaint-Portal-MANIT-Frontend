import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  Book,
  Hash,
  Award,
  CircleUserRound,
  User,
  Users,
  Globe,
  Droplet,
  Languages,
  UserRound,
  Home,
  BedDouble,
  CreditCard,
  CreditCard as PanIcon,
  FileDigit,
  Vote,
  Building,
  Heart,
  ShieldAlert,
  AtSign,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function Profile() {
  const [activeTab, setActiveTab] = useState("personal");

  const {auth} = useAuth();
  const studentData=auth.userData;
  // const studentData = {
  //   // Basic Info
  //   name: "Alex Johnson",
  //   fullName: "Alexander David Johnson",
  //   department: "Computer Science",
  //   studentId: "STU2023456",
  //   semester: "Spring 2025",
  //   year: "3rd Year",
  //   dateOfBirth: "15 June 2000",
  //   maritalStatus: "Single",
  //   nationality: "American",
  //   bloodGroup: "O+",
  //   motherTongue: "English",
  //   caste: "N/A",
  //   gender: "Male",

  //   // Residence
  //   hostel: "West Wing Dormitory",
  //   roomNo: "203-B",

  //   // Documents
  //   aadharNumber: "XXXX-XXXX-1234",
  //   passportNumber: "A12345678",
  //   panNumber: "ABCDE1234F",
  //   abcId: "ABC123456789",
  //   voterCard: "VTR987654321",

  //   // Family Details
  //   fatherName: "David Johnson",
  //   fatherProfession: "Software Engineer",
  //   motherName: "Sarah Williams",
  //   motherProfession: "University Professor",
  //   parentsAddress: "456 Maple Avenue, Springfield, IL",
  //   parentsPhone: "+1 (555) 987-6543",
  //   parentsEmail: "david.johnson@email.com",
  //   guardianName: "Emma Johnson",
  //   relationshipWithGuardian: "Aunt",
  //   guardianAddress: "789 Oak Street, Springfield, IL",
  //   guardianPhone: "+1 (555) 456-7890",
  //   guardianEmail: "emma.johnson@email.com",

  //   // Contact Info
  //   phoneNumber: "+1 (555) 123-4567",
  //   alternatePhoneNumber: "+1 (555) 234-5678",
  //   emailId: "alex.johnson@university.edu",
  //   alternateEmailId: "alexj2000@email.com",

  //   // Addresses
  //   permanentAddress: "123 Pine Street, Springfield, IL",
  //   presentAddress: "123 Campus Drive, University Heights",

  //   // Academic Info
  //   enrollmentDate: "September 2022",
  //   gpa: "3.8/4.0",
  //   academicAdvisor: "Dr. Robert Chen",
  // };

  // Wave animation
  const waveVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const wavePath = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        duration: 2,
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "reverse",
      },
    },
  };

  return (
    <div className="max-w-4xl my-6 rounded-lg mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-blue-300 min-h-screen">
      {/* Header with wave animation */}
      <div className="overflow-hidden bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-xl mb-8">

        <div className="p-8 flex flex-col md:flex-row items-center z-10">
          <motion.div
            className="mb-6 md:mb-0 md:mr-8"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-40 h-40 rounded-full bg-white/20 backdrop-blur-sm p-1">
              <div className="w-full h-full bg-gradient-to-br from-white/80 to-white/40 rounded-full p-2">
                <div className="w-full h-full rounded-full overflow-hidden bg-white">
                  <img
                    src={`${studentData.profileImage}`}
                    alt="Profile"
                    className="w-full h-full object-fill"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="text-center md:text-left text-white"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-3xl font-bold">{studentData.name}</h2>
            <p className="text-lg text-white/90 mt-1">
              {studentData.department}
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mt-3">
              <span className="bg-white/20 backdrop-blur-sm text-white text-sm px-3 py-1 rounded-full font-medium flex items-center">
                <Hash className="w-4 h-4 mr-1" />
                {studentData.studentId}
              </span>
              <span className="bg-white/20 backdrop-blur-sm text-white text-sm px-3 py-1 rounded-full font-medium flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                {studentData.semester}
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl shadow-md mb-8 overflow-hidden">
        <div className="flex overflow-x-auto scrollbar-hide">
          <button
            onClick={() => setActiveTab("personal")}
            className={`flex-1 py-4 px-4 text-center font-medium transition-all ${
              activeTab === "personal"
                ? "text-indigo-600 border-b-2 border-indigo-500"
                : "text-gray-500 hover:text-indigo-500"
            }`}
          >
            <div className="flex items-center justify-center">
              <User className="w-5 h-5 mr-2" />
              <span>Personal</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab("academic")}
            className={`flex-1 py-4 px-4 text-center font-medium transition-all ${
              activeTab === "academic"
                ? "text-indigo-600 border-b-2 border-indigo-500"
                : "text-gray-500 hover:text-indigo-500"
            }`}
          >
            <div className="flex items-center justify-center">
              <Book className="w-5 h-5 mr-2" />
              <span>Academic</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab("family")}
            className={`flex-1 py-4 px-4 text-center font-medium transition-all ${
              activeTab === "family"
                ? "text-indigo-600 border-b-2 border-indigo-500"
                : "text-gray-500 hover:text-indigo-500"
            }`}
          >
            <div className="flex items-center justify-center">
              <Users className="w-5 h-5 mr-2" />
              <span>Family</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab("contact")}
            className={`flex-1 py-4 px-4 text-center font-medium transition-all ${
              activeTab === "contact"
                ? "text-indigo-600 border-b-2 border-indigo-500"
                : "text-gray-500 hover:text-indigo-500"
            }`}
          >
            <div className="flex items-center justify-center">
              <Phone className="w-5 h-5 mr-2" />
              <span>Contact</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab("documents")}
            className={`flex-1 py-4 px-4 text-center font-medium transition-all ${
              activeTab === "documents"
                ? "text-indigo-600 border-b-2 border-indigo-500"
                : "text-gray-500 hover:text-indigo-500"
            }`}
          >
            <div className="flex items-center justify-center">
              <FileDigit className="w-5 h-5 mr-2" />
              <span>Documents</span>
            </div>
          </button>
        </div>
      </div>

      {/* Content */}
      <motion.div
        className="bg-white rounded-xl shadow-md overflow-hidden p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        key={activeTab}
      >
        {/* Personal Information Tab */}
        {activeTab === "personal" && (
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-6 border-b border-gray-200 pb-2">
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="flex items-start">
                <User className="w-5 h-5 text-indigo-500 mt-1 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Full Name</p>
                  <p className="font-medium text-gray-800">
                    {studentData.fullName}
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <Calendar className="w-5 h-5 text-indigo-500 mt-1 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Date of Birth</p>
                  <p className="font-medium text-gray-800">
                    {studentData.dateOfBirth}
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <Heart className="w-5 h-5 text-indigo-500 mt-1 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Marital Status</p>
                  <p className="font-medium text-gray-800">
                    {studentData.maritalStatus}
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <Globe className="w-5 h-5 text-indigo-500 mt-1 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Nationality</p>
                  <p className="font-medium text-gray-800">
                    {studentData.nationality}
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <Droplet className="w-5 h-5 text-indigo-500 mt-1 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Blood Group</p>
                  <p className="font-medium text-gray-800">
                    {studentData.bloodGroup}
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <Languages className="w-5 h-5 text-indigo-500 mt-1 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Mother Tongue</p>
                  <p className="font-medium text-gray-800">
                    {studentData.motherTongue}
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <Users className="w-5 h-5 text-indigo-500 mt-1 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Caste</p>
                  <p className="font-medium text-gray-800">
                    {studentData.caste}
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <UserRound className="w-5 h-5 text-indigo-500 mt-1 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Gender</p>
                  <p className="font-medium text-gray-800">
                    {studentData.gender}
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <Home className="w-5 h-5 text-indigo-500 mt-1 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Hostel</p>
                  <p className="font-medium text-gray-800">
                    {studentData.hostel}
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <BedDouble className="w-5 h-5 text-indigo-500 mt-1 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Room No</p>
                  <p className="font-medium text-gray-800">
                    {studentData.roomNo}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Academic Information Tab */}
        {activeTab === "academic" && (
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-6 border-b border-gray-200 pb-2">
              Academic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start">
                <Book className="w-5 h-5 text-indigo-500 mt-1 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Department</p>
                  <p className="font-medium text-gray-800">
                    {studentData.department}
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <Hash className="w-5 h-5 text-indigo-500 mt-1 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Student ID</p>
                  <p className="font-medium text-gray-800">
                    {studentData.studentId}
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <Calendar className="w-5 h-5 text-indigo-500 mt-1 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Current Semester</p>
                  <p className="font-medium text-gray-800">
                    {studentData.semester}
                  </p>
                </div>
              </div>
              {/* <div className="flex items-start">
                <Calendar className="w-5 h-5 text-indigo-500 mt-1 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Enrollment Date</p>
                  <p className="font-medium text-gray-800">
                    {studentData.enrollmentDate}
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <Award className="w-5 h-5 text-indigo-500 mt-1 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">GPA</p>
                  <p className="font-medium text-gray-800">{studentData.gpa}</p>
                </div>
              </div>
              <div className="flex items-start">
                <User className="w-5 h-5 text-indigo-500 mt-1 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Academic Advisor</p>
                  <p className="font-medium text-gray-800">
                    {studentData.academicAdvisor}
                  </p>
                </div>
              </div> */}
            </div>
          </div>
        )}

        {/* Family Information Tab */}
        {activeTab === "family" && (
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-6 border-b border-gray-200 pb-2">
              Family Information
            </h3>
            <div className="space-y-8">
              <div>
                <h4 className="text-md font-medium text-indigo-600 mb-4">
                  Parents
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-start">
                    <User className="w-5 h-5 text-indigo-500 mt-1 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Father's Name</p>
                      <p className="font-medium text-gray-800">
                        {studentData.fatherName}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Building className="w-5 h-5 text-indigo-500 mt-1 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">
                        Father's Profession
                      </p>
                      <p className="font-medium text-gray-800">
                        {studentData.fatherProfession}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <User className="w-5 h-5 text-indigo-500 mt-1 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Mother's Name</p>
                      <p className="font-medium text-gray-800">
                        {studentData.motherName}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Building className="w-5 h-5 text-indigo-500 mt-1 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">
                        Mother's Profession
                      </p>
                      <p className="font-medium text-gray-800">
                        {studentData.motherProfession}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <MapPin className="w-5 h-5 text-indigo-500 mt-1 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Parents' Address</p>
                      <p className="font-medium text-gray-800">
                        {studentData.parentsAddress}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Phone className="w-5 h-5 text-indigo-500 mt-1 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Parents' Phone</p>
                      <p className="font-medium text-gray-800">
                        {studentData.parentsPhone}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Mail className="w-5 h-5 text-indigo-500 mt-1 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Parents' Email</p>
                      <p className="font-medium text-gray-800">
                        {studentData.parentsEmail}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-md font-medium text-indigo-600 mb-4">
                  Guardian
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-start">
                    <User className="w-5 h-5 text-indigo-500 mt-1 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Guardian's Name</p>
                      <p className="font-medium text-gray-800">
                        {studentData.guardianName}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Users className="w-5 h-5 text-indigo-500 mt-1 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">
                        Relationship with Guardian
                      </p>
                      <p className="font-medium text-gray-800">
                        {studentData.relationshipWithGuardian}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <MapPin className="w-5 h-5 text-indigo-500 mt-1 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">
                        Guardian's Address
                      </p>
                      <p className="font-medium text-gray-800">
                        {studentData.guardianAddress}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Phone className="w-5 h-5 text-indigo-500 mt-1 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Guardian's Phone</p>
                      <p className="font-medium text-gray-800">
                        {studentData.guardianPhone}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Mail className="w-5 h-5 text-indigo-500 mt-1 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Guardian's Email</p>
                      <p className="font-medium text-gray-800">
                        {studentData.guardianEmail}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Contact Information Tab */}
        {activeTab === "contact" && (
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-6 border-b border-gray-200 pb-2">
              Contact Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start">
                <Phone className="w-5 h-5 text-indigo-500 mt-1 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Phone Number</p>
                  <p className="font-medium text-gray-800">
                    {studentData.phoneNumber}
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <Phone className="w-5 h-5 text-indigo-500 mt-1 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">
                    Alternate Phone Number
                  </p>
                  <p className="font-medium text-gray-800">
                    {studentData.alternatePhoneNumber}
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <Mail className="w-5 h-5 text-indigo-500 mt-1 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Email ID</p>
                  <p className="font-medium text-gray-800">
                    {studentData.emailId}
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <AtSign className="w-5 h-5 text-indigo-500 mt-1 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Alternate Email ID</p>
                  <p className="font-medium text-gray-800">
                    {studentData.alternateEmailId}
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <MapPin className="w-5 h-5 text-indigo-500 mt-1 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Permanent Address</p>
                  <p className="font-medium text-gray-800">
                    {studentData.permanentAddress}
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <MapPin className="w-5 h-5 text-indigo-500 mt-1 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Present Address</p>
                  <p className="font-medium text-gray-800">
                    {studentData.presentAddress}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Documents Tab */}
        {activeTab === "documents" && (
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-6 border-b border-gray-200 pb-2">
              Documents & Identification
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start">
                <CreditCard className="w-5 h-5 text-indigo-500 mt-1 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Aadhar Number</p>
                  <p className="font-medium text-gray-800">
                    {studentData.aadharNumber}
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <Book className="w-5 h-5 text-indigo-500 mt-1 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Passport Number</p>
                  <p className="font-medium text-gray-800">
                    {studentData.passportNumber}
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <PanIcon className="w-5 h-5 text-indigo-500 mt-1 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">PAN Number</p>
                  <p className="font-medium text-gray-800">
                    {studentData.panNumber}
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <FileDigit className="w-5 h-5 text-indigo-500 mt-1 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">ABC ID</p>
                  <p className="font-medium text-gray-800">
                    {studentData.abcId}
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <Vote className="w-5 h-5 text-indigo-500 mt-1 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Voter Card</p>
                  <p className="font-medium text-gray-800">
                    {studentData.voterCard}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
