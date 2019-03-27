const express = require("express");
const helmet = require("helmet");
const knex = require("knex");
const knexConfig = require("../knexfile.js");

const server = express();

server.use(express.json());
server.use(helmet());

const db = knex(knexConfig.development);



// End Points for ***Cohorts*** table  
// This route will return an array of all cohorts:
server.get("/api/cohorts", (req, res) => {
    db("cohorts")
      .then(cohorts => {
        if (cohorts) {
          res.status(200).json(cohorts);
        } else {
          res.status(404).json({ error: "Cohorts not found" });
        }
      })
      .catch(err =>
        res.status(500).json({ error: "The cohorts information could not be retrieved." })
      );
  });
  
  // This route will return the cohort with the matching id:
  server.get("/api/cohorts/:id", (req, res) => {
    db("cohorts")
      .where({ id: req.params.id })
      .then(cohort => {
        if (cohort.length > 0) {
          res.status(200).json(cohort);
        } else {
          res.status(404).json({ error: "There is no Cohort with the provided id" });
        }
      })
      .catch(err =>
        res.status(500).json({ error: "The cohort information could not be retrieved." })
      );
  });
  
  // Returns all students for the cohort with the specified id.
    server.get("/api/cohorts/:id/students", (req, res) => {
        const {id} = req.params;
      db("students")
        .where('cohort_id', id)
        .then(cohort => {
          if (cohort.length > 0) {
            res.status(200).json(cohort);
          } else {
            res.status(404).json({ error: "Student not found" });
          }
        })
        .catch(err =>
          res
            .status(500)
            .json({ error: "The studen information could not be retrieved." })
        );
    });

  //This route should save a new cohort to the database:
  server.post("/api/cohorts", (req, res) => {
    const changes = req.body;
    if(!req.body.name){
        res.status(400).json({ error: 'Please make sure you have name property!'})
    } else {
        db.insert(changes).into("cohorts")
        .then(ids => {
        res.status(201).json(ids);
      })
      .catch(err => {
        res.status(500).json({error: "There was an error while saving the cohorts to the database."});
      });
    }
});

server.delete("/api/cohorts/:id", (req, res) => {
    db("cohorts").where({ id: req.params.id })
      .del()
      .then(count => {
        if (count) {
          res.status(200).json(count);
        } else {
          res.status(404).json({ error: "Cohort not found" });
        }
      })
      .catch(err =>
        res.status(500).json({ error: "The cohort could not be removed." })
      );
  });
  
  //This route will update the cohort with the matching id using information sent in the body of the request:
  server.put("/api/cohorts/:id", (req, res) => {
    const id = req.params.id;
    const changes = req.body;
    if(!changes.name) {
        res.status(400).json({ error: 'Please provide a name!' })
    } else {
        db("cohorts").where('id', id).update(changes)
        .then(ids => {
            if(ids) {
                res.status(200).json({message: `Successfully updated cohort with ID ${id}`});
            } else {
                res.status(404).json({error: `Student with ID ${id} does not exist!`})
            }
          })
          .catch(err => {
            res.status(500).json({error: "Failed to update db. Does your id exist?"});
          })
        }
    })

    // End Points for ***Student*** table  
    // [POST] /students This route should save a new student to the database:
    server.post("/api/students", (req, res) => {
        const changes = req.body;
        if (!changes.name || !changes.cohort_id) {
            res.status(500).json({error: "Please provide both a name and a cohort_id for the student."});
          } else {
            db.insert(changes).into("students")
            .then(ids => {
            res.status(201).json(ids);
          })
          .catch(err => {
            res.status(500).json({error: "There was an error while saving the student to the database."});
          });
        }
    });

    //[GET] /students This route will return an array of all students:
    server.get("/api/students", (req, res) => {
        db("students")
          .then(students => {
            if (students) {
              res.status(200).json(students);
            } else {
              res.status(404).json({ error: "Student not found" });
            }
          })
          .catch(err =>
            res.status(500).json({ error: "The Student information could not be retrieved." })
          );
      });

      //[GET] /students/:id This route will return the student with the matching id:
      server.get("/api/students/:id", (req, res) => {
        db("students")
          .where({ id: req.params.id })
          .then(student => {
            if (student.length > 0) {
              res.status(200).json(student);
            } else {
              res.status(404).json({ error: "There is no Student with the provided id" });
            }
          })
          .catch(err =>
            res.status(500).json({ error: "The Student information could not be retrieved." })
          );
      });

      //[PUT] /students/:id This route will update the student with the matching id using information sent in the body of the request:
      server.put('/api/students/:id', (req, res) => {
        const id = req.params.id;
        const student = req.body;
        if (!student.name || !student.cohort_id) {
            res.status(500).json({error: "Please provide both a name and a cohort_id for the student."});
          } else {
            db("students").where("id",id).update(student)
            .then(response => {
                if (response) {
                    res.status(200).json({message: `Successfully edited student with ID ${id}`})
                } else {
                    res.status(404).json({error: `Student with ID ${id} does not exist.`})
                }
            })
            .catch(err => {
                console.log(err)
                res.status(500).json({error: "Unable to update students DB."})
            })
          }
    })

    server.delete('/api/students/:id', (req, res) => {
        const id = req.params.id;
        db("students").where("id", id).del()
        .then(response => {
            if (response) {
                res.status(200).json({message: `Successfully deleted student with ID ${id}`})
            } else {
                res.status(404).json({error: `Student with ID ${id} does not exist!`})
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: "Unable to DELETE from students db."})
        })
    })
    
module.exports = server;
