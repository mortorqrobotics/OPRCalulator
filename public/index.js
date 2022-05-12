(async () => {
    let [events, categories] = await Promise.all([getData("/api/events"), getData("/api/categories")]);

    appendOptions(events, "events");
    appendOptions(categories, "categories");
    await appendTeamsForEvent(events[0]);
})();

document.getElementById("events").addEventListener('change', (e) => {
    appendTeamsForEvent(e.target.value);
})

async function appendTeamsForEvent(eventId) {
    let teams = await getData(`/api/teams?event=${eventId}`);
    teams = ["Show all teams", ...teams]
    document.getElementById("teams").innerHTML = '';
    appendOptions(teams, "teams");
}

function appendOptions(arr, parentId) {
    for(let item of arr) {
        let option = document.createElement('option');
        option.value = item;
        option.textContent = item;

        document.getElementById(parentId).appendChild(option);
    }
}

async function getData(path) {
    let response = await fetch(path);
    let data = response.json();
    return data;
}

document.getElementById('inputs').addEventListener('submit', async (e) => {
    e.preventDefault();

    let options = document.querySelector('form').querySelectorAll('select');
    let event = options[0].value;
    let team = options[1].value;
    let category = e.target[2].value;

    if(team === "Show all teams") {
        return await allTeams(event, category);
    }

    return await oneTeam(event, team, category);
})

async function allTeams(event, category) {
    let response = await fetch(`/api/average?event=${event}&category=${category}`)
    let data = await response.json();

    let averages = Object.entries(data);
    averages.sort((a, b) => b[1] - a[1]);

    document.querySelector('p').innerHTML = "";
    for([team, points] of averages) {
        document.querySelector('p').innerHTML += `${team} | ${points.toFixed(2)}<br>`;
    }
}

async function oneTeam(event, team, category) {
    let response = await fetch(`/api/averageTeam?event=${event}&category=${category}&team=${team}`)
    let data = await response.json();

    document.querySelector('p').textContent = data.toFixed(2);
}