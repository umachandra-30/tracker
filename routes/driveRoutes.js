const express = require('express');
const router = express.Router();
const Drive = require('../models/Drive');

// GET /api/drives - Get all placement drives sorted by newest creation date
router.get('/', async (req, res) => {
  try {
    // .lean() improves query execution speed by returning plain JS objects instead of full Mongoose Documents
    const drives = await Drive.find().sort({ createdAt: -1 }).lean();
    return res.json(drives);
  } catch (error) {
    console.error('Error fetching drives from MongoDB Atlas:', error);
    res.status(500).json({ error: 'Failed to fetch placement drives from database' });
  }
});

// POST /api/drives - Create a new placement drive
router.post('/', async (req, res) => {
  try {
    const { companyName, driveDate, role, driveType, status, examStatus, driveLink, resumeLink, hacktonName, hacktonHostedFrom, hacktonDate } = req.body;

    const trimmedCompany = companyName ? companyName.trim() : '';
    const trimmedHacktonName = hacktonName ? hacktonName.trim() : '';

    if (!trimmedCompany && !trimmedHacktonName) {
      return res.status(400).json({ error: 'Please enter a Company Name or Hackton Name' });
    }

    const isHackton = driveType === 'Hacktons' || Boolean(trimmedHacktonName);
    const finalHacktonName = trimmedHacktonName || trimmedCompany;
    const finalCompanyName = trimmedCompany || trimmedHacktonName;
    const finalHacktonDate = hacktonDate ? new Date(hacktonDate) : (driveDate ? new Date(driveDate) : null);
    const finalDriveDate = driveDate ? new Date(driveDate) : finalHacktonDate;

    const driveData = {
      companyName: finalCompanyName,
      driveDate: finalDriveDate,
      role: role ? role.trim() : '',
      driveType: driveType || (isHackton ? 'Hacktons' : 'Campus Drive'),
      status: status || 'Upcoming',
      examStatus: examStatus || 'Not Completed',
      driveLink: driveLink ? driveLink.trim() : '',
      resumeLink: resumeLink ? resumeLink.trim() : '',
      hacktonName: finalHacktonName,
      hacktonHostedFrom: hacktonHostedFrom ? hacktonHostedFrom.trim() : '',
      hacktonDate: finalHacktonDate
    };

    const newDrive = new Drive(driveData);
    const savedDrive = await newDrive.save();
    return res.status(201).json(savedDrive);
  } catch (error) {
    console.error('Error creating drive in MongoDB Atlas:', error);
    res.status(500).json({ error: 'Failed to create placement drive' });
  }
});

// PUT /api/drives/:id - Update an existing placement drive
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { companyName, driveDate, role, driveType, status, examStatus, driveLink, resumeLink, hacktonName, hacktonHostedFrom, hacktonDate } = req.body;

    const updateFields = {};
    if (companyName !== undefined) updateFields.companyName = companyName.trim();
    if (driveDate !== undefined) updateFields.driveDate = driveDate ? new Date(driveDate) : null;
    if (role !== undefined) updateFields.role = role.trim();
    if (driveType !== undefined) updateFields.driveType = driveType;
    if (status !== undefined) updateFields.status = status;
    if (examStatus !== undefined) updateFields.examStatus = examStatus;
    if (driveLink !== undefined) updateFields.driveLink = driveLink.trim();
    if (resumeLink !== undefined) updateFields.resumeLink = resumeLink.trim();
    if (hacktonName !== undefined) {
      updateFields.hacktonName = hacktonName.trim();
      if (!companyName) updateFields.companyName = hacktonName.trim();
    }
    if (hacktonHostedFrom !== undefined) updateFields.hacktonHostedFrom = hacktonHostedFrom.trim();
    if (hacktonDate !== undefined) {
      updateFields.hacktonDate = hacktonDate ? new Date(hacktonDate) : null;
      if (!driveDate) updateFields.driveDate = hacktonDate ? new Date(hacktonDate) : null;
    }

    const updatedDrive = await Drive.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    if (!updatedDrive) {
      return res.status(404).json({ error: 'Placement drive not found' });
    }
    return res.json(updatedDrive);
  } catch (error) {
    console.error('Error updating drive in MongoDB Atlas:', error);
    res.status(500).json({ error: 'Failed to update placement drive' });
  }
});

// DELETE /api/drives/:id - Delete a placement drive
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const deletedDrive = await Drive.findByIdAndDelete(id);
    if (!deletedDrive) {
      return res.status(404).json({ error: 'Placement drive not found' });
    }
    return res.json({ message: 'Placement drive deleted successfully', id });
  } catch (error) {
    console.error('Error deleting drive from MongoDB Atlas:', error);
    res.status(500).json({ error: 'Failed to delete placement drive' });
  }
});

module.exports = router;
