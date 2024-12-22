# Setup

#### PyEnv

- Setup **PyEnv** to install and use local Python version,  
  `curl https://pyenv.run | bash`

- Config your shell environment to use **PyEnv** by following [this](https://github.com/pyenv/pyenv?tab=readme-ov-file#b-set-up-your-shell-environment-for-pyenv)

#### Virtual Environment

- Bootstrap the Virtual Environment and install all the dependencies by running the following commands at the project root,
  
  ```
  chmod +x scripts/setup.sh
  scripts/setup.sh
  ```
  
  More details can be found [here](https://www.freecodecamp.org/news/how-to-setup-virtual-environments-in-python/)

# Usage

- For VSCode, install the extension `ms-python` and ensure the Virtual Environment is properly detected
- Go to any file of interest (_say `browser/simple.py`_) and either run the file directly using play icon ▶ (_on the **top-right** corner_) or debug it using the config in `launch.json` to get the full debugging capability

# Misc

#### Tree Folder

This was checked-in for the reference sake. To try them out,

- Uncomment the **PyQt5** package in `requirements.txt`
- Run the command `pip install -r requirements.txt`
- Remove the `.bak` extension and happy debugging !
