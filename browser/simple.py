import sys

from PySide6.QtCore import QUrl
from PySide6.QtWidgets import QApplication, QHBoxLayout, QLineEdit
from PySide6.QtWidgets import QMainWindow, QPushButton, QVBoxLayout
from PySide6.QtWidgets import QWidget
from PySide6.QtWebEngineWidgets import QWebEngineView


class Widgets(QMainWindow):

    def __init__(self):
        QMainWindow.__init__(self)
        self.setWindowTitle("Simple Web Browser")
        self.widget = QWidget(self)

        # Where the webpage is rendered.
        self.webview = QWebEngineView()

        # Simple Web browser
        self.webview.load(QUrl("https://www.python.org/"))
        self.webview.urlChanged.connect(self.url_changed)

        # Navigation buttons.
        self.back_button = QPushButton("<")
        self.back_button.clicked.connect(self.webview.back)
        self.forward_button = QPushButton(">")
        self.forward_button.clicked.connect(self.webview.forward)
        self.refresh_button = QPushButton("Refresh")
        self.refresh_button.clicked.connect(self.webview.reload)

        # URL address bar.
        self.url_text = QLineEdit()
        self.url_text.returnPressed.connect(self.url_set)

        # Button to load the current page.
        self.go_button = QPushButton("Go")
        self.go_button.clicked.connect(self.url_set)

        self.toplayout = QHBoxLayout()
        self.toplayout.addWidget(self.back_button)
        self.toplayout.addWidget(self.forward_button)
        self.toplayout.addWidget(self.refresh_button)
        self.toplayout.addWidget(self.url_text)
        self.toplayout.addWidget(self.go_button)

        self.layout = QVBoxLayout()
        self.layout.addLayout(self.toplayout)
        self.layout.addWidget(self.webview)

        self.widget.setLayout(self.layout)
        self.setCentralWidget(self.widget)

    def url_changed(self, url):
        """Refresh the address bar"""
        self.url_text.setText(url.toString())

    def url_set(self):
        """Load the new URL"""
        self.webview.setUrl(QUrl(self.url_text.text()))


if __name__ == "__main__":
    app = QApplication(sys.argv)
    window = Widgets()
    window.show()
    sys.exit(app.exec())
