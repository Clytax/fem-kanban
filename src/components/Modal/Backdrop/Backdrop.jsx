import React from "react";
import "./backdrop.scss";
import { motion } from "framer-motion";

const Backdrop = ({ children, onClick, mobile }) => {
  return (
    <motion.div
      className={`backdrop ${mobile ? "mobile-backdrop" : ""}`}
      onMouseDown={onClick}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {children}
    </motion.div>
  );
};

export default Backdrop;
