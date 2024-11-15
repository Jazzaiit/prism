import { parseCSV } from './connectDb.js';
import { searchById } from './studentSearch.js';

//search student data by ID
const searchBox = document.getElementById('searchBox');
searchBox.addEventListener('keyup', function () {
    searchById(this.value);
})



const loading = document.querySelector('.layer');
//get selected radio button value
function getSelectedStatus() {

const radios = document.querySelectorAll('input[name="status"]');
let selectedValue = '';

radios.forEach(radio => {
if (radio.checked) {
    selectedValue = radio.value;
}
});

return selectedValue;
}
// Select DOM elements
const table = document.querySelector('table>tbody');
const fieldInput = document.querySelector('#filter');
const warningUl=document.querySelector('.warning')
const btnGetData=document.querySelector("#getReport")
const drpFilter=document.querySelector("#field")


const items = document.querySelector('h6');


// Fetch filter data and populate the field input
drpFilter.addEventListener('change',
  async function () {
    
    fieldInput.innerHTML = '';
    const response = await fetch('./script/filterData.js');
    const subList = await response.json();
    const updatedData = subList.find(e => e.fieldName === this.value);

    if (updatedData) {
    updatedData.data.forEach(x => {
        const option = document.createElement('option');
        option.value = x.substr(0,8); 
        option.textContent = x; 
        fieldInput.appendChild(option); 
    });
    }
    }
)


// Fetch data based on selected filters and display it in the table
btnGetData.addEventListener('click',
  async function getData() {

    loading.setAttribute("style","display:block");
    
    const fieldSelection = document.querySelector('#field').value;
    const filterSelection = document.querySelector('#filter').value;
    
    
    const field = `"${fieldSelection}"`;
    const filter = `"${filterSelection}"`;
    
    try {
    const data = await parseCSV(); 
    const filteredData = filterData(data, field, filter,getSelectedStatus() );
    
    displayData(filteredData);
    loading.setAttribute("style","display:none");
    
    } catch (error) {
    console.error('Error fetching data:', error);
    }
    }
)

// Filter data based on selected criteria
function filterData(data, field, filter, status) {

return data.filter(element => {
let studyingStatus=true;
const matchesFilter = element[field] === filter;
if(status!=="*"){
   studyingStatus = element[`"COE Status"`] === `"${status}"`;
}

return matchesFilter && studyingStatus;
});
}

// Display filtered data in the table
function displayData(data) {

table.innerHTML = '';
items.innerText = `We have found (${data.length}) records for this filter`;

if (data.length > 0) {
data.forEach(element => {
    table.innerHTML += `
        <tr>
            <td scope="row">${element['"Provider Student ID"'].replace(/"/g, '')}</td>
            <td>${element['"First Name"'].replace(/"/g, '')} ${element['"Family Name"']?.replace(/"/g, '')}</td>
            <td><span class="badge badge-dark"> ${element['"VET National Code"']?.replace(/"/g, '')}</span></td>
            <td ><span class="badge badge-primary">${element['"COE Status"'].replace(/"/g, '')}</span></td>
            <td ><a href="student.html?id=${element[`"Provider Student ID"`].replace(/"/g, '')}" class="btn btn-warning btn-sm">View</a></td>
            
        </tr>`;
});
loading.setAttribute("style","display:none");

} else {
table.innerHTML = `
    <tr>
        <th scope="row"></th>
        <td>There are no records found. Change the filter.</td>
        <td></td>
    </tr>`;
}

}

//get status of student visa rejection or any alert in the current month studying student
studentWarning()

async function studentWarning(){
const date = new Date();
const currentMonth = (`${date.getMonth() + 1}`).padStart(2, '0');
const data =await parseCSV(); 

const filterWarning=data.filter(e=>{
if(e[`"COE Status"`] !== `"Studying"`)
{
return false;
}
let elMonth="";
const actionDate=e[`"Visa Non Grant Action Date"`]?.split('/');

if (actionDate && actionDate.length === 3) {
elMonth = actionDate[1].padStart(2, '0');
}

const isMonthMatch= elMonth==currentMonth;

return isMonthMatch;
})
    displayWarnings(filterWarning);
}
//display warnings
function displayWarnings(data) {

    warningUl.innerHTML = '';    
    if (data.length > 0) {
    data.forEach(element => {
        warningUl.innerHTML += `<li class="list-group-item list-group-item-danger"><b>${element['"Provider Student ID"'].replace(/"/g, '')}</b> <span>${element['"First Name"'].replace(/"/g, '')}</span></li>`;
    });
    loading.setAttribute("style","display:none");
    
    } else {
    warningUl.innerHTML = `<li class="list-group-item list-group-item-danger">No Visa warning in this month</li>`;
    }
    
    }


