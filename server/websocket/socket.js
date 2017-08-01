let io = require('socket.io')();
let currentPage = {location: "clock"};
let ListGroup = require('../models/todo.js');

io.on('connection', function(socket) {

    socket.on('joinRoom', function(data) {
        socket.userRoom = data.userID;
        socket.join(data.userID);
        console.log('joining room ' + data.userID);
    });

    socket.emit('newPage', currentPage);

    socket.on('changePage', function(data) {
        console.log('changing room ' + socket.userRoom);
        currentPage = data;      
        io.to(socket.userRoom).emit('newPage', data);
    });

    socket.on('addList', function(data) {
        var newGroup = new ListGroup({
            name: data.name,
            groups: []
        });
        newGroup.save(function(err) {
            if (!err) {
                io.emit('addList', data);                
            } else {
                console.log(err);
            }
        });
    });

    socket.on('deleteList', function(data) {
        console.log(data);
        ListGroup.findOneAndRemove({name: data.name}, function(err) {
            if (!err) {
                io.emit('deleteList', data);
            } else {
                console.log(err);
            }
        });
    });

    socket.on('addGroup', function(data) {
        ListGroup.findOne({name: data.list}, function(err, list) {
            list.groups.push({
                title: data.groupTitle,
                items: []
            });
            list.save(function(err) {
                if (!err) {
                    io.emit('addGroup', data);
                } else {
                    console.log(err);
                }
            });
        })
    });

    socket.on('toggleListItem', function(data) {
        ListGroup.findOne({name: data.list}, function(err, list) {
            list.groups[data.box].items[data.item].checked = !list.groups[data.box].items[data.item].checked;
            
            list.save(function(err) {
                if (!err) {
                    io.emit('toggleListItem', data);
                } else {
                    console.log(err);
                }
            });
        });
    });

    socket.on('deleteListItem', function(data) {
        ListGroup.findOne({name: data.list}, function(err, list) {
            list.groups[data.box].items.splice(data.item, 1);
            if (list.groups[data.box].items.length <= 0) {
                list.groups.splice(data.box, 1);
            }
            list.save(function(err) {
                if (!err) {
                    io.emit('deleteListItem', data);
                } else {
                    console.log(err);
                }
            });
        });
    });

    socket.on('addListItem', function(data) {
        ListGroup.findOne({name: data.list}, function(err, list) {
            list.groups[data.box].items.push({text: data.text, checked: false});
            list.save(function(err) {
                if (!err) {
                    io.emit('addListItem', data);
                } else {
                    console.log(err);
                }
            });
        });
    });

});

module.exports = {
    attach: function(server) {
        io.attach(server);
    },
    changePage: function(newPage) {
        currentPage = {location: newPage};
        io.emit('newPage', {location: newPage});
    }
};