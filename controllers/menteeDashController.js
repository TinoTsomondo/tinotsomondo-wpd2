// menteeDashController.js

const menteeDashController = {
  // Render the mentee dashboard
  renderMenteeDashboard(req, res) {
    // Assuming you have the events data retrieved or created somewhere
    const events = [
      { name: 'Event 1', category: 'Category 1', /* other properties */ },
      { name: 'Event 2', category: 'Category 2', /* other properties */ },
      // ... more events
    ];
    
    const data = {
      pageTitle: 'Mentee Dashboard',
      logoPath: '/media/logo.png', // Update the path based on your project structure
      homeLink: 'index.html',
      aboutUsLink: 'about.html',
      events, // Pass the events data
    };

    res.render('menteeDash/home', data); // Assuming the view file is menteeDashboard.ejs
  },
};

const listEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.render('menteeDash/home', { events });
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).send('Internal Server Error');
  }
};



module.exports = menteeDashController;
