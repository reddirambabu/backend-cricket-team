const express = require("express");
const app = express();
app.use(express.json());
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const dbPath = path.join(__dirname, "cricketTeam.db");

let db = null;

const initializeDbAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    app.listen(3000, () => {
      console.log("This Server is Running at https://localhost:3000/");
    });
  } catch (error) {
    console.log(`DB Error : ${error.message}`);
    process.exit(1);
  }
};

initializeDbAndServer();

app.get("/players/", async (request, response) => {
  const getPlayers = `SELECT * FROM cricket_team ORDER BY player_id ASC;`;
  const playersArray = await db.all(getPlayers);
  response.send(playersArray);
});

app.post("/players/", async (request, response) => {
  const { playerName, jerseyNumber, role } = request.body;

  const createPost = `INSERT INTO 
    cricket_team(player_name , jersey_number , role)
    VALUES ('${playerName}' , ${jerseyNumber} , '${role}') ;
    `;

  await db.run(createPost);
  response.send("Player Added to Team");
});

app.get("/players/:playerId", async (request, response) => {
  const { playerId } = request.params;
  const playerQuery = `SELECT * FROM cricket_team WHERE player_id = ${playerId};`;
  const playerDetails = await db.get(playerQuery);
  response.send(playerDetails);
});

app.put("/players/:playerId", async (request, response) => {
  const { playerId } = request.params;
  const { playerName, jerseyNumber, role } = request.body;
  const updateQuery = `
    UPDATE
        cricket_team
    SET 
        player_name = '${playerName}' , 
        jersey_number = ${jerseyNumber} , 
        role = '${role}' 
    WHERE 
        player_id = ${playerId} ;
    `;
  await db.run(updateQuery);
  response.send("Player Details Updated");
});

app.delete("/players/:playerId", async (request, response) => {
  const { playerId } = request.params;
  const deleteQuery = `DELETE FROM cricket_team WHERE player_id = ${playerId} ; `;
  await db.run(deleteQuery);
  response.send("Player Remove");
});
