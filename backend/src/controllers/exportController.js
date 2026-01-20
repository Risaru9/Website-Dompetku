const prisma = require('../config/prisma');
const ExcelJS = require('exceljs');

exports.downloadExcel = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const userId = req.user ? req.user.id : null; 

    if (!userId) {
        return res.status(401).json({ status: 'error', message: 'Unauthorized' });
    }

    if (!startDate || !endDate) {
      return res.status(400).json({ status: 'error', message: 'Tanggal awal dan akhir wajib diisi' });
    }

    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const transactions = await prisma.transaction.findMany({
      where: {
        userId: userId,
        date: { gte: start, lte: end }
      },
      orderBy: { date: 'asc' }
    });

    // Setup Excel
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Laporan Keuangan');

    worksheet.columns = [
      { header: 'No', key: 'no', width: 5 },
      { header: 'Tanggal', key: 'date', width: 15 },
      { header: 'Jenis', key: 'type', width: 15 },
      { header: 'Kategori', key: 'category', width: 25 },
      { header: 'Keterangan', key: 'desc', width: 35 },
      { header: 'Masuk (Rp)', key: 'income', width: 15 },
      { header: 'Keluar (Rp)', key: 'expense', width: 15 },
    ];

    worksheet.getRow(1).font = { bold: true };

    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach((tx, index) => {
      const amount = Number(tx.amount);
      const isIncome = tx.type === 'INCOME';

      if (isIncome) totalIncome += amount;
      else totalExpense += amount;

      worksheet.addRow({
        no: index + 1,
        date: new Date(tx.date).toISOString().split('T')[0],
        type: isIncome ? 'Pemasukan' : 'Pengeluaran',
        category: tx.category || 'Umum',
        desc: tx.description || '-',
        income: isIncome ? amount : 0,
        expense: !isIncome ? amount : 0,
      });
    });

    worksheet.addRow([]);
    worksheet.addRow(['', '', '', '', 'TOTAL', totalIncome, totalExpense]);
    worksheet.addRow(['', '', '', '', 'SALDO PERIODE', totalIncome - totalExpense]);
    
    worksheet.lastRow.font = { bold: true };

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=Laporan.xlsx`);

    await workbook.xlsx.write(res);
    res.end();

  } catch (error) {
    console.error("Export Error:", error);
    res.status(500).json({ status: 'error', message: 'Gagal generate Excel' });
  }
};