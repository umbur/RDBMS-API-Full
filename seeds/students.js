
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('students').del()
    .then(function () {
      // Inserts seed entries
      return knex('students').insert([
        {cohort_id: 1, name: 'rowValue1'},
        {cohort_id: 2, name: 'rowValue2'},
        {cohort_id: 3, name: 'rowValue3'}
      ]);
    });
};
