// GAME ELEMENTS
const dayButton = document.getElementById('day-button');
const nightButton = document.getElementById('night-button');

const listPlayers = document.getElementById('list-button');
const playerList = document.getElementById('player-list');


// GAME LOGIC
dayButton.addEventListener('click', () => {
    fetch('http://localhost:5050/notificar-dia', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({message: 'dia'}),
    }).then((response) => response.json())
    .then((data) => {
        alert(data.message);

        return data;
    }) 
});


nightButton.addEventListener('click', () => {
    fetch('http://localhost:5050/notificar-noche', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({message: 'noche'}),
    }).then((response) => response.json())
    .then((data) => {
        alert(data.message);

        return data;
    }) 
});

listPlayers.addEventListener('click', () => {
    fetch('http://localhost:5050/users')
    .then((response) => response.json())
    .then((data) => {
        data.forEach((player) => {
            const playerElement = document.createElement('li');

            playerElement.innerHTML = `
                <p>${player.username}, is a ${player.role}</p>
            `;

            playerList.appendChild(playerElement);
        });
    })
    .catch((error) => console.error("Error:", error));
});