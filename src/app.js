const connectDB = require('./config/db');
const job = require('./jobs/fetchActionsJob');

connectDB();

job.start();