import React from 'react';

export const ReportPage = () => {


  const get = () => {
  
  }
  useEffect(() => {
    
  }, []);
  // Datos de ejemplo
  const stats = {
    totalReports: 1245,
    resolved: 892,
    pending: 353,
    averageResolutionTime: '2.5 días',
    newThisWeek: 127,
    resolutionRate: Math.round((892 / 1245) * 100),
    pendingRate: Math.round((353 / 1245) * 100)
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Estadísticas de Reportes</h1>
        <p className="text-gray-600">Resumen general del sistema</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {/* Card 1: Total de reportes */}
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
              <span className="font-bold text-xl">📊</span>
            </div>
            <div>
              <h3 className="text-gray-500 font-medium">Total de Reportes</h3>
              <p className="text-2xl font-bold text-gray-800">{stats.totalReports.toLocaleString()}</p>
              <p className="text-sm text-green-600">↑ 12% vs último mes</p>
            </div>
          </div>
        </div>

        {/* Card 2: Resueltos */}
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
          <div className="flex flex-col h-full">
            <div className="flex items-center mb-2">
              <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                <span className="font-bold text-xl">✔️</span>
              </div>
              <div>
                <h3 className="text-gray-500 font-medium">Resueltos</h3>
                <p className="text-2xl font-bold text-gray-800">{stats.resolved.toLocaleString()}</p>
              </div>
            </div>
            <div className="mt-auto">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full" 
                  style={{ width: `${stats.resolutionRate}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-500 mt-1">{stats.resolutionRate}% de efectividad</p>
            </div>
          </div>
        </div>

        {/* Card 3: Pendientes */}
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100 text-red-600 mr-4">
              <span className="font-bold text-xl">⚠️</span>
            </div>
            <div>
              <h3 className="text-gray-500 font-medium">Pendientes</h3>
              <p className="text-2xl font-bold text-gray-800">{stats.pending.toLocaleString()}</p>
              <p className="text-sm text-gray-500">{stats.pendingRate}% del total</p>
            </div>
          </div>
        </div>

        {/* Card 4: Tiempo promedio */}
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
              <span className="font-bold text-xl">⏱️</span>
            </div>
            <div>
              <h3 className="text-gray-500 font-medium">Tiempo Promedio</h3>
              <p className="text-2xl font-bold text-gray-800">{stats.averageResolutionTime}</p>
              <p className="text-sm text-green-600">↓ 0.5 días vs último trimestre</p>
            </div>
          </div>
        </div>

        {/* Card 5: Nuevos esta semana */}
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
              <span className="font-bold text-xl">🆕</span>
            </div>
            <div>
              <h3 className="text-gray-500 font-medium">Nuevos esta semana</h3>
              <p className="text-2xl font-bold text-gray-800">{stats.newThisWeek}</p>
              <p className="text-sm text-green-600">↑ 8% vs semana anterior</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};