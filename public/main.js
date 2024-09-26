document.addEventListener('DOMContentLoaded', () => {
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('fileInput');
    const spaceConnectionInput = document.getElementById('spaceConnection');
    const remoteTableCheckbox = document.getElementById('remoteTable');
    const replicationCheckbox = document.getElementById('replication');
    const localTableCheckbox = document.getElementById('localTable');
    const showSqlButton = document.getElementById('showSqlButton');
    const showJsonButton = document.getElementById('showJsonButton');

    dropZone.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', (event) => handleFile(event, displaySchemas, localTableCheckbox, remoteTableCheckbox, replicationCheckbox, spaceConnectionInput));
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('dragover');
    });
    dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));
    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('dragover');
        const files = e.dataTransfer.files;
        if (files.length) {
            handleFile({ target: { files } }, displaySchemas, localTableCheckbox, remoteTableCheckbox, replicationCheckbox, spaceConnectionInput);
        }
    });

    spaceConnectionInput.addEventListener('input', checkDownloadButtonState);
    remoteTableCheckbox.addEventListener('change', checkDownloadButtonState);
    replicationCheckbox.addEventListener('change', checkDownloadButtonState);
    localTableCheckbox.addEventListener('change', checkDownloadButtonState);

    showJsonButton.addEventListener('click', () => {
        const output = document.getElementById('output');
        const jsonContent = document.getElementById('jsonContent');
        jsonContent.innerHTML = output.innerHTML.trim() === ''
            ? `<pre>You need to import a CSV file in the following format:
SCHEMANAME, TABLENAME, TABLEDESCRIPTION, COLNAME, KEY, COLDESCRIPTION, TYPE, LENGTH, SCALE
This file should contain the tables which you want to snap into datasphere.</pre>`
            : output.innerHTML;
        document.getElementById('jsonModal').style.display = 'block';
    });

    showSqlButton.addEventListener('click', () => {
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
});