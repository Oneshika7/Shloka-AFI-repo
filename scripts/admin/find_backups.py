import os

def find_backups(root_dir):
    for dirpath, dirnames, filenames in os.walk(root_dir):
        # skip venv and node_modules
        if 'venv' in dirpath or 'node_modules' in dirpath or '.git' in dirpath:
            continue
        for f in filenames:
            ext = os.path.splitext(f)[1].lower()
            if ext in ['.sql', '.dump', '.bak', '.backup', '.csv', '.json', '.txt']:
                if 'migrations' not in dirpath and 'package' not in f and 'tsconfig' not in f:
                    print(os.path.join(dirpath, f))
find_backups('/mnt/c/Users/EW0116TU/SHLOKA-AFI')
