const express = require('express');
const app = express();
const port = 3000;
const { Sequelize, QueryTypes } = require('sequelize');

const sequelize = new Sequelize('personalweb', 'postgres', 'muhammad68671', {
    host: 'localhost',
    dialect: 'postgres'
});

app.set("view engine", "hbs");
app.set("views", "views");

app.use("/assets", express.static("assets"));
app.use(express.urlencoded({ extended: true }));

const projects = []

app.get('/', renderHome);
app.get('/project', renderProject);
app.get('/testimonials', renderTestimnonials);
app.get('/contact', renderContac);
app.get('/project-detail/:project_id', renderProjectDetail);
app.get('/edit-project/:project_id', renderEditProject);

app.post('/add-project', addProject)
app.post('/edit-project/:project_id', editProject);
app.get('/delete-project/:project_id', deleteProject);

app.listen(port, () => {
    console.log(`Aplikasi berjalan pada port ${port}`);
})


async function renderHome(req, res) {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }

    const query = `SELECT * FROM projects`;
    const result = await sequelize.query(query, { type: QueryTypes.SELECT})

    res.render("index", {
        data: result,
    });
};

// Project Post
function renderProject(req, res) {
    res.render("add-project");
};

function renderProjectDetail(req, res) {
    const id = req.params.project_id;

    const project = projects.find( project => project.id == id );

    res.render("detail", {
        data : project,
    });
};

function addProject(req, res) {
    console.log(req.body);

    const newProject = {
        id : projects.length + 1,
        title : req.body.title,
        startDate : req.body.startDate,
        endDate : req.body.endDate,
        description : req.body.description,
        image : req.body.image
    }

    projects.unshift(newProject);

    res.redirect('/');
};

function renderEditProject(req, res) {
    const id = req.params.project_id;

    const project = projects.find( project => project.id == id )

    res.render("edit-project", {
        data : project,
    })
}

function editProject(req, res) {
    console.log(req.body);

    const id = req.params.project_id;

    const newProject = {
        id : id,
        title : req.body.title,
        startDate : req.body.startDate,
        endDate : req.body.endDate,
        description : req.body.description,
        image : req.body.image,
    };

    const index = projects.findIndex(project => project.id == id );

    projects[index] = newProject;

    res.redirect('/');
}

function deleteProject(req, res) {
    const id = req.params.project_id;

    const index = projects.findIndex( project => project.id == id );

    projects.splice(index, 1);

    res.redirect('/');
}
// End Project Post

function renderTestimnonials(req, res) {
    res.render("testimonials");
};

function renderContac(req, res) {
    res.render("contact");
};
