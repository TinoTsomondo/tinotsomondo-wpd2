const Mentor = require('../models/adminMentor');

const mentorController = {
  // List all mentors
  async listMentors(req, res) {
    try {
      const mentors = await Mentor.find();
      res.render('adminDash/mentor/homeMentor', { mentors });
    } catch (error) {
      console.error('Error fetching mentors:', error);
      res.status(500).send('Internal Server Error');
    }
  },

  // Display a form to add a new mentor
  addMentorForm(req, res) {
    res.render('adminDash/mentor/addMentor');
  },


  // Create a new mentor
  async createMentor(req, res) {
    const { name, expertise, description } = req.body;
    const mentor = new Mentor({ name, expertise, description });
    await mentor.save();
    res.redirect('/adminDash/mentor/homeMentor');
  },

  // Display a form to edit a mentor
  async editMentorForm(req, res) {
    try {
      const mentor = await Mentor.findById(req.params.id);
      if (!mentor) {
        // Handle case where mentor with the given id is not found
        return res.status(404).send('Mentor not found');
      }
      res.render('adminDash/mentor/editMentor', { mentor });
    } catch (error) {
      console.error('Error fetching mentor details for editing:', error);
      res.status(500).send('Internal Server Error');
    }
  },

  // Update an existing mentor
  async updateMentor(req, res) {
    const { name, expertise, description } = req.body;
    try {
      const mentor = await Mentor.findByIdAndUpdate(req.params.id, { name, expertise, description });
      if (!mentor) {
        // Handle case where mentor with the given id is not found
        return res.status(404).send('Mentor not found');
      }
      res.redirect('/adminDash/mentor/homeMentor');
    } catch (error) {
      console.error('Error updating mentor:', error);
      res.status(500).send('Internal Server Error');
    }
  },

  // Delete a mentor
  async deleteMentor(req, res) {
    try {
      const mentor = await Mentor.findByIdAndDelete(req.params.id);
      if (!mentor) {
        // Handle case where mentor with the given id is not found
        return res.status(404).send('Mentor not found');
      }
      res.redirect('/adminDash/mentor/homeMentor');
    } catch (error) {
      console.error('Error deleting mentor:', error);
      res.status(500).send('Internal Server Error');
    }
  },

  // View mentor details
  async viewMentor(req, res) {
    try {
      const mentor = await Mentor.findById(req.params.id);
      if (!mentor) {
        // Handle case where mentor with the given id is not found
        return res.status(404).send('Mentor not found');
      }
      res.render('adminDash/mentor/mentorDetails', { mentor });
    } catch (error) {
      console.error('Error fetching mentor details:', error);
      res.status(500).send('Internal Server Error');
    }
  },
};

module.exports = mentorController;