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

async function createTable(users) {
    let tbody = document.getElementById("tbodyOfAllUsers");
    return users.reduce((body, usr) => {
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
    [newUserSelectRoles, editSelectRoles].forEach( select => {
        roles.forEach( role => {
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
    let id = row.children[0].innerHTML;
    let firstName = row.children[1].innerHTML;
    let lastName = row.children[2].innerHTML;
    let age = row.children[3].innerHTML;
    let email = row.children[4].innerHTML;

    editInputId.value = id
    editInputFirstName.value = firstName;
    editInputLastName.value = lastName;
    editInputAge.value = age;
    editInputEmail.value = email;

    modalEdit.show();
})

tool(document, 'click', '.firstDeleteButton', (ev) => {
    let row = ev.target.parentNode.parentNode;
    let id = row.children[0].innerHTML;
    let firstName = row.children[1].innerHTML;
    let lastName = row.children[2].innerHTML;
    let age = row.children[3].innerHTML;
    let email = row.children[4].innerHTML;
    let roles = row.children[5].innerHTML.split(" ");

    deleteInputId.value = id
    deleteInputFirstName.value = firstName;
    deleteInputLastName.value = lastName;
    deleteInputAge.value = age;
    deleteInputEmail.value = email;
    roles.forEach(role => {
        let option = document.createElement('option');
        option.innerHTML = role;
        deleteSelectRoles.appendChild(option);
    });
    modalDelete.show();
})

// <--- Bootstrap jQuery --->
$('#modalEditUser').on('hidden.bs.modal', function() {
    editInputId.innerHTML = '';
    editInputFirstName.innerHTML = '';
    editInputLastName.innerHTML = '';
    editInputAge.innerHTML = '';
    editInputEmail.innerHTML = '';
    editInputPassword.value = '';
})

$('#modalDeleteUser').on('hidden.bs.modal', function() {
    deleteSelectRoles.innerHTML = '';
})
// <--- /Bootstrap jQuery --->

editUserForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let updateUser = {id: editInputId.value,
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
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(updateUser)})
        .then(updateRow(updateUser))
        .catch(err => console.log(`Error: ${err}`));

    modalEdit.hide();
})

deleteUserForm.addEventListener('submit', (ev) => {
    ev.preventDefault();
    fetch(`/api/users/${deleteInputId.value}`, {method: "DELETE"})
        .then(() => removeRow(deleteInputId.value))
        .catch(err => console.log(`Error: ${err}`));
    modalDelete.hide();
})

newUserButton.addEventListener('click', () => {
    let roles = [...newUserSelectRoles.childNodes]
        .filter(role => role.selected)
        .map(role => obj = {id: role.value, name: role.text})

    fetch(`/api/users`, {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            firstName: newUserFirstName.value,
            lastName: newUserLastName.value,
            age: newUserAge.value,
            email: newUserEmail.value,
            password: newUserPassword.value,
            roles: roles
        })})
        .then(console.log)
        .then(redirectFunction)
        .catch(err => console.log(`Error: ${err}`));
})

function removeRow(id) {
    tbodyOfAllUsers.removeChild(document.getElementById(`rowUser_${id}`));
}

function updateRow(user) {
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

