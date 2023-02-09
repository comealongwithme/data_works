define("tree", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.defaultTreeTable = void 0;
    exports.defaultTreeTable = {
        Name: "Table",
        Children: [
            {
                VerticalSpan: 1, Color: "Orange", Value: "1",
                Children: [
                    {
                        VerticalSpan: 1, Color: "Green", Value: "4",
                        Children: [{ VerticalSpan: 1, Color: "Purple", Value: "7", Children: [] }],
                    },
                    {
                        VerticalSpan: 1, Color: "Green", Value: "5",
                        Children: [{ VerticalSpan: 1, Color: "Purple", Value: "8", Children: [] }],
                    },
                ],
            },
            {
                VerticalSpan: 1, Color: "Orange", Value: "2",
                Children: [{ VerticalSpan: 2, Color: "Green", Value: "6", Children: [] }],
            },
            {
                VerticalSpan: 2, Color: "Orange", Value: "3",
                Children: [
                    { VerticalSpan: 1, Color: "Purple", Value: "9", Children: [] },
                    { VerticalSpan: 1, Color: "Purple", Value: "10", Children: [] },
                ],
            },
        ]
    };
});
define("renderer", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.renderTreeTable = void 0;
    const createCellElement = ({ Children, Color, Value, VerticalSpan }) => {
        const cell = document.createElement('td');
        cell.colSpan = Children.length > 1 ? Children.length : 1;
        cell.rowSpan = VerticalSpan;
        cell.innerText = Value;
        cell.setAttribute('style', `background-color: ${Color}`);
        return cell;
    };
    const renderTreeTable = (containerId, treeTable) => {
        const tableContainer = document.querySelector(`#${containerId}`);
        while (tableContainer.firstChild) {
            tableContainer.removeChild(tableContainer.firstChild);
        }
        if (treeTable.Children.length === 0)
            return;
        const table = document.createElement('table');
        const tableRows = [];
        const renderNode = (node, level) => {
            if (!tableRows[level]) {
                tableRows[level] = document.createElement('tr');
            }
            tableRows[level].appendChild(createCellElement(node));
            node.Children.forEach(childNode => renderNode(childNode, level + node.VerticalSpan));
        };
        treeTable.Children.forEach(node => renderNode(node, 0));
        tableRows.forEach(tableRow => table.appendChild(tableRow));
        table.setAttribute('style', `height: ${tableRows.length * 100}px`);
        tableContainer.appendChild(table);
        console.log('TreeTable has been updated!');
        console.dir(treeTable);
    };
    exports.renderTreeTable = renderTreeTable;
});
define("index", ["require", "exports", "renderer", "tree"], function (require, exports, renderer_1, tree_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function modifyTree(tree, item, col, row) {
        if (col === 0) {
            if (row === 0) {
                tree.Value = item;
                return tree;
            }
            else {
                row--;
            }
        }
        else {
            col--;
            if (!tree.Children) {
                tree.Children = [];
            }
            let targetNode = tree;
            let currentRow = 0;
            while (targetNode.Children && targetNode.Children.length > 0 && currentRow + targetNode.Children.length <= row) {
                currentRow += targetNode.Children.length;
                targetNode = targetNode.Children[targetNode.Children.length - 1];
            }
            if (currentRow === row && !targetNode.Children) {
                targetNode.Children = [];
            }
            if (row - currentRow < targetNode.Children.length) {
                targetNode.Children[row - currentRow] = modifyTree(targetNode.Children[row - currentRow], item, col, 0);
            }
            else {
                targetNode.Children.push({ Value: item, Children: [], VerticalSpan: 0, Color: 'Red' });
            }
        }
        return tree;
    }
    const treeTable = tree_1.defaultTreeTable;
    const addColumn = (rowIndex, colIndex) => {
        modifyTree(treeTable.Children[0], 42, colIndex, rowIndex);
        (0, renderer_1.renderTreeTable)('tree-table', treeTable);
    };
    const addRow = (rowIndex, colIndex) => {
        modifyTree(treeTable.Children[0], 42, colIndex, rowIndex);
        (0, renderer_1.renderTreeTable)('tree-table', treeTable);
    };
    const init = () => {
        window.TreeTable = {
            AddColumn: addColumn,
            AddRow: addRow
        };
        (0, renderer_1.renderTreeTable)('tree-table', treeTable);
    };
    init();
});
