CREATE TABLE activities (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  date DATE NOT NULL,
  duration VARCHAR(255) NOT NULL,
  user_id UUID REFERENCES auth.users(id)
);

CREATE TABLE friends (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  friend_id UUID REFERENCES auth.users(id)
);
