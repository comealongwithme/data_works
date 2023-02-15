// нужно проверять что ячейка существует и уже тогда после нее вставлять
// каждая строка имеет количество столбцов = Children.length этого уровня
// Сначала найти где в древе располагается нужная нам ячейка
// В чем разница между addColumn и addRow?

import { renderTreeTable } from './renderer'
import { defaultTreeTable, TreeTable, TreeTableNode } from './tree'

declare global {
	interface Window {
		TreeTable: {

			/**
			 * Adds a new Column **to the right** of the specified cell
			 * @param rowIndex a row index of the target cell
			 * @param colIndex a column index of the target cell
			 */
			AddColumn: (rowIndex: number, colIndex: number) => void;

			/**
			 * Adds a new Column **to the right** of the specified cell
			 * @param rowIndex a row index of the target cell
			 * @param colIndex a column index of the target cell
			 */
			AddRow: (rowIndex: number, colIndex: number) => void;
		}
	}
}

const treeTable = defaultTreeTable

const defaultTreeNode: TreeTableNode = {
	VerticalSpan: 1,
	Color: 'Red',
	Value: '42',
	Children: [],
}

const addColumn = (rowIndex: number, colIndex: number) => {

	const traverse = (parent: TreeTableNode | null, node: TreeTableNode, row: number, col: number): [TreeTableNode | null, TreeTableNode, number] | null => {
		if (row === rowIndex && col === colIndex) {
			return [parent, node, col];
		}
		if (node.Children.length === 0) {
			return null;
		}
		let childCol = col;
		for (let i = 0; i < node.Children.length; i++) {
			const child = node.Children[i];
			const childRow = row + child.VerticalSpan;
			const result = traverse(node, child, childRow, childCol);
			if (result !== null) {
				return result;
			}
			childCol += 1;
		}
		return null;
	};

	let col = 0;
	for (let i = 0; i < defaultTreeTable.Children.length; i++) {
		const child = defaultTreeTable.Children[i];
		const result = traverse(null, child, 0, col);
		if (result !== null) {
			const [parent, node, index] = result;
			if (parent === null) {
				defaultTreeTable.Children.splice(index + 1, 0, defaultTreeNode);
			} else {
				parent.Children.splice(index + 1, 0, defaultTreeNode);
			}
		}
		col += 1;
	}

	renderTreeTable('tree-table', treeTable)
}

const addRow = (rowIndex: number, colIndex: number) => {

	const traverse = (parent: TreeTableNode | null, node: TreeTableNode, row: number, col: number): [TreeTableNode | null, TreeTableNode, number] | null => {
		if (row === rowIndex && col === colIndex) {
			return [parent, node, col];
		}
		if (node.Children.length === 0) {
			return null;
		}
		let childCol = col;
		for (let i = 0; i < node.Children.length; i++) {
			const child = node.Children[i];
			const childRow = row + child.VerticalSpan;
			const result = traverse(node, child, childRow, childCol);
			if (result !== null) {
				return result;
			}
			childCol += 1;
		}
		return null;
	};

	let col = 0;
	for (let i = 0; i < defaultTreeTable.Children.length; i++) {
		const child = defaultTreeTable.Children[i];
		const result = traverse(null, child, 0, col);
		if (result !== null) {
			const [parent, node, index] = result;
			if (parent === null) {
				defaultTreeTable.Children.splice(index + 1, 0, defaultTreeNode);
			} else {
				node.Children.splice(index + 1, 0, defaultTreeNode);
			}
		}
		col += 1;
	}

	renderTreeTable('tree-table', treeTable)
}

const init = () => {
	window.TreeTable = {
		AddColumn: addColumn,
		AddRow: addRow
	}

	renderTreeTable('tree-table', treeTable)
}

init()

