const bcrypt = require('bcryptjs');

async function testHash() {
    const hash = '$2b$10$rOE8YZJz.x7VHgxKqX3G0.kB8W7d1l8YhG4vUzQkY5gU1Y5L.K6pq';
    const password = 'admin123';
    const isValid = await bcrypt.compare(password, hash);
    console.log('Is password valid?', isValid);
}

testHash();
