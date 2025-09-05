import { useEffect } from 'react';
import UserLayout from '../../layouts/UserLayout';
import UserStockTable from '../../components/user/UserStockTable';
import DevTable from '../../components/user/UserDevTable';
import { useMarketStore } from '../../store/useMarketStore';

const UserHome = () => {

    const {
        fetchAllDev,
        devs,
        fetchDev,
        dev,
        isDevsLoading,
        isDevLoading
    } = useMarketStore();

    useEffect(() => {
        fetchAllDev();
    }, [fetchAllDev]);


    return (
        <UserLayout>
            <UserStockTable />
            <DevTable
                devs={devs}
                isLoading={isDevsLoading}
                onRefresh={fetchAllDev}
                showRefreshButton={false}
                title="Recent Developments"
            />
        </UserLayout>
    );
};

export default UserHome;