"use client";

import React from "react";

const marksData = [
	["Mathematics", "MATH101", 10, 50, 35, 50, 45, "Pass"],
	["Physics", "PHY102", 20, 50, 25, 50, 45, "Pass"],
	["Chemistry", "CHEM103", 15, 50, 30, 50, 45, "Pass"],
	["Computer Science", "CS104", 40, 50, 45, 50, 85, "Pass"],
];

const MarksTable = () => {
	return (
		<div className="p-6">
			<h2 className="text-xl font-semibold mb-4">Student Marks Report</h2>
			<table className="w-full border border-gray-300">
				<thead>
					<tr className="bg-gray-200 text-left">
						<th className="p-2 border">Subject</th>
						<th className="p-2 border">Subject Code</th>
						<th className="p-2 border">Internal Marks</th>
						<th className="p-2 border">External Marks</th>
						<th className="p-2 border">Total Marks</th>
						<th className="p-2 border">Status (P/F)</th>
					</tr>
				</thead>
				<tbody>
					{marksData.map((row, index) => (
						<tr key={index} className="text-center border-b">
							<td className="p-2 border">{row[0]}</td>
							<td className="p-2 border">{row[1]}</td>
							<td className="p-2 border">
								{row[2]}/{row[3]}
							</td>
							<td className="p-2 border">
								{row[4]}/{row[5]}
							</td>
							<td className="p-2 border">{row[6]}</td>
							<td
								className={`p-2 border ${
									row[7] === "Pass" ? "text-green-600" : "text-red-600"
								}`}
							>
								{row[7]}
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default MarksTable;
