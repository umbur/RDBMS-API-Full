
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('cohorts').del()
    .then(function () {
      // Inserts seed entries
      return knex('cohorts').insert([
        {id: 3, name: 'rowValue1'},
        {id: 4, name: 'rowValue2'},
        {id: 5, name: 'rowValue3'}
      ]);
    });
};
