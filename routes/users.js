router.route('/users/:id')
  .get(async (req, res) => {
    try {
      const userId = req.params.id;
      const user = await getUserById(userId);
      if (user) {
        res.render('user_profile', { user });
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
