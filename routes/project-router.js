const express = require("express");

const Project = require("../models/project-model.js")

const router = express.Router();


router.get("/project/add", (req, res, next) => {

    if(!req.user) {

        //redirect away if you arent logged in
        // req.flash("error", "you must logged in.")
        res.redirect("/login");
        return;
      }

    res.render("project-views/project-form.hbs");

});

router.post("/process-project", (req, res, next) => {
    if(!req.user) {

        //redirect away if you arent logged in
        // req.flash("error", "you must logged in.")
        res.redirect("/login");
        return;
      }

    const { projectName, projectDescription, clientName, startOfProject, endOfProject, adress } = req.body;
    Project.create({ owner: req.user._id, projectName, projectDescription, clientName, startOfProject, endOfProject, adress })
    .then((projectDoc) => {
    //   req.flash("success", "Room created!");
      res.redirect("/my-created-pro");
    })
    .catch((err) => {
     next(err);
    })
});


router.get("/my-projects", (req, res, next) => {
    if(!req.user) {

        //redirect away if you arent logged in
        // req.flash("error", "you must logged in.")
        res.redirect("/login");
        return;
      }
    Project.find({ owner: req.user._id })
    .then((projectResults) => {
        res.locals.projectArrayCreated = projectResults;
        Project.find({ team: { $in: [req.user._id] } })
        .then((projectParticipated) => {
            res.locals.projectArrayParticipated = projectParticipated;
            res.render("project-views/project-list.hbs");
        })
        
    })
    .catch((err) => {
        next(err);
    });



});



module.exports = router;