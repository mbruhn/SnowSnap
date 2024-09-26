# SAP Datasphere Artifact Generator, Snaptable (Snowflake)

This Node.js tool automates the generation of necessary SAP Datasphere artifacts (Remote Tables, Local Tables, and Dataflows) based on table definitions provided in a CSV file. It streamlines the process by converting the CSV metadata into appropriate JSON files, which can be used for import into SAP Datasphere.

## Features

- **Remote Table Generation**: Automatically create remote table definitions for SAP Datasphere.
- **Local Table Generation**: Generate local table definitions with metadata mappings.
- **Dataflow Creation**: Build dataflows based on table metadata, linking local and remote tables.
- **CSV-based Input**: Metadata is supplied via a CSV file that includes schema, table, and column details.

## Prerequisites

- **Node.js**: Ensure you have Node.js installed. You can download it from [here](https://nodejs.org/).
- **CSV file**: The tool uses a CSV file that defines the table schema, you will find an example in the  `/examples` directory. This file contains definitions for tables from a Snowflake system. The CSV format is as follows:

  ```csv
  SCHEMANAME,TABLENAME,TABLEDESCRIPTION,COLNAME,KEY,COLDESCRIPTION,TYPE,LENGTH,SCALE
  ```

## Installation

### Clone the repository
```bash
git clone https://github.com/mbruhn/SnowSnap.git
cd SnowSnap
```

### Install dependencies
```bash
npm install
```

## Usage
To get started with generating artifacts, follow these steps:

### Step 1: Prepare the CSV File

Generate your CSV file containing table definitions. A sample CSV file is already included for tables in a Snowflake system. Ensure your file follows the correct format:

```csv
SCHEMANAME,TABLENAME,TABLEDESCRIPTION,COLNAME,KEY,COLDESCRIPTION,TYPE,LENGTH,SCALE
```

### Step 2: Run the Tool

Run the tool with the following command:

node index.js

The tool will process the CSV file and generate JSON files for the following artifacts:

	•	Local Table JSON: <tableName>_local_table.json
	•	Remote Table JSON: <tableName>_remote_table.json
	•	Dataflow JSON: <tableName>_dataflow.json

The generated JSON files will be saved in the download directory and you can access them from the browser as you would when you normally download a file.

### Step 3: Upload Artifacts to SAP Datasphere

Once the JSON files are generated, you can upload them to SAP Datasphere using the platform’s import functionality.

## How It Works

The tool processes the CSV file using the following steps:

	1.	File Upload: The CSV is parsed, and the metadata is extracted.
	2.	Mapping: The CSV metadata is converted into SAP Datasphere compatible JSON format.
	3.	Artifact Generation: Local Tables, Remote Tables, and Dataflows are created based on the metadata.

The tool uses a combination of pre-defined templates and metadata mappings to structure the output JSON files.

## Examples

A sample CSV file with Snowflake table definitions is included in the examples directory. This file serves as an example of the required format and helps you get started quickly.

## Contributing

Feel free to contribute to the project by submitting pull requests or opening issues on the GitHub repository.

## License

This project is licensed under the **Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0)** license.

You are free to:
- **Share**: Copy and redistribute the material in any medium or format.
- **Adapt**: Remix, transform, and build upon the material.

Under the following terms:
- **Attribution**: You must give appropriate credit, provide a link to the license, and indicate if changes were made. You may do so in any reasonable manner, but not in any way that suggests the licensor endorses you or your use.
- **NonCommercial**: You may not use the material for commercial purposes.

For more information, see the full license at: [https://creativecommons.org/licenses/by-nc/4.0/](https://creativecommons.org/licenses/by-nc/4.0/)
