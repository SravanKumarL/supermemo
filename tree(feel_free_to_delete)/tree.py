"""
This is an adjusted version of the official simpletreemodel[1] that adds lazy loading and uses a dict as backend.
Instead of the dict it could also use a database or similar. Items are only loaded when expanded, which allows
for speedy startup-time, even with 2.5m items.
1: https://github.com/baoboa/pyqt5/tree/master/examples/itemviews/simpletreemodel
"""

import sys
from PySide6.QtCore import QAbstractItemModel, QFile, QIODevice, QModelIndex, Qt
from PySide6.QtWidgets import QApplication, QTreeView, QHeaderView
from collections import OrderedDict


d = {'Users': {'files': [{'filename': 'file.txt', 'size': 1234, 'modified': 'blah'},
                     {'filename': 'file2.txt', 'size': 1234, 'modified': 'blah'},
                     {'filename': 'file3.txt', 'size': 1234, 'modified': 'blah'}],
           'manu': {'files': [{'filename': 'file.txt', 'size': 1234, 'modified': 'blah'},
                              {'filename': 'file2.txt', 'size': 1234, 'modified': 'blah'},
                              {'filename': 'file3.txt', 'size': 1234, 'modified': 'blah'}],
                    'Documents': {'files': []},
                    },
           },
     'Applications': {'files': [{'filename': 'file.txt', 'size': 1234, 'modified': 'blah'},
                                {'filename': 'file2.txt', 'size': 1234, 'modified': 'blah'},
                                {'filename': 'file3.txt', 'size': 1234, 'modified': 'blah'}]
                      }
     }

for i in range(500):
    d['Users']['manu'][f'Documents-{i}'] = {'files': []}
    for j in range(5000):
        d['Users']['manu'][f'Documents-{i}']['files'].append({'filename': f'file-{j}.txt', 'size': 1234, 'modified': 'blah'})

selected = set()


class FileItem:
    def __init__(self, filename, modified, size, parent=None):
        self.parentItem = parent
        self.itemData = [filename, modified, size]
        self.checkedState = False

    def childCount(self):
        return 0

    def columnCount(self):
        return 3

    def data(self, column):
        return self.itemData[column]

    def parent(self):
        return self.parentItem

    def row(self):
        return self.parentItem.childItems.index(self)

    def setCheckedState(self, value):
        if value == 2:
            self.checkedState = True
            selected.add('/'.join(self.parentItem.path)+'/'+self.itemData[0])
        else:
            self.checkedState = False
            selected.remove('/'.join(self.parentItem.path)+'/'+self.itemData[0])
        print(selected)

    def getCheckedState(self):
        if self.checkedState:
            return Qt.Checked
        else:
            return Qt.Unchecked

def get_dict_from_path(path):
    current_level = d
    for folder in path:
        current_level = current_level[folder]

    return current_level

class FolderItem():
    def __init__(self, path=[], parent=None):
        self.parentItem = parent
        self.path = path
        self.checkedState = False
        self.childItems = []

        if self.path:
            folder_content = get_dict_from_path(self.path)
            if folder_content.get('files', False):
                self.n_children = len(folder_content['files']) + len(folder_content) - 1
            else:
                self.n_children = len(folder_content)
        else:
            self.n_children = len(d)  # TODO: handle files at root level

        self.is_loaded = False

    def load_children(self):
        self.childItems = []
        if self.path:
            child_dirs = []
            folder_content = get_dict_from_path(self.path)
            for folder in folder_content.keys():
                if folder == 'files':
                    for file in folder_content['files']:
                        self.childItems.append(FileItem(file['filename'], file['modified'], file['size'], parent=self))
                else:
                    child_dirs.append(folder)
        else:  # special case of root node. TODO: handle files at root level
            child_dirs = d.keys()

        for child_dir in child_dirs:
            child_path = self.path + [child_dir]
            self.childItems.append(FolderItem(path=child_path, parent=self))
        self.is_loaded = True

    def child(self, row):
        return self.childItems[row]

    def childCount(self):
        return self.n_children

    def columnCount(self):
        return 3

    def setCheckedState(self, value):
        if value == 2:
            self.checkedState = True
            selected.add('/'.join(self.path))
        else:
            self.checkedState = False
            selected.remove('/'.join(self.path))
        print(selected)

    def getCheckedState(self):
        if self.checkedState:
            return Qt.Checked
        else:
            return Qt.Unchecked

    def data(self, column):
        if column == 0 and self.path:
            return self.path[-1]
        else:
            return None

    def parent(self):
        return self.parentItem

    def row(self):
        if self.parentItem:
            return self.parentItem.childItems.index(self)

        return 0

class TreeModel(QAbstractItemModel):
    column_names = ['Name','Modified', 'Size']

    def __init__(self, parent=None):
        super(TreeModel, self).__init__(parent)

        self.rootItem = FolderItem(path=[])
        self.rootItem.load_children()

    def columnCount(self, parent):
        return 3

    def data(self, index, role):
        if not index.isValid():
            return None

        item = index.internalPointer()

        if role == Qt.DisplayRole:
            return item.data(index.column())
        elif role == Qt.CheckStateRole and index.column() == 0:
            return item.getCheckedState()
        else:
            return None

    def setData(self, index, value, role=Qt.EditRole):
        if role == Qt.CheckStateRole:
            item = index.internalPointer()
            item.setCheckedState(value)

        return True

    def canFetchMore(self, index):
        if not index.isValid():
            return False
        item = index.internalPointer()
        return not item.is_loaded

    def fetchMore(self, index):
        item = index.internalPointer()
        item.load_children()


    def flags(self, index):
        if not index.isValid():
            return Qt.NoItemFlags

        return Qt.ItemIsEnabled | Qt.ItemIsUserCheckable

    def headerData(self, section, orientation, role):
        if orientation == Qt.Horizontal and role == Qt.DisplayRole:
            return self.column_names[section]

        return None

    def index(self, row, column, parent):
        if not self.hasIndex(row, column, parent):
            return QModelIndex()

        if not parent.isValid():
            parentItem = self.rootItem
        else:
            parentItem = parent.internalPointer()

        childItem = parentItem.child(row)
        if childItem:
            return self.createIndex(row, column, childItem)
        else:
            return QModelIndex()

    def parent(self, index):
        if not index.isValid():
            return QModelIndex()

        childItem = index.internalPointer()
        parentItem = childItem.parent()

        if parentItem == self.rootItem:
            return QModelIndex()

        return self.createIndex(parentItem.row(), 0, parentItem)

    def rowCount(self, parent):
        if parent.column() > 0:
            return 0

        if not parent.isValid():
            parentItem = self.rootItem
        else:
            parentItem = parent.internalPointer()

        return parentItem.childCount()



if __name__ == '__main__':
    app = QApplication(sys.argv)

    model = TreeModel()

    view = QTreeView()
    view.setAlternatingRowColors(True)
    view.setUniformRowHeights(True)  # Allows for scrolling optimizations.
    view.setModel(model)
    view.setWindowTitle("Simple Tree Model")
    header = view.header()
    header.setStretchLastSection(False)
    header.setSectionResizeMode(1, QHeaderView.ResizeToContents)
    header.setSectionResizeMode(2, QHeaderView.ResizeToContents)
    header.setSectionResizeMode(0, QHeaderView.Stretch)

    view.show()
    sys.exit(app.exec_())