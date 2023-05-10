console.log('Felix ======= GoodBOY');
const {Client} = require('pg');

const connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/demo';

const client = new Client({connectionString});

const users = [
    {
        name:'Felix',
        age: 09
    },
    {
        name:'Hambone',
        age: 11
    },
    {
        name:'Biscuit',
        age: 13
    }
];
  

async function dropTables () {
    try{
     await client.query(`
      DROP TABLE IF EXISTS users;
     `)
    }catch(er){
        console.log('SHIT IS BROKE IN DROPPING TABLES');
        console.log(er);
      }

};

async function createTables() {
    try{
        await client.query (`
        CREATE TABLE users (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          age INTEGER
        );
        `)

    }catch(er){
        console.log('SHIT IS BROKE IN TABLES');
        console.log(er);
      }
};

async function createUser(user) {
    const {name, age} = user;
    try{
      const {rows: [user]} = await client.query(`
      INSERT INTO users (name, age)
      VALUES ($1, $2)
      RETURNING *;
      `,[name,age])
      console.log(user);
      return user;
    }catch(er){
        console.log('SHIT IS BROKE IN CREATE USER');
        console.log(er);
      }
}
async function createInitialUser() {
    try{
    await Promise.all(users.map(createUser))
    }catch(er){
        console.log('SHIT IS BROKE IN CREATEINITIAL USER');
        console.log(er);
      }
}

  

async function buildDB() {
    try{
        console.log('Starting to build DB');
        client.connect();

        console.log('DROPPING TABLES!!!');
        dropTables();
        console.log('FINISHED DROPPING TABLES!!')
        console.log('CREATING TABLES!!!');
        createTables();
        console.log('FINISHED CREATING TABLES');
        console.log('Creating Initial Users.');
        createInitialUser();
        console.log('FInished Creating Initial Users.')
    }catch(er){
        console.log('SHIT IS BROKE IN BUILD DB');
        console.log(er);
      }

};


buildDB();
