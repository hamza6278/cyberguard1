// TestedSoftware.js
import React from 'react';
import './DuplicatePage.css';

function TestedSoftware() {
  // Dummy data for the table
  const data = [
    { seqNo: 1, hashCode: '4321X', softwareName: 'Adobe Premiere Pro', department: 'Video Editing', conditions: 'Sensitive', dateAlloted: '2023-11-15', remarks: '' },
    { seqNo: 2, hashCode: '9876Y', softwareName: 'AutoCAD 2023', department: 'CAD', conditions: 'Not Sensitive', dateAlloted: '2023-11-16', remarks: '' },
    { seqNo: 3, hashCode: '2345Z', softwareName: 'Photoshop CC', department: 'Graphics', conditions: 'Sensitive', dateAlloted: '2023-11-14', remarks: '' },
    // ... (other data)
  ];

  const additionalRows = [
    { seqNo: 4, hashCode: '5678A', softwareName: 'Visual Studio Code', department: 'Software Development', conditions: 'Not Sensitive', dateAlloted: '2023-11-13', remarks: '' },
    { seqNo: 5, hashCode: '3456B', softwareName: 'Microsoft Excel', department: 'Office Tools', conditions: 'Sensitive', dateAlloted: '2023-11-17', remarks: '' },
    { seqNo: 6, hashCode: '7890C', softwareName: 'AutoCAD LT', department: 'CAD', conditions: 'Not Sensitive', dateAlloted: '2023-11-18', remarks: '' },
    { seqNo: 7, hashCode: '8765D', softwareName: 'Visual Studio', department: 'Software Development', conditions: 'Sensitive', dateAlloted: '2023-11-19', remarks: '' },
    // ... (other data)
  ];

  return (
    <div style={{ textAlign: 'center' }}>
      <h1>Date Allocation For New Software Tests</h1>
      <h4>Please Enter Date And remarks(if needed)</h4>
      <table className="software-table">
        <thead>
          <tr>
            <th>Seq No.</th>
            <th>Hash Code</th>
            <th>Software Name</th>
            <th>Department</th>
            <th>Conditions</th>
            <th>Date Alloted</th>
            <th>Remarks</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td>{item.seqNo}</td>
              <td>{item.hashCode}</td>
              <td>{item.softwareName}</td>
              <td>{item.department}</td>
              <td>{item.conditions}</td>
              <td>{item.dateAlloted}</td>
              <td>{item.remarks}</td>
            </tr>
          ))}
          {additionalRows.map((item, index) => (
            <tr key={index + data.length}>
              <td>{item.seqNo}</td>
              <td>{item.hashCode}</td>
              <td>{item.softwareName}</td>
              <td>{item.department}</td>
              <td>{item.conditions}</td>
              <td>{item.dateAlloted}</td>
              <td>{item.remarks}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TestedSoftware;
