const reportWebVitals = async (onPerfEntry) => {
  if (typeof onPerfEntry !== "function") {
    return;
  }

  const { getCLS, getFID, getFCP, getLCP, getTTFB } = await import("web-vitals");

  getCLS(onPerfEntry);
  getFID(onPerfEntry);
  getFCP(onPerfEntry);
  getLCP(onPerfEntry);
  getTTFB(onPerfEntry);
};

export default reportWebVitals;
