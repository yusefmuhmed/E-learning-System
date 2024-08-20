const cron = require("node-cron");
const Teacher = require("../../db/models/teacher.model");
const SessionMap = require("../util/sessionMapCache");

async function scheduleTasks() {
  // Schedule the job to run every 12 hours
  cron.schedule("0 */12 * * *", async () => {
    try {
      console.log(`[${new Date().toISOString()}] Running the scheduled job to remove expired tokens...`);
      await Teacher.removeExpiredTokens();
    } catch (error) {
      console.error("Error while removing expired tokens:", error);
    }
  });

  // Schedule the job to run every 4 hours
  cron.schedule("0 */4 * * *", async () => {
    try {
      console.log(`[${new Date().toISOString()}] Running the scheduled job to remove expired sessions...`);
      SessionMap.deleteExpiredSessions();
    } catch (error) {
      console.error("Error while removing expired sessions:", error);
    }
  });
}

module.exports = scheduleTasks;
