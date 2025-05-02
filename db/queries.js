const pool = require("./pool");

async function getAllMessage() {
    const { rows } = await pool.query(`
            SELECT 
                messages.*,
                members.firstname,
                members.lastname
            FROM messages
            JOIN members ON messages.userid = members.id
            ORDER BY messages.date DESC
        `);
    return rows;
  }

module.exports = {
    getAllMessage
};