


export async function parseCSV() {
const response = await fetch('./data.csv');
if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
const text = await response.text();

    const rows = text.split('\n');
    const headers = rows[0].split(',');
    
    return rows.slice(1).map(row => {
    const values = row.split(',');
    return headers.reduce((obj, header, index) => {
        obj[header.trim()] = values[index]?.trim();
        return obj;
    }, {});
    });
    }


   
  