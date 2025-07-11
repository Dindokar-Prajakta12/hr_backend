const Candidate = require("../models/Candidate");
const ExcelJS = require("exceljs");
const fs = require("fs");

// 📤 Upload and Save Candidates from Excel
exports.uploadCandidates = async (req, res) => {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(req.file.path);
  const worksheet = workbook.worksheets[0];

  const rows = [];
  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return;
    rows.push({
      name: row.getCell(1).value,
      phone: row.getCell(2).value,
      email: row.getCell(3).value,
      experience: row.getCell(4).value,
      skills: row.getCell(5).value,
      location: row.getCell(6).value,
    });
  });

  await Candidate.insertMany(rows);
  fs.unlinkSync(req.file.path);
  res.send({ message: "Upload successful" });
};

// 📋 Get All Candidates
exports.getCandidates = async (req, res) => {
  const candidates = await Candidate.find().sort({ createdAt: -1 });
  res.json(candidates);
};

// ✅ Update Candidate (status and notes supported)
exports.updateCandidate = async (req, res) => {
  const { id } = req.params;
  const { status, notes } = req.body;

  const updateFields = {};
  if (status) updateFields.status = status;
  if (notes !== undefined) updateFields.notes = notes;

  await Candidate.findByIdAndUpdate(id, updateFields);
  res.send({ message: "Candidate updated" });
};

// 📊 Summary Report
// exports.getSummary = async (req, res) => {
//   const total = await Candidate.countDocuments();
//   const connected = await Candidate.countDocuments({ status: { $ne: "Not Connected" } });
//   const notConnected = await Candidate.countDocuments({ status: "Not Connected" });
//   const shortlisted = await Candidate.countDocuments({ status: "Shortlisted" });
//   const rejected = await Candidate.countDocuments({ status: "Rejected" });

//   res.json({ total, connected, notConnected, shortlisted, rejected });
// };

exports.getSummary = async (req, res) => {
  // Get today's start and end time
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  // Filter for candidates created today
  const dateFilter = { createdAt: { $gte: startOfDay, $lte: endOfDay } };

  const total = await Candidate.countDocuments(dateFilter);
  const connected = await Candidate.countDocuments({ ...dateFilter, status: { $ne: "Not Connected" } });
  const notConnected = await Candidate.countDocuments({ ...dateFilter, status: "Not Connected" });
  const shortlisted = await Candidate.countDocuments({ ...dateFilter, status: "Shortlisted" });
  const rejected = await Candidate.countDocuments({ ...dateFilter, status: "Rejected" });

  res.json({ total, connected, notConnected, shortlisted, rejected });
};
// 🗑️ DELETE a Candidate
exports.deleteCandidate = async (req, res) => {
  const { id } = req.params;
  await Candidate.findByIdAndDelete(id);
  res.send({ message: "Candidate deleted" });
};


// 📤 Export Filtered Candidates to Excel
exports.exportCandidates = async (req, res) => {
  const { status } = req.query; // Optional filter by status
  const filter = status ? { status } : {};

  const candidates = await Candidate.find(filter);

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Candidates");

  worksheet.columns = [
    { header: "Name", key: "name", width: 20 },
    { header: "Phone", key: "phone", width: 15 },
    { header: "Email", key: "email", width: 25 },
    { header: "Experience", key: "experience", width: 12 },
    { header: "Skills", key: "skills", width: 30 },
    { header: "Location", key: "location", width: 20 },
    { header: "Status", key: "status", width: 20 },
    { header: "Notes", key: "notes", width: 30 },
  ];

  candidates.forEach((c) => {
    worksheet.addRow(c);
  });

  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader(
    "Content-Disposition",
    "attachment; filename=candidates.xlsx"
  );

  await workbook.xlsx.write(res);
  res.end();
};

exports.bulkUpdateStatus = async (req, res) => {
  const { ids, status } = req.body;
  if (!ids || !status) return res.status(400).json({ message: "Missing ids or status" });

  try {
    await Candidate.updateMany(
      { _id: { $in: ids } },
      { $set: { status } }
    );
    res.send({ message: "Bulk update successful" });
  } catch (error) {
    console.error("Bulk update failed:", error);
    res.status(500).json({ message: "Server error during bulk update" });
  }
};

