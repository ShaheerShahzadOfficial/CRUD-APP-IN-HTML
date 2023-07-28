var selectedRow = null;

// Show Alerts
function showAlert(message, className) {
    const div = document.createElement("div");
    div.className = `alert alert-${className}`;

    div.appendChild(document.createTextNode(message));
    const container = document.querySelector(".container");
    const main = document.querySelector(".main");
    container.insertBefore(div, main);

    setTimeout(() => document.querySelector(".alert").remove(), 3000);
}

// Clear All Fields
function clearFields() {
    document.querySelector("#firstName").value = "";
    document.querySelector("#lastName").value = "";
    document.querySelector("#rollNo").value = "";
}

// Add Data

const API_BASE_URL = "http://localhost:3001" // change this local host url with hosted url 
const list = document.querySelector("#student-list");


// All Product form Api
const getData = async () => {
    //     await axios.get(`${API_BASE_URL}/products`).then((result)=>{

    // const newArray = result.data?.data

    // for (let index = 0; index < result.data?.data?.length; index++) {

    //     const row = document.createElement("tr");

    //     row.innerHTML = `
    //     <td>${newArray[index]?.name}</td>
    //     <td>${newArray[index]?.price}</td>
    //     <td>${newArray[index]?.description}</td>
    //     <td>
    //     <a href="#" class="btn btn-warning btn-sm edit">Edit</a>
    //     <a href="#" class="btn btn-danger btn-sm delete">Delete</a>
    //     `;
    //     list.appendChild(row);

    // }


    //     }).catch((error)=>{
    //         console.log(error?.response?.data)
    //         showAlert(error?.response?.data, "danger");

    //     })

    await axios.get(`${API_BASE_URL}/products`).then((result) => {
        const newArray = result.data?.data
        for (let index = 0; index < newArray.length; index++) {

            const row = document.createElement("tr");

            row.innerHTML = `
            <td>${newArray[index]?._id}</td>
                <td>${newArray[index]?.name}</td>
                <td>${newArray[index]?.price}</td>
                <td>${newArray[index]?.description}</td>
                <td>
                <a href="#" class="btn btn-warning btn-sm edit">Edit</a>
                <a href="#" class="btn btn-danger btn-sm delete">Delete</a>
            `;
            list.appendChild(row);

        }
    }).catch((error) => {
        showAlert(error?.response?.data, "danger");

    })


}
getData()

// Edit Product
const editData = async (id, name, price, description) => {
    await axios.put(`${API_BASE_URL}/product/${id}`, {
        name,
        price,
        description
    }).then((result) => {

        showAlert(result?.data?.message, "info");


    }).catch((error) => {
        console.log(error?.response?.data)
        showAlert(error?.response?.data, "danger");

    })
}




// DELETE PRODUCTS


const deleteProduct = async (id) => {
    await axios.delete(`${API_BASE_URL}/product/${id}`).then((result) => {
        showAlert(result?.data?.message, "danger");   // returning the message Product is deleted
    }).catch((error) => {
        console.log(error?.response?.data)
        showAlert(error?.response?.data, "danger");

    })
}



//  Creating A new Project

const addProject = async (name, price, description) => {
    await axios.post(`${API_BASE_URL}/product`, {
        name, price, description
    }).then((result) => {
        showAlert(result?.data?.message, "info"); // getting the message product created
        getData()
    }).catch((error) => {
        console.log(error?.response?.data)
        showAlert(error?.response?.data, "danger");

    })
}


document.querySelector("#student-form").addEventListener("submit", (e) => {
    e.preventDefault();

    // Get Form Values
    const firstName = document.querySelector("#firstName").value;
    const lastName = document.querySelector("#lastName").value;
    const rollNo = document.querySelector("#rollNo").value;

    // validate
    if (firstName == "" || lastName == "" || rollNo == "") {
        showAlert("Please fill in all fields", "danger");
    }
    else {
        if (selectedRow == null) {
            const list = document.querySelector("#student-list");
            const row = document.createElement("tr");

            // row.innerHTML = `
            //     <td>${firstName}</td>
            //     <td>${lastName}</td>
            //     <td>${rollNo}</td>
            //     <td>
            //     <a href="#" class="btn btn-warning btn-sm edit">Edit</a>
            //     <a href="#" class="btn btn-danger btn-sm delete">Delete</a>
            // `;
            // list.appendChild(row);

            addProject(firstName,lastName,rollNo)
            selectedRow = null;
            // showAlert("Student Added", "success");
        }
        else {
            selectedRow.children[1].textContent = firstName;
            selectedRow.children[2].textContent = lastName;
            selectedRow.children[3].textContent = rollNo;
            editData(selectedRow.children[0].textContent, firstName, lastName, rollNo)
            console.log(selectedRow)
            selectedRow = null;

        }

        clearFields();
    }
});

// Edit Data

document.querySelector("#student-list").addEventListener("click", (e) => {
    target = e.target;
    if (target.classList.contains("edit")) {
        selectedRow = target.parentElement.parentElement;
        document.querySelector("#firstName").value = selectedRow.children[1].textContent;
        document.querySelector("#lastName").value = selectedRow.children[2].textContent;
        document.querySelector("#rollNo").value = selectedRow.children[3].textContent;
    }
});


// Delete Data

document.querySelector("#student-list").addEventListener("click", (e) => {
    target = e.target;
    if (target.classList.contains("delete")) {
        selectedRow = target.parentElement.parentElement;

        deleteProduct(selectedRow.children[0].textContent)  // Passing Id on Function
        // showAlert("Student Data Deleted", "danger");
        target.parentElement.parentElement.remove();

    }
});