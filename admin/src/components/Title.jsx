import React from "react";

const Title = ({ title1, title2, titleStyles }) => {
  return (
    <h2 className={`font-bold text-2xl mb-4 ${titleStyles}`}>
      {title1} <span className="text-primary">{title2}</span>
    </h2>
  );
};

export default Title;