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

    function addGrid(width, height, x, y, id = null) {
        const gridId = id || `grid-${gridCounter++}`;
        const grid = $(`<div class="grid" id="${gridId}"></div>`);

        grid.css({
            width: width + 'px',
            height: height + 'px',
            left: x + 'px',
            top: y + 'px'
        });

        // 儲存初始值（僅用於參考，不直接用於恢復）
        grid.data('initial-left', x);
        grid.data('initial-top', y);
        grid.data('initial-width', width);
        grid.data('initial-height', height);

        // 初始化滑鼠指向時的位置（預設為初始位置）
        grid.data('hover-left', x);
        grid.data('hover-top', y);
        grid.data('hover-width', width);
        grid.data('hover-height', height);

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

        // 滑鼠指標進入時記住當前位置
        grid.on('mouseenter', function () {
            const position = $(this).position();
            $(this).data('hover-left', position.left);
            $(this).data('hover-top', position.top);
            $(this).data('hover-width', $(this).width());
            $(this).data('hover-height', $(this).height());
            console.log(`Grid ${gridId} hover position saved: (${position.left}, ${position.top}), size: (${$(this).width()}, ${$(this).height()})`);
        });

        grid.on('dblclick', function (e) {
            if (confirm('Are you sure you want to delete this grid?')) {
                $(this).remove();
            }
            e.stopPropagation();
        });

        return grid;
    }

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
            // 若有重疊，恢復到滑鼠指標指向時記住的位置
            currentGrid.css({
                left: currentGrid.data('hover-left') + 'px',
                top: currentGrid.data('hover-top') + 'px',
                width: currentGrid.data('hover-width') + 'px',
                height: currentGrid.data('hover-height') + 'px'
            });
            alert('Grids cannot overlap! Reset to last hover position.');
        }
        // 不更新任何「最後有效位置」，因為需求是基於滑鼠指向位置恢復
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
                        const newGrid = addGrid(grid.width, grid.height, grid.x, grid.y, grid.id);
                        // 載入時將 hover 位置初始化為載入位置
                        newGrid.data('hover-left', grid.x);
                        newGrid.data('hover-top', grid.y);
                        newGrid.data('hover-width', grid.width);
                        newGrid.data('hover-height', grid.height);
                    });
                } else {
                    gridContainer.empty(); // 未登入或無佈局時清空
                }
            },
            error: function (error) {
                console.error('Load Failed:', error);
                gridContainer.empty(); // 載入失敗時清空
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