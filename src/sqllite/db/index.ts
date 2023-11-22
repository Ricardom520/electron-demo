import { app } from 'electron'
import knex, { Knex } from 'knex'
import { join } from 'path'

// dbPath为你想存放数据库文件的目录路径
// const connectDb = (dbPath: string) => {
//   return open({
//     filename: dbPath,
//     driver: sqlite3.Database,
//   });
// };
export class LocalDB {
  declare db: Knex
  async init() {
    // connectDb(join(app.getPath("userData"), "local.db"))
    this.db = knex({
      client: 'sqlite',
      useNullAsDefault: true,
      connection: {
        filename: join(app.getPath('userData'), 'local.db')
      }
    })
    await this.sync()
  }

  async sync() {
    await this.db.schema.hasTable('documents').then((exist) => {
      if (exist) return
      return this.db.schema.createTable('documents', (table) => {
        table.bigIncrements('id', { primaryKey: true })
        table.string('name')
        table.timestamps(true, true)
      })
    })
    await this.db.schema.hasTable('pages').then((exist) => {
      if (exist) return
      return this.db.schema.createTable('pages', (table) => {
        table.bigIncrements('id', { primaryKey: true })
        table.string('name')
        table.text('content')
        table.bigInteger('documentId')
        table.integer('sort_order')
        table.timestamps(true, true)
      })
    })
  }

  async findAll() {
    console.log('============')
    await this.db('documents')
      .select()
      .then((res) => {
        console.log(res)
      })
  }

  async insert() {
    await this.db('documents')
      .insert({
        id: 0,
        name: '测试'
      })
      .then((res) => {
        console.log('insert-res:', res)
      })
  }
}
