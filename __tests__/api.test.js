    const request = require('supertest');
    const express = require('express');

    const app = express();
    
    app.get('/', (req, res) => {
      res.send('PG Management API is running...');
    });
    
    describe('GET /', () => {
      it('should respond with the API running message', async () => {
        const response = await request(app).get('/');
        expect(response.statusCode).toBe(200);
        expect(response.text).toBe('PG Management API is running...');
      });
    });
    


    
