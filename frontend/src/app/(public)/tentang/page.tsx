import { PublicNavbar } from '@/components/layout/public-navbar';
import { PublicFooter } from '@/components/layout/public-footer';
import { Target, Heart, Lightbulb, Users, ShieldCheck } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <PublicNavbar />
      <main className="flex-1 bg-white">
        {/* Header Section */}
        <section className="py-20 text-center">
          <div className="container mx-auto px-4 max-w-3xl">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-6">
              Tentang Dompetku
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              Kami percaya bahwa mengelola keuangan seharusnya tidak rumit. Dompetku hadir untuk 
              membantu siapa saja, terutama generasi muda, memahami dan mengelola keuangan pribadi 
              dengan cara yang sederhana.
            </p>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Mengapa Dompetku Dibuat?</h2>
            <div className="space-y-6 text-gray-600 leading-relaxed">
              <p>
                Banyak anak muda Indonesia yang baru memasuki dunia kerja atau masih kuliah kesulitan mengelola 
                keuangan. Bukan karena mereka tidak mau, tapi karena tools yang ada terlalu rumit atau menggunakan 
                istilah akuntansi yang membingungkan.
              </p>
              <p>
                Dompetku dibuat untuk menjembatani gap tersebut. Kami ingin membuat pencatatan keuangan semudah 
                mencatat di buku catatan, tapi dengan kekuatan visualisasi dan analisis yang biasanya hanya ada di aplikasi 
                enterprise.
              </p>
              <p className="font-medium text-gray-900">
                Prinsip kami sederhana: <span className="text-black font-bold">Simpel &gt; Canggih</span>. 
                Kami lebih memilih fitur yang benar-benar dibutuhkan dan mudah dipahami, daripada menambahkan 
                banyak fitur yang hanya membingungkan user.
              </p>
            </div>
          </div>
        </section>

        {/* Visi Misi Section */}
        <section className="py-20 bg-gray-50/50">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="grid md:grid-cols-2 gap-12">
              {/* Visi */}
              <div>
                <div className="bg-emerald-100 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                  <Target className="h-6 w-6 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold mb-4">Visi Kami</h3>
                <p className="text-gray-600 leading-relaxed">
                  Menjadi platform pengelola keuangan pribadi paling mudah dipahami di Indonesia, 
                  membantu jutaan orang Indonesia mencapai kesehatan finansial melalui pencatatan 
                  yang konsisten dan insight yang actionable.
                </p>
              </div>
              {/* Misi */}
              <div>
                <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                  <Heart className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold mb-4">Misi Kami</h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex gap-2">
                    <span className="text-blue-500">•</span>
                    Menyederhanakan pencatatan keuangan tanpa mengorbankan kegunaan
                  </li>
                  <li className="flex gap-2">
                    <span className="text-blue-500">•</span>
                    Memberikan visualisasi yang jelas dan mudah dipahami
                  </li>
                  <li className="flex gap-2">
                    <span className="text-blue-500">•</span>
                    Tetap gratis dan accessible untuk semua kalangan
                  </li>
                  <li className="flex gap-2">
                    <span className="text-blue-500">•</span>
                    Terus berinovasi dengan mendengarkan feedback user
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 max-w-6xl text-center">
            <h2 className="text-3xl font-bold mb-4">Nilai-Nilai Kami</h2>
            <p className="text-gray-600 mb-16">Prinsip yang kami pegang dalam mengembangkan Dompetku.</p>
            
            <div className="grid md:grid-cols-3 gap-8">
              {/* Value 1 */}
              <div className="p-8 border rounded-2xl bg-white hover:shadow-lg transition-shadow">
                <div className="bg-green-50 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Lightbulb className="h-7 w-7 text-green-600" />
                </div>
                <h3 className="font-bold text-lg mb-3">Kesederhanaan</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Setiap fitur harus bisa dipahami dalam sekali lihat. Tidak ada yang tersembunyi atau membingungkan.
                </p>
              </div>
              {/* Value 2 */}
              <div className="p-8 border rounded-2xl bg-white hover:shadow-lg transition-shadow">
                <div className="bg-blue-50 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="h-7 w-7 text-blue-600" />
                </div>
                <h3 className="font-bold text-lg mb-3">User-First</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Keputusan pengembangan selalu berdasarkan kebutuhan user, bukan se-mood developer.
                </p>
              </div>
              {/* Value 3 */}
              <div className="p-8 border rounded-2xl bg-white hover:shadow-lg transition-shadow">
                <div className="bg-red-50 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-6">
                  <ShieldCheck className="h-7 w-7 text-red-600" />
                </div>
                <h3 className="font-bold text-lg mb-3">Transparansi</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Kami terbuka tentang bagaimana data digunakan dan tidak pernah menjual data user.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <PublicFooter />
    </div>
  );
}