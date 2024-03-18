const express = require('express');
const mysql = require('mysql2'); // Change to mysql2
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
//const multer = require('multer');
//const fs = require('fs');
//const path = require('path');




const app = express();
app.use(cors())
//app.use(express.json());
app.use(express.json({ limit: '15000000mb' }));
app.use(express.urlencoded({ limit: '15000000mb', extended: true }))

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '399216@qwerty%6',
  database: 'demo',
  //Promise: require('mysql2/promise'),
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');
});


app.post('/login', (req, res) => {
  const { full_name, password } = req.body;
  const query = 'SELECT * FROM userdetails WHERE username = ? AND password = ?';

  db.query(query, [full_name, password], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
      return;
    }

    if (results.length > 0) {
      res.status(200).json({ success: true });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  });
});

app.post('/submitAnalyzerNoti', (req, res) => {
  const { date, contact, functionality, department, folderLocation } = req.body;
  console.log(req.body);

  // Perform database insertion query for analyzer_notifications
  db.query(
    'INSERT INTO analyzer_notifications (date, contact, functionality, department, folderLocation) VALUES (?, ?, ?, ?, ?)',
    [date, contact, functionality, department, folderLocation],
    (err, results) => {
      if (err) {
        console.error('Database error:', err);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
        return;
      }
      
      // Handle success if needed
      res.status(200).json({ success: true, message: 'Data Submitted to analyzer_notifications' });
    }
  );
});

app.post('/submitSoftware', (req, res) => {
  const { date, contact, functionality, department, softwareName, letterID, remarks, folderLocation } = req.body;

  // Check if the software name already exists
  db.query(
    'SELECT * FROM softwarecredentials WHERE softwareName = ?',
    [softwareName],
    (err, results) => {
      if (err) {
        console.error('Database error:', err);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
        return;
      }

      if (results.length > 0) {
        // Software name already exists, inform the client
        res.status(200).json({ success: false, message: 'Software name already exists. Please choose a different name.' });
      } else {
        // Software name doesn't exist, proceed with the insertion
        db.query(
          'INSERT INTO softwarecredentials (date, contact, functionality, department, softwareName, folderLocation) VALUES (?, ?, ?, ?, ?, ?)',
          [date, contact, functionality, department, softwareName, folderLocation],
          (err, results) => {
            if (err) {
              console.error('Database error:', err);
              res.status(500).json({ success: false, message: 'Internal Server Error' });
              return;
            }

            // Insert into notifications table
            db.query(
              'INSERT INTO notifications (date, contact, functionality, department, softwareName, letterID, remarks, folderLocation) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
              [date, contact, functionality, department, softwareName, letterID, remarks, folderLocation],
              (err, results) => {
                if (err) {
                  console.error('Database error:', err);
                  res.status(500).json({ success: false, message: 'Internal Server Error' });
                  return;
                }

                // For example, you can use nodemailer to send an email
                // Notification logic here...

                res.status(200).json({ success: true, message: 'Data Submitted to softwarecredentials and notifications' });
              }
            );
          }
        );
      }
    }
  );
});
app.get('/softwarecredentials', (req, res) => {
  db.query('SELECT * FROM softwarecredentials', (err, results) => {
    if (err) {
      console.error('Database error:', err);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
      return;
    }

    // Send the software credentials list to the client
    res.status(200).json({ success: true, softwarecredentials: results });
  });
});

//post resu;t to db
/*app.post('/saveDataToDB', (req, res) => {
  const { fileData } = req.body;

  // Assuming 'softwareresult' table exists with columns: filename, directory, hash, analysisresult, status
  const insertQuery = 'INSERT INTO softwareresult (filename, directory, hash, analysisresult, status) VALUES ?';

  const values = fileData.map((file) => [
    file.fileName,
    file.directory,
    file.hash,
    JSON.stringify(file.result), // Assuming analysis result is an object to be stored as JSON
    file.result.status,
  ]);

  db.query(insertQuery, [values], (error, result) => {
    if (error) {
      console.error('Error inserting data into database:', error);
      res.status(500).send('Error inserting data into database');
    } else {
      console.log('Data inserted into database');
      res.status(200).send('Data inserted into database');
    }
  });
});
*/

//save result to db

app.post('/saveDataToDB', (req, res) => {
  const { fileData } = req.body;

  const insertQuery = 'INSERT INTO softwareresults (folderName, fileName, directory, hash, analysisResult, status) VALUES ?';

  const values = fileData.map((file) => [
    file.folderName,
    file.fileName,
    file.directory,
    file.hash,
    JSON.stringify(file.result), // Assuming analysis result is stored as a JSON string
    file.status,
  ]);

  db.query(insertQuery, [values], (error, results) => {
    if (error) {
      console.error('Error saving data to database:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    } else {
      console.log('Data saved to database');
      res.status(200).json({ message: 'Data saved successfully' });
    }
  });
});


// Backend route to fetch data from softwareresults table without remarks column
app.get('/fetchSoftwareResults', (req, res) => {
  const fetchQuery = 'SELECT folderName, fileName, directory, hash, analysisResult, status FROM vthashresult';

  db.query(fetchQuery, (error, result) => {
    if (error) {
      console.error('Error fetching data from database:', error);
      res.status(500).send('Error fetching data from database');
    } else {
      console.log('Data fetched from database');
      res.status(200).json(result); // Send fetched data as JSON response
    }
  });
});


//save remarks
app.post('/saveRemarks', (req, res) => {
  const { remarksData } = req.body;

  // Assuming 'remarks' table exists with columns: remarks, folderName, fileName, directory, hash, analysisResult, status
  const insertQuery =
    'INSERT INTO remarks (remarks, folderName, fileName, directory, hash, analysisResult, status) VALUES ?';

  const values = remarksData.map((result) => [
    result.remarks,
    result.folderName,
    result.fileName,
    result.directory,
    result.hash,
    result.analysisResult,
    result.status,
  ]);

  db.query(insertQuery, [values], (error, results) => {
    if (error) {
      console.error('Error saving remarks to database:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    } else {
      console.log('Remarks saved to database');
      res.status(200).json({ message: 'Remarks saved successfully' });
    }
  });
});



app.get('/analyzer_notifications', (req, res) => {
  const query = 'SELECT * FROM analyzer_notifications';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    res.json(results);
  });
});

app.get('/notifications', (req, res) => {
  const query = 'SELECT * FROM notifications';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    res.json(results);
  });
});
//save hash result

app.post('/saveHashResults', (req, res) => {
  const hashResults = req.body.hashResults;

  // Check if hashResults is an array
  if (!Array.isArray(hashResults)) {
    return res.status(400).json({ error: 'Invalid data format' });
  }

  // Insert each hash result into the 'hashresult' table
  hashResults.forEach((result) => {
    const { folderName, fileName, directory, hash } = result;

    const sql = 'INSERT INTO hashresult (folderName, fileName, directory, hash) VALUES (?, ?, ?, ?)';
    const values = [folderName, fileName, directory, hash];

    db.query(sql, values, (err, result) => {
      if (err) {
        console.error('Error inserting data into MySQL:', err);
      } else {
        console.log('Data inserted into MySQL successfully.');
      }
    });
  });

  res.status(200).json({ message: 'Hash results saved successfully' });
});
//app.use(bodyParser.json());

// Endpoint to handle saving data to the 'softwareresult' table

//view result of software from db//
// Backend route to fetch data from softwareresult table



//view hash result where result = NULL
app.get('/getPendingResults', (req, res) => {
  const sql = `
    SELECT hashresult.*
    FROM hashresult
    LEFT JOIN vthashresult ON hashresult.hash = vthashresult.hash
    WHERE vthashresult.hash IS NULL
      AND hashresult.analysisResult IS NULL
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching pending results:', err);
      res.status(500).send('Internal Server Error');
    } else {
      res.json(results);
    }
  });
});

app.post('/addNoti', (req, res) => {
  const {date, contact, functionality, department,analyzerAcc,letterID,remarks,softwareName,folderLocation}  =req.body
  const query = 'DELETE FROM notifications WHERE contact = ?';
console.log(req.body)
  db.query(query, [contact], (err, result) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    // Check if any rows were affected
    db.query(
      'INSERT INTO analyzer_notifications (date, contact, functionality, department,analyzeAcc,letterID,remarks,softwareName,folderLocation) VALUES (?, ?, ?, ?,?,?,?,?,?)',
      [date, contact, functionality, department,analyzerAcc,letterID,remarks,softwareName,folderLocation],
      (err, results) => {
        if (err) {
          console.error('Database error:', err);
          res.status(500).json({ success: false, message: 'Internal Server Error' });
          return;
        }
      })      
    })

      // For example, you can use nodemailer to send an email
      // Notification logic here...

      res.status(200).json({ success: true });
    }
  );
  
app.delete('/notifications/', (req, res) => {
  const contactToDelete = req.body.contact;
  const {date, contact, functionality, department}  =req.body
//   const query = 'DELETE FROM notifications WHERE contact = ?';
// console.log(contactToDelete)
//   db.query(query, [contactToDelete], (err, result) => {
//     if (err) {
//       console.error('Error executing query:', err);
//       res.status(500).json({ error: 'Internal Server Error' });
//       return;
//     }
    // Check if any rows were affected
    db.query(
      'INSERT INTO notifications (date, contact, functionality, department) VALUES (?, ?, ?, ?)',
      [date, contact, functionality, department],
      (err, results) => {
        if (err) {
          console.error('Database error:', err);
          res.status(500).json({ success: false, message: 'Internal Server Error' });
          return;
        }
      })      
  

      // For example, you can use nodemailer to send an email
      // Notification logic here...

      res.status(200).json({ success: true });
    }
  );
// });

//update hash table
// API endpoint to update hashresult table

app.post('/saveToVTDB', (req, res) => {
  const results = req.body.results;

  // Assuming vthashresult table has columns: id, fileName, folderName, directory, hash, analysisResult, status
  const insertQuery = 'INSERT INTO vthashresult (fileName, folderName, directory, hash, analysisResult, status) VALUES ?';

  const values = results.map((result) => [
    result.fileName,
    result.folderName,
    result.directory,
    result.hash,
    JSON.stringify(result.analysisResult), // Convert analysisResult to JSON string
    result.status, // Assuming status is a string
  ]);

  db.query(insertQuery, [values], (err, result) => {
    if (err) {
      console.error('Error saving to vthashresult:', err);
      res.status(500).json({ message: 'Error saving to database' });
    } else {
      console.log('Saved to vthashresult:', result);
      res.json({ message: 'Saved to database successfully' });
    }
  });
});

function saveAnalysisResultToDB(result) {
  const { fileName, folderName, directory, hash, analysisResult } = result;

  const query = `INSERT INTO vthashresult (fileName, folderName, directory, hash, analysisResult) 
                 VALUES (?, ?, ?, ?, ?)`;

  connection.query(query, [fileName, folderName, directory, hash, JSON.stringify(analysisResult)], (err, results) => {
    if (err) {
      console.error('Error saving analysis result to the database:', err);
    } else {
      console.log('Analysis result saved to the database');
    }
  });
}

app.post('/saveApiKeys', (req, res) => {
  const { apiKeys } = req.body;

  // Delete existing API keys
  db.query('DELETE FROM apikey', (deleteError) => {
    if (deleteError) {
      console.error('Error deleting existing API keys:', deleteError);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
      return;
    }

    // Insert new API keys
    const insertQuery = 'INSERT INTO apikey (apiKey) VALUES ?';
    db.query(insertQuery, [apiKeys.map(key => [key])], (insertError) => {
      if (insertError) {
        console.error('Error inserting new API keys:', insertError);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
        return;
      }

      res.status(200).json({ success: true, message: 'API keys saved successfully' });
    });
  });
});

app.get('/getApiKeys', (req, res) => {
  // Replace 'apikey' with your actual table name
  db.query('SELECT * FROM apikey', (error, results) => {
    if (error) {
      console.error('Error fetching API keys:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      const apiKeys = results.map(result => result.apikey); // Extracting only the API keys
      res.json(apiKeys);
    }
  });
});

app.post('/register', (req, res) => {
  const { role, username, password } = req.body;

  // Insert the registration data into the database
  const sql = 'INSERT INTO register (role, username, password) VALUES (?, ?, ?)';
  db.query(sql, [role, username, password], (err, result) => {
    if (err) {
      console.error('Error during registration:', err);
      res.status(500).json({ success: false, error: 'Error during registration' });
    } else {
      console.log('User registered successfully');
      res.status(200).json({ success: true, message: 'User registered successfully' });
    }
  });
})

app.get('/viewNewUsers', (req, res) => {
  // Execute the query to fetch new users from the register table with only role, username, and password columns
  db.query('SELECT role, username, password FROM register', (err, results) => {
    if (err) {
      console.error('Error fetching new users:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    // Send the fetched new users data as JSON response
    res.status(200).json(results);
  });
});

app.post('/registerUser', (req, res) => {
  const { role, username, password } = req.body;

  // Insert user details into the userdetails table
  const insertQuery = 'INSERT INTO userdetails (role, username, password) VALUES (?, ?, ?)';
  db.query(insertQuery, [role, username, password], (err, result) => {
    if (err) {
      console.error('Error registering user:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    console.log('User registered successfully:', result);
    res.sendStatus(200);
  });

  // Delete the registered user from the register table
  const deleteQuery = 'DELETE FROM register WHERE username = ?';
  db.query(deleteQuery, [username], (err, result) => {
    if (err) {
      console.error('Error deleting user from register:', err);
      return;
    }
    console.log('User deleted from register:', result);
  });
});

// Route to decline and delete a user from the register table
app.post('/declineUser', (req, res) => {
  const { username } = req.body;

  // Delete the user from the register table
  const deleteQuery = 'DELETE FROM register WHERE username = ?';
  db.query(deleteQuery, [username], (err, result) => {
    if (err) {
      console.error('Error declining user:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    console.log('User declined and deleted from register:', result);
    res.sendStatus(200);
  });
});

//

app.post('/upload', (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  const folder = req.files.folder;

  // Move the uploaded folder to a specific directory
  folder.mv(path.join(__dirname, 'uploads', folder.name), (err) => {
    if (err) {
      console.error('Error uploading folder:', err);
      return res.status(500).send('Internal Server Error');
    }

    res.send('Folder uploaded successfully!');
  });
});


const PORT = 3028
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

