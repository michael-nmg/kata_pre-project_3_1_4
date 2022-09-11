window.onload = function userTable() {
    fetch("api/user")
        .then(res => res.json())
        .then(data => {
            navbarPreview(data);
            userPreview(data);
        }).catch(err => console.log(`Error: ${err}`));
}

async function userPreview(usr) {
    let tbody = document.getElementById("bodyUserPage");
    let tr = document.createElement('tr');

    ['id', "firstName", "lastName", "age", "email"].forEach(column => {
        let td = document.createElement('td');
        td.innerHTML = usr[column];
        tr.appendChild(td);
    })

    let td = document.createElement('td');
    td.innerHTML = usr["roles"].map(role => role.name).join(' ');
    tr.appendChild(td);
    tbody.appendChild(tr);
}

async function navbarPreview(usr) {
    let roles = usr.roles.map(role => role.name).join(' ')
    document.getElementById("navbarMainText").text = `${usr.email} with roles: ${roles}`;
}
