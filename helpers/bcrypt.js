const bcrypt = require('bcrypt');

function hash(password){
    return bcrypt.hash(password, 10);
}
function compare(password, hash){
    return bcrypt.compare(password, hash)
    .then(result => {
        if(!result) throw new Error('Password invalid!')
        return result;
    })
}
module.exports = { hash, compare }
