const express = require('express');
const router = express.Router();
const slotService = require('./slot.service');
const authorize = require('_helpers/authorize')
const Role = require('_helpers/role');

const mongoose = require('mongoose');

//Attributes of the Course object
var courseSchema = new mongoose.Schema({
    courseName: {
        type: String,
        required: 'This field is required!'
    },
    courseId: {
        type: String
    },
    courseDuration: {
        type: String
    },
    courseFee: {
        type: String
    }
});

const Course = mongoose.model('Slot', courseSchema);

//Router Controller for READ request
router.get('/', (req, res) => {
    Course.find((err, docs) => {
        if (!err) {
            console.log(docs);
            res.status(200).json(docs);
        }
        else {
            console.log('Failed to retrieve the Course List: ' + err);
        }
    });
});

//Router Controller for UPDATE request
router.post('/', (req, res) => {
    if (req.body._id == '')
        insertIntoMongoDB(req, res);
    else
        updateIntoMongoDB(req, res);
});

//Router Controller for UPDATE request
router.delete('/', (req, res) => {
    Course.deleteOne({_id: req.body._id}, (err, doc) => {
        if (!err) res.status(200).json({});
        else console.log(err);
    });
});

//Creating function to insert data into MongoDB
function insertIntoMongoDB(req, res) {
    var course = new Course();
    course.courseName = req.body.courseName;
    course.courseId = req.body.courseId;
    course.courseDuration = req.body.courseDuration;
    course.courseFee = req.body.courseFee;
    course.save((err, doc) => {
        if (!err)
            res.redirect('course/list');
        else
            console.log('Error during record insertion : ' + err);
    });
}

//Creating a function to update data in MongoDB
function updateIntoMongoDB(req, res) {
    Course.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true }, (err, doc) => {
        if (!err) { res.redirect('course/list'); }
        else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.status(200).json(req.body);
            }
            else
                console.log('Error during updating the record: ' + err);
        }
    });
}

//Router to retrieve the complete list of available courses
// router.get('/list', (req, res) => {
//     Course.find((err, docs) => {
//         if (!err) {
//             res.render("course/list", {
//                 list: docs
//             });
//         }
//         else {
//             console.log('Failed to retrieve the Course List: ' + err);
//         }
//     });
// });

//Creating a function to implement input validations
function handleValidationError(err, body) {
    for (field in err.errors) {
        switch (err.errors[field].path) {
            case 'courseName':
                body['courseNameError'] = err.errors[field].message;
                break;
            default:
                break;
        }
    }
}

//Router to update a course using it's ID
router.get('/:id', (req, res) => {
    Course.findById(req.params.id, (err, doc) => {
        if (!err) {
            res.render("course/courseAddEdit", {
                viewTitle: "Update Course Details",
                course: doc
            });
        }
    });
});

//Router Controller for DELETE request
router.get('/delete/:id', (req, res) => {
    Course.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) {
            res.redirect('/course/list');
        }
        else { console.log('Failed to Delete Course Details: ' + err); }
    });
});

module.exports = router;
