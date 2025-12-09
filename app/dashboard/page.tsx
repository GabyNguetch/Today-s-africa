// FICHIER: app/dashboard/page.tsx
export default function DashboardOverview() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Vue d'ensemble</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Stats Cards Demo */}
        {['Articles Publiés', 'Vues Totales', 'Commentaires'].map((item) => (
          <div key={item} className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-gray-100 dark:border-zinc-800 shadow-sm">
            <h3 className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">{item}</h3>
            <p className="text-3xl font-extrabold text-[#3E7B52] dark:text-[#13EC13]">0</p>
          </div>
        ))}
      </div>
      <div className="mt-12 bg-white dark:bg-zinc-900 rounded-xl border border-gray-100 dark:border-zinc-800 p-10 text-center">
         <p className="text-gray-400 text-sm">Vos statistiques apparaîtront ici.</p>
      </div>
    </div>
  );
}