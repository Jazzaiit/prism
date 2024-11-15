import { parseCSV } from './connectDb.js';



const courses=[
  "Certificate III in Commercial Cookery",	
  "Certificate IV in Kitchen Management",
  "Diploma of Hospitality Management",	
  "Advanced Diploma of Hospitality Management",	
  "Diploma of Leadership and Management",
  "Advanced Diploma of Leadership and Management",
  "Graduate Diploma of Strategic Leadership"
]
const CoEstudentData=[];
//array for CoE started for each course
const coursesStart = [];
const yearReport='2025';

//read complete student data who strated their courses 
const filter=document.querySelector("#filter")
filter.addEventListener('change',(e)=>{
  
studentDataByCourse(e.target.value);
})


// Wait for the DOM to be fully loaded before running the report
document.addEventListener("DOMContentLoaded", function() {
  getCoursesReport();
});

// Main function to generate the report for the given course and year
async function getCoursesReport() {
  
  try{
    for (const course of courses) {
      const data=await studentData(course)
      coursesStart.push(data.length);
      CoEstudentData.push(data);
  };
  chartData(coursesStart)     
  }
   catch (error) {
    console.error("Error generating report:", error);
  }
}

// Get data for a specific month based on the provided student status and course name
async function studentData(courseName) {
  
  try {
    // Parse CSV data
    const data = await parseCSV();
    
    // Remove the last row (if it is unwanted)
    data.pop();
    
    // Filter data for the selected course, month, and year, and where COE Status is "Approved"
    return data.filter(entry => {
      const courseNameMatch = entry[`"Course Name"`] === `"${courseName}"`;
      const startDate = entry[`"Proposed Start Date"`]?.split('/');
      const year = startDate[2]?.toString();
      const yearMatch = year === `${yearReport}"`;
      const approvedStatus = entry[`"COE Status"`] === `"Approved"`;

      // Return true if all conditions match
      return courseNameMatch &&  yearMatch && approvedStatus;
    });
  } catch (error) {
    console.error(`Error fetching data for month ${courseName}:`, error);
    return [];  // Return an empty array if there is an error
  }
}

// Function to render the chart with the student start data for each month
function chartData(data) {
  let delayed;
  const dataConfig = {
    type: 'bar',
    data: {
      labels: courses,
      datasets: [{
        fill: true,
        label: `Number of CoEs Course wise in  ${yearReport}`,
        data: [...data],
        borderWidth: 0,
        borderRadius:15,
        borderColor: '',
        backgroundColor: ['#ffb1c1','#9ad0f5','#7bd1d1e8','#ffcd56','#f3bc84f2','#ff56c38c','#7056ffb8','#999']
      }]
    },
    options: {
      animation: {
        onComplete: () => {
          delayed = true;
        },
        delay: (context) => {
          let delay = 0;
          if (context.type === 'data' && context.mode === 'default' && !delayed) {
            delay = context.dataIndex * 300 + context.datasetIndex * 100;
          }
          return delay;
        },
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  };

  // Create the chart
  const ctx = document.getElementById('myChart');
  if (ctx) {
    new Chart(ctx, dataConfig);
  } else {
    console.error("Chart container element not found.");
  }
}

//actual student data eg.inofrmation accordingly the courses
function studentDataByCourse(courseCode){
  
  const filterData=  CoEstudentData.filter((e,idx)=>{
    if(e.length>0){
      const courseNameMatch = e[0][`"VET National Code"`] === `"${courseCode}"`;
       return courseNameMatch;
    }
    else{
      return false;
    }
    })
    studentCourses(filterData)
      return filterData;
}

 ///student data append to data table

 export function studentCourses(student){
  
  const courses=document.querySelector("#courses>tbody");
  courses.innerHTML ='';
  let row=0;
  student[0].forEach(element => {
    
      const colour=element["COE Status"]?.replace(/"/g, '')=="Cancelled" ? "badge-danger":"badge-primary"
      courses.innerHTML += `
      <tr>
      <td>${row+=1}</td>
          <td>${element['"Provider Student ID"']?.replace(/"/g, '')} </td>
          <td>${element['"First Name"']?.replace(/"/g, '')} </td>
          
          <td scope="row"><span class="badge ${colour} "> ${element['"COE Status"']?.replace(/"/g, '')}</span></td>

          <td>${element['"VET National Code"']?.replace(/"/g, '')} : ${element['"Course Name"']?.replace(/"/g, '')}</td>
          <td><span > ${element['"Proposed Start Date"']?.replace(/"/g, '')}</span></td>
          <td ><span >${element['"Proposed End Date"']?.replace(/"/g, '')}</span></td>
      </tr>`;
  });

}