
import { parseCSV } from './connectDb.js';

export async function searchById(studentId){
    const ID=studentId.toUpperCase();
    
    const data =await parseCSV();
    data.pop();
    const students=data.filter(e=>{
        return e[`"Provider Student ID"`] ===`"${ID}"`;
    })
const suggestionsBox = document.getElementById('suggestions');


if (ID === '') {
  // If the input is empty, hide the suggestion box
  suggestionsBox.style.display = 'none';
  return;
}

// Filter data based on the query
//   const filteredData = data.filter(item => item.toLowerCase().includes(query));

// Display the suggestions
if (students.length > 0) {
  suggestionsBox.style.display = 'block';
  suggestionsBox.innerHTML = `<div class="suggestion-item  alert alert-primary"><a href="student.html?id=${students[0][`"Provider Student ID"`].replace(/"/g, '')}"> ${students[0][`"Provider Student ID"`].replace(/"/g, '')} : ${students[0][`"First Name"`].replace(/"/g, '')}</a></div>`;
  
  // Add event listener to each suggestion
  const suggestionItems = suggestionsBox.querySelectorAll('.suggestion-item');
  suggestionItems.forEach(item => {
    item.addEventListener('click', function () {
      searchBox.value = item.textContent; // Set the input to the selected suggestion
      suggestionsBox.style.display = 'none'; // Hide the suggestion box
    });
  });
} else {
//   suggestionsBox.style.display = 'none';
  suggestionsBox.innerHTML = `No result found`;
   // Hide the suggestion box if no matches
}
};
