// When page is sent to viewer and the last page was list, then an
// error is thrown because these variables already exist. I'm
// scoping the variables to this function which is automatically
// called

(function() {
    let boxes = [];
    let $newBox;
    let target = 0;
    let $textInput;
    let textInputForNote = true;
    let $shadow;

    // Sets up array of all boxes and check box items
    $(function() {
        let $boxes = $('.list-container');
        $newBox = $('.new-list-container');

        $newBox.on('click', function() {
            textInputForNote = false;
            $textInput.label.text('New Group: ');

            $shadow.fadeIn(400, function() {
                $textInput.show();
            });
        });

        $shadow = $('.shadow');
        $textInput = $('.text-input');
        $textInput.button = $textInput.find('.btn');
        $textInput.text = $textInput.find('input');
        $textInput.label = $textInput.find('label');

        $boxes.toArray().forEach(function(box, boxIndex) {
            createNewBox($(box), boxIndex);
        });

        $textInput.button.on('click', function(event) {
            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();

            console.log($textInput.text.val());

            if (textInputForNote) {
                socket.emit('addListItem', {list: listName, box: target, text: $textInput.text.val()});
            } else {
                socket.emit('addGroup', {list: listName, groupTitle: $textInput.text.val()});       
            }

            $textInput.text.val('');
            $shadow.hide();
            $textInput.hide();
        });

        $shadow.on('click', function() {
            $shadow.hide();
            $textInput.hide();
        });
    });

    socket.on('toggleListItem', function(data) {
        let rem = boxes[data.box].items[data.item];
        rem.$check.prop('checked', !rem.$check.prop('checked'));
    });

    socket.on('deleteListItem', function(data) {
        removeListItem(data);
    });

    socket.on('addListItem', function(data) {
        let li = $(
            '<li>'
            + '\n<div class="list-number-container">'
            +   '\n<p class="item-number">' + (boxes[data.box].items.length + 1) + '\n</p>'
            + '\n</div>'
            + '\n<div class="list-checkbox-container">'
            +   '\n<input type="checkbox" class="input-checkbox">'
            + '\n</div>'
            + '\n<div class="list-text-container">'
            +   '\n<p>' + data.text + '</p>'
            + '\n</div>'
            + '\n<div class="list-delete-container text-danger">'
            + '\n</div>'
            + '\n</li>'
        );

        let item = {};
        let $item = li;

        item.$item = $item;
        item.itemIndex = boxes[data.box].items.length;
        item.$number = $item.find('.item-number');
        item.$check = $item.find('.list-checkbox-container>.input-checkbox');
        item.$delete = $item.find('.list-delete-container');
        let itemBox = boxes[data.box];

        item.$check.on('click', function(event) {
            event.preventDefault();
            socket.emit('toggleListItem', {list: listName, box: itemBox.boxIndex, item: item.itemIndex});
        });

        item.$delete.on('click', function() {
            socket.emit('deleteListItem', {list: listName, box: itemBox.boxIndex, item: item.itemIndex});
        });

        boxes[data.box].$ul.append(li);
        boxes[data.box].items.push(item);
    });

    socket.on('addGroup', function(data) {
        let $newBoxTemp = $('<div class="list-container col-xs-12 col-md-6 col-lg-4">'
                + '\n<div class="list">'
                    + '\n<div class="list-title-container"' + '\nstyle="background-color: ' + backgroundColors[boxes.length % backgroundColors.length] + '">'
                        + '\n<h3 class="list-title">' + data.groupTitle + '</h3>'
                        + '\n<h5 class="list-subtitle">List ' + (boxes.length + 1)
                        + '</h5>'
                    + '\n</div>'
                    + '\n<ul class="list-content-container">'
                    + '\n</ul>'
                    + '\n<div class="add-button">'
                        + '\n<span>+</span>'
                    + '\n</div>'
                + '\n</div>'
            + '\n</div>'
        );

        $newBox.before($newBoxTemp);

        let $clears = $('<div class="counted-fix visible-md clearfix"></div>'
            + '\n<div class="counted-fix visible-lg clearfix"></div>');
        $newBox.before($clears);

        createNewBox($newBoxTemp, boxes.length);
    });

    function removeListItem(data) {
        let rem = boxes[data.box].items.splice(data.item, 1)[0];
        rem.$item.remove();

        boxes[data.box].items.forEach(function(item, itemIndex) {
            item.$number.text(itemIndex + 1);
            item.itemIndex = itemIndex;
        });

        if (boxes[data.box].items.length <= 0) {
            removeBox(data);
        }
    }

    function removeBox(data) {
        // Remove the clear fixes
        boxes[data.box].$box.next().remove();
        boxes[data.box].$box.next().remove();
        boxes[data.box].$box.remove();
        boxes.splice(data.box, 1);

        boxes.forEach(function(box, boxIndex) {
            box.boxIndex = boxIndex;
            box.$number.text('List ' + (boxIndex + 1));
        });
    }

    function createNewBox($box, boxIndex) {
        let obj = {};
        obj.boxIndex = boxIndex;
        obj.$box = $box;
        obj.$number = $box.find('.list-subtitle');
        obj.$ul = obj.$box.find('ul');
        obj.items = [];

        $box.find('li').toArray().forEach(function(li, itemIndex) {
            let item = {};
            let $item = $(li);

            item.$item = $item;
            item.itemIndex = itemIndex;
            item.$number = $item.find('.item-number');
            item.$check = $item.find('.list-checkbox-container>.input-checkbox');
            item.$delete = $item.find('.list-delete-container');

            item.$check.on('click', function(event) {
                event.preventDefault();
                socket.emit('toggleListItem', {list: listName, box: obj.boxIndex, item: item.itemIndex});
            });

            item.$delete.on('click', function() {
                socket.emit('deleteListItem', {list: listName, box: obj.boxIndex, item: item.itemIndex});
            });

            obj.items.push(item);
        });

        obj.$button = $box.find('.add-button');

        obj.$button.on('click', function() {
            textInputForNote = true;
            $textInput.label.text('New Note: ');

            target = obj.boxIndex;
            $shadow.fadeIn(400, function() {
                $textInput.show();
            });
        });

        boxes.push(obj);
    }
})();