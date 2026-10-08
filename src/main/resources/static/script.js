// ============================================================
// GLOBAL DATA
// ============================================================

let allStudents = [];


// ============================================================
// PAGE LOAD
// ============================================================

document.addEventListener("DOMContentLoaded", function () {

    getAllStudents();

    const studentForm =
        document.getElementById("studentForm");

    if (studentForm) {

        studentForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();

                const studentId =
                    document.getElementById("studentId").value;

                const student = {

                    name:
                        document
                            .getElementById("name")
                            .value
                            .trim(),

                    age:
                        parseInt(
                            document
                                .getElementById("age")
                                .value
                        ),

                    email:
                        document
                            .getElementById("email")
                            .value
                            .trim(),

                    rollNo:
                        parseInt(
                            document
                                .getElementById("rollNo")
                                .value
                        ),

                    address:
                        document
                            .getElementById("address")
                            .value
                            .trim()
                };

                if (studentId) {

                    updateStudent(
                        studentId,
                        student
                    );

                } else {

                    createStudent(student);

                }

            }
        );
    }

});


// ============================================================
// CREATE
// ============================================================

function createStudent(student) {

    fetch("/api/students/create", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(student)

    })

        .then(async response => {

            if (!response.ok) {

                const errorText =
                    await response.text();

                throw new Error(
                    errorText ||
                    "Failed to create student"
                );
            }

            return response.json();

        })

        .then(data => {

            alert(
                "Student created successfully!"
            );

            clearForm();

            getAllStudents();

        })

        .catch(error => {

            console.error(
                "Create Error:",
                error
            );

            alert(
                "Error creating student: " +
                error.message
            );

        });
}


// ============================================================
// GET ALL STUDENTS
// Active + Deleted
// ============================================================

function getAllStudents() {

    fetch("/api/students/getAll")

        .then(async response => {

            if (!response.ok) {

                const errorText =
                    await response.text();

                throw new Error(
                    errorText ||
                    "Failed to fetch students"
                );
            }

            return response.json();

        })

        .then(students => {

            allStudents =
                Array.isArray(students)
                    ? students
                    : [];

            displayActiveStudents();

            displayAllStudents();

        })

        .catch(error => {

            console.error(
                "Get All Error:",
                error
            );

            showTableError(
                "activeStudentTableBody"
            );

            showTableError(
                "allStudentTableBody"
            );

        });
}


// ============================================================
// DISPLAY ACTIVE STUDENTS
// ============================================================

function displayActiveStudents() {

    const tableBody =
        document.getElementById(
            "activeStudentTableBody"
        );

    if (!tableBody) {
        return;
    }

    tableBody.innerHTML = "";

    /*
     * IMPORTANT:
     *
     * Backend JSON property is:
     *
     * isDeleted
     *
     * NOT:
     *
     * is_deleted
     */

    const activeStudents =
        allStudents.filter(
            student =>
                student.isDeleted === false
        );

    if (activeStudents.length === 0) {

        tableBody.innerHTML = `

            <tr>

                <td
                    colspan="8"
                    class="no-data">

                    No active students found

                </td>

            </tr>

        `;

        return;
    }

    activeStudents.forEach(student => {

        const row =
            createStudentRow(student);

        tableBody.appendChild(row);

    });
}


// ============================================================
// DISPLAY ALL STUDENTS
// Active + Deleted
// ============================================================

function displayAllStudents() {

    const tableBody =
        document.getElementById(
            "allStudentTableBody"
        );

    if (!tableBody) {
        return;
    }

    tableBody.innerHTML = "";

    if (allStudents.length === 0) {

        tableBody.innerHTML = `

            <tr>

                <td
                    colspan="8"
                    class="no-data">

                    No students found

                </td>

            </tr>

        `;

        return;
    }

    allStudents.forEach(student => {

        const row =
            createStudentRow(student);

        tableBody.appendChild(row);

    });
}


// ============================================================
// CREATE TABLE ROW
// ============================================================

function createStudentRow(student) {

    const row =
        document.createElement("tr");

    const isDeleted =
        student.isDeleted === true;


    // ========================================================
    // STATUS
    // ========================================================

    const statusHtml = isDeleted

        ? `
            <span class="status status-deleted">
                Deleted
            </span>
          `

        : `
            <span class="status status-active">
                Active
            </span>
          `;


    // ========================================================
    // STATUS BUTTON
    // ========================================================

    const statusButton = isDeleted

        ? `
            <button
                class="btn btn-success"
                onclick="restoreStudent(${student.id})">

                Restore

            </button>
          `

        : `
            <button
                class="btn btn-soft-delete"
                onclick="softDeleteStudent(${student.id})">

                Soft Delete

            </button>
          `;


    // ========================================================
    // EDIT BUTTON
    // ========================================================

    const editButton = isDeleted

        ? `
            <button
                class="btn btn-warning"
                disabled
                title="Deleted students cannot be edited">

                Edit

            </button>
          `

        : `
            <button
                class="btn btn-warning"
                onclick="editStudent(${student.id})">

                Edit

            </button>
          `;


    // ========================================================
    // ROW
    // ========================================================

    row.innerHTML = `

        <td>
            ${escapeHtml(student.id)}
        </td>

        <td>
            ${escapeHtml(student.name)}
        </td>

        <td>
            ${escapeHtml(student.age)}
        </td>

        <td>
            ${escapeHtml(student.email)}
        </td>

        <td>
            ${escapeHtml(student.rollNo)}
        </td>

        <td>
            ${escapeHtml(student.address)}
        </td>

        <td>
            ${statusHtml}
        </td>

        <td>

            <div class="action-buttons">

                ${editButton}

                <button
                    class="btn btn-danger"
                    onclick="hardDeleteStudent(${student.id})">

                    Delete

                </button>

                ${statusButton}

            </div>

        </td>

    `;

    return row;
}


// ============================================================
// GET STUDENT BY ID
// ============================================================

function getStudentById() {

    const searchInput =
        document.getElementById("searchId");

    const id =
        searchInput.value.trim();

    if (!id) {

        alert(
            "Please enter a student ID"
        );

        return;
    }

    fetch(
        "/api/students/get/" +
        encodeURIComponent(id)
    )

        .then(async response => {

            if (response.status === 404) {

                throw new Error(
                    "Student not found"
                );
            }

            if (!response.ok) {

                throw new Error(
                    "Failed to find student"
                );
            }

            return response.json();

        })

        .then(student => {

            displaySearchResult(student);

        })

        .catch(error => {

            console.error(
                "Get Student Error:",
                error
            );

            document.getElementById(
                "searchResult"
            ).innerHTML = `

                <div class="student-card">

                    <p class="error-message">

                        ${escapeHtml(error.message)}

                    </p>

                </div>

            `;

        });
}


// ============================================================
// DISPLAY SEARCH RESULT
// ============================================================

function displaySearchResult(student) {

    const result =
        document.getElementById(
            "searchResult"
        );

    const isDeleted =
        student.isDeleted === true;

    const statusHtml = isDeleted

        ? `
            <span class="status status-deleted">
                Deleted
            </span>
          `

        : `
            <span class="status status-active">
                Active
            </span>
          `;

    result.innerHTML = `

        <div class="student-card">

            <p>
                <strong>ID:</strong>
                ${escapeHtml(student.id)}
            </p>

            <p>
                <strong>Name:</strong>
                ${escapeHtml(student.name)}
            </p>

            <p>
                <strong>Age:</strong>
                ${escapeHtml(student.age)}
            </p>

            <p>
                <strong>Email:</strong>
                ${escapeHtml(student.email)}
            </p>

            <p>
                <strong>Roll No:</strong>
                ${escapeHtml(student.rollNo)}
            </p>

            <p>
                <strong>Address:</strong>
                ${escapeHtml(student.address)}
            </p>

            <p>
                <strong>Status:</strong>
                ${statusHtml}
            </p>

        </div>

    `;
}


// ============================================================
// EDIT STUDENT
// ============================================================

function editStudent(id) {

    fetch(
        "/api/students/get/" +
        encodeURIComponent(id)
    )

        .then(async response => {

            if (response.status === 404) {

                throw new Error(
                    "Student not found"
                );
            }

            if (!response.ok) {

                throw new Error(
                    "Failed to get student"
                );
            }

            return response.json();

        })

        .then(student => {

            /*
             * Deleted students cannot be edited.
             */

            if (student.isDeleted === true) {

                throw new Error(
                    "Deleted students cannot be edited. Restore the student first."
                );
            }

            document.getElementById(
                "studentId"
            ).value = student.id;

            document.getElementById(
                "name"
            ).value = student.name || "";

            document.getElementById(
                "age"
            ).value =
                student.age ?? "";

            document.getElementById(
                "email"
            ).value = student.email || "";

            document.getElementById(
                "rollNo"
            ).value =
                student.rollNo ?? "";

            document.getElementById(
                "address"
            ).value =
                student.address || "";

            document.getElementById(
                "formTitle"
            ).textContent =
                "Update Student";

            document.getElementById(
                "submitButton"
            ).textContent =
                "Update Student";

            document.getElementById(
                "cancelButton"
            ).style.display =
                "inline-block";

            const formContainer =
                document.querySelector(
                    ".form-container"
                );

            if (formContainer) {

                formContainer.scrollIntoView({
                    behavior: "smooth"
                });

            }

        })

        .catch(error => {

            console.error(
                "Edit Error:",
                error
            );

            alert(error.message);

        });
}


// ============================================================
// UPDATE
// ============================================================

function updateStudent(id, student) {

    fetch(
        "/api/students/update/" +
        encodeURIComponent(id),
        {

            method: "PUT",

            headers: {
                "Content-Type":
                    "application/json"
            },

            body:
                JSON.stringify(student)

        }
    )

        .then(async response => {

            if (response.status === 404) {

                throw new Error(
                    "Student not found or student is deleted"
                );
            }

            if (!response.ok) {

                const errorText =
                    await response.text();

                throw new Error(
                    errorText ||
                    "Failed to update student"
                );
            }

            return response.json();

        })

        .then(data => {

            alert(
                "Student updated successfully!"
            );

            clearForm();

            getAllStudents();

        })

        .catch(error => {

            console.error(
                "Update Error:",
                error
            );

            alert(
                "Error updating student: " +
                error.message
            );

        });
}


// ============================================================
// SOFT DELETE
// ============================================================

function softDeleteStudent(id) {

    const confirmed =
        confirm(
            "Are you sure you want to soft delete this student?"
        );

    if (!confirmed) {
        return;
    }

    fetch(
        "/api/students/deleteSoft/" +
        encodeURIComponent(id),
        {
            method: "PATCH"
        }
    )

        .then(async response => {

            if (response.status === 404) {

                throw new Error(
                    "Active student not found"
                );
            }

            if (!response.ok) {

                const errorText =
                    await response.text();

                throw new Error(
                    errorText ||
                    "Failed to soft delete student"
                );
            }

            return response.text();

        })

        .then(message => {

            alert(
                message ||
                "Student soft deleted successfully"
            );

            getAllStudents();

        })

        .catch(error => {

            console.error(
                "Soft Delete Error:",
                error
            );

            alert(
                "Error soft deleting student: " +
                error.message
            );

        });
}


// ============================================================
// RESTORE
// ============================================================

function restoreStudent(id) {

    const confirmed =
        confirm(
            "Are you sure you want to restore this student?"
        );

    if (!confirmed) {
        return;
    }

    fetch(
        "/api/students/restore/" +
        encodeURIComponent(id),
        {
            method: "PATCH"
        }
    )

        .then(async response => {

            if (response.status === 404) {

                throw new Error(
                    "Deleted student not found"
                );
            }

            if (!response.ok) {

                const errorText =
                    await response.text();

                throw new Error(
                    errorText ||
                    "Failed to restore student"
                );
            }

            return response.text();

        })

        .then(message => {

            alert(
                message ||
                "Student restored successfully"
            );

            getAllStudents();

        })

        .catch(error => {

            console.error(
                "Restore Error:",
                error
            );

            alert(
                "Error restoring student: " +
                error.message
            );

        });
}


// ============================================================
// HARD DELETE
// ============================================================

function hardDeleteStudent(id) {

    const confirmed =
        confirm(
            "Are you sure you want to permanently delete this student?"
        );

    if (!confirmed) {
        return;
    }

    fetch(
        "/api/students/delete/" +
        encodeURIComponent(id),
        {
            method: "DELETE"
        }
    )

        .then(async response => {

            if (response.status === 404) {

                throw new Error(
                    "Student not found"
                );
            }

            if (!response.ok) {

                const errorText =
                    await response.text();

                throw new Error(
                    errorText ||
                    "Failed to delete student"
                );
            }

            return response.text();

        })

        .then(message => {

            alert(
                message ||
                "Student permanently deleted"
            );

            getAllStudents();

        })

        .catch(error => {

            console.error(
                "Hard Delete Error:",
                error
            );

            alert(
                "Error deleting student: " +
                error.message
            );

        });
}


// ============================================================
// CANCEL EDIT
// ============================================================

function cancelEdit() {

    clearForm();

}


// ============================================================
// CLEAR FORM
// ============================================================

function clearForm() {

    const studentForm =
        document.getElementById(
            "studentForm"
        );

    if (studentForm) {

        studentForm.reset();

    }

    document.getElementById(
        "studentId"
    ).value = "";

    document.getElementById(
        "formTitle"
    ).textContent =
        "Create Student";

    document.getElementById(
        "submitButton"
    ).textContent =
        "Create Student";

    document.getElementById(
        "cancelButton"
    ).style.display =
        "none";
}


// ============================================================
// CLEAR SEARCH
// ============================================================

function clearSearch() {

    document.getElementById(
        "searchId"
    ).value = "";

    document.getElementById(
        "searchResult"
    ).innerHTML = "";
}


// ============================================================
// TABLE ERROR
// ============================================================

function showTableError(tableId) {

    const tableBody =
        document.getElementById(tableId);

    if (!tableBody) {
        return;
    }

    tableBody.innerHTML = `

        <tr>

            <td
                colspan="8"
                class="no-data">

                Error loading students

            </td>

        </tr>

    `;
}


// ============================================================
// HTML ESCAPE
// ============================================================

function escapeHtml(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }

    return String(value)

        .replace(/&/g, "&amp;")

        .replace(/</g, "&lt;")

        .replace(/>/g, "&gt;")

        .replace(/"/g, "&quot;")

        .replace(/'/g, "&#039;");
}