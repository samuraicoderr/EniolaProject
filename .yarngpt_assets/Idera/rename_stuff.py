import os

# Get current directory
directory = os.getcwd()

for filename in os.listdir(directory):
    # Check if file ends with .mp3
    if filename.lower().endswith(".mp3"):
        name, ext = os.path.splitext(filename)
        
        # Skip if already renamed
        if not name.endswith("_in_yoruba_translation"):
            new_name = f"{name}_in_yoruba_translation{ext}"
            
            old_path = os.path.join(directory, filename)
            new_path = os.path.join(directory, new_name)
            
            # os.rename(old_path, new_path)
            print(f"Renamed: {filename} → {new_name}")

print("Done ✅")