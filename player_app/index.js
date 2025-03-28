const socket = io("http://localhost:5050", { path: "/rea-time" });

// ---- WOLF GAME ----
let userData = {};

// ---- LOGIN ELEMENTS ----
const loginSection = document.getElementById("login");
const loginForm = document.getElementById("login-form");
const usernameInput = document.getElementById("username");

// ---- GAME ELEMENTS ----
const gameSection = document.getElementById("game-section");

// GAME LOGIC
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    userData.username = usernameInput.value;

    fetch('http://localhost:5050/join-game', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
    body: JSON.stringify({ username: userData.username }),
    }).then((response) => response.json())
    .then((data) => {
        if (data.message !== '201') {
            alert(data.message);
        } else {
            userData = { ...userData, ...data };
            loginSection.style.display = "none";
            gameSection.style.display = "flex";
            gameSection.innerHTML =`
                <style>
                    body {
                        background-color: #aliceblue; 
                    }
                </style>

                <h2>${userData.username}</h2>
                <h5>Your Role is:</h5>
                <h3>${userData.role}</h3>
                <p>Wait for the narrator...</p>
            `;
            return data;
        }
    });
});

socket.on('notificar-dia', (data) => {
    if(userData.role === "villager") {
        gameSection.innerHTML = `
            <style>
                    body {
                        background-color: rgb(127, 190, 239); 
                    }
            </style>

            <h2>${userData.username}</h2>
            <h5>Your Role is:</h5>
            <h3>${userData.role}</h3>
            <h2>${data.message}</h2>
            <p>It's day time, talk with the other villagers to select who to kill!</p>
            <ul id="player-list"></ul>
        `;
    
        const playerList = document.getElementById('player-list');
    
        data.players.forEach(player => {
            const playerElement = document.createElement('li');
            playerElement.innerHTML = `
                <h4>${player.username}</h4>
            `;
            playerList.appendChild(playerElement);
        })
    } else {
        gameSection.innerHTML = `
            <style>
                body {
                    background-color: rgb(127, 190, 239); 
                }
            </style>

            <h2>${userData.username}</h2>
            <h5>Your Role is:</h5>
            <h3>${userData.role}</h3>
            <h2>${data.message}</h2>
            <p>It's day time, wait for the villagers to make a decision!</p>
        `;
    }
});

socket.on('notificar-noche', (data) => {
    if(userData.role === "villager") {
        gameSection.innerHTML = `
            <style>
                body {
                    background-color: rgb(27, 6, 47); 
                }
                
                * {
                    color: white;
                }
            </style>

            <h2>${userData.username}</h2>
            <h5>Your Role is:</h5>
            <h3>${userData.role}</h3>
            <h2>${data.message}</h2>
            <p>It's Night Time, wait for the wolves to make a move</p>
        `;
    } else {
        gameSection.innerHTML = `
            <style>
                body {
                    background-color: rgb(27, 6, 47); 
                }

                * {
                    color: white;
                }
            </style>


            <h2>${userData.username}</h2>
            <h5>Your Role is:</h5>
            <h3>${userData.role}</h3>
            <h2>${data.message}</h2>
            <p>It's Night Time, talk with the other wolf to kill a villager!</p>
            <ul id="player-list"></ul>
        `;
    
        const playerList = document.getElementById('player-list');
    
        data.players.forEach(player => {
            if(player.role === 'villager') {
                const playerElement = document.createElement('li');
                playerElement.innerHTML = `
                    <h4>${player.username}</h4>
                `;
                playerList.appendChild(playerElement);
            }
        })
    }
});
