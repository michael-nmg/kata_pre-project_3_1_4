window.onload = function userTable() {
    fetch("/api/users")
        .then(res => res.json())
        .then(data => createTable(data))
        .catch(err => console.log(`Error: ${err}`));

    fetch("/api/users/roles")
        .then(res => res.json())
        .then(data => rolesBroadcast(data))
        .catch(err => console.log(`Error: ${err}`));

    fetch("api/user")
        .then(res => res.json())
        .then(data => {
            navbarPreview(data);
            userPreview(data);
        }).catch(err => console.log(`Error: ${err}`));
}

let modalEdit = new bootstrap.Modal(document.getElementById('modalEditUser'));
let modalDelete = new bootstrap.Modal(document.getElementById('modalDeleteUser'));
const csrfToken = document.cookie.replace(/(?:(?:^|.*;\s*)XSRF-TOKEN\s*\=\s*([^;]*).*$)|^.*$/, '$1');

async function createTable(users) {
    let tbody = document.getElementById("tbodyOfAllUsers");
    users.reduce((body, usr) => {
        let tr = document.createElement('tr');
        tr.setAttribute('id', `rowUser_${usr.id}`);
        ['id', "firstName", "lastName", "age", "email"].forEach(col => {
            let td = document.createElement('td');
            td.innerHTML = usr[col];
            tr.appendChild(td);
        })

        let td = document.createElement('td');
        td.innerHTML = usr["roles"].map(role => role.name).join(' ');
        tr.appendChild(td);

        td = document.createElement('td');
        let editButton = document.createElement('button');
        editButton.setAttribute('type', 'submit');
        editButton.setAttribute('class', 'btn btn-info firstEditButton');
        editButton.setAttribute('data-toggle', 'modal');
        editButton.setAttribute('data-target', `#editUser_${usr.id}`);
        editButton.innerHTML = 'Edit';
        td.appendChild(editButton);
        tr.appendChild(td);

        td = document.createElement('td');
        let deleteButton = document.createElement('button');
        deleteButton.setAttribute('type', 'submit');
        deleteButton.setAttribute('class', 'btn btn-danger firstDeleteButton');
        deleteButton.setAttribute('data-toggle', 'modal');
        deleteButton.setAttribute('data-target', `#deleteUser_${usr.id}`);
        deleteButton.innerHTML = 'Delete';
        td.appendChild(deleteButton);
        tr.appendChild(td);
        tbody.appendChild(tr);
        return tbody;
    }, tbody)
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

async function rolesBroadcast(roles) {
    [newUserSelectRoles, editSelectRoles].forEach(select => {
        roles.forEach(role => {
            let option = document.createElement('option');
            option.value = role.id;
            option.text = role.name;
            select.appendChild(option);
        })
    })
}

const tool = (element, event, selector, handler) => {
    element.addEventListener(event, (e) => {
        if (e.target.closest(selector)) {
            handler(e);
        }
    })
}

tool(document, 'click', '.firstEditButton', (ev) => {
    let row = ev.target.parentNode.parentNode;
    editInputId.value = row.children[0].innerHTML;
    editInputFirstName.value = row.children[1].innerHTML;
    editInputLastName.value = row.children[2].innerHTML;
    editInputAge.value = row.children[3].innerHTML;
    editInputEmail.value = row.children[4].innerHTML;
    modalEdit.show();
})

tool(document, 'click', '.firstDeleteButton', (ev) => {
    let row = ev.target.parentNode.parentNode;
    deleteInputId.value = row.children[0].innerHTML;
    deleteInputFirstName.value = row.children[1].innerHTML;
    deleteInputLastName.value = row.children[2].innerHTML;
    deleteInputAge.value = row.children[3].innerHTML;
    deleteInputEmail.value = row.children[4].innerHTML;
    row.children[5].innerHTML.split(" ")
        .forEach(role => {
        let option = document.createElement('option');
        option.innerHTML = role;
        deleteSelectRoles.appendChild(option);
    });
    modalDelete.show();
})

// <--- Bootstrap jQuery --->
$('#modalEditUser').on('hidden.bs.modal', function () {
    editInputId.innerHTML = '';
    editInputFirstName.innerHTML = '';
    editInputLastName.innerHTML = '';
    editInputAge.innerHTML = '';
    editInputEmail.innerHTML = '';
    editInputPassword.value = '';
})

$('#modalDeleteUser').on('hidden.bs.modal', function () {
    deleteSelectRoles.innerHTML = '';
})
// <--- /Bootstrap jQuery --->

editUserForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let updateUser = {
        id: editInputId.value,
        firstName: editInputFirstName.value,
        lastName: editInputLastName.value,
        age: editInputAge.value,
        email: editInputEmail.value,
        password: editInputPassword.value,
        roles: [...editSelectRoles.childNodes]
            .filter(role => role.selected)
            .map(role => obj = {id: role.value, name: role.text})
    }

    fetch(`/api/users/${editInputId.value}`, {
        method: "PATCH",
        headers: {'Content-Type': 'application/json', 'X-XSRF-TOKEN': csrfToken},
        body: JSON.stringify(updateUser)
    })
        .then(updateRow(updateUser))
        .catch(err => console.log(`Error: ${err}`));

    modalEdit.hide();
})

deleteUserForm.addEventListener('submit', (ev) => {
    ev.preventDefault();
    fetch(`/api/users/${deleteInputId.value}`, {
        method: "DELETE",
        headers: {'X-XSRF-TOKEN': csrfToken}
    })
        .then(() => removeRow(deleteInputId.value))
        .catch(err => console.log(`Error: ${err}`));

    modalDelete.hide();
})

newUserButton.addEventListener('click', (ev) => {
    ev.preventDefault();
    let newUser = {
        firstName: newUserFirstName.value,
        lastName: newUserLastName.value,
        age: newUserAge.value,
        email: newUserEmail.value,
        password: newUserPassword.value,
        roles: [...newUserSelectRoles.childNodes]
            .filter(role => role.selected)
            .map(role => obj = {id: role.value, name: role.text})
    }

    fetch(`/api/users`, {
        method: "POST",
        headers: {'Content-Type': 'application/json', 'X-XSRF-TOKEN': csrfToken},
        body: JSON.stringify(newUser)
    })
        .then(() =>
            fetch('http://localhost:8080/api/users')
                .then(res => res.json())
                .then(data => createTable(data.slice(-1))))
        .then(() => switchTabsOnNewUser())
        .catch(err => console.log(`Error: ${err}`));
})

async function removeRow(id) {
    tbodyOfAllUsers.removeChild(document.getElementById(`rowUser_${id}`));
}

async function switchTabsOnNewUser() {
    let home = document.getElementById('home');
    let profile = document.getElementById('profile');
    let homeTab = document.getElementById('home-tab');
    let profileTab = document.getElementById('profile-tab');

    profileTab.classList.remove('active');
    profile.classList.remove('active', 'show');
    homeTab.classList.add('active');
    home.classList.add('active', 'show');

    newUserFirstName.value = '';
    newUserLastName.value = '';
    newUserAge.value = '';
    newUserEmail.value = '';
    newUserPassword.value = '';
}

async function updateRow(user) {
    let row = document.getElementById(`rowUser_${user.id}`);
    row.children[1].innerHTML = user.firstName;
    row.children[2].innerHTML = user.lastName;
    row.children[3].innerHTML = user.age;
    row.children[4].innerHTML = user.email;
    row.children[5].innerHTML = user.roles.map(role => role.name).join(' ');
}

async function redirectFunction() {
    window.location.replace("/admin");
}

