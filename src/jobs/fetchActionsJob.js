const cron = require('cron');
const { fetchActions } = require('../services/eosService');
const Action = require('../models/action');

const fetchAndSaveActions = async () => {
  try {
    const actions = await fetchActions();
    
    const actionDocs = actions.map(action => ({
      trx_id: action.action_trace.trx_id,
      block_time: action.action_trace.block_time,
      block_num: action.action_trace.block_num
    }));
    
    await Action.insertMany(actionDocs, { ordered: false })
      .then(() => {
        console.log('Actions fetched and saved');
      })
      .catch(err => {
        if (err.writeErrors) {
          err.writeErrors.forEach(e => {
            if (e.code !== 11000) {
              console.error('Error saving action:', e);
            }
          });
        } else {
          console.error('Error in insertMany:', err);
        }
      });

  } catch (error) {
    console.error('Error in fetchAndSaveActions:', error);
  }
};

const job = new cron.CronJob('* * * * *', fetchAndSaveActions, null, true, 'America/Los_Angeles');

module.exports = job;