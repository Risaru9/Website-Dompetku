const prisma = require("../config/prisma");

exports.getSummary = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Hitung Total Income
    const incomeAgg = await prisma.transaction.aggregate({
      where: { userId, type: "INCOME" },
      _sum: { amount: true },
    });

    // Hitung Total Expense
    const expenseAgg = await prisma.transaction.aggregate({
      where: { userId, type: "EXPENSE" },
      _sum: { amount: true },
    });

    const totalIncome = incomeAgg._sum.amount || 0;
    const totalExpense = expenseAgg._sum.amount || 0;
    const balance = totalIncome - totalExpense;

    return res.json({
      totalIncome,
      totalExpense,
      balance,
    });
  } catch (error) {
    next(error);
  }
};

exports.getCashflow = async (req, res) => {
  try {
    const { range } = req.query; // '7d', '1m', '1y', 'all'
    const userId = req.user.id;
    
    // 1. CARI TRANSAKSI TERAKHIR (Untuk menentukan Ujung Kanan Grafik)
    const lastTransaction = await prisma.transaction.findFirst({
      where: { userId },
      orderBy: { date: 'desc' } // Paling baru
    });

    // Default Anchor = Hari ini
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    let anchorDate = today;

    // Jika ada transaksi masa depan, geser Anchor ke sana
    if (lastTransaction) {
      const lastTxDate = new Date(lastTransaction.date);
      if (lastTxDate > today) {
        anchorDate = lastTxDate;
        anchorDate.setHours(23, 59, 59, 999);
      }
    }

    // 2. TENTUKAN START DATE (Ujung Kiri Grafik)
    let startDate = new Date(anchorDate);
    startDate.setHours(0, 0, 0, 0);

    let loopCount = 0;
    let mode = 'day'; // 'day' atau 'month'

    if (range === '1m') {
      startDate.setDate(startDate.getDate() - 29); 
      loopCount = 30;
    } else if (range === '1y') {
      // Mundur 11 bulan ke belakang
      startDate.setFullYear(startDate.getFullYear() - 1); 
      startDate.setMonth(startDate.getMonth() + 1);
      startDate.setDate(1);
      loopCount = 12;
      mode = 'month';
    } else if (range === 'all') {
      // 👇 LOGIKA BARU UNTUK 'SEMUA'
      // Cari transaksi paling jadul/lama
      const firstTransaction = await prisma.transaction.findFirst({
        where: { userId },
        orderBy: { date: 'asc' } 
      });

      if (firstTransaction) {
        startDate = new Date(firstTransaction.date);
        startDate.setHours(0, 0, 0, 0);
        
        // Hitung selisih hari antara Transaksi Pertama vs Terakhir
        const diffTime = Math.abs(anchorDate - startDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
        
        // Loop sebanyak hari yang ada (tambah 1 biar inklusif)
        loopCount = diffDays + 1; 
      } else {
        // Kalau belum ada transaksi sama sekali, default 7 hari aja
        startDate.setDate(startDate.getDate() - 6);
        loopCount = 7;
      }
    } else {
      // Default: 7 Hari ('7d')
      startDate.setDate(startDate.getDate() - 6);
      loopCount = 7;
    }

    // 3. AMBIL DATA DARI DB SESUAI RANGE
    const transactions = await prisma.transaction.findMany({
      where: {
        userId: userId,
        date: { 
            gte: startDate,
            lte: anchorDate 
        },
      },
      orderBy: { date: 'asc' },
    });

    // 4. MAPPING DATA (LOOPING untuk mengisi kekosongan)
    const dataMap = {};
    const dateList = [];
    
    let pointerDate = new Date(startDate);

    for (let i = 0; i < loopCount; i++) {
        let label = "";
        
        if (mode === 'month') {
            label = pointerDate.toLocaleDateString('id-ID', { month: 'short', year: 'numeric' });
            // Maju 1 bulan
            pointerDate.setMonth(pointerDate.getMonth() + 1);
        } else {
            label = pointerDate.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' });
            // Maju 1 hari
            pointerDate.setDate(pointerDate.getDate() + 1);
        }

        // Hindari duplikasi label (penting untuk mode month/all)
        if (!dataMap[label]) {
            dateList.push(label);
            dataMap[label] = { income: 0, expense: 0 }; 
        }
    }

    // 5. ISI DATA TRANSAKSI KE DALAM MAP
    transactions.forEach(tx => {
      const dateObj = new Date(tx.date);
      let label = "";
      
      if (mode === 'month') {
          label = dateObj.toLocaleDateString('id-ID', { month: 'short', year: 'numeric' });
      } else {
          label = dateObj.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' });
      }

      if (dataMap[label]) {
        if (tx.type === 'INCOME') {
            dataMap[label].income += Number(tx.amount);
        } else {
            dataMap[label].expense += Number(tx.amount);
        }
      }
    });

    res.json({
      status: 'success',
      data: {
        labels: dateList,
        income: dateList.map(l => dataMap[l].income),
        expense: dateList.map(l => dataMap[l].expense)
      }
    });

  } catch (error) {
    console.error("Cashflow Error:", error);
    res.status(500).json({ status: "error", message: error.message });
  }
};