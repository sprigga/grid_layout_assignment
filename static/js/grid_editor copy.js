// static/js/grid_editor.js
$(document).ready(function () {
    const gridContainer = $('#grid-container');
    let gridCounter = 0;

    loadGrids();

    $('#add-grid').click(function () {
        const width = parseInt($('#grid-width').val()) || 100;
        const height = parseInt($('#grid-height').val()) || 100;
        addGrid(width, height, 10, 10);
    });

    $('#save-layout').click(function () {
        saveGridLayout();
    });

    $('#load-versions').click(function () {
        window.location.href = '/layout-versions/';
    });

    // function addGrid(width, height, x, y, id = null) {
    //     const gridId = id || `grid-${gridCounter++}`;
    //     const grid = $(`<div class="grid" id="${gridId}"></div>`);

    //     grid.css({
    //         width: width + 'px',
    //         height: height + 'px',
    //         left: x + 'px',
    //         top: y + 'px'
    //     });

    //     gridContainer.append(grid);

    //     grid.draggable({
    //         containment: "parent",
    //         stop: function (event, ui) {
    //             checkGridOverlap(grid);
    //         }
    //     });

    //     grid.resizable({
    //         containment: "parent",
    //         minWidth: 20,
    //         minHeight: 20,
    //         stop: function (event, ui) {
    //             checkGridOverlap(grid);
    //         }
    //     });

    //     grid.on('dblclick', function (e) {
    //         if (confirm('Are you sure you want to delete this grid?')) {
    //             $(this).remove();
    //         }
    //         e.stopPropagation();
    //     });

    //     return grid;
    // }

    function addGrid(width, height, x, y, id = null) {
        const gridId = id || `grid-${gridCounter++}`;
        const grid = $(`<div class="grid" id="${gridId}"></div>`);

        grid.css({
            width: width + 'px',
            height: height + 'px',
            left: x + 'px',
            top: y + 'px'
        });

        // 預設合法位置與尺寸
        grid.data('last-valid-left', x);
        grid.data('last-valid-top', y);
        grid.data('last-valid-width', width);
        grid.data('last-valid-height', height);

        gridContainer.append(grid);

        grid.draggable({
            containment: "parent",
            stop: function (event, ui) {
                checkGridOverlap(grid);
            }
        });

        grid.resizable({
            containment: "parent",
            minWidth: 20,
            minHeight: 20,
            stop: function (event, ui) {
                checkGridOverlap(grid);
            }
        });

        grid.on('dblclick', function (e) {
            if (confirm('Are you sure you want to delete this grid?')) {
                $(this).remove();
            }
            e.stopPropagation();
        });

        return grid;
    }
    

    // function checkGridOverlap(currentGrid) {
    //     const current = currentGrid.position();
    //     const currentRect = {
    //         left: current.left,
    //         top: current.top,
    //         right: current.left + currentGrid.width(),
    //         bottom: current.top + currentGrid.height()
    //     };

    //     let hasOverlap = false;

    //     $('.grid').not(currentGrid).each(function () {
    //         const other = $(this).position();
    //         const otherRect = {
    //             left: other.left,
    //             top: other.top,
    //             right: other.left + $(this).width(),
    //             bottom: other.top + $(this).height()
    //         };

    //         if (!(currentRect.right < otherRect.left ||
    //             currentRect.left > otherRect.right ||
    //             currentRect.bottom < otherRect.top ||
    //             currentRect.top > otherRect.bottom)) {
    //             hasOverlap = true;
    //             return false;
    //         }
    //     });

    //     if (hasOverlap) {
    //         currentGrid.css({
    //             left: currentGrid.data('last-valid-left') || currentRect.left,
    //             top: currentGrid.data('last-valid-top') || currentRect.top,
    //             width: currentGrid.data('last-valid-width') || (currentRect.right - currentRect.left),
    //             height: currentGrid.data('last-valid-height') || (currentRect.bottom - currentRect.top)
    //         });
    //         alert('Grids cannot overlap!');
    //     } else {
    //         currentGrid.data('last-valid-left', currentRect.left);
    //         currentGrid.data('last-valid-top', currentRect.top);
    //         currentGrid.data('last-valid-width', currentRect.right - currentRect.left);
    //         currentGrid.data('last-valid-height', currentRect.bottom - currentRect.top);
    //     }
    // }

    function checkGridOverlap(currentGrid) {
        const current = currentGrid.position();
        const currentRect = {
            left: current.left,
            top: current.top,
            right: current.left + currentGrid.width(),
            bottom: current.top + currentGrid.height()
        };

        let hasOverlap = false;

        $('.grid').not(currentGrid).each(function () {
            const other = $(this).position();
            const otherRect = {
                left: other.left,
                top: other.top,
                right: other.left + $(this).width(),
                bottom: other.top + $(this).height()
            };

            if (!(currentRect.right < otherRect.left ||
                currentRect.left > otherRect.right ||
                currentRect.bottom < otherRect.top ||
                currentRect.top > otherRect.bottom)) {
                hasOverlap = true;
                return false;
            }
        });

        if (hasOverlap) {
            currentGrid.css({
                left: currentGrid.data('last-valid-left'),
                top: currentGrid.data('last-valid-top'),
                width: currentGrid.data('last-valid-width'),
                height: currentGrid.data('last-valid-height')
            });
            alert('Grids cannot overlap!');
        } else {
            currentGrid.data('last-valid-left', currentRect.left);
            currentGrid.data('last-valid-top', currentRect.top);
            currentGrid.data('last-valid-width', currentRect.right - currentRect.left);
            currentGrid.data('last-valid-height', currentRect.bottom - currentRect.top);
        }
    }


    function saveGridLayout() {
        const gridLayout = [];

        $('.grid').each(function () {
            const position = $(this).position();
            gridLayout.push({
                id: $(this).attr('id'),
                x: position.left,
                y: position.top,
                width: $(this).width(),
                height: $(this).height()
            });
        });

        $.ajax({
            url: '/save-grid-layout/',
            type: 'POST',
            data: {
                grids: JSON.stringify(gridLayout),
                csrfmiddlewaretoken: $('input[name="csrfmiddlewaretoken"]').val()
            },
            success: function (response) {
                if (response.status === 'success') {
                    alert('Layout has been saved! Layout ID: ' + response.layout_id);
                }
            },
            error: function (error) {
                console.error('Save Failed:', error);
                alert('Save failed, please check console.');
            }
        });
    }

    function loadGrids(layoutId = null) {
        let url = '/get-grid-layout/';
        if (layoutId) {
            url += `?layout_id=${layoutId}`;
        }

        $.ajax({
            url: url,
            type: 'GET',
            success: function (response) {
                if (response.status === 'success' && response.grids && response.grids.length > 0) {
                    gridContainer.empty();
                    gridCounter = 0;
                    response.grids.forEach(function (grid) {
                        addGrid(grid.width, grid.height, grid.x, grid.y, grid.id);
                    });
                } else {
                    gridContainer.empty();  // 未登入或無佈局時清空
                }
            },
            error: function (error) {
                console.error('Load Failed:', error);
                gridContainer.empty();  // 載入失敗時清空
            }
        });
    }

    // 如果 URL 中有 layout_id 參數，則加載特定版本
    const urlParams = new URLSearchParams(window.location.search);
    const layoutId = urlParams.get('layout_id');
    if (layoutId) {
        loadGrids(layoutId);
    }
});