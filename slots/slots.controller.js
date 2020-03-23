const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

//Attributes of the Slot object
let slotSchema = new mongoose.Schema({
    slotName: {
        type: String
    },
    slotTime: {
        type: String
    },
    slotStatus: {
        type: Number
    },
    userId: {
        type: String
    },
    userName: {
        type: String
    },
    start: {
        type: String
    }
});

const Slot = mongoose.model('Slot', slotSchema);

//Router Controller for READ request
router.get('/', (req, res) => {
    Slot.find((err, docs) => {
        if (!err) {
            res.status(200).json({
                data: processEntries(docs),
                status: true
            });
        }
        else {
            console.log('Failed to retrieve the Slot List: ' + err);
        }
    });
});

//Router Controller for UPDATE request
router.post('/', (req, res) => {
    if (!req.body._id) {
        insertIntoMongoDB(req, res);
    }
    else
        updateIntoMongoDB(req, res);
});

//Creating function to insert data into MongoDB
function insertIntoMongoDB(req, res) {
    let slot = new Slot();
    slot.slotName = req.body.slotName;
    slot.userId = req.body.userId;
    slot.start = req.body.start;
    slot.slotTime = req.body.slotTime;
    slot.slotStatus = req.body.slotStatus;
    slot.userName = req.body.userName;
    slot.save((err, doc) => {
        if (!err)
            Slot.find(function (error, docs) {
                res.status(200).json({
                    data: processEntries(docs),
                    status: true
                });
            });
        else {
            console.log('Error during record insertion : ' + err);
        }
    });
}

function processEntries(docs) {
    return docs;
}

//Creating a function to update data in MongoDB
function updateIntoMongoDB(req, res) {
    Slot.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true }, (err, doc) => {
        if (!err) {
            Slot.find(function (error, docs) {
                res.status(200).json({
                    data: processEntries(docs),
                    status: true
                });
            });
        }
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

//Router to update a Slot using it's ID
router.get('/:id', (req, res) => {
    Slot.findById(req.params.id, (err, doc) => {
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
    Slot.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) {
            Slot.find(function (error, docs) {
                res.status(200).json({
                    data: processEntries(docs),
                    status: true
                });
            });
        }
        else { console.log('Failed to Delete Course Details: ' + err); }
    });
});

module.exports = router;
