const { runInspectionAI } = require("./aiOrchestrator");

const images = {
  front: "test-images/front.jpg",
};

const runTest = async () => {
  const result = await runInspectionAI(images);

  console.log(
    "\n========== FINAL ORCHESTRATOR RESULT ==========\n"
  );

  console.log(JSON.stringify(result, null, 2));

  console.log(
    "\n================================================\n"
  );
};

runTest();