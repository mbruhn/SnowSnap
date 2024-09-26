const express = require('express');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const upload = multer({ dest: 'uploads/' });

let jsonData = { SCHEMAS: [] };

app.use(express.static(path.join(__dirname, 'public')));

app.post('/upload', upload.single('file'), (req, res) => {
    const filePath = path.join(__dirname, req.file.path);
    const results = [];

    fs.createReadStream(filePath)
        .pipe(csv(['SCHEMANAME', 'TABLENAME', 'TABLEDESCRIPTION', 'COLNAME', 'KEY', 'COLDESCRIPTION', 'TYPE', 'LENGTH', 'SCALE']))
        .on('data', (data) => {
            // Trim leading and trailing spaces from all fields
            Object.keys(data).forEach(key => {
                data[key] = data[key].trim().replace(/^"|"$/g, '');
            });

            // Convert 'KEY' to boolean
            data.KEY = (data.KEY.toLowerCase() === 'true');
            // Convert 'LENGTH' and 'SCALE' to integers
            data.LENGTH = parseInt(data.LENGTH, 10);
            data.SCALE = parseInt(data.SCALE, 10) || 0;
            results.push(data);
        })
        .on('end', () => {
            jsonData = { SCHEMAS: [] };
            const schemaMap = {};

            results.forEach(row => {
                const schemaKey = row.SCHEMANAME;
                const tableKey = `${row.TABLENAME}-${row.TABLEDESCRIPTION}`;

                if (!schemaMap[schemaKey]) {
                    schemaMap[schemaKey] = {
                        SCHEMANAME: row.SCHEMANAME,
                        TABLES: {}
                    };
                    jsonData.SCHEMAS.push(schemaMap[schemaKey]);
                }

                if (!schemaMap[schemaKey].TABLES[tableKey]) {
                    schemaMap[schemaKey].TABLES[tableKey] = {
                        TABLENAME: row.TABLENAME,
                        TABLEDESCRIPTION: row.TABLEDESCRIPTION,
                        COLUMNS: []
                    };
                }
                schemaMap[schemaKey].TABLES[tableKey].COLUMNS.push({
                    COLNAME: row.COLNAME,
                    KEY: row.KEY,
                    COLDESCRIPTION: row.COLDESCRIPTION,
                    TYPE: row.TYPE,
                    LENGTH: row.LENGTH,
                    SCALE: row.SCALE
                });
            });

            // Flatten the TABLES object into an array for each schema
            jsonData.SCHEMAS.forEach(schema => {
                schema.TABLES = Object.values(schema.TABLES);
            });

            fs.unlinkSync(filePath); // Remove the uploaded file
            res.json({ message: 'File processed successfully', jsonData });
        });
});

app.get('/localtable-pattern', (req, res) => {
    const patternPath = path.join(__dirname, 'setup', 'localtable_pattern.txt');
    fs.readFile(patternPath, 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error reading pattern file');
            return;
        }
        res.json({ pattern: data });
    });
});

app.get('/elements-pattern', (req, res) => {
    const patternPath = path.join(__dirname, 'setup', 'elements_pattern.txt');
    fs.readFile(patternPath, 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error reading pattern file');
            return;
        }
        res.json({ pattern: data });
    });
});

app.get('/remotetable-pattern', (req, res) => {
    const patternPath = path.join(__dirname, 'setup', 'remotetable_pattern.txt');
    fs.readFile(patternPath, 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error reading pattern file');
            return;
        }
        res.json({ pattern: data });
    });
});

app.get('/remote_elements-pattern', (req, res) => {
    const patternPath = path.join(__dirname, 'setup', 'remote_elements_pattern.txt');
    fs.readFile(patternPath, 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error reading pattern file');
            return;
        }
        res.json({ pattern: data });
    });
});

app.get('/dataflow-pattern', (req, res) => {
    const patternPath = path.join(__dirname, 'setup', 'dataflow_pattern.txt');
    fs.readFile(patternPath, 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error reading pattern file');
            return;
        }
        res.json({ pattern: data });
    });
});

app.get('/dataflow_attributemapping-pattern', (req, res) => {
    const patternPath = path.join(__dirname, 'setup', 'dataflow_attributemapping_pattern.txt');
    fs.readFile(patternPath, 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error reading pattern file');
            return;
        }
        res.json({ pattern: data });
    });
});

app.get('/dataflow_elements-pattern', (req, res) => {
    const patternPath = path.join(__dirname, 'setup', 'dataflow_elements_pattern.txt');
    fs.readFile(patternPath, 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error reading pattern file');
            return;
        }
        res.json({ pattern: data });
    });
});

app.get('/dataflow_tableattributes-pattern', (req, res) => {
    const patternPath = path.join(__dirname, 'setup', 'dataflow_tableattributes_pattern.txt');
    fs.readFile(patternPath, 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error reading pattern file');
            return;
        }
        res.json({ pattern: data });
    });
});

app.get('/dataflow_tablecomponents-pattern', (req, res) => {
    const patternPath = path.join(__dirname, 'setup', 'dataflow_tablecomponents_pattern.txt');
    fs.readFile(patternPath, 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error reading pattern file');
            return;
        }
        res.json({ pattern: data });
    });
});

app.listen(3010, () => {
    console.log('Server is running on http://localhost:3010');
});