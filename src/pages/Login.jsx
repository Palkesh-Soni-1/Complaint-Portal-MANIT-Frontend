import React from "react";
import { motion } from "framer-motion";
import LoginForm from "../components/LoginForm";
import ComplaintProcessline from "../components/ComplaintProcessline";

const Login = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-b from-blue-900 to-indigo-900 px-2 sm:px-8 py-6 w-full"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Alert Banner */}
      <motion.div
        className="w-full text-center bg-black bg-opacity-80 mb-8 p-3 rounded-lg text-white backdrop-blur-sm shadow-lg border border-gray-800"
        variants={itemVariants}
      >
        <p className="font-medium">
          Any Grievance sent by email will not be attended to / entertained.
          Please lodge your grievance on this portal.
        </p>
      </motion.div>

      {/* Main Content */}
      <motion.div
        className="flex justify-center items-center mb-12"
        variants={itemVariants}
      >
        <div className="bg-black bg-opacity-30 backdrop-blur-sm rounded-2xl overflow-hidden w-full max-w-4xl flex flex-col-reverse gap-5 sm:flex-row shadow-2xl border border-gray-700">
          {/* Login Form Section */}
          <div className="w-full md:w-1/2 md:p-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <LoginForm />
            </motion.div>
          </div>

          {/* Welcome Section */}
          <div className="w-full md:w-1/2 md:p-8 text-white flex flex-col justify-center bg-indigo-900 bg-opacity-40">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="text-center"
            >
              <div className="flex justify-center mb-4">
                <motion.img
                  src="/icons/login-rm.png"
                  alt="Login"
                  className="w-40 h-40 md:w-52 md:h-52 drop-shadow-2xl"
                  whileHover={{ rotate: 5, scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-3 text-center">
                Welcome Back
              </h2>
              <p className="text-lg opacity-90">
                Please login using your ID and password <br/> to access the complaint
                portal
              </p>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Process Timeline */}
      <motion.div
        variants={itemVariants}
        className="bg-black bg-opacity-30 backdrop-blur-sm rounded-2xl p-4 border border-gray-700 shadow-xl"
      >
        <ComplaintProcessline />
      </motion.div>
    </motion.div>
  );
};

export default Login;
