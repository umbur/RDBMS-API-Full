const express = require("express");
const helmet = require("helmet");
const knex = require("knex");

const knexConfig = require("./knexfile.js");

const server = express();

server.use(express.json());
server.use(helmet());

const db = knex(knexConfig.development);

// COHORTS 
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
        res
          .status(500)
          .json({ error: "The cohorts information could not be retrieved." })
      );
  });

  server.get("/api/cohorts/:id", (req, res) => {
    db("cohorts")
      .where({ id: req.params.id })
      .then(cohort => {
        if (cohort) {
          res.status(200).json(cohort);
        } else {
          res.status(404).json({ error: "Cohort not found" });
        }
      })
      .catch(err =>
        res
          .status(500)
          .json({ error: "The cohort information could not be retrieved." })
      );
  });
  
    server.get("/api/cohorts/:id/students", (req, res) => {
        const {id} = req.params;
      db("students")
        .where('cohort_id', id)
        .then(cohort => {
          if (cohort) {
            res.status(200).json(cohort);
          } else {
            res.status(404).json({ error: "Students not found" });
          }
        })
        .catch(err =>
          res
            .status(500)
            .json({ error: "The studen information could not be retrieved." })
        );
    });
  
  server.post("/api/cohorts", (req, res) => {
    const changes = req.body;
  
    db.insert(changes)
      .into("cohorts")
      .then(ids => {
        res.status(201).json(ids);
      })
      .catch(err => {
        res.status(500).json({
          error: "There was an error while saving the cohorts to the database."
        });
      });
  });

const port = 5000;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});

server.delete("/api/cohorts/:id", (req, res) => {
    db("cohorts")
      .where({ id: req.params.id })
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
  
  server.put("/api/cohorts/:id", (req, res) => {
    const changes = req.body;
  
    db("cohorts")
      .where({ id: req.params.id })
      .update(changes)
      .then(count => {
        res.status(200).json(count);
      })
      .catch(err =>
        res
          .status(500)
          .json({ error: "The cohort information could not be modified." })
      );
  });