import sys
from PySide6.QtCore import QUrl
from PySide6.QtWidgets import (QApplication, QHBoxLayout, QLineEdit,
                              QMainWindow, QPushButton, QVBoxLayout,
                              QWidget)
from PySide6.QtWebEngineWidgets import QWebEngineView

class ExtractorBrowser(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("Web Browser with Text Extractor")
        self.setGeometry(100, 100, 1024, 768)
        
        main_widget = QWidget()
        self.setCentralWidget(main_widget)
        layout = QVBoxLayout(main_widget)
        
        nav_bar = QHBoxLayout()
        
        self.back_btn = QPushButton("<")
        self.back_btn.clicked.connect(self.navigate_back)
        nav_bar.addWidget(self.back_btn)
        
        self.forward_btn = QPushButton(">")
        self.forward_btn.clicked.connect(self.navigate_forward)
        nav_bar.addWidget(self.forward_btn)
        
        self.url_bar = QLineEdit()
        self.url_bar.returnPressed.connect(self.navigate_to_url)
        nav_bar.addWidget(self.url_bar)
        
        self.extract_btn = QPushButton("Extract")
        self.extract_btn.clicked.connect(self.extract_text)
        nav_bar.addWidget(self.extract_btn)
        
        layout.addLayout(nav_bar)
        
        self.web_view = QWebEngineView()
        self.web_view.setUrl(QUrl("https://www.python.org"))
        self.web_view.urlChanged.connect(self.update_url)
        layout.addWidget(self.web_view)
        
    def navigate_back(self):
        self.web_view.back()
        
    def navigate_forward(self):
        self.web_view.forward()
        
    def navigate_to_url(self):
        url = QUrl(self.url_bar.text())
        self.web_view.setUrl(url)
        
    def update_url(self, url):
        self.url_bar.setText(url.toString())
        
    def extract_text(self):
        # JavaScript to get selected text
        js = """
        (function() {
            var selectedText = window.getSelection().toString();
            return selectedText;
        })()
        """
        # Execute JavaScript and handle the result
        self.web_view.page().runJavaScript(js, self.handle_extracted_text)
        
    def handle_extracted_text(self, text):
        if text:
            print("Extracted text:", text)
        else:
            print("No text selected")

if __name__ == "__main__":
    app = QApplication(sys.argv)
    browser = ExtractorBrowser()
    browser.show()
    sys.exit(app.exec())