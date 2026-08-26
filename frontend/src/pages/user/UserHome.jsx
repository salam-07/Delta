import { useEffect } from 'react';
import UserLayout from '../../layouts/UserLayout';
import UserStockTable from '../../components/user/UserStockTable';
import UserDevTable from '../../components/user/UserDevTable';
import { useMarketStore } from '../../store/useMarketStore';

const UserHome = () => {
    const { fetchAllDev, devs, isDevsLoading } = useMarketStore();

    useEffect(() => {
        fetchAllDev();
    }, [fetchAllDev]);

    return (
        <UserLayout title="Market">
            <div className="space-y-6">
                <UserStockTable />
                <UserDevTable
                    devs={devs}
                    isLoading={isDevsLoading}
                    onRefresh={fetchAllDev}
                    showRefreshButton={false}
                    title="Recent Developments"
                />
            </div>
        </UserLayout>
    );
};

export default UserHome;
