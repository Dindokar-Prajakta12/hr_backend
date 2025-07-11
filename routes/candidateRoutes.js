

// const express = require("express");
// const router = express.Router();
// const multer = require("multer");
// const { uploadCandidates, getCandidates, updateCandidate, getSummary,exportCandidates ,bulkUpdateStatus } = require("../controllers/candidateController");

// const upload = multer({ dest: "uploads/" });

// // Update these routes to match frontend expectations:
// router.post("/candidates/upload", upload.single("file"), uploadCandidates);
// router.get("/candidates", getCandidates);
// router.get("/candidates/summary", getSummary);
// router.put("/candidates/:id", updateCandidate);
// router.get("/candidates/export/excel", exportCandidates);
// router.put("/candidates/bulk-update", bulkUpdateStatus);
// router.put("/candidates/:id", updateCandidate);


// module.exports = router;




const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
  uploadCandidates,
  getCandidates,
  updateCandidate,
  getSummary,
  exportCandidates,
  bulkUpdateStatus,
} = require("../controllers/candidateController");

const upload = multer({ dest: "uploads/" });

// ✅ Specific routes first
router.post("/candidates/upload", upload.single("file"), uploadCandidates);
router.get("/candidates", getCandidates);
router.get("/candidates/summary", getSummary);
router.get("/candidates/export/excel", exportCandidates);
router.put("/candidates/bulk-update", bulkUpdateStatus); // 👈 Keep this above :id

// ✅ Dynamic route last
router.put("/candidates/:id", updateCandidate);

module.exports = router;
