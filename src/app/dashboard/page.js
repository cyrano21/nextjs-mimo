
"use client";

import dynamic from 'next/dynamic';
import { useState } from 'react';

// Importer dynamiquement les composants client pour éviter les erreurs de prérendu
const DashboardClient = dynamic(() => import('../../components/dashboard/DashboardClient'), {
  loading: () => <p>Chargement du tableau de bord...</p>
});

const CourseVerificationComponent = dynamic(() => import('../../components/dashboard/CourseVerificationComponent'), {
  loading: () => <p>Chargement de la vérification des cours...</p>
});

const CourseStatistics = dynamic(() => import('../../components/dashboard/CourseStatistics'), {
  loading: () => <p>Chargement des statistiques des cours...</p>
});

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="page-container space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="page-title mb-0">Tableau de bord</h1>
        <div className="flex space-x-2 bg-gray-100 p-1 rounded-lg">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'overview' 
                ? 'bg-indigo-600 text-white' 
                : 'hover:bg-gray-200 text-gray-700'
            }`}
          >
            Vue d'ensemble
          </button>
          <button 
            onClick={() => setActiveTab('verification')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'verification' 
                ? 'bg-indigo-600 text-white' 
                : 'hover:bg-gray-200 text-gray-700'
            }`}
          >
            Vérification des cours
          </button>
          <button 
            onClick={() => setActiveTab('statistics')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'statistics' 
                ? 'bg-indigo-600 text-white' 
                : 'hover:bg-gray-200 text-gray-700'
            }`}
          >
            Statistiques
          </button>
        </div>
      </div>

      {activeTab === 'overview' && <DashboardClient />}
      {activeTab === 'verification' && <CourseVerificationComponent />}
      {activeTab === 'statistics' && <CourseStatistics />}
    </div>
  );
}
