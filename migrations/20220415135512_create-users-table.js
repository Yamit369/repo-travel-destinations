
exports.up = function(knex) {
  

    return knex.schema.createTable('users', tbl=>{
        tbl.increments()// for id of the parent column 
        tbl.text('username',120).notNullable().unique().index()
        tbl.text('password',200).notNullable()
        tbl.text('imgUrl').notNullable()
        tbl.timestamps(true,true)
    }) //all of these is the table
    .createTable('destinations', tbl=>{
        tbl.increments()
        tbl.text('title',200).notNullable().index()
        tbl.text('description',700).notNullable()
        tbl.text('imgUrl').notNullable()
        tbl.timestamps(true,true)
        tbl.integer('user_id').notNullable().unsigned().references('id').inTable('users').onDelete('CASCADE').onUpdate('CASCADE')
    })



};

exports.down = function(knex) {
  return knex.schema.dropTableIfExist('users').dropTableIfExist('destinations')
};
