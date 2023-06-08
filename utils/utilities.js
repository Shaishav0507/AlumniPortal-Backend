const crypto = require('crypto');

const algorithm = 'aes-256-cbc';

const ENCRYPTION_KEY = process.env.CIPHER_KEY;

const IV_LENGTH = 16;

const encryptString = (text) => {
    try {
        let iv = crypto.randomBytes(IV_LENGTH);
        let cipher = crypto.createCipheriv(algorithm, Buffer.from(ENCRYPTION_KEY), iv);

        let encrypted = cipher.update(text);
        encrypted = Buffer.concat([encrypted, cipher.final()]);

        return iv.toString('hex') + ':' + encrypted.toString('hex');
    } catch (error) {
        throw Error("Could not encrypt. Please communicate the same to the team.");
    }
};

const decryptString = (text) => {
    try {
        let textParts = text.split(':');
        let iv = Buffer.from(textParts.shift(), 'hex');
        let encryptedText = Buffer.from(textParts.join(':'), 'hex');
        let decipher = crypto.createDecipheriv(algorithm, Buffer.from(ENCRYPTION_KEY), iv);

        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);

        return decrypted.toString();
    } catch (error) {
        throw Error("Could not decrypt. Please communicate the same to the team.");
    }
};

module.exports = {
    encrypt: encryptString,
    decrypt: decryptString
};