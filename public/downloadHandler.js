const typeToCDSTypeMapping = {
    "VARCHAR": "cds.String",
    "NVARCHAR": "cds.String",
    "INTEGER": "cds.Integer",
    "DECIMAL": "cds.Decimal",
    "BIGINT" : "cds.Integer64",
    "DOUBLE": "cds.Double",
    "ST_GEOMETRY" : "cds.hana.ST_GEOMETRY"
    // Add other mappings as needed
};

function extractDefinition(jsonStream, keyName) {
    // Parse the JSON stream to an object
    let jsonObject;
    try {
        jsonObject = JSON.parse(jsonStream);
    } catch (error) {
        throw new Error("Invalid JSON stream"+jsonStream);
    }

    // Check if the key exists in the definitions
    if (jsonObject.definitions && jsonObject.definitions[keyName]) {
        // Create a new object to retain the key name
        const result = {};
        result[keyName] = jsonObject.definitions[keyName];
        return result;
    } else {
        throw new Error(`Key '${keyName}' not found in definitions`);
    }
}

function removeBraces(jsonString) {
    // Trim the string to remove leading and trailing whitespace
    jsonString = jsonString.trim();

    // Remove only the first { and the last }
    if (jsonString.startsWith('{')) {
        jsonString = jsonString.slice(1);
    }

    if (jsonString.endsWith('}')) {
        jsonString = jsonString.slice(0, -1);
    }

    return jsonString;
}

function oldextractDefinition(jsonStream, keyName) {
    // Parse the JSON stream to an object
    let jsonObject;
    try {
        jsonObject = JSON.parse(jsonStream);
    } catch (error) {
        throw new Error("Invalid JSON stream");
    }

    // Check if the key exists in the definitions
    if (jsonObject.definitions && jsonObject.definitions[keyName]) {
        const result = {};
        result[keyName] = jsonObject.definitions[keyName];
        const resultString = JSON.stringify(result);
        return resultString.slice(1, -1);
    } else {
        throw new Error(`Key '${keyName}' not found in definitions`);
    }
}
function extractDefinition2(jsonStream, keyName) {
    // Parse the JSON stream to an object
    let jsonObject;
    try {
        jsonObject = JSON.parse(jsonStream);
    } catch (error) {
        throw new Error("Invalid JSON stream");
    }

    // Check if the key exists in the definitions
    if (jsonObject.definitions && jsonObject.definitions[keyName]) {
        const result = {};
        result[keyName] = jsonObject.definitions[keyName];
        const resultString = JSON.stringify(result, null, 2);
        return resultString.slice(1, -1).trim();
    } else {
        throw new Error(`Key '${keyName}' not found in definitions`);
    }
}
function createAndDownloadLocalTableJson(tableName, tableDescription, columns) {
    return fetch('/localtable-pattern')
        .then(response => response.json())
        .then(localTableData => {
            return fetch('/elements-pattern')
                .then(response => response.json())
                .then(elementsData => {
                    let localTablePattern = localTableData.pattern;
                    let elementsPattern = elementsData.pattern;

                    const columnElements = columns.map(column => {
                        let columnPattern = elementsPattern;
                        columnPattern = columnPattern.replace(/&COLNAME&/g, column.COLNAME);
                        columnPattern = columnPattern.replace(/&COLDESCRIPTION&/g, column.COLDESCRIPTION);

                        if (column.TYPE === 'NVARCHAR' || column.TYPE === 'VARCHAR') {
                        // replace &LENGTH& with "/"length/": " + column.LENGTH
                            columnPattern = columnPattern.replace(/&LENGTH&/g, ',"length": ' + column.LENGTH);
                        }
                        else { // remove lenth spec
                            columnPattern = columnPattern.replace(/&LENGTH&/g, '');
                        }
                        columnPattern = columnPattern.replace(/&KEY&/g, column.KEY);
                        columnPattern = columnPattern.replace(/&NOTNULL&/g, column.KEY);
                        columnPattern = columnPattern.replace(/&CDSTYPE&/g, column.CDSTYPE);
                        columnPattern = columnPattern.replace(/&TYPE&/g, column.TYPE);
                        return columnPattern;
                    }).join(',\n');

                    localTablePattern = localTablePattern.replace(/&_COLUMN_ELEMENTS_&/g, columnElements);
                    localTablePattern = localTablePattern.replace(/&TABLENAME&/g, tableName);
                    localTablePattern = localTablePattern.replace(/&TABLEDESCRIPTION&/g, tableDescription);

                    const blob = new Blob([localTablePattern], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${tableName}_local_table.json`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                });
        })
        .catch(error => console.error('Error:', error));
}

function createAndDownloadRemoteTableJson(tableName, tableDescription, columns, spaceConnection, schemaName) {
    return fetch('/remotetable-pattern')
        .then(response => response.json())
        .then(remoteTableData => {
            return fetch('/remote_elements-pattern')
                .then(response => response.json())
                .then(remoteElementsData => {
                    let remoteTablePattern = remoteTableData.pattern;
                    let remoteElementsPattern = remoteElementsData.pattern;

                    const columnElements = columns.map(column => {
                        let columnPattern = remoteElementsPattern;
                        columnPattern = columnPattern.replace(/&COLNAME&/g, column.COLNAME);
                        columnPattern = columnPattern.replace(/&COLDESCRIPTION&/g, column.COLDESCRIPTION);
                       // columnPattern = columnPattern.replace(/&LENGTH&/g, column.LENGTH);

                        if (column.TYPE === 'NVARCHAR' || column.TYPE === 'VARCHAR') {
                            columnPattern = columnPattern.replace(/&LENGTH&/g, ',"length": ' + column.LENGTH);
                        }
                        else {
                            columnPattern = columnPattern.replace(/&LENGTH&/g, '');
                        }

                        columnPattern = columnPattern.replace(/&KEY&/g, column.KEY);
                        columnPattern = columnPattern.replace(/&NOTNULL&/g, column.KEY);
                        columnPattern = columnPattern.replace(/&CDSTYPE&/g, column.CDSTYPE);
                        columnPattern = columnPattern.replace(/&TYPE&/g, column.TYPE);
                        return columnPattern;
                    }).join(',\n');

                    remoteTablePattern = remoteTablePattern.replace(/&_COLUMN_ELEMENTS_&/g, columnElements);
                    remoteTablePattern = remoteTablePattern.replace(/&TABLENAME&/g, tableName);
                    remoteTablePattern = remoteTablePattern.replace(/&TABLEDESCRIPTION&/g, tableDescription);
                    remoteTablePattern = remoteTablePattern.replace(/&SPACECONNECTION&/g, spaceConnection);
                    remoteTablePattern = remoteTablePattern.replace(/&SCHEMANAME&/g, schemaName);

                    const blob = new Blob([remoteTablePattern], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${tableName}_remote_table.json`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                });
        })
        .catch(error => console.error('Error:', error));
}

function createLocalTableJson(tableName, tableDescription, columns) {
    return fetch('/localtable-pattern')
        .then(response => response.json())
        .then(localTableData => {
            return fetch('/elements-pattern')
                .then(response => response.json())
                .then(elementsData => {
                    let localTablePattern = localTableData.pattern;
                    let elementsPattern = elementsData.pattern;

                    const columnElements = columns.map(column => {
                        let columnPattern = elementsPattern;
                        columnPattern = columnPattern.replace(/&COLNAME&/g, column.COLNAME);
                        columnPattern = columnPattern.replace(/&COLDESCRIPTION&/g, column.COLDESCRIPTION);

                        //columnPattern = columnPattern.replace(/&LENGTH&/g, column.LENGTH);
                        if (column.TYPE === 'NVARCHAR' || column.TYPE === 'VARCHAR') {
                            // replace &LENGTH& with "/"length/": " + column.LENGTH
                            columnPattern = columnPattern.replace(/&LENGTH&/g, ',"length": ' + column.LENGTH);
                        }
                        else { // remove lenth spec
                            columnPattern = columnPattern.replace(/&LENGTH&/g, '');
                        }

                        columnPattern = columnPattern.replace(/&KEY&/g, column.KEY);
                        columnPattern = columnPattern.replace(/&NOTNULL&/g, column.KEY);
                        columnPattern = columnPattern.replace(/&CDSTYPE&/g, column.CDSTYPE);
                        columnPattern = columnPattern.replace(/&TYPE&/g, column.TYPE);

                        return columnPattern;
                    }).join(',\n');

                    localTablePattern = localTablePattern.replace(/&_COLUMN_ELEMENTS_&/g, columnElements);
                    localTablePattern = localTablePattern.replace(/&TABLENAME&/g, tableName);
                    localTablePattern = localTablePattern.replace(/&TABLEDESCRIPTION&/g, tableDescription);

                    return localTablePattern;
                });
        })
        .catch(error => console.error('Error:', error));
}

function createRemoteTableJson(tableName, tableDescription, columns, spaceConnection, schemaName) {
    return fetch('/remotetable-pattern')
        .then(response => response.json())
        .then(remoteTableData => {
            return fetch('/remote_elements-pattern')
                .then(response => response.json())
                .then(remoteElementsData => {
                    let remoteTablePattern = remoteTableData.pattern;
                    let remoteElementsPattern = remoteElementsData.pattern;

                    const columnElements = columns.map(column => {
                        let columnPattern = remoteElementsPattern;
                        columnPattern = columnPattern.replace(/&COLNAME&/g, column.COLNAME);
                        columnPattern = columnPattern.replace(/&COLDESCRIPTION&/g, column.COLDESCRIPTION);

                        if (column.TYPE === 'NVARCHAR' || column.TYPE === 'VARCHAR') {
                            columnPattern = columnPattern.replace(/&LENGTH&/g, ',"length": ' + column.LENGTH);
                        }
                        else { // remove lenth spec
                            columnPattern = columnPattern.replace(/&LENGTH&/g, '');
                        }

                        columnPattern = columnPattern.replace(/&KEY&/g, column.KEY);
                        columnPattern = columnPattern.replace(/&NOTNULL&/g, column.KEY);
                        columnPattern = columnPattern.replace(/&CDSTYPE&/g, column.CDSTYPE);
                        columnPattern = columnPattern.replace(/&TYPE&/g, column.TYPE);
                        return columnPattern;
                    }).join(',\n');

                    remoteTablePattern = remoteTablePattern.replace(/&_COLUMN_ELEMENTS_&/g, columnElements);
                    remoteTablePattern = remoteTablePattern.replace(/&TABLENAME&/g, tableName);
                    remoteTablePattern = remoteTablePattern.replace(/&TABLEDESCRIPTION&/g, tableDescription);
                    remoteTablePattern = remoteTablePattern.replace(/&SPACECONNECTION&/g, spaceConnection);
                    remoteTablePattern = remoteTablePattern.replace(/&SCHEMANAME&/g, schemaName);

                    return remoteTablePattern;
                });
        })
        .catch(error => console.error('Error:', error));
}


function createAndDownloadDataFlowJson(tableName, tableDescription, columns, spaceConnection, schemaName) {
    Promise.all([
        fetch('/dataflow_attributemapping-pattern').then(response => response.json()),
        fetch('/dataflow_elements-pattern').then(response => response.json()),
        fetch('/dataflow_tableattributes-pattern').then(response => response.json()),
        fetch('/dataflow_tablecomponents-pattern').then(response => response.json()),
        fetch('/dataflow-pattern').then(response => response.json()),
        createLocalTableJson(tableName, tableDescription, columns),
        createRemoteTableJson(tableName, tableDescription, columns, spaceConnection, schemaName)
    ])
        .then(([attributeMappingData, elementsData, tableAttributesData, tableComponentsData, dataFlowData, localTableJson, remoteTableJson]) => {
            let dataFlowPattern = dataFlowData.pattern;
            let attributeMappingPattern = attributeMappingData.pattern;
            let elementsPattern = elementsData.pattern;
            let tableAttributesPattern = tableAttributesData.pattern;
            let tableComponentsPattern = tableComponentsData.pattern;

            // column elements &_DATAFLOW_ELEMENTS_&
            const columnElements = columns.map(column => {
                let columnPattern = elementsPattern;
                columnPattern = columnPattern.replace(/&COLNAME&/g, column.COLNAME);
                columnPattern = columnPattern.replace(/&COLDESCRIPTION&/g, column.COLDESCRIPTION);
                columnPattern = columnPattern.replace(/&LENGTH&/g, column.LENGTH);
                columnPattern = columnPattern.replace(/&KEY&/g, column.KEY);
                columnPattern = columnPattern.replace(/&NOTNULL&/g, column.KEY);
                columnPattern = columnPattern.replace(/&CDSTYPE&/g, column.CDSTYPE);
                return columnPattern;
            }).join(',\n');

            // Table Attributes &_TABLE_ATTRIBUTES_&
            const tableAttributesElements = columns.map(column => {
                let columnPattern = tableAttributesPattern;
                columnPattern = columnPattern.replace(/&COLNAME&/g, column.COLNAME);
                return columnPattern;
            }).join(',\n');

            // AttributeMapping  &_ATTRIBUTE_MAPPING_&
            const attributeMappingElements = columns.map(column => {
                let columnPattern = attributeMappingPattern;
                columnPattern = columnPattern.replace(/&COLNAME&/g, column.COLNAME);
                return columnPattern;
            }).join(',\n');


            // TableComponents  &_TABLE_COMPONENTS_&
            const tableComponentElements = columns.map(column => {
                let columnPattern = tableComponentsPattern;
                columnPattern = columnPattern.replace(/&COLNAME&/g, column.COLNAME);
                return columnPattern;
            }).join(',\n');

            // Working the main document
            dataFlowPattern = dataFlowPattern.replace(/&_DATAFLOW_ELEMENTS_&/g, columnElements);
            dataFlowPattern = dataFlowPattern.replace(/&TABLENAME&/g, tableName);
            dataFlowPattern = dataFlowPattern.replace(/&TABLEDESCRIPTION&/g, tableDescription);
            dataFlowPattern = dataFlowPattern.replace(/&SPACECONNECTION&/g, spaceConnection);
            dataFlowPattern = dataFlowPattern.replace(/&SCHEMANAME&/g, schemaName);
            dataFlowPattern = dataFlowPattern.replace(/&_LOCAL_TABLE_&/g, localTableJson);
            dataFlowPattern = dataFlowPattern.replace(/&_REMOTE_TABLE_&/g, remoteTableJson);
            dataFlowPattern = dataFlowPattern.replace(/&_TABLE_ATTRIBUTES_&/g, tableAttributesElements);
            dataFlowPattern = dataFlowPattern.replace(/&_ATTRIBUTE_MAPPING_&/g, attributeMappingElements);
            dataFlowPattern = dataFlowPattern.replace(/&_TABLE_COMPONENTS_&/g, tableComponentElements);

            const json_lt = extractDefinition(localTableJson, "LT_" + tableName);
            const json_rt = extractDefinition(remoteTableJson, "RT_" + tableName);

            dataFlowPattern = dataFlowPattern.replace(/&_JSON_LT_&/g, removeBraces(JSON.stringify(json_lt)));
            dataFlowPattern = dataFlowPattern.replace(/&_JSON_RT_&/g, removeBraces(JSON.stringify(json_rt)));

            const blob = new Blob([dataFlowPattern], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${tableName}_dataflow.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        })
        .catch(error => console.error('Error:', error));
}