import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faUserTie,
  faCog,
  faCheck,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";

export default function ComplaintProcessVisualization() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  const steps = [
    {
      id: 1,
      title: "Lodge Complaint",
      description: "Student submits a complaint through the portal.",
      status: "Status: Open",
      icon: faEdit,
      color: "bg-blue-500",
    },
    {
      id: 2,
      title: "Complaint Assigned",
      description: "Distributor assigns complaint to appropriate admin.",
      status: "Status: Assigned",
      icon: faUserTie,
      color: "bg-yellow-500",
    },
    {
      id: 3,
      title: "Processing",
      description: "Admin reviews and processes the complaint.",
      status: "Status: Processing",
      icon: faCog,
      color: "bg-orange-500",
    },
    {
      id: 4,
      title: "Resolution",
      description: "Admin resolves the complaint and updates status.",
      status: "Status: Resolved",
      icon: faCheck,
      color: "bg-green-500",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <div className="w-full py-8 px-4 rounded-lg">
      <h2 className="text-2xl max-sm:text-lg font-bold text-center mb-5 mt-8 text-white">
        Complaint Process Flow
      </h2>

      {/* Desktop View with Horizontal Steps */}
      {!isMobile && (
        <motion.div
          className="flex justify-between items-center max-w-[1200px] mx-auto relative"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              <motion.div
                className="flex flex-col items-center z-10 m-5"
                variants={itemVariants}
              >
                <div
                  className={`flex justify-center items-center w-16 h-16 rounded-full ${step.color} text-white mb-4 mx-auto shadow-lg`}
                >
                  <FontAwesomeIcon icon={step.icon} size="lg" />
                </div>
                <div className="text-center max-w-xs">
                  <h3 className="font-bold text-lg mb-1 text-white">
                    {step.title}
                  </h3>
                  <p className="text-gray-100 text-sm mb-2">
                    {step.description}
                  </p>
                  <p className="text-white text-xs font-semibold">
                    {step.status}
                  </p>
                </div>
              </motion.div>

              {/* Arrows between steps */}
              {index < steps.length - 1 && (
                <motion.div
                  className="flex-grow flex justify-center items-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: (index + 1) * 0.3 }}
                >
                  <FontAwesomeIcon
                    icon={faArrowRight}
                    size="lg"
                    className="text-white"
                  />
                </motion.div>
              )}
            </React.Fragment>
          ))}
        </motion.div>
      )}

      {/* Mobile View with Vertical Timeline */}
      {isMobile && (
        <motion.div
          className="relative pl-10"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Timeline Line */}
          <div className="absolute left-4 top-0 bottom-0 w-1 bg-white bg-opacity-50"></div>

          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              className="mb-12 relative"
              variants={itemVariants}
            >
              {/* Timeline Circle */}
              <div
                className={`absolute left-0 top-0 transform -translate-x-1/2 ${step.color} w-8 h-8 rounded-full flex items-center justify-center text-white shadow-md`}
              >
                <FontAwesomeIcon icon={step.icon} size="sm" />
              </div>

              {/* Content */}
              <div className="bg-white bg-opacity-20 p-4 rounded shadow-md ml-4">
                <h3 className="font-bold text-md text-white">{step.title}</h3>
                <p className="text-gray-100 text-sm my-2">{step.description}</p>
                <p className="text-white text-xs font-semibold">
                  {step.status}
                </p>
              </div>

              {/* Arrow to next step */}
              {index < steps.length - 1 && (
                <div className="absolute left-4 bottom-0 transform translate-y-1/2 -translate-x-1/2 text-white">
                  <FontAwesomeIcon
                    icon={faArrowRight}
                    size="sm"
                    rotation={90}
                  />
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
