function displaySchemas(schemas, localTableCheckbox, remoteTableCheckbox, replicationCheckbox, spaceConnectionValue) {
    const tableBody = document.querySelector('#tablesTable tbody');
    tableBody.innerHTML = '';
    schemas.forEach(schema => {
        const schemaName = schema.SCHEMANAME;
        schema.TABLES.forEach(table => {
            const row = document.createElement('tr');
            const schemaNameCell = document.createElement('td');
            const tableNameCell = document.createElement('td');
            const tableDescriptionCell = document.createElement('td');
            const actionCell = document.createElement('td');
            const downloadButton = document.createElement('button');

            schemaNameCell.textContent = schemaName;
            tableNameCell.textContent = table.TABLENAME;
            tableDescriptionCell.textContent = table.TABLEDESCRIPTION;

            downloadButton.classList.add('download-button');
            downloadButton.innerHTML = '<i class="fa fa-download"></i>';
            downloadButton.addEventListener('click', async () => {
                if (localTableCheckbox.checked) {
                    await createAndDownloadLocalTableJson(table.TABLENAME, table.TABLEDESCRIPTION, table.COLUMNS);
                }

               // await createAndDownloadDataFlowJson(table.TABLENAME, table.TABLEDESCRIPTION, table.COLUMNS, spaceConnectionValue, schemaName);
                if (remoteTableCheckbox.checked) {
                    setTimeout(() => {
                        createAndDownloadRemoteTableJson(table.TABLENAME, table.TABLEDESCRIPTION, table.COLUMNS, spaceConnectionValue, schemaName);
                    }, 1000);

                }
                if (replicationCheckbox.checked) {
                    setTimeout(() => {
                        //removed await
                        createAndDownloadDataFlowJson(table.TABLENAME, table.TABLEDESCRIPTION, table.COLUMNS, spaceConnectionValue, schemaName);
                    }, 2000);
                }

            });

            actionCell.appendChild(downloadButton);
            row.appendChild(schemaNameCell);
            row.appendChild(tableNameCell);
            row.appendChild(tableDescriptionCell);
            row.appendChild(actionCell);
            tableBody.appendChild(row);
        });
    });
    document.getElementById('tablesTable').style.display = 'table';
    checkDownloadButtonState(); // Check if download buttons should be enabled
}

function checkDownloadButtonState() {
    const spaceConnectionValue = document.getElementById('spaceConnection').value.trim();
    const isChecked = document.getElementById('remoteTable').checked || document.getElementById('replication').checked || document.getElementById('localTable').checked;
    const downloadButtons = document.querySelectorAll('.download-button');

    downloadButtons.forEach(button => {
        button.disabled = !(spaceConnectionValue && isChecked);
        button.style.color = button.disabled ? 'gray' : '#007bff';
    });
}