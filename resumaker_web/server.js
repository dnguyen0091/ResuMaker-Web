import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import fetch from 'node-fetch'; // You'll need to install this: npm install node-fetch

const app = express();
const REMOTE_API_URL = 'https://resumaker-api.onrender.com';

// Middleware
app.use(cors());
app.use(bodyParser.json());

// CORS Headers
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, PATCH, DELETE, OPTIONS'
    );
    next();
});

// Test endpoint
app.get('/', (req, res) => {
    res.send('ResuMaker API Proxy is running');
});

// Proxy for login endpoint
app.post('/login', async (req, res) => {
    try {
        const response = await fetch(`${REMOTE_API_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(req.body)
        });
        
        const data = await response.json();
        
        // Forward the status code and data from the remote API
        res.status(response.status).json(data);
    } catch (error) {
        console.error('Error proxying login request:', error);
        res.status(500).json({ message: 'Failed to connect to authentication service' });
    }
});

// Proxy for registration endpoint
app.post('/register', async (req, res) => {
    try {
        const response = await fetch(`${REMOTE_API_URL}/api/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(req.body)
        });
        
        const data = await response.json();
        
        // Forward the status code and data from the remote API
        res.status(response.status).json(data);
    } catch (error) {
        console.error('Error proxying register request:', error);
        res.status(500).json({ message: 'Failed to connect to registration service' });
    }
});

// Start the server
app.listen(5000, () => {
    console.log('Server is running on port 5000');
    console.log('Proxying requests to:', REMOTE_API_URL);
}).on('error', (err) => {
    console.error('Server error:', err);
});


// import bodyParser from 'body-parser';
// import cors from 'cors';
// import express from 'express';

// const app = express();

// // Middleware
// app.use(cors());
// app.use(bodyParser.json());

// // CORS Headers
// app.use((req, res, next) => {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader(
//         'Access-Control-Allow-Headers',
//         'Origin, X-Requested-With, Content-Type, Accept, Authorization'
//     );
//     res.setHeader(
//         'Access-Control-Allow-Methods',
//         'GET, POST, PATCH, DELETE, OPTIONS'
//     );
//     next();
// });

// // Test endpoint
// app.get('/', (req, res) => {
//     res.send('Hello, world!');
// });

// // Start the server
// app.listen(5000, () => {
//     console.log('Server is running on port 5000');
// }).on('error', (err) => {
//     console.error('Server error:', err);
// });



