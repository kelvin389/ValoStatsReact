# lazy way to update mapdat.json and all the minimap images it links to
# should also update mapdat.json, agent icons, etc but it doesnt lol
import json
import requests
import sys

args = sys.argv[1:]

MAPS_URL = "https://valorant-api.com/v1/maps"
AGENTS_URL = "https://valorant-api.com/v1/agents?isPlayableCharacter=true"
COMPETITIVETIERS_URL = "https://valorant-api.com/v1/competitivetiers"

if len(args) == 0:
    print("usage: ./update_assets.py [keyword(s)]\npossible keywords: 'all', 'maps', 'agents', 'ranks'")
    exit()

# specifically for KAY/O to remove the "/"
def sanitize_agent_name(name):
    return name.replace("/", "")

def sanitize_rank_name(name):
    return name.replace(" ", "")

if "maps" in args or "all" in args:
    ####################
    # update maps json
    ####################
    with open("json/maps.json", "wb") as maps:
        try:
            response = requests.get(MAPS_URL)
            response.raise_for_status()
            maps.write(response.content)
        except requests.exceptions.RequestException as e:
            print(f"An error occurred getting maps json: {e}")

    ####################
    # update minimap images
    ####################
    with open("json/maps.json") as maps:
        data = json.load(maps)
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
                with open(file_dir + new_fname, "wb") as out_file:
                    out_file.write(response.content)
                
                print(f"File downloaded and saved in {file_dir + new_fname}")
            except requests.exceptions.RequestException as e:
                print(f"An error occurred getting minimaps: {e}")


        ####################
        # generate index.ts
        ####################
        with open("images/minimaps/index.ts", "w") as f:
            for map in data:
                # skip maps without a minimap
                if not map["displayIcon"]:
                    continue

                f.write(f"import {map["displayName"]} from './{map["displayName"]}.png';\n")


            # Write the exported object containing all minimap images
            f.write("\nexport const MinimapIcons = {\n")

            for map in data:
                # skip maps without a minimap
                if not map["displayIcon"]:
                    continue
                f.write(f"  {map["displayName"]},\n")
            f.write("};\n")

            print("index.ts generated for maps")

if "agents" in args or "all" in args:
    ####################
    # update agents json
    ####################
    with open("json/agents.json", "wb") as agents:
        try:
            response = requests.get(AGENTS_URL)
            response.raise_for_status()
            agents.write(response.content)
        except requests.exceptions.RequestException as e:
            print(f"An error occurred getting agents json: {e}")

    ####################
    # update agent images
    ####################
    with open("json/agents.json") as agents:
        data = json.load(agents)
        data = data["data"]

        ####################
        # download images
        ####################
        for agent in data:
            # skip agents without an icon
            if not agent["displayIcon"]:
                continue

            try:
                # send a request to agent url as retrieved in json data
                url = agent["displayIcon"]
                response = requests.get(url)
                response.raise_for_status()  # Raise an exception for HTTP errors
                
                # save file locally and name it with uuid
                file_dir = "images/agent-icons/"
                new_fname = sanitize_agent_name(agent["displayName"]) + ".png"
                with open(file_dir + new_fname, "wb") as out_file:
                    out_file.write(response.content)
                
                print(f"File downloaded and saved in {file_dir + new_fname}")
            except requests.exceptions.RequestException as e:
                print(f"An error occurred getting minimaps: {e}")


        ####################
        # generate index.ts
        ####################
        with open("images/agent-icons/index.ts", "w") as f:
            for agent in data:
                # skip agents without an icon
                if not agent["displayIcon"]:
                    continue

                f.write(f"import {sanitize_agent_name(agent["displayName"])} from './{sanitize_agent_name(agent["displayName"])}.png';\n")


            # Write the exported object containing all agent icons
            f.write("\nexport const AgentIcons = {\n")

            for agent in data:
                # skip agents without an icon
                if not agent["displayIcon"]:
                    continue
                f.write(f"  {sanitize_agent_name(agent["displayName"])},\n")
            f.write("};\n")

            print("index.ts generated for agents")

if "ranks" in args or "all" in args:
    ####################
    # update agents json
    ####################
    with open("json/competitivetiers.json", "wb") as ranks:
        try:
            response = requests.get(COMPETITIVETIERS_URL)
            response.raise_for_status()
            ranks.write(response.content)
        except requests.exceptions.RequestException as e:
            print(f"An error occurred getting ranks json: {e}")

    ####################
    # update agent images
    ####################
    with open("json/competitivetiers.json") as ranks:
        data = json.load(ranks)
        data = data["data"][-1]["tiers"] # get the last item to get the latest ranks

        ####################
        # download images
        ####################
        for rank in data:
            # skip agents without an icon
            if not rank["smallIcon"]:
                continue

            try:
                # send a request to agent url as retrieved in json data
                url = rank["smallIcon"]
                response = requests.get(url)
                response.raise_for_status()  # Raise an exception for HTTP errors
                
                # save file locally and name it with uuid
                file_dir = "images/rank-icons/"
                new_fname = str(rank["tier"]) + ".png"
                with open(file_dir + new_fname, "wb") as out_file:
                    out_file.write(response.content)
                
                print(f"File downloaded and saved in {file_dir + new_fname}")
            except requests.exceptions.RequestException as e:
                print(f"An error occurred getting ranks: {e}")


        ####################
        # generate index.ts
        ####################
        with open("images/rank-icons/index.ts", "w") as f:
            for rank in data:
                # skip agents without an icon
                if not rank["smallIcon"]:
                    continue

                f.write(f"import {sanitize_rank_name(rank["tierName"])} from './{rank["tier"]}.png';\n")


            # Write the exported object containing all agent icons
            f.write("\nexport const RankIcons = {\n")

            for rank in data:
                # skip agents without an icon
                if not rank["smallIcon"]:
                    continue
                f.write(f"  {rank["tier"]}: {sanitize_rank_name(rank["tierName"])},\n")
            f.write("};\n")

            print("index.ts generated for ranks")