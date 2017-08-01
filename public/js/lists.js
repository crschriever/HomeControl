(function() {
    let lists = [];
    let $container;
    let $newList;
    let $textInput;
    let $shadow;

    $(function() {

        $newList = $('.new-list-button');
        $container = $('.list-group');
        $shadow = $('.shadow');
        $textInput = $('.text-input');
        $textInput.button = $textInput.find('.btn');
        $textInput.text = $textInput.find('input');
        $textInput.label = $textInput.find('label');

        $newList.on('click', function() {
            $shadow.fadeIn(400, function() {
                $textInput.show();
            });
        });

        $textInput.button.on('click', function(event) {
            socket.emit('addList', {name: $textInput.text.val()});

            $textInput.text.val('');
            $shadow.hide();
            $textInput.hide();
        });

        let $lists = $('.list-group-item');
        $lists.toArray().forEach(function(list) {
            addList($(list));
        });
    });

    socket.on('addList', function(data) {
        $list = $('<li class="list-group-item" data-name="' + data.name + '">'
                    + '\n<div class="list-text" onclick="changePage(\'list/' + data.name + '\')">' + (lists.length + 1) + ': ' + data.name + '</div>'
                    + '\n<div class="list-delete-container text-danger"></div>'
                + '\n</li>');
        
        $container.append($list);
        addList($list);
    });

    socket.on('deleteList', function(data) {
        console.log(data);
        let deleteIndex = lists.findIndex(function(element) {return element.name === data.name});
        let deleteList = lists.splice(deleteIndex, 1)[0];
        deleteList.$list.remove();

        lists.forEach(function(list, index) {
            list.$text.text((index + 1) + ': ' + list.name);
        });
    });

    function addList($list) {
        let obj = {};
        obj.$list = $list;
        obj.$text = $list.find('.list-text');
        obj.$delete = $list.find('.list-delete-container');
        obj.name = $list.data('name');

        obj.$delete.on('click', function() {
            socket.emit('deleteList', {name: obj.name});
        });

        lists.push(obj);
    }

})();