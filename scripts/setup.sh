# Install Python Version
pyenv install --skip-existing
# Wait for installation
wait $!
# Install virtual environment package
pip install virtualenv
# Create a directory for the virtual environment
python -m venv env
# Activate it
source env/bin/activate
# Install the dependencies
pip install -r requirements.txt