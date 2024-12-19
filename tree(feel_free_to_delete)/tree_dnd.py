import sys
from PyQt5.QtCore import *
from PyQt5.QtGui import *
from PyQt5.QtWidgets import *


class DragDropTreeWidget(QTreeWidget):
    def __init__(self):
        super(DragDropTreeWidget, self).__init__()
        # I'm using the QTreeWidget like a QTableWidget here.
        self.setRootIsDecorated(False)
        self.setSelectionMode(QAbstractItemView.SingleSelection)

    def mimeTypes(self):
        mimetypes = QTreeWidget.mimeTypes(self)
        mimetypes.append("text/plain")
        return mimetypes

    def startDrag(self, allowableActions):
        drag = QDrag(self)

        # only one item is selectable at once so self.selectedItems() should have a length of 1 only
        selectedItems = self.selectedItems()
        if len(selectedItems) < 1:
            return
        # else use the first item
        selectedTreeWidgetItem = selectedItems[0]

        # for this to work, just note that you need to add your own extension to the QTreeWidgetItem
        # so you can implement this simple data getter method.
        dragAndDropName = selectedTreeWidgetItem.dragAndDropName()

        mimedata = QMimeData()
        mimedata.setText(dragAndDropName)
        drag.setMimeData(mimedata)
        drag.exec_(allowableActions)

    def dropEvent(self, event):
        if event.mimeData().hasFormat("text/plain"):
            passedData = event.mimeData().text()
            event.acceptProposedAction()
            print("passedData", passedData)
            # TODO handle drop event (prob emit a signal to be caught somewhere else)


def window():
    app = QApplication(sys.argv)
    w = QWidget()
    b = QLabel(w)
    b.setText("Hello World!")
    w.setGeometry(100, 100, 200, 50)
    b.move(50, 20)
    w.setWindowTitle("PyQt5")
    treeWidget = DragDropTreeWidget()
    header = QTreeWidgetItem(["Header Name"])
    treeWidget.setHeaderItem(header)
    w.show()
    sys.exit(app.exec_())


if __name__ == '__main__':
    window()
