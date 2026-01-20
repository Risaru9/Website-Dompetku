const prisma = require("../config/prisma");
const { successResponse, errorResponse } = require("../utils/response");
const ExcelJS = require('exceljs');

// 1. CREATE (Buat Baru)
exports.createTransaction = async (req, res) => {
  try {
    if (!req.user) return errorResponse(res, "Unauthorized", 401);

    const { type, amount, category, description, date } = req.body;
    const userId = req.user.id;

    if (!type || !amount || !date || !category) {
      return errorResponse(res, "Field wajib diisi: type, amount, category, date", 400);
    }

    const transaction = await prisma.transaction.create({
      data: {
        type,
        amount: Number(amount),
        category,
        description,
        date: new Date(date),
        userId: userId, 
      },
    });

    return successResponse(res, "Transaksi berhasil ditambahkan", transaction, 201);
  } catch (error) {
    console.error("CREATE ERROR:", error);
    return errorResponse(res, "Gagal menambahkan transaksi", 500);
  }
};

// 2. READ (Ambil Semua)
exports.getTransactions = async (req, res) => {
  try {
    if (!req.user) return errorResponse(res, "Unauthorized", 401);

    const userId = req.user.id;
    // Ambil parameter filter
    const { limit } = req.query; 

    const transactions = await prisma.transaction.findMany({
      where: { userId },
      orderBy: { date: "desc" },
      take: limit ? Number(limit) : undefined,
    });

    return successResponse(res, "Data berhasil diambil", transactions);
  } catch (error) {
    console.error("GET ERROR:", error);
    return errorResponse(res, "Gagal mengambil data", 500);
  }
};

// 3. UPDATE (Edit Transaksi)
exports.updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const { type, amount, category, description, date } = req.body;
    const userId = req.user.id;

    // Cek dulu: Apakah transaksi ini ada & milik user ini?
    const existingTx = await prisma.transaction.findUnique({
      where: { id: Number(id) }
    });

    if (!existingTx) {
      return errorResponse(res, "Transaksi tidak ditemukan", 404);
    }
    if (existingTx.userId !== userId) {
      return errorResponse(res, "Anda tidak berhak mengedit data ini", 403);
    }

    // Lakukan Update
    const updatedTx = await prisma.transaction.update({
      where: { id: Number(id) },
      data: {
        type,
        amount: Number(amount),
        category,
        description,
        date: new Date(date)
      }
    });

    return successResponse(res, "Transaksi berhasil diperbarui", updatedTx);

  } catch (error) {
    console.error("UPDATE ERROR:", error);
    return errorResponse(res, "Gagal mengupdate transaksi", 500);
  }
};

// 4. DELETE
exports.deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Cek kepemilikan
    const existingTx = await prisma.transaction.findUnique({
      where: { id: Number(id) }
    });

    if (!existingTx) {
      return errorResponse(res, "Transaksi tidak ditemukan", 404);
    }
    if (existingTx.userId !== userId) {
      return errorResponse(res, "Anda tidak berhak menghapus data ini", 403);
    }

    // Hapus
    await prisma.transaction.delete({
      where: { id: Number(id) }
    });

    return successResponse(res, "Transaksi berhasil dihapus");

  } catch (error) {
    console.error("DELETE ERROR:", error);
    return errorResponse(res, "Gagal menghapus transaksi", 500);
  }
};

// 5. DOWNLOAD EXCEL
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