var studentsList = [];

window.addEventListener('load', function() {
  studentsData = getItemsData();
  getStudentItem();
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

  saveDataToLocalStorage();
  fillForms();
});

function showErrorAlert(alertClass) {
  const alertElement = document.querySelector(`.${alertClass}`);
  alertElement.style.display = 'block';
  setTimeout(function () {
    alertElement.style.display = 'none';
  }, 5000);
}

function getItemsData() {
  let savedData = localStorage.getItem('studentsList');
  if (savedData) {
    studentsList = JSON.parse(savedData);
  }
}

function saveDataToLocalStorage() {
  localStorage.setItem('studentsList', JSON.stringify(studentsList));
}

function fillForms() {
  const firstNameStudent = document.getElementById('firstName').value.trim();
  const lastNameStudent = document.getElementById('lastName').value.trim();
  const patronymicStudent = document.getElementById('patronymic').value.trim();
  const birthDateStudent = new Date(document.getElementById('birthDate').value);
  const startYearStudent = parseInt(document.getElementById('startYear').value);
  const facultyStudent = document.getElementById('faculty').value.trim();

  var student = {
    firstName: firstNameStudent,
    lastName: lastNameStudent,
    patronymic: patronymicStudent,
    birthDate: birthDateStudent,
    startYear: startYearStudent,
    faculty: facultyStudent,
  };

  studentsList.push(student);
  getStudentItem();
}

function getStudentItem() {
  const table = document.getElementById('studentsTableBody');
  table.innerHTML = '';

  for (var i = 0; i < studentsList.length; i++) {
    var student = studentsList[i];

    var row = document.createElement('tr');
    var fullNameCell = document.createElement('td');
    var facultyCell = document.createElement('td');
    var birthDateCell = document.createElement('td');
    var startYearCell = document.createElement('td');

    fullNameCell.textContent = student.firstName + ' ' + student.lastName + ' ' + student.patronymic;
    facultyCell.textContent = student.faculty;
    birthDateCell.textContent = formatDate(new Date(student.birthDate)) + ' (' + calculateAge(new Date(student.birthDate)) + ' лет)';
    startYearCell.textContent = student.startYear + '-' + (student.startYear + 4) + ' (' + calculateCourse(student.startYear) + ' курс' + ')';

    row.appendChild(fullNameCell);
    row.appendChild(facultyCell);
    row.appendChild(birthDateCell);
    row.appendChild(startYearCell);

    table.appendChild(row);
    saveDataToLocalStorage();
    addStudentForm.style.display = 'none'
    showAddStudentsButton.style.display = 'inline-block'
  }
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

function searchStudents() {
  const searchTermFio = document.getElementById('search-fio').value.trim().toLowerCase();
  const searchTermFaculty = document.getElementById('search-faculty').value.trim().toLowerCase();
  const searchTermStartYear = document.getElementById('search-year-of-admission').value.trim();
  const searchTermEndYear = document.getElementById('search-year-of-graduation').value.trim();

  const tableBody = document.getElementById('studentsTableBody');
  const tableRows = tableBody.getElementsByTagName('tr');

  for (let i = 0; i < tableRows.length; i++) {
    const row = tableRows[i];
    const fullNameCell = row.getElementsByTagName('td')[0];
    const facultyCell = row.getElementsByTagName('td')[1];
    const birthDateCell = row.getElementsByTagName('td')[2];
    const startYearCell = row.getElementsByTagName('td')[3];

    const fullName = fullNameCell.textContent.trim().toLowerCase();
    const faculty = facultyCell.textContent.trim().toLowerCase();
    const birthDate = birthDateCell.textContent.trim();
    const startYear = startYearCell.textContent.trim();

    const fioMatch = fullName.includes(searchTermFio);
    const facultyMatch = faculty.includes(searchTermFaculty);
    const startYearMatch = startYear.includes(searchTermStartYear);
    const endYearMatch = startYear.includes(searchTermEndYear);

    if (fioMatch && facultyMatch && startYearMatch && endYearMatch) {
      row.style.display = 'table-row';
    } else {
      row.style.display = 'none';
    }
  }
}

function sortTable(columnIndex) {
  studentsList.sort((a, b) => {
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

  getStudentItem();
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
