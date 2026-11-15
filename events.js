import {EventEmitter} from 'node:events';

export const eventEmitter = new EventEmitter();
 
eventEmitter.on('account created',(username) => {
console.log(` account created successfully: ${username.user}`);
});