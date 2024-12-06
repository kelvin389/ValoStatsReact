# lazy way to update mapdat.json and all the minimap images it links to
# should also update mapdat.json, agent icons, etc but it doesnt lol
import json
import requests

with open("mapdat.json") as f:
    data = json.load(f)
    data = data["data"]

    ####################
    # download images
    ####################
    for map in data:
        # skip maps without a minimap
        if not map["displayIcon"]:
            continue

        try:
            # send a request to minimap url as retrieved in json data
            url = map["displayIcon"]
            response = requests.get(url)
            response.raise_for_status()  # Raise an exception for HTTP errors
            
            # save file locally and name it with uuid
            file_dir = "images/minimaps/"
            new_fname = map["displayName"] + ".png"
            with open(file_dir + new_fname, "wb") as file:
                file.write(response.content)
            
            print(f"File downloaded and saved in {file_dir + new_fname}")
        except requests.exceptions.RequestException as e:
            print(f"An error occurred: {e}")


    ####################
    # generate index.ts
    ####################
    with open("images/minimaps/index.ts", "w") as f:
        for map in data:
            # skip maps without a minimap
            if not map["displayIcon"]:
                continue

            f.write(f"import {map["displayName"]} from './{map["displayName"]}.png';\n")


        # Write the exported object containing all agent icons
        f.write("\nexport const MinimapIcons = {\n")

        for map in data:
            # skip maps without a minimap
            if not map["displayIcon"]:
                continue
            f.write(f"  {map["displayName"]},\n")
        f.write("};\n")

        print("TypeScript file 'AgentIcons.ts' generated!")