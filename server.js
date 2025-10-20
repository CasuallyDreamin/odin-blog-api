import app from './app.js';

const PORT = process.env.PORT || 5000;
const SERVER_URL = process.env.SERVER_URL || "http://localhost";

app.listen(PORT, () => console.log(`Server running on ${SERVER_URL}:${PORT}`));
