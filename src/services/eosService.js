const axios = require('axios');

const fetchActions = async () => {
  try {
    const response = await axios.post('https://eos.greymass.com/v1/history/get_actions', {
      account_name: 'eosio',
      pos: -1,
      offset: -100
    });
    return response.data.actions;
  } catch (error) {
    console.error('Error fetching actions:', error);
    throw error;
  }
};

module.exports = { fetchActions };
