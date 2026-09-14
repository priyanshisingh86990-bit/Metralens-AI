const { analyzeCrossPanel } = require("./crossPanelAnalyzer");

const mockPanels = {
  front: {
    success: true,
    analysis: {
      product: {
        name: "Fairness Cream For Women",
        brand: "Fairdew",
        category: "Skincare",
      },
      declarations: {
        manufacturer: {
          value: "Indo Herbal Products",
          confidence: 95,
        },
        netQuantity: {
          value: "50 gm",
          confidence: 95,
        },
        countryOfOrigin: {
          value: "India",
          confidence: 98,
        },
      },
    },
  },

  back: {
    success: true,
    analysis: {
      product: {
        name: "Fairness Cream For Women",
        brand: "Fairdew",
        category: "Skincare",
      },
      declarations: {
        manufacturer: {
          value: "Indo Herbal Products",
          confidence: 94,
        },
        netQuantity: {
          value: "50 gm",
          confidence: 94,
        },
        countryOfOrigin: {
          value: "India",
          confidence: 97,
        },
      },
    },
  },
};

const result = analyzeCrossPanel(mockPanels);

console.log("\n========== CROSS PANEL RESULT ==========\n");

console.log(JSON.stringify(result, null, 2));

console.log("\n=========================================\n");