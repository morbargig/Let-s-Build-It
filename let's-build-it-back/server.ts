import 'dotenv/config'
import express from 'express'
import router from './api/router'
import mongoose from 'mongoose'
import path from 'path'
import bodyParser from 'body-parser'
// import cors from 'cors'
import { exit } from 'process'

const checkDbConnection = (mongo_url: string) => {
    return mongoose
        .connect(mongo_url, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            useFindAndModify: false
        })
}

const cmdResponse = (error, stdout, stderr) => {
    if (error) {
        console.log(`error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
    }
    console.log(`stdout: ${stdout}`);
}

(async () => {
    const app = express()
    // app.use(cors())
    app.use(bodyParser.json());
    if (!(process.env.MONGODB_URI || process.env.SERVER_PORT)) {
        console.log("exit, no envs", process.env.MONGODB_URI || process.env.SERVER_PORT)
        exit()
    }
    const PORT = process.env.SERVER_PORT || 3030
    const DBName = "Let's-Build-It"
    const MONGO_URL = process.env.MONGODB_URI || `mongodb://localhost/${DBName}`
    const connection = await checkDbConnection(MONGO_URL)
        .catch(err => {
            // TODO start manual mongoDB
            if (process.env.AUTO_DB === 'true') {
                console.log("\nstart manual mongoDB Connection");
                const { exec } = require("child_process");
                exec('brew services start mongodb-community', cmdResponse);
                return checkDbConnection(MONGO_URL).catch(err => {
                    console.error('Error connecting db:', err.message)
                    process.env.noDBConnection = true as any
                    console.error(process.env.noDBConnection ? 'exit, no Db connection' : '')
                    exit()
                })
            }
        })

    app.get('/health', (req, res) => res.json({ UP: !!connection }))

    if (!connection) {
        app.use((req, res) => {
            res.status(500)
            res.json({ error: 'Server is unavailable at the moment' })
            console.error('Server is unavailable at the moment')
        })
    }
    else {
        app.use(function (req, res, next) {
            res.header('Access-Control-Allow-Origin', '*')
            res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
            res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With')
            next()
        })
        app.use(express.static(path.join(__dirname, 'dist')))
        app.use('/api', router)
        // app.get('*', function (req, res) {
        //     res.sendFile(path.join(__dirname, 'dist', 'index.html'))
        // })
        app.listen(PORT, () => console.log(`Server is listening on http://localhost:${PORT}`))

        process.on('SIGINT', () => {
            // kill manual mongoDb connection
            if (connection && process.env.AUTO_DB === 'true') {
                const { exec } = require("child_process");
                console.log("\nKill MongoDb Connection");
                exec('brew services stop mongodb-community', (error, stdout, stderr) => {
                    cmdResponse(error, stdout, stderr)
                    console.log("Bye bye!");
                    exit()
                })
            }
        });
    }
})()