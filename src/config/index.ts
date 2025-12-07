import { Connection } from "pg";

const dotenv = require('dotenv');
dotenv.config()



const config ={
    port:process.env.PORT,
    connectionStr:process.env.CONNECTION
}


export default config