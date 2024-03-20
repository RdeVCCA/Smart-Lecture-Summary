import os
def delete_empty_folders(directory):
    for root, dirs, files in os.walk(directory, topdown=False):
        for name in dirs:
            dir_path = os.path.join(root, name)
            try:
                if not os.listdir(dir_path):
                    try:
                        os.rmdir(dir_path)
                        print("Removed empty folder:", dir_path)
                    except:
                        print(f"Failed to remove {dir_path}")
            except:
                print(f"Failed to list {dir_path}")

delete_empty_folders("upload")