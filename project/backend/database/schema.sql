    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        games INTEGER DEFAULT 0,
        wins INTEGER DEFAULT 0,
        losses INTEGER DEFAULT 0,
		email TEXT NOT NULL UNIQUE,
		password TEXT NOT NULL,
		avatar TEXT DEFAULT '../../frontend/public/assets/default_avatar.jpg',
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

    CREATE TABLE IF NOT EXISTS games (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        player1_id INTEGER,
        player2_id INTEGER,
        winner_id INTEGER,
        FOREIGN KEY (player1_id) REFERENCES users(id),
        FOREIGN KEY (player2_id) REFERENCES users(id),
        FOREIGN KEY (winner_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS leaderboard (
        user_id INTEGER PRIMARY KEY,
        wins INTEGER DEFAULT 0,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
    );



-- https://dbdiagram.io/d
-- CREATE TABLE users (
--     id INTEGER PRIMARY KEY AUTOINCREMENT,
--     username TEXT NOT NULL,
--     email TEXT NOT NULL UNIQUE,
--     password TEXT NOT NULL,
--     avatar TEXT, //WILL WE NEED IT?
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

-- CREATE TABLE friends (
--     id INTEGER PRIMARY KEY AUTOINCREMENT,
--     user_id INTEGER NOT NULL,
--     friend_id INTEGER NOT NULL,
--     status TEXT CHECK(status IN ('pending', 'accepted', 'blocked')),
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     FOREIGN KEY(user_id) REFERENCES users(id),
--     FOREIGN KEY(friend_id) REFERENCES users(id)
-- );

-- CREATE TABLE games (
--     id INTEGER PRIMARY KEY AUTOINCREMENT,
--     player1_id INTEGER NOT NULL,
--     player2_id INTEGER NOT NULL,
--     player1_score INTEGER NOT NULL,
--     player2_score INTEGER NOT NULL,
--     winner_id INTEGER,
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     FOREIGN KEY(player1_id) REFERENCES users(id),
--     FOREIGN KEY(player2_id) REFERENCES users(id),
--     FOREIGN KEY(winner_id) REFERENCES users(id)
-- );

-- CREATE TABLE user_stats (
--     id INTEGER PRIMARY KEY AUTOINCREMENT,
--     user_id INTEGER NOT NULL UNIQUE,
--     games_played INTEGER DEFAULT 0,
--     games_won INTEGER DEFAULT 0,
--     games_lost INTEGER DEFAULT 0,
--     total_score INTEGER DEFAULT 0,
--     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     FOREIGN KEY(user_id) REFERENCES users(id)
-- );

-- CREATE TABLE tournaments (
--     id INTEGER PRIMARY KEY AUTOINCREMENT,
--     name TEXT NOT NULL,
--     game_type TEXT,
--     max_participants INTEGER,
--     status TEXT CHECK(status IN ('upcoming', 'ongoing', 'completed')) DEFAULT 'upcoming',
--     created_by INTEGER NOT NULL,
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     start_date DATE,
--     end_date DATE,
--     FOREIGN KEY(created_by) REFERENCES users(id)
-- );

-- CREATE TABLE tournament_participants (
--     id INTEGER PRIMARY KEY AUTOINCREMENT,
--     tournament_id INTEGER NOT NULL,
--     user_id INTEGER NOT NULL,
--     FOREIGN KEY(tournament_id) REFERENCES tournaments(id),
--     FOREIGN KEY(user_id) REFERENCES users(id)
-- );

-- CREATE TABLE tournament_games (
--     id INTEGER PRIMARY KEY AUTOINCREMENT,
--     tournament_id INTEGER NOT NULL,
--     game_id INTEGER NOT NULL,
--     FOREIGN KEY(tournament_id) REFERENCES tournaments(id),
--     FOREIGN KEY(game_id) REFERENCES games(id)
-- );
