const cron = require('cron');
const { fetchActions } = require('../services/eosService');
const Action = require('../models/action');

const fetchAndSaveActions = async () => {
  try {
    const actions = await fetchActions();

    for (const action of actions) {
      const { trx_id, block_time, block_num } = action.action_trace;

      const newAction = new Action({
        trx_id,
        block_time,
        block_num
      });

      await newAction.save().catch(err => {
        if (err.code !== 11000) {
          console.error('Error saving action:', err);
        }
      });
    }

    console.log('Actions fetched and saved');
  } catch (error) {
    console.error('Error in fetchAndSaveActions:', error);
  }
};

const job = new cron.CronJob('* * * * *', fetchAndSaveActions, null, true, 'America/Los_Angeles');

module.exports = job;
