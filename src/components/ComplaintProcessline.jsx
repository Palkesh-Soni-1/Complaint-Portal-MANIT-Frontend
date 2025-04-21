import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FileEdit, Share2, Settings, CheckCircle } from "lucide-react";


const ComplaintProcessline = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight;
      const element = document.getElementById("complaint-process");
      if (element) {
        const elementPosition = element.offsetTop;
        if (scrollPosition > elementPosition) {
          setIsVisible(true);
        }
      }
    };

    checkScreenSize();
    setIsVisible(true);

    window.addEventListener("resize", checkScreenSize);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("resize", checkScreenSize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const steps = [
    {
      id: 1,
      title: "Lodge Complaint",
      description: "Student submits a complaint through the portal.",
      status: "Status: Open",
      icon: <FileEdit/>,
      color: "bg-pink-600",
    },
    {
      id: 2,
      title: "Complaint Assigned",
      description: "Distributor assigns complaint to appropriate admin.",
      status: "Status: Assigned",
      icon: <Share2/>,
      color: "bg-blue-600",
    },
    {
      id: 3,
      title: "Processing",
      description: "Admin reviews and processes the complaint.",
      status: "Status: Processing",
      icon: <Settings/>, 
      color: "bg-yellow-600",
    },
    {
      id: 4,
      title: "Resolution",
      description: "Admin resolves the complaint and updates status.",
      status: "Status: Resolved",
      icon: <CheckCircle/>, 
      color: "bg-green-600",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.3,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.7,
        ease: "easeOut",
      },
    },
  };

  const lineVariants = {
    hidden: { width: "0%" },
    visible: {
      width: "100%",
      transition: {
        duration: 1.5,
        ease: "easeInOut",
      },
    },
  };

  const mobileLineVariants = {
    hidden: { height: "0%" },
    visible: {
      height: "100%",
      transition: {
        duration: 1.8,
        ease: "easeInOut",
      },
    },
  };

  return (
    <div id="complaint-process" className="w-full py-8 px-2 md:px-6">
      <motion.h2
        className="text-xl md:text-3xl font-bold text-center mb-8 text-white"
        initial={{ opacity: 0, y: -20 }}
        animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
        transition={{ duration: 0.6 }}
      >
        Complaint Resolution Process
      </motion.h2>

      {/* Desktop View with Horizontal Steps */}
      {!isMobile && (
        <motion.div
          className="relative max-w-5xl mx-auto mb-6"
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
        >
          <div className="flex justify-between items-start relative mb-16">
            {/* Connecting Line */}
            <div className="absolute top-10 left-0 right-0 h-1 bg-white">
              <motion.div
                className="h-full bg-gradient-to-r from-pink-500 via-blue-500 to-green-500"
                variants={lineVariants}
              />
            </div>

            {/* Steps */}
            {steps.map((step, index) => (
              <motion.div
                key={step.id}
                className="flex flex-col items-center z-10 w-52"
                variants={itemVariants}
              >
                <motion.div
                  className={`flex justify-center items-center w-20 h-20 rounded-full ${step.color} text-white mb-4 shadow-lg border-2 border-white`}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <span className="text-2xl">{step.icon}</span>
                </motion.div>
                <motion.div
                  className="text-center p-3 bg-white bg-opacity-20 rounded-lg backdrop-blur-sm w-full border border-gray-700 h-48 flex flex-col justify-between"
                  whileHover={{
                    y: -5,
                    boxShadow: "0 10px 15px rgba(0, 0, 0, 0.3)",
                  }}
                >
                  <div>
                    <h3 className="font-bold text-lg mb-2 text-white">
                      {step.title}
                    </h3>
                    <p className="text-gray-200 text-sm mb-2">
                      {step.description}
                    </p>
                  </div>
                  <div
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${step.color} bg-opacity-90 text-white`}
                  >
                    {step.status}
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Mobile View with Vertical Timeline */}
      {isMobile && (
        <motion.div
          className="relative pl-12 max-w-xs mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
        >
          {/* Timeline Line */}
          <div className="absolute left-2 top-4 bottom-0 w-1 bg-gray-50 bg-opacity-70 rounded-full">
            <motion.div
              className="w-full bg-gradient-to-b from-pink-500 via-blue-500 to-green-500 rounded-full"
              variants={mobileLineVariants}
            />
          </div>

          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              className="mb-12 relative"
              variants={itemVariants}
            >
              {/* Timeline Circle */}
              <motion.div
                className={`absolute -left-3 top-0 transform -translate-x-1/2 ${step.color} w-10 h-10 rounded-full flex items-center justify-center text-white shadow-lg border-2 border-white z-10`}
                whileHover={{ scale: 1.2 }}
              >
                <span className="text-lg">{step.icon}</span>
              </motion.div>

              {/* Content */}
              <motion.div
                className="bg-white bg-opacity-20 p-4 rounded-lg shadow-md border border-gray-700 backdrop-blur-sm"
                whileHover={{
                  x: 5,
                  boxShadow: "0 6px 12px rgba(0, 0, 0, 0.2)",
                }}
              >
                <h3 className="font-bold text-md text-white">{step.title}</h3>
                <p className="text-gray-200 text-sm my-2">{step.description}</p>
                <div
                  className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${step.color} bg-opacity-90 text-white`}
                >
                  {step.status}
                </div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default ComplaintProcessline;
