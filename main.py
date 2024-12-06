import sys
from PySide6.QtCore import Qt, Slot
from PySide6.QtWidgets import QApplication, QLabel
# from PySide6.QtGui import QAction


@Slot
def printHello():
    print("Hello world")


if __name__ == "__main__":
    app = QApplication()
    label = QLabel("Placeholder text")
    label.setAlignment(Qt.AlignCenter)
    label.show()
    sys.exit(app.exec())
