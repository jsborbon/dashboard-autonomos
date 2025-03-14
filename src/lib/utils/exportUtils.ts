import jsPDF from 'jspdf';
import * as Papa from 'papaparse';
import pkg from 'file-saver';
const { saveAs } = pkg;
import type { InvoiceData } from '$lib/types';

/**
 * Exports invoice data to CSV format and triggers download
 */
export function exportToCSV(data: InvoiceData, filename = 'invoice-data.csv') {
	try {
		// Prepare data for CSV format
		const csvData = [];

		// Add header row
		csvData.push(['Mes', 'Ingresos', 'Gastos', 'Balance']);

		// Add data rows
		for (let i = 0; i < data.months.length; i++) {
			const balance = data.income[i] - data.expenses[i];
			csvData.push([
				data.months[i],
				data.income[i].toFixed(2),
				data.expenses[i].toFixed(2),
				balance.toFixed(2)
			]);
		}

		// Add summary row
		const totalIncome = data.income.reduce((sum, val) => sum + val, 0);
		const totalExpenses = data.expenses.reduce((sum, val) => sum + val, 0);
		const totalBalance = totalIncome - totalExpenses;
		csvData.push([
			'Total',
			totalIncome.toFixed(2),
			totalExpenses.toFixed(2),
			totalBalance.toFixed(2)
		]);

		// Convert to CSV string
		const csv = Papa.unparse(csvData, {
			delimiter: ';',
			newline: '\r\n'
		});

		// Create blob and download
		const blob = new Blob([csv], { type: 'text/csv;charset=ISO-8859-1' });
		saveAs(blob, filename);
	} catch (error) {
		console.error('Error exporting to CSV:', error);
		alert('Error exporting to CSV. Please try again.');
	}
}

/**
 * Exports invoice data to PDF format and triggers download
 */
export function exportToPDF(data: InvoiceData, filename = 'invoice-data.pdf') {
	try {
		// Create new PDF document
		const doc = new jsPDF({
			orientation: 'portrait',
			unit: 'mm',
			format: 'a4'
		});

		// Add title
		doc.setFontSize(18);
		doc.text('Informe de Facturación', 105, 15, { align: 'center' });

		// Add date
		doc.setFontSize(10);
		doc.text(`Generado: ${new Date().toLocaleDateString('es-ES')}`, 105, 22, { align: 'center' });

		// Add table header
		doc.setFontSize(12);
		doc.setTextColor(0, 0, 0);
		doc.text('Mes', 20, 35);
		doc.text('Ingresos (€)', 80, 35);
		doc.text('Gastos (€)', 130, 35);
		doc.text('Balance (€)', 180, 35);

		// Add horizontal line
		doc.setDrawColor(0, 0, 0);
		doc.line(20, 38, 190, 38);

		// Add data rows
		let y = 45;
		let totalIncome = 0;
		let totalExpenses = 0;

		data.months.forEach((month, index) => {
			const income = data.income[index];
			const expense = data.expenses[index];
			const balance = income - expense;

			totalIncome += income;
			totalExpenses += expense;

			doc.setFontSize(10);
			doc.text(month, 20, y);
			doc.text(income.toFixed(2), 80, y, { align: 'right' });
			doc.text(expense.toFixed(2), 130, y, { align: 'right' });

			// Set balance color based on value
			if (balance < 0) {
				doc.setTextColor(255, 0, 0); // Red for negative
			} else {
				doc.setTextColor(0, 128, 0); // Green for positive
			}

			doc.text(balance.toFixed(2), 180, y, { align: 'right' });
			doc.setTextColor(0, 0, 0); // Reset text color

			y += 8;

			// Add new page if needed
			if (y > 270) {
				doc.addPage();
				y = 20;
			}
		});

		// Add horizontal line
		doc.line(20, y, 190, y);
		y += 8;

		// Add totals
		const totalBalance = totalIncome - totalExpenses;

		doc.setFontSize(12);
		// Use standard font with bold style instead of setFont('bold')
		doc.setFont('helvetica', 'bold');
		doc.text('Total', 20, y);
		doc.text(totalIncome.toFixed(2), 80, y, { align: 'right' });
		doc.text(totalExpenses.toFixed(2), 130, y, { align: 'right' });

		// Set total balance color
		if (totalBalance < 0) {
			doc.setTextColor(255, 0, 0);
		} else {
			doc.setTextColor(0, 128, 0);
		}

		doc.text(totalBalance.toFixed(2), 180, y, { align: 'right' });

		// Save the PDF
		doc.save(filename);
	} catch (error) {
		console.error('Error exporting to PDF:', error);
		alert('Error exporting to PDF. Please try again.');
	}
}
