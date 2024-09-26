document.getElementById('showJsonButton').addEventListener('click', () => {
    const jsonContent = document.getElementById('jsonContent');
    const output = document.getElementById('output');
    /*jsonContent.innerHTML = output.innerHTML.trim() === ''
        ? `<pre>You need to import????? a CSV file in the following format:
SCHEMANAME, TABLENAME, TABLEDESCRIPTION, COLNAME, KEY, COLDESCRIPTION, TYPE, LENGTH, SCALE
This file should contain the tables which you want to snap into datasphere.</pre>`
        : output.innerHTML;*/

    document.getElementById('jsonModal').style.display = 'block';
});

document.getElementById('showSqlButton').addEventListener('click', () => {
    document.getElementById('sqlModal').style.display = 'block';
});

document.getElementById('closeSqlButton').addEventListener('click', () => {
    document.getElementById('sqlModal').style.display = 'none';
});

document.getElementById('closeJsonButton').addEventListener('click', () => {
    document.getElementById('jsonModal').style.display = 'none';
});

window.addEventListener('click', (event) => {
    if (event.target === document.getElementById('sqlModal')) {
        document.getElementById('sqlModal').style.display = 'none';
    }
    if (event.target === document.getElementById('jsonModal')) {
        document.getElementById('jsonModal').style.display = 'none';
    }
});