const analyzeCrossPanel = (panelResults) => {
  const conflicts = [];
  const fieldsToCompare = [
    "name",
    "brand",
    "manufacturer",
    "netQuantity",
    "countryOfOrigin",
  ];

  const availablePanels = Object.entries(panelResults).filter(
    ([, result]) => result?.success && result?.analysis
  );

  if (availablePanels.length < 2) {
    return {
      success: true,
      status: "INSUFFICIENT_PANELS",
      conflicts: [],
      message: "At least two analyzed package panels are required.",
    };
  }

  fieldsToCompare.forEach((field) => {
    const values = [];

    availablePanels.forEach(([side, result]) => {
      let value = "";

      if (field === "name" || field === "brand") {
        value = result.analysis.product?.[field] || "";
      } else {
        value = result.analysis.declarations?.[field]?.value || "";
      }

      if (value.trim()) {
        values.push({
          side,
          value: value.trim(),
        });
      }
    });

    if (values.length < 2) {
      return;
    }

    const normalizedValues = values.map((item) =>
      item.value.toLowerCase().replace(/\s+/g, " ").trim()
    );

    const firstValue = normalizedValues[0];

    const hasConflict = normalizedValues.some(
      (value) => value !== firstValue
    );

    if (hasConflict) {
      conflicts.push({
        field,
        status: "CONFLICT",
        observations: values,
      });
    }
  });

  return {
    success: true,
    status: conflicts.length > 0 ? "CONFLICTS_FOUND" : "CONSISTENT",
    conflicts,
  };
};

module.exports = {
  analyzeCrossPanel,
};