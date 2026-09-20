import { createContext, useContext, useState } from 'react';

const DashboardContext = createContext(null);

export function DashboardProvider({ children }) {
  const [reviewsVersion, setReviewsVersion] = useState(1);
  const refreshReviews = () => setReviewsVersion((prev) => prev + 1);
  const [ordersVersion, setOrdersVersion] = useState(1);
  const refreshOrders = () => setOrdersVersion((prev) => prev + 1);
  const [statVersion, setStatVersion] = useState(1);
  const refreshStat = () => setStatVersion((prev) => prev + 1);  

  const dashboardValue = {
    reviewsVersion,
    refreshReviews,
    ordersVersion,
    refreshOrders,
    statVersion,
    refreshStat,
  };

  return (
    <DashboardContext.Provider value={dashboardValue}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard는 DashboardProvider 내 사용 가능!');
  }
  return context;
}