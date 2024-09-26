function handleFile(event, displaySchemas, localTableCheckbox, remoteTableCheckbox, replicationCheckbox, spaceConnectionInput) {
    const file = event.target.files[0];
    if (file) {
        const formData = new FormData();
        formData.append('file', file);

        fetch('/upload', {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                // Map TYPE to CDSTYPE
                data.jsonData.SCHEMAS.forEach(schema => {
                    schema.TABLES.forEach(table => {
                        table.COLUMNS.forEach(column => {
                            column.CDSTYPE = typeToCDSTypeMapping[column.TYPE] || column.TYPE;
                        });
                    });
                });

                const output = document.getElementById('output');
                output.innerHTML = '<pre>' + JSON.stringify(data.jsonData, null, 2) + '</pre>';

                displaySchemas(data.jsonData.SCHEMAS, localTableCheckbox, remoteTableCheckbox, replicationCheckbox, spaceConnectionInput.value);
                output.style.display = 'none';
                document.getElementById('fileInput').value = ''; // Reset file input
                checkDownloadButtonState(); // Check if download buttons should be enabled
            })
            .catch(error => console.error('Error:', error));
    }
}