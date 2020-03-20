const config = require('config.json');
const jwt = require('jsonwebtoken');
const Role = require('_helpers/role');
const colors = {
    red: {
      primary: '#ad2121',
      secondary: '#FAE3E3'
    },
    blue: {
      primary: '#1e90ff',
      secondary: '#D1E8FF'
    },
    yellow: {
      primary: '#e3bc08',
      secondary: '#FDF1BA'
    }
  };
// users hardcoded for simplicity, store in a db for production applications
const slots = [
    {
        id: 1,
        start: new Date('2016-01-08'),
        end: new Date('2016-01-10'),
        title: 'One day excluded event',
        color: colors.red,
        allDay: true
      },
      {
        id: 2,
        start: new Date('2016-01-01'),
        end: new Date('2016-01-09'),
        title: 'Multiple weeks event',
        allDay: true
      }
];

module.exports = {
    getAll,
    getById
};

async function getAll() {
    return slots.map(u => {
        return u;
    });
}

async function getById(id) {
    const user = users.find(u => u.id === parseInt(id));
    if (!user) return;
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
}