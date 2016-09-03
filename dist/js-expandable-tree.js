var jsExpandableTree = function(params) {
    var th = this;
    th.tree = params.jsonTree;
    th.wrapper = params.wrapper;
    th.maxId = 0;

    $(wrapper).addClass('js-expandable-tree');

    th.render = function(tree, id) {
        if (th.maxId < parseInt(id)) {
            th.maxId = group.id + 1;
        }
        
        var content = '<ul data-group="' + id + '">';
        var amount = 0;
        _.each(tree, function(group) {
            if (th.maxId < parseInt(group.id)) {
                th.maxId = group.id + 1;
            }
            if (group.deleted !== undefined) {
                return '';
            }
            if (group.nodes !== undefined && group.nodes.length != 0) {
                content += '<li class="has-child" data-parent-group="' + group.parent_id + '" data-group="' + group.id + '"><div class="wrapper"><input type="text"  data-parent-group="' + group.parent_id + '" data-group="' + group.id + '" class="changeTitle form-control" value="' + group.title + '">' + th.getRightPad(group.parent_id, group.id) + '</div></li>';
                content += th.render(group.nodes, group.id);
            } else {
                content += '<li class="empty" data-parent-group="' + group.parent_id + '" data-group="' + group.id + '"><div class="wrapper"><input type="text"  data-parent-group="' + group.parent_id + '" data-group="' + group.id + '" class="changeTitle form-control" value="' + group.title + '">' + th.getRightPad(group.parent_id, group.id) + '</div></li>';
                if (th.maxId < group.id) {
                    th.maxId++;
                }
            }
            amount++;
        });

        if (amount) {
            content += '<a data-group="'+ id +'" class="glyphicon glyphicon-plus text-success plus"></a>';
        }

        content += '</ul>';

        return content;
    };

    th.getRightPad = function(parent_id, id) {
        if (id == 1) {
            return '<div class="right-pad"><a data-group="'+ id +'" class="addSubGroup">' 
            		+ 'Добавить подгруппу</a></div>';
        } else {
            return '<div class="right-pad"><a data-parent-group="' + parent_id + '" data-group="'+ id +'" class="glyphicon glyphicon-remove text-danger remove"></a>' 
            	 + '<a data-group="'+ id +'" class="addSubGroup">Добавить подгруппу</a></div>';            
        }
    }

    th.searchGroupById = function(tree, id, callBack, param) {
        _.each(tree, function(group) {
            if (group.id == id) {
                callBack(group, param);
            }
            if (group.nodes !== undefined && group.nodes.length != 0) {
                th.searchGroupById(group.nodes, id, callBack, param);
            }
        });
    };

    th.addGroup = function(group) {
        ++th.maxId;
        group.push({
            title: '',
            id: th.maxId,
        });

        th.renderContent();
    };

    th.addSubGroup = function(group) {
        ++th.maxId;
        if (group.nodes === undefined) {
            group.nodes = [];
        }
        group.nodes.push({
            title: '',
            id: th.maxId,
        });

        th.renderContent();
    };

    th.removeGroup = function(group) {
        group.deleted = true;
        th.renderContent();
    };

    th.changeTitle = function(group, title) {
        group.title = title;
        
        th.renderContent();
    };

    th.addEventListeners = function() {
        $('.plus').on('click', function() {
            if ($(this).data('group') != 0) {
                th.searchGroupById(th.tree, $(this).data('group'), th.addSubGroup);
            } else {
                th.addGroup(th.tree);
            }
        });

        $('.remove').on('click', function() {
            th.searchGroupById(th.tree, $(this).data('group'), th.removeGroup);
        });

        $('.addSubGroup').on('click', function() {
           th.searchGroupById(th.tree, $(this).data('group'), th.addSubGroup); 
        });

        $('.changeTitle').on('change', function() {
            th.searchGroupById(th.tree, $(this).data('group'), th.changeTitle, $(this).val());  
        });
    };

    th.renderContent = function() {
        $(wrapper).html('');
        $(th.wrapper).append(th.render(th.tree, 0));
        $('#stockGroup ul:first').css('margin-left', '0px')

        _.each($('#stockGroup ul'), function(elem) {
            if ($(elem).html() == '') {
                $(elem).remove();
            }
        });

        th.addEventListeners();
    };

    th.getToSave = function() {
        return th.tree;
    };

    th.validateMe = function(tree) {
        var errors = true;
        var elems = $(wrapper + ' input[data-group]');
        _.each(elems, function(elem) {
            if ($(elem).val() == '') {
		    	console.log('Here');  
            	$(elem).attr({
			    	'title': 'Это поле не может быть пустым',
			    	'data-toggle': 'tooltip',
			    	'data-trigger': 'manual',
			    	'data-placement': 'top',
			    });
			    $(elem).tooltip('show');
                errors = false;
            }
        });

        return errors;
    };  

    th.renderContent();

    return th;
};

