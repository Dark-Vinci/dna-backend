const { User } = require('../../../models/userM');
const jwt = require('jsonwebtoken');
const config = require('config');
const mongoose = require('mongoose');

describe('user.generateToken', () => {
    it('should generate a valid json-web-token', () => {
        const payload = { 
            _id: new mongoose.Types.ObjectId().toHexString() ,
            isAdmin: false
        }
        const user = new User(payload);
        const token = user.generateToken();

        const decoded = jwt.verify(token, config.get('signature'));
        expect(decoded).toMatchObject(payload);
    })
})