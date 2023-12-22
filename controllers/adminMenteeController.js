const Mentee = require('../models/adminMentee');

const menteeController = {
  // List all mentees
  async listMentees(req, res) {
    try {
      const mentees = await Mentee.find();
      res.render('adminDash/mentee/homeMentee', { mentees });
    } catch (error) {
      console.error('Error fetching mentees:', error);
      res.status(500).send('Internal Server Error');
    }
  },

  // Display a form to add a new mentee
  addMenteeForm(req, res) {
    res.render('adminDash/mentee/addMentee');
  },

  // Create a new mentee
  async createMentee(req, res) {
    const { fullname, degreeProgram, email } = req.body;
    const mentee = new Mentee({ fullname, degreeProgram, email });
    await mentee.save();
    res.redirect('/adminDash/mentee/homeMentee');
  },

  // Display a form to edit a mentee
  async editMenteeForm(req, res) {
    try {
      const mentee = await Mentee.findById(req.params.id);
      if (!mentee) {
        // Handle case where mentee with the given id is not found
        return res.status(404).send('Mentee not found');
      }
      res.render('adminDash/mentee/editMentee', { mentee });
    } catch (error) {
      console.error('Error fetching mentee details for editing:', error);
      res.status(500).send('Internal Server Error');
    }
  },

  // Update an existing mentee
  async updateMentee(req, res) {
    const { fullname, degreeProgram, email } = req.body;
    try {
      const mentee = await Mentee.findByIdAndUpdate(req.params.id, { fullname, degreeProgram, email });
      if (!mentee) {
        // Handle case where mentee with the given id is not found
        return res.status(404).send('Mentee not found');
      }
      res.redirect('/adminDash/mentee/homeMentee');
    } catch (error) {
      console.error('Error updating mentee:', error);
      res.status(500).send('Internal Server Error');
    }
  },

  // Delete a mentee
  async deleteMentee(req, res) {
    try {
      const mentee = await Mentee.findByIdAndDelete(req.params.id);
      if (!mentee) {
        // Handle case where mentee with the given id is not found
        return res.status(404).send('Mentee not found');
      }
      res.redirect('/adminDash/mentee/homeMentee');
    } catch (error) {
      console.error('Error deleting mentee:', error);
      res.status(500).send('Internal Server Error');
    }
  },

  // View mentee details
  async viewMentee(req, res) {
    try {
      const mentee = await Mentee.findById(req.params.id);
      if (!mentee) {
        // Handle case where mentee with the given id is not found
        return res.status(404).send('Mentee not found');
      }
      res.render('adminDash/mentee/menteeDetails', { mentee });
    } catch (error) {
      console.error('Error fetching mentee details:', error);
      res.status(500).send('Internal Server Error');
    }
  },
};

module.exports = menteeController;
