import { config } from 'dotenv'
import { resolve } from 'node:path'
import { cwd } from 'node:process'
config({ path: resolve(cwd(), `./secrets/.env`), override: true })
