import { parseCSV } from './connectDb.js';
const studentInformationBox=document.querySelector("#studentInformation");
const sName=document.querySelector("#sName");
const notification=document.querySelector("#notification");

//get student id from the URL
const params = new URLSearchParams(window.location.search);
const id = params.get('id'); 


const student=await studentData(id)
studentInformationBox.innerHTML=appendStudentInformation(student);


//call to append courses to the table
studentCourses(student)

//get particular student data from main db
async function studentData(studentId) {
    const data=await parseCSV();
    data.pop();
    const student=data.filter(e=>{
        const providerId=e['"Provider Student ID"']?.replace(/"/g, '');
        return providerId ===studentId;
    })
    return student;
}

// pass the student basic information
function appendStudentInformation(student){
  

  //pass student name
    sName.innerHTML=student[0]['"First Name"']?.replace(/"/g, '');
    //pass student non grant visa status
    let grantStatus;
    student.filter(e=>{
      
      if(e[`"Visa Non  Grant Status"`].length>2){
     notification.innerHTML=`  <span class="alert alert-danger"><b> ${e['"Visa Non  Grant Status"']?.replace(/"/g, '')}</b> Action Date: ${e['"Visa Non Grant Action Date"']?.replace(/"/g, '')} </span>`
      }
    })
    


    // Convert the date property to Date objects and find the latest one
const studentData = student.reduce((latest, current) => {
    const latestDate = new Date(latest['"Proposed End Date"']);
    const currentDate = new Date(current['"Proposed End Date"']);
    
    return currentDate > latestDate ? current : latest;
  });
    
    const id=studentData['"Provider Student ID"']?.replace(/"/g, '');
    const visaStatus=studentData['"Visa Grant Status"']?.replace(/"/g, '');
    const visaEndDate=studentData['"Visa End Date"']?.replace(/"/g, '');
    const visaNumber=studentData['"Visa Grant Number"']?.replace(/"/g, '');
    const email=studentData['"Email Address"']?.replace(/"/g, '');
    const mobile=studentData['"Mobile"']?.replace(/"/g, '');
   

    const html=` <table class="table table-bordered">
                          <tbody>
                            <tr>
                              <th>Provider Student ID</th>
                              <td class=""><strong >${id}</strong></td>
                            </tr>
                             <tr>
                              <th>Visa Grant Number</th>
                              <td class="alert alert-dark"><strong >${visaNumber}</strong></td>
                            </tr>
                            <tr>
                            <tr>
                              <th>Visa Grant Status</th>
                              <td class="alert alert-info"><strong >${visaStatus}</strong></td>
                            </tr>
                            <tr>
                              <tr>
                                <th>Visa End Date</th>
                                <td ><span >${visaEndDate}</span></td>
                              </tr>
                              <tr>
                              <th>Email</th>
                              <td ><strong >${email}</strong></td>
                            </tr>
                            <tr>
                              <th>Contact Number</th>
                              <td ><span >${mobile}</span></td>
                            </tr>
                          </tbody>
                        </table>`
                        return html;

}

export function studentCourses(student){
    const courses=document.querySelector("#courses>tbody");
let colour='';
    student.forEach(element => {

        const coeStatus = element['"COE Status"'].replace(/"/g, '');

          if (coeStatus === "Cancelled") {
            colour = "badge-danger";  // Set to danger if the status is "Cancelled"
          } else if (coeStatus === "Studying") {
            colour = "badge-success";  // Set to success if the status is "Studying"
          } else {
          
            colour = "badge-primary";  
          }
        
        courses.innerHTML += `
        <tr>
            <td scope="row"><span class="badge ${colour} "> ${element['"COE Status"'].replace(/"/g, '')}</span></td>
            <td>${element['"VET National Code"'].replace(/"/g, '')} : ${element['"Course Name"']?.replace(/"/g, '')}</td>
            <td><span > ${element['"Proposed Start Date"']?.replace(/"/g, '')}</span></td>
            <td ><span >${element['"Proposed End Date"'].replace(/"/g, '')}</span></td>
        </tr>`;
    });
  
}

