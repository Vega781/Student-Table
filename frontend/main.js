//comment

window.addEventListener('load', async function() {
  studentsData = await getStudentData();
  if(studentsData){
    getStudentItem(studentsData);
  } else {
    console.log("В базе отсутствуют данные")
  }
});

const buttonSearchStudents = document.querySelector('.search-students');
const buttonAddStudents = document.querySelector('.add-students');
const studentList = document.querySelector('.student-list');
const searchField = document.querySelector('.search');
const buttonAdd = document.querySelector('.add-student');

const alertFirstName = document.querySelector('.alert__first-name');
const alertLastName = document.querySelector('.alert__last-name');
const alertPatronymic = document.querySelector('.alert__patronymic');
const alertBirthDate = document.querySelector('.alert__birth-date');
const alertBirthDate1900 = document.querySelector('.alert__birth-date-1900');
const alertStartYear = document.querySelector('.alert__start-date');
const alertStartYear2000 = document.querySelector('.alert__start-date-2000');
const alertFaculty = document.querySelector('.alert__faculty');

alertFirstName.style.display = 'none';
alertLastName.style.display = 'none';
alertPatronymic.style.display = 'none';
alertBirthDate.style.display = 'none';
alertBirthDate1900.style.display = 'none';
alertStartYear.style.display = 'none';
alertStartYear2000.style.display = 'none';
alertFaculty.style.display = 'none';


const addStudentForm = document.getElementById('addStudentForm')
const showAddStudentsButton = document.getElementById('show__add-student')
addStudentForm.style.display = 'none'
showAddStudentsButton.addEventListener('click', function() {
  showAddStudentsButton.style.display = 'none'
  addStudentForm.style.display = 'flex'

})

const searchStudentForm = document.getElementById('searchForm')
const showSearchStudentsButton = document.getElementById('show__search-student')
searchStudentForm.style.display = 'none'
showSearchStudentsButton.addEventListener('click', function() {
  showSearchStudentsButton.style.display = 'none'
  searchStudentForm.style.display = 'flex'

})


buttonAdd.addEventListener('click', function(e) {
  e.preventDefault()

  const firstNameStudent = document.getElementById('firstName').value.trim();
  const lastNameStudent = document.getElementById('lastName').value.trim();
  const patronymicStudent = document.getElementById('patronymic').value.trim();
  const birthDateStudent = new Date(document.getElementById('birthDate').value);
  const startYearStudent = document.getElementById('startYear').value.trim();
  const facultyStudent = document.getElementById('faculty').value.trim();

  if(firstNameStudent === '') {
    showErrorAlert('alert__first-name');
    return;
  }

  if(lastNameStudent === '') {
    showErrorAlert('alert__last-name');
    return;
  }

  if(patronymicStudent === '') {
    showErrorAlert('alert__patronymic');
    return;
  }

  if(isNaN(birthDateStudent)) {
    showErrorAlert('alert__birth-date');
    return;
  } else if(birthDateStudent < new Date('1900-01-01') || birthDateStudent > new Date()) {
    showErrorAlert('alert__birth-date-1900');
    return;
  }

  if(startYearStudent === '') {
    showErrorAlert('alert__start-date');
    return;
  } else if(startYearStudent < 2000 || startYearStudent > new Date().getFullYear()) {
    showErrorAlert('alert__start-date-2000');
    return;
  }

  if(facultyStudent === '') {
    showErrorAlert('alert__faculty');
    return;
  }
  fillForms();
  clearInputFields()
});

function showErrorAlert(alertClass) {
  const alertElement = document.querySelector(`.${alertClass}`);
  alertElement.style.display = 'block';
  setTimeout(function () {
    alertElement.style.display = 'none';
  }, 5000);
}

function clearInputFields() {
  document.getElementById('firstName').value = '';
  document.getElementById('lastName').value = '';
  document.getElementById('patronymic').value = '';
  document.getElementById('birthDate').value = '';
  document.getElementById('startYear').value = '';
  document.getElementById('faculty').value = '';
}

async function fillForms() {
  const firstNameStudent = document.getElementById('firstName').value.trim();
  const lastNameStudent = document.getElementById('lastName').value.trim();
  const patronymicStudent = document.getElementById('patronymic').value.trim();
  const birthDateStudent = new Date(document.getElementById('birthDate').value);
  const startYearStudent = parseInt(document.getElementById('startYear').value);
  const facultyStudent = document.getElementById('faculty').value.trim();

  await fetch('http://localhost:3000/api/students', {
    method: 'POST',
    body: JSON.stringify({
      name: firstNameStudent,
      surname: lastNameStudent,
      lastname: patronymicStudent,
      birthday: birthDateStudent,
      studyStart: startYearStudent,
      faculty: facultyStudent,
    }),
    headers: {
      "Content-Type": 'application/json'
    }
  })
  const response = await getStudentData();
  getStudentItem(response)
}

async function getStudentData() {
  try {
    const response = await fetch('http://localhost:3000/api/students');
    const dataList = await response.json();
    return dataList;
  } catch (error) {
    console.error('Ошибка при получении данных с сервера:', error);
    return [];
  }
}

async function deleteStudent(studentId) {
  const response = await fetch(`http://localhost:3000/api/students/${studentId}`, {
    method: 'DELETE',
  });

  if (response.ok) {
    studentsData = await getStudentData();
    getStudentItem(studentsData);
  } else {
    console.error('Ошибка при удалении студента');
  }
}

async function getStudentItem(students) {
  const tableBody = document.getElementById('studentsTableBody');
  tableBody.innerHTML = '';

  if (students.length === 0) {
    const noDataMessage = document.createElement('tr');
    const noDataCell = document.createElement('td');
    noDataCell.colSpan = 5;
    noDataCell.textContent = 'Нет данных о студентах.';
    noDataMessage.appendChild(noDataCell);
    tableBody.appendChild(noDataMessage);
  } else {
    students.forEach(student => {
      const row = document.createElement('tr');
      const fullNameCell = createTableCell(`${student.name} ${student.surname} ${student.lastname}`);
      const facultyCell = createTableCell(student.faculty);
      const birthDateCell = createTableCell(`${formatDate(new Date(student.birthday))} (${calculateAge(new Date(student.birthday))} лет)`);
      const startYearCell = createTableCell(`${student.studyStart}-${Number(student.studyStart) + 4} (${calculateCourse(student.studyStart)} курс)`);
      const actionsCell = document.createElement('td');

      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Удалить';
      deleteButton.classList.add('btn', 'btn-success')
      deleteButton.addEventListener('click', function() {
        deleteStudent(student.id)
      });

      row.appendChild(fullNameCell);
      row.appendChild(facultyCell);
      row.appendChild(birthDateCell);
      row.appendChild(startYearCell);
      row.appendChild(actionsCell);
      actionsCell.appendChild(deleteButton);

      tableBody.appendChild(row);
      addStudentForm.style.display = 'none'
      showAddStudentsButton.style.display = 'inline-block'
    });
  }
}

function createTableCell(text) {
  const cell = document.createElement('td');
  cell.textContent = text;
  return cell;
}

function formatDate(date) {
  var day = date.getDate();
  var month = date.getMonth() + 1;
  var year = date.getFullYear();

  return (day < 10 ? '0' : '') + day + '.' + (month < 10 ? '0' : '') + month + '.' + year;
}

function calculateAge(birthdate) {
  var currentDate = new Date();
  var age = currentDate.getFullYear() - birthdate.getFullYear();
  var monthDiff = currentDate.getMonth() - birthdate.getMonth();
  var dayDiff = currentDate.getDate() - birthdate.getDate();

  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age--;
  }

  return age;
}

function calculateCourse(startYear) {
  var currentYear = new Date().getFullYear();
  var course = currentYear - startYear + 1;

  if (currentYear > startYear + 4) {
    course = 'закончил';
  }

  return course;
}

async function searchStudents() {
  const searchTermFio = document.getElementById('search-fio').value.trim().toLowerCase();
  const searchTermFaculty = document.getElementById('search-faculty').value.trim().toLowerCase();
  const searchTermStartYear = document.getElementById('search-year-of-admission').value.trim();
  const searchTermEndYear = document.getElementById('search-year-of-graduation').value.trim();

  const studentsData = await getStudentData();
  const tableRows = document.getElementById('studentsTableBody').getElementsByTagName('tr');

  for (let i = 0; i < tableRows.length; i++) {
    const row = tableRows[i];
    const fullName = row.cells[0].textContent.trim().toLowerCase();
    const faculty = row.cells[1].textContent.trim().toLowerCase();
    const startYear = row.cells[3].textContent.trim();

    const student = studentsData[i];
    const nameMatch = student.name.toLowerCase().includes(searchTermFio);
    const surnameMatch = student.surname.toLowerCase().includes(searchTermFio);
    const facultyDataMatch = student.faculty.toLowerCase().includes(searchTermFaculty);
    const startYearDataMatch = student.studyStart.includes(searchTermStartYear);
    const endYearDataMatch = student.studyStart.includes(searchTermEndYear);

    const shouldShow =
      (fullName.includes(searchTermFio) || nameMatch || surnameMatch) &&
      (faculty.includes(searchTermFaculty) || facultyDataMatch) &&
      (startYear.includes(searchTermStartYear) || startYearDataMatch) &&
      (startYear.includes(searchTermEndYear) || endYearDataMatch);

    row.style.display = shouldShow ? 'table-row' : 'none';
  }
}


function sortTable(columnIndex) {
  studentsData.sort((a, b) => {
    const columnA = getColumnValue(a, columnIndex);
    const columnB = getColumnValue(b, columnIndex);

    if (columnA < columnB) {
      return -1;
    } else if (columnA > columnB) {
      return 1;
    } else {
      return 0;
    }
  });
  getStudentItem(studentsData);
}

function getColumnValue(student, columnIndex) {
  switch (columnIndex) {
    case 0:
      return student.lastName + ' ' + student.firstName + ' ' + student.patronymic;
    case 1:
      return student.faculty;
    case 2:
      return new Date(student.birthDate);
    case 3:
      return student.startYear;
    default:
      return '';
  }
}

